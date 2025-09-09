import { supabase } from './supabaseClient';
import { UserInfo, Scores, Character, EneagramaTrait, KeyVerse, RelationshipAnalysis, Devotional, StudyPlan, StudyPlanReading, UserProfile } from '../types';
import type { Database, Json } from './database.types';
import { translateCharacterFields } from './geminiService';
import { getTranslatedValue } from '../utils/translation';
import { translateBookName } from '../utils/bibleBookMapper';

type DbCharacter = Database['public']['Tables']['qsb_characters']['Row'];
type DbProfileUpdate = Database['public']['Tables']['qsb_profiles']['Update'];
type DbCharacterInsert = Database['public']['Tables']['qsb_characters']['Insert'];
type DbProfileInsert = Database['public']['Tables']['qsb_profiles']['Insert'];

// Fetches all characters from the database and maps them to the app's Character type
export const getCharacters = async (): Promise<Character[]> => {
  const { data, error } = await supabase.from('qsb_characters').select('*');

  if (error) {
    console.error('Error fetching characters:', error.message);
    throw error;
  }
  
  if (!data) {
    return [];
  }
  
  return data as Character[];
};


export const upsertUserProfile = async (email: string): Promise<UserInfo | null> => {
  const { data: profile, error: fetchError } = await supabase
      .from('qsb_profiles')
      .select('*')
      .eq('email', email)
      .single();

  if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 is "No rows found"
      console.error('Error fetching user profile during upsert:', fetchError.message);
      throw fetchError;
  }
  
  if (profile) {
      return profile as UserInfo;
  }

  const insertData: DbProfileInsert = { email: email, acesso: '0' };
  const { data: newProfile, error: insertError } = await supabase
      .from('qsb_profiles')
      .insert(insertData)
      .select('*')
      .single();
  
  if (insertError) {
      console.error('Error creating user profile during upsert:', insertError.message);
      throw insertError;
  }
  
  return newProfile as UserInfo;
};

export const getUserProfile = async (email: string): Promise<UserInfo | null> => {
  const { data, error } = await supabase
    .from('qsb_profiles')
    .select('*')
    .eq('email', email)
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error('Error fetching user profile:', error.message);
    throw error;
  }
  return data as UserInfo | null;
};

export const updateUserName = async (email: string, name: string): Promise<void> => {
    const payload: DbProfileUpdate = { nome: name };
    const { error } = await supabase
        .from('qsb_profiles')
        .update(payload)
        .eq('email', email);

    if (error) {
        console.error('Error updating user name:', error.message);
        throw error;
    }
};

export const saveQuizResult = async (email: string, character: Character, scores: Scores, analysis: Json | null, tipos: number) => {
    const characterNameInPt = getTranslatedValue(character.name, 'pt');
    
    const resultData: DbProfileUpdate = {
        personagem: characterNameInPt,
        tipo_1: scores[EneagramaTrait.INTEGRO] || 0,
        tipo_2: scores[EneagramaTrait.SERVO] || 0,
        tipo_3: scores[EneagramaTrait.MORDOMO] || 0,
        tipo_4: scores[EneagramaTrait.ADORADOR] || 0,
        tipo_5: scores[EneagramaTrait.SABIO] || 0,
        tipo_6: scores[EneagramaTrait.FIEL] || 0,
        tipo_7: scores[EneagramaTrait.CELEBRANTE] || 0,
        tipo_8: scores[EneagramaTrait.PROTETOR] || 0,
        tipo_9: scores[EneagramaTrait.PACIFICADOR] || 0,
        tipos: tipos,
    };

    if (analysis !== null) {
        resultData.relatorio = analysis;
    } else {
        // This is a new test result (or a retake), so we must clear old analyses.
        resultData.relatorio = null;
        resultData.secondary_analysis = null;
    }

    const { error } = await supabase
        .from('qsb_profiles')
        .update(resultData)
        .eq('email', email);

    if (error) {
        console.error('Error saving quiz result:', error.message);
        throw error;
    }
};

export const saveSecondaryAnalysis = async (email: string, analysis: Json): Promise<void> => {
    const payload: DbProfileUpdate = { secondary_analysis: analysis };
    const { error } = await supabase
        .from('qsb_profiles')
        .update(payload)
        .eq('email', email);

    if (error) {
        console.error('Error saving secondary analysis:', error.message);
        throw error;
    }
};

// Admin Functions for Characters

export const characterExists = async (id: string): Promise<boolean> => {
  const { data, error } = await supabase
    .from('qsb_characters')
    .select('id')
    .eq('id', id)
    .limit(1)
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error('Error checking if character exists:', error.message);
    throw error;
  }

  return !!data;
};

export const upsertCharacter = async (characterData: Character) => {
  const { data, error } = await supabase
    .from('qsb_characters')
    .upsert(characterData as DbCharacterInsert)
    .select()
    .single();

  if (error) {
    console.error('Error upserting character:', error.message);
    throw error;
  }
  if (!data) {
    throw new Error('Falha ao salvar o personagem, nenhum dado retornado.');
  }
  return data;
};

export const updateCharacterTranslations = async (character: Character): Promise<Character> => {
    const updatedCharacter = JSON.parse(JSON.stringify(character));

    const fieldsToTranslate: Record<string, any> = {};
    const textFields: (keyof Character)[] = ['name', 'tagline', 'description', 'analysis', 'strengthsInFaith', 'areasForVigilance'];

    textFields.forEach(field => {
        fieldsToTranslate[field] = getTranslatedValue(updatedCharacter[field], 'pt');
    });

    fieldsToTranslate.tags = (Array.isArray(updatedCharacter.tags) ? updatedCharacter.tags : []).map((tag: any) => getTranslatedValue(tag, 'pt'));
    fieldsToTranslate.keyVerses = (Array.isArray(updatedCharacter.keyVerses) ? (updatedCharacter.keyVerses as unknown as KeyVerse[]) : []).map(v => getTranslatedValue(v.texto, 'pt'));
    fieldsToTranslate.relationshipAnalyses = (Array.isArray(updatedCharacter.relationshipAnalyses) ? (updatedCharacter.relationshipAnalyses as unknown as RelationshipAnalysis[]) : []).map(ra => ({ title: getTranslatedValue(ra.title, 'pt'), text: getTranslatedValue(ra.text, 'pt') }));
    fieldsToTranslate.dailyDevotionals = (Array.isArray(updatedCharacter.dailyDevotionals) ? (updatedCharacter.dailyDevotionals as unknown as Devotional[]) : []).map(dd => ({ verse: getTranslatedValue(dd.verse, 'pt'), reflection: getTranslatedValue(dd.reflection, 'pt') }));
    
    if (updatedCharacter.studyPlan && typeof updatedCharacter.studyPlan === 'object' && !Array.isArray(updatedCharacter.studyPlan)) {
        const sp = updatedCharacter.studyPlan as unknown as StudyPlan;
        fieldsToTranslate.studyPlan = {
            readings: Array.isArray(sp.readings) ? sp.readings.map(r => getTranslatedValue(r.description, 'pt')) : [],
            reflectionQuestions: Array.isArray(sp.reflectionQuestions) ? (sp.reflectionQuestions as Json[]).map(q => getTranslatedValue(q, 'pt')) : [],
            prayer: getTranslatedValue(sp.prayer, 'pt')
        };
    }

    const translations = await translateCharacterFields(fieldsToTranslate);

    const mergeMultilingual = (original: any, en_text?: string, es_text?: string): Json => {
        let result: { [key: string]: string | undefined } = { pt: '', en: undefined, es: undefined };
        if (typeof original === 'object' && original !== null && !Array.isArray(original)) {
            result = { ...original };
        } else {
            result.pt = String(original || '');
        }
        if (en_text) result.en = en_text;
        if (es_text) result.es = es_text;
        return result;
    };

    textFields.forEach(field => {
        if (translations.en[field] || translations.es[field]) {
            updatedCharacter[field] = mergeMultilingual(updatedCharacter[field], translations.en[field], translations.es[field]);
        }
    });

    if (translations.en.tags && Array.isArray(translations.en.tags)) {
        const originalTags = Array.isArray(updatedCharacter.tags) ? updatedCharacter.tags : [];
        updatedCharacter.tags = originalTags.map((originalTag: any, index: number) => 
            mergeMultilingual(originalTag, translations.en.tags[index], translations.es.tags[index])
        );
    }
    
    // Programmatically translate references to avoid AI errors and ensure accuracy
    const translateReferences = (items: any[], textField: string, refField: string) => {
        if (Array.isArray(items)) {
            items.forEach(item => {
                const ptRef = getTranslatedValue(item[refField], 'pt');
                item[refField] = translateBookName(ptRef);
            });
        }
    };

    translateReferences(updatedCharacter.keyVerses as unknown as KeyVerse[], 'texto', 'referencia');
    translateReferences(updatedCharacter.dailyDevotionals as unknown as Devotional[], 'verse', 'reference');
    if (updatedCharacter.studyPlan) {
        translateReferences((updatedCharacter.studyPlan as unknown as StudyPlan).readings, 'description', 'reference');
    }

    await upsertCharacter(updatedCharacter);
    return updatedCharacter;
};

export const deleteCharacter = async (id: string) => {
  const { error } = await supabase.from('qsb_characters').delete().eq('id', id);
  if (error) {
    console.error('Error deleting character:', error.message);
    throw error;
  }
};

// Admin Functions for Users

export const getAllUsers = async (): Promise<UserProfile[]> => {
    const { data, error } = await supabase
        .from('qsb_profiles')
        .select('*')
        .not('email', 'like', 'deleted_%')
        .order('created_at', { ascending: false });
    
    if (error) {
        console.error('Error fetching all users:', error.message);
        throw error;
    }
    return data as UserProfile[];
};

export const updateUserProfile = async (email: string, updates: DbProfileUpdate): Promise<UserProfile> => {
    const { data, error } = await supabase
        .from('qsb_profiles')
        .update(updates)
        .eq('email', email)
        .select()
        .single();
    
    if (error) {
        console.error('Error updating user profile:', error.message);
        throw error;
    }
    return data as UserProfile;
};

export const deleteUser = async (email: string): Promise<void> => {
    // Workaround for restrictive RLS on DELETE. We "soft-delete" by updating the record
    // to anonymize it and make it inaccessible from the app.
    const anonymizedUpdate = {
        // Change email to prevent login and to filter it out from the user list.
        email: `deleted_${Date.now()}_${email}`,
        nome: 'Usuário Excluído',
        acesso: null,
        personagem: null,
        relatorio: null,
        secondary_analysis: null,
        tipo_1: null, tipo_2: null, tipo_3: null, tipo_4: null, tipo_5: null,
        tipo_6: null, tipo_7: null, tipo_8: null, tipo_9: null, tipos: null,
    };

    const { data, error } = await supabase
        .from('qsb_profiles')
        .update(anonymizedUpdate)
        .eq('email', email)
        .select()
        .single();

    if (error) {
        console.error('Error "deleting" (anonymizing) user:', error.message);
        throw new Error(`Falha ao tentar anonimizar o usuário. Detalhes: ${error.message}`);
    }

    if (!data) {
        throw new Error(`A operação de "exclusão" (anonimização) não afetou nenhuma linha. Verifique se o usuário com e-mail "${email}" existe e se as permissões (RLS) para UPDATE estão corretas.`);
    }
};

export const grantPremiumAccess = async (email: string): Promise<void> => {
  const payload: DbProfileInsert = { email: email, acesso: '1' };
  const { error } = await supabase
    .from('qsb_profiles')
    .upsert(payload, { onConflict: 'email' });

  if (error) {
    console.error('Error granting premium access:', error.message);
    throw error;
  }
};

export const getPixValue = async (): Promise<string | null> => {
  const { data, error } = await supabase
    .from('qsb_config')
    .select('valorconfig')
    .eq('nomeconfig', 'valorpix')
    .single();

  if (error && error.code !== 'PGRST116') { // PGRST116 = no rows found
    console.error('Error fetching PIX value from database. This could be an RLS policy issue.', error);
    throw error; // Throw the actual error to be caught by the caller
  }
  
  // If no data is found (either by error PGRST116 or just empty), return null.
  // This allows the frontend to set a sensible default.
  if (!data?.valorconfig) {
      console.warn('PIX value for "valorpix" not found in qsb_config table.');
      return null;
  }
  
  return data.valorconfig;
};