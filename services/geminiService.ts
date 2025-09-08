import { Character, Scores, PersonalizedAnalysis, EneagramaTrait } from '../types';
import { getTranslatedValue } from '../utils/translation';

// Using a relative path for the proxy is more robust and avoids CORS issues.
const API_URL = '/api-proxy/v1beta/models/gemini-2.5-flash:generateContent';
const API_KEY = process.env.API_KEY;

// Local enum for GenaiType since the SDK is removed
enum Type {
  OBJECT = 'OBJECT',
  STRING = 'STRING',
  ARRAY = 'ARRAY',
  INTEGER = 'INTEGER',
  NUMBER = 'NUMBER',
  BOOLEAN = 'BOOLEAN',
}

const traitNames: { [key in EneagramaTrait]: string } = {
  [EneagramaTrait.INTEGRO]: 'Íntegro',
  [EneagramaTrait.SERVO]: 'Servo',
  [EneagramaTrait.MORDOMO]: 'Mordomo',
  [EneagramaTrait.ADORADOR]: 'Adorador',
  [EneagramaTrait.SABIO]: 'Sábio',
  [EneagramaTrait.FIEL]: 'Fiel',
  [EneagramaTrait.CELEBRANTE]: 'Celebrante',
  [EneagramaTrait.PROTETOR]: 'Protetor',
  [EneagramaTrait.PACIFICADOR]: 'Pacificador',
};

// Polyfill para AbortController em browsers mais antigos
const createAbortController = (): AbortController | null => {
  if (typeof AbortController !== 'undefined') {
    return new AbortController();
  }
  return null;
};

const callGeminiAPI = async (prompt: string, schema: any, timeout: number = 90000): Promise<string> => {
  const controller = createAbortController();
  const timeoutId = setTimeout(() => {
    if (controller) {
      controller.abort();
    }
  }, timeout); // Use provided timeout, default to 90 seconds

  try {
    const requestBody = {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: schema,
        temperature: 0.7,
      },
    };

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        // Adicionar headers para compatibilidade iOS
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      },
      body: JSON.stringify(requestBody),
      signal: controller?.signal,
      // Configurações específicas para iOS
      mode: 'cors',
      credentials: 'same-origin'
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      let errorBody;
      try {
        errorBody = await response.json();
      } catch (e) {
        errorBody = { error: { message: `HTTP ${response.status}: ${response.statusText}` } };
      }
      console.error('Gemini API Error:', errorBody);
      throw new Error(errorBody.error?.message || `Failed to fetch from Gemini API: ${response.status}`);
    }

    const data = await response.json();
    
    // Tratamento flexível da resposta: o proxy pode simplificar a resposta.
    // Verifica primeiro por uma propriedade 'text', depois pela estrutura completa do Gemini.
    const text = data?.text || data?.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!text || typeof text !== 'string') {
      console.error('Could not extract text from Gemini API response. Full response:', JSON.stringify(data, null, 2));
      throw new Error('Invalid or empty response from Gemini API');
    }
    
    return text;
  } catch (error) {
    clearTimeout(timeoutId);
    
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new Error('Request timeout - please try again');
      }
      if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
        throw new Error('Network error - please check your connection and try again');
      }
    }
    
    throw error;
  }
};

const cleanAndParseJson = (rawText: string): any => {
  if (!rawText || typeof rawText !== 'string') {
    throw new Error("A resposta da IA estava vazia ou inválida.");
  }

  const cleanedText = rawText.trim();
  
  // Tenta fazer o parse diretamente, que é o caso esperado.
  try {
    return JSON.parse(cleanedText);
  } catch (e) {
    // Se a análise direta falhar, tenta extrair de um bloco de código markdown.
    console.warn("Análise direta de JSON falhou, tentando extrair de markdown.", cleanedText.substring(0, 200));
    const match = cleanedText.match(/```json\s*([\s\S]*?)\s*```/i);
    if (match && match[1]) {
      try {
        return JSON.parse(match[1]);
      } catch (e2) {
        console.error("Falha ao analisar JSON mesmo após a extração.", (e2 as Error).message);
        throw new Error("Não foi possível processar o formato da resposta da IA.");
      }
    }
    console.error("Nenhum JSON válido encontrado na resposta.", (e as Error).message);
    throw new Error("Não foi possível processar a resposta da IA.");
  }
};

export const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) return error.message;
  if (typeof error === 'string') return error;
  return 'Ocorreu um erro desconhecido';
};

export const suggestNewCharacterName = async (
  existingNames: string[], 
  gender: 'male' | 'female' | 'any'
): Promise<string> => {
  const genderInstruction = gender === 'any' ? 'masculino ou feminino' : (gender === 'male' ? 'masculino' : 'feminino');

  const prompt = `
    Sugira o nome de UM personagem bíblico que NÃO ESTEJA na seguinte lista: ${existingNames.join(', ')}.
    O personagem deve ser do gênero ${genderInstruction}.
    O personagem deve ser relevante, com uma história conhecida na Bíblia.
    Responda APENAS com um objeto JSON contendo a chave "sugestao" com o nome do personagem (ex: { "sugestao": "Moisés" }), sem nenhuma outra palavra, explicação ou pontuação.
  `;

  const schema = {
    type: Type.OBJECT,
    properties: {
      sugestao: { type: Type.STRING, description: "O nome do personagem bíblico sugerido." }
    },
    required: ['sugestao']
  };

  try {
    const rawText = await callGeminiAPI(prompt, schema, 30000); // 30s timeout for name suggestion
    const result = cleanAndParseJson(rawText);
    if (result && result.sugestao && typeof result.sugestao === 'string') {
        return result.sugestao.trim();
    }
    throw new Error('A IA não retornou um nome válido.');
  } catch (error) {
    console.error('Error suggesting new character name:', error);
    throw new Error(`Erro ao sugerir nome de personagem: ${getErrorMessage(error)}`);
  }
};


export const generateCharacterProfile = async (
  characterName: string, 
  language: string
): Promise<Omit<Character, 'id' | 'imageUrl' | 'imagePromptDescription'>> => {
  if (!characterName || typeof characterName !== 'string' || characterName.trim().length === 0) {
    throw new Error('Nome do personagem é obrigatório');
  }

  const prompt = `Crie um perfil detalhado para o personagem bíblico "${characterName.trim()}". O perfil deve ser otimista, inspirador e focado em lições de fé e crescimento pessoal. Gere todos os campos de texto (name, tagline, description, tags, etc.) como objetos com chaves "pt", "en", e "es", contendo as respectivas traduções.
    
    O objeto deve ter a seguinte estrutura:
    - name: objeto com traduções (ex: { "pt": "Davi", "en": "David", "es": "David" }).
    - mainTrait: O traço de personalidade do Eneagrama. Valores: ${Object.values(EneagramaTrait).join(', ')}.
    - tagline: objeto com traduções.
    - tags: Um array de 3 a 5 OBJETOS, cada um com traduções (ex: [{ "pt": "Líder", "en": "Leader", "es": "Líder" }]).
    - gender: O gênero ('male' ou 'female').
    - description: objeto com traduções.
    - analysis: objeto com traduções.
    - strengthsInFaith: objeto com traduções.
    - areasForVigilance: objeto com traduções.
    - keyVerses: Um array de 2 a 3 objetos, cada um com "texto" e "referencia" (ambos com traduções).
    - relationshipAnalyses: Um array de 2 objetos, cada um com "title" e "text" (ambos com traduções).
    - dailyDevotionals: Um array de 3 objetos, cada um com "verse", "reference", e "reflection" (verse, reference e reflection com traduções).
    - studyPlan: Um objeto com "readings" (array de objetos com "reference" e "description"), "reflectionQuestions" (array de objetos com traduções), e "prayer" (objeto com traduções).
    
    Responda APENAS com JSON válido, sem texto adicional.
    `;

  const schema = {
    type: Type.OBJECT,
    properties: {
      name: { 
        type: Type.OBJECT, 
        properties: { 
          pt: { type: Type.STRING }, 
          en: { type: Type.STRING }, 
          es: { type: Type.STRING } 
        },
        required: ['pt', 'en', 'es']
      },
      mainTrait: { 
        type: Type.STRING, 
        enum: Object.values(EneagramaTrait) 
      },
      tagline: { 
        type: Type.OBJECT, 
        properties: { 
          pt: { type: Type.STRING }, 
          en: { type: Type.STRING }, 
          es: { type: Type.STRING } 
        },
        required: ['pt', 'en', 'es']
      },
      tags: { 
        type: Type.ARRAY, 
        items: { 
          type: Type.OBJECT, 
          properties: { 
            pt: { type: Type.STRING }, 
            en: { type: Type.STRING }, 
            es: { type: Type.STRING } 
          },
          required: ['pt', 'en', 'es']
        },
        minItems: 3,
        maxItems: 5
      },
      gender: { 
        type: Type.STRING, 
        enum: ['male', 'female', 'other'] 
      },
      description: { 
        type: Type.OBJECT, 
        properties: { 
          pt: { type: Type.STRING }, 
          en: { type: Type.STRING }, 
          es: { type: Type.STRING } 
        },
        required: ['pt', 'en', 'es']
      },
      analysis: { 
        type: Type.OBJECT, 
        properties: { 
          pt: { type: Type.STRING }, 
          en: { type: Type.STRING }, 
          es: { type: Type.STRING } 
        },
        required: ['pt', 'en', 'es']
      },
      strengthsInFaith: { 
        type: Type.OBJECT, 
        properties: { 
          pt: { type: Type.STRING }, 
          en: { type: Type.STRING }, 
          es: { type: Type.STRING } 
        },
        required: ['pt', 'en', 'es']
      },
      areasForVigilance: { 
        type: Type.OBJECT, 
        properties: { 
          pt: { type: Type.STRING }, 
          en: { type: Type.STRING }, 
          es: { type: Type.STRING } 
        },
        required: ['pt', 'en', 'es']
      },
      keyVerses: { 
        type: Type.ARRAY, 
        items: { 
          type: Type.OBJECT, 
          properties: { 
            texto: { 
              type: Type.OBJECT, 
              properties: { 
                pt: { type: Type.STRING }, 
                en: { type: Type.STRING }, 
                es: { type: Type.STRING } 
              },
              required: ['pt', 'en', 'es']
            }, 
            referencia: { 
              type: Type.OBJECT, 
              properties: { 
                pt: { type: Type.STRING }, 
                en: { type: Type.STRING }, 
                es: { type: Type.STRING } 
              },
              required: ['pt', 'en', 'es']
            }
          },
          required: ['texto', 'referencia']
        },
        minItems: 2,
        maxItems: 3
      },
      relationshipAnalyses: { 
        type: Type.ARRAY, 
        items: { 
          type: Type.OBJECT, 
          properties: { 
            title: { 
              type: Type.OBJECT, 
              properties: { 
                pt: { type: Type.STRING }, 
                en: { type: Type.STRING }, 
                es: { type: Type.STRING } 
              },
              required: ['pt', 'en', 'es']
            }, 
            text: { 
              type: Type.OBJECT, 
              properties: { 
                pt: { type: Type.STRING }, 
                en: { type: Type.STRING }, 
                es: { type: Type.STRING } 
              },
              required: ['pt', 'en', 'es']
            }
          },
          required: ['title', 'text']
        },
        minItems: 2,
        maxItems: 2
      },
      dailyDevotionals: { 
        type: Type.ARRAY, 
        items: { 
          type: Type.OBJECT, 
          properties: { 
            verse: { 
              type: Type.OBJECT, 
              properties: { 
                pt: { type: Type.STRING }, 
                en: { type: Type.STRING }, 
                es: { type: Type.STRING } 
              },
              required: ['pt', 'en', 'es']
            }, 
            reference: { 
              type: Type.OBJECT, 
              properties: { 
                pt: { type: Type.STRING }, 
                en: { type: Type.STRING }, 
                es: { type: Type.STRING } 
              },
              required: ['pt', 'en', 'es']
            }, 
            reflection: { 
              type: Type.OBJECT, 
              properties: { 
                pt: { type: Type.STRING }, 
                en: { type: Type.STRING }, 
                es: { type: Type.STRING } 
              },
              required: ['pt', 'en', 'es']
            }
          },
          required: ['verse', 'reference', 'reflection']
        },
        minItems: 3,
        maxItems: 3
      },
      studyPlan: {
        type: Type.OBJECT,
        properties: {
          readings: { 
            type: Type.ARRAY, 
            items: { 
              type: Type.OBJECT, 
              properties: { 
                reference: { 
                  type: Type.OBJECT, 
                  properties: { 
                    pt: { type: Type.STRING }, 
                    en: { type: Type.STRING }, 
                    es: { type: Type.STRING } 
                  },
                  required: ['pt', 'en', 'es']
                }, 
                description: { 
                  type: Type.OBJECT, 
                  properties: { 
                    pt: { type: Type.STRING }, 
                    en: { type: Type.STRING }, 
                    es: { type: Type.STRING } 
                  },
                  required: ['pt', 'en', 'es']
                }
              },
              required: ['reference', 'description']
            }
          },
          reflectionQuestions: { 
            type: Type.ARRAY, 
            items: { 
              type: Type.OBJECT, 
              properties: { 
                pt: { type: Type.STRING }, 
                en: { type: Type.STRING }, 
                es: { type: Type.STRING } 
              },
              required: ['pt', 'en', 'es']
            }
          },
          prayer: { 
            type: Type.OBJECT, 
            properties: { 
              pt: { type: Type.STRING }, 
              en: { type: Type.STRING }, 
              es: { type: Type.STRING } 
            },
            required: ['pt', 'en', 'es']
          }
        },
        required: ['readings', 'reflectionQuestions', 'prayer']
      }
    },
    required: ['name', 'mainTrait', 'tagline', 'tags', 'gender', 'description', 'analysis', 'strengthsInFaith', 'areasForVigilance', 'keyVerses', 'relationshipAnalyses', 'dailyDevotionals', 'studyPlan']
  };
    
  try {
    const rawText = await callGeminiAPI(prompt, schema, 90000); // 90s timeout for profile generation
    return cleanAndParseJson(rawText);
  } catch (error) {
    console.error('Error generating character profile:', error);
    throw new Error(`Erro ao gerar perfil do personagem: ${getErrorMessage(error)}`);
  }
};

export const translateCharacterFields = async (
  characterContent: Record<string, any>
): Promise<{ en: Record<string, any>, es: Record<string, any> }> => {
  if (!characterContent || typeof characterContent !== 'object') {
    throw new Error('Conteúdo do personagem é obrigatório');
  }

  const prompt = `
    Você é um tradutor especialista com profundo conhecimento teológico.
    Traduza o seguinte conteúdo de um perfil de personagem bíblico do português para o inglês e para o espanhol.
    Mantenha o tom inspirador e a terminologia teológica apropriada para cada idioma.
    O conteúdo original em português é:
    ${JSON.stringify(characterContent, null, 2)}

    Responda APENAS com um objeto JSON válido contendo as chaves "en" e "es", cada uma com o conteúdo traduzido.
  `;

  const schema = {
    type: Type.OBJECT,
    properties: {
      en: { type: Type.OBJECT },
      es: { type: Type.OBJECT }
    },
    required: ['en', 'es']
  };

  try {
    const rawText = await callGeminiAPI(prompt, schema);
    return cleanAndParseJson(rawText);
  } catch (error) {
    console.error('Error translating character fields:', error);
    throw new Error(`Erro ao traduzir campos do personagem: ${getErrorMessage(error)}`);
  }
};

export const generatePersonalizedAnalysis = async (
  character: Character,
  scores: Scores,
  userName: string | null,
  language: string
): Promise<PersonalizedAnalysis> => {
  if (!character || !scores) {
    throw new Error('Personagem e pontuações são obrigatórios');
  }

  const mainTraitName = traitNames[character.mainTrait] || character.mainTrait;
  const sortedScores = Object.entries(scores).sort(([, a], [, b]) => b - a);
  const topTraits = sortedScores.slice(0, 3)
    .map(([trait, score]) => `${traitNames[trait as EneagramaTrait]} (Pontuação: ${score})`)
    .join(', ');

  const prompt = `
    Aja como um conselheiro espiritual e escritor. Gere uma "Análise de Compatibilidade" para um usuário de um teste de personalidade bíblico.
    A análise deve ser um parágrafo único, caloroso, encorajador e perspicaz, com aproximadamente 100-150 palavras.
    Deve ser retornada como um objeto JSON com chaves "pt", "en" e "es", contendo as respectivas traduções.

    CONTEXTO:
    - Nome do usuário: ${userName || 'o usuário'}
    - Personagem Bíblico Resultante: ${getTranslatedValue(character.name, 'pt')} (Traço Principal: ${mainTraitName})
    - Principais Traços de Personalidade do Usuário (baseado nas pontuações): ${topTraits}

    INSTRUÇÕES:
    1. Dirija-se ao usuário (usando o nome, se disponível) e reconheça sua conexão com ${getTranslatedValue(character.name, 'pt')}.
    2. Compare e contraste sutilmente os principais traços do usuário com a personalidade e história conhecidas do personagem. Por exemplo: "Assim como ${getTranslatedValue(character.name, 'pt')} demonstrou [traço], suas pontuações revelam uma força semelhante em..."
    3. Ofereça uma visão prática e inspiradora sobre como o usuário pode aplicar as lições da vida de ${getTranslatedValue(character.name, 'pt')} em sua própria jornada de fé, considerando sua mistura de personalidade específica.
    4. Mantenha um tom positivo e orientado para o crescimento.
    5. CRUCIALMENTE, sua resposta inteira deve ser APENAS o objeto JSON válido, sem texto introdutório, markdown ou explicações.
  `;

  const schema = {
    type: Type.OBJECT,
    properties: {
      pt: { type: Type.STRING, description: "A análise de compatibilidade em português." },
      en: { type: Type.STRING, description: "The compatibility analysis in English." },
      es: { type: Type.STRING, description: "El análisis de compatibilidad en español." }
    },
    required: ['pt', 'en', 'es']
  };

  try {
    const rawText = await callGeminiAPI(prompt, schema);
    return { compatibilityAnalysis: cleanAndParseJson(rawText) };
  } catch (error) {
    console.error('Error generating personalized analysis:', error);
    throw new Error(`Erro ao gerar análise personalizada: ${getErrorMessage(error)}`);
  }
};

export const generateSecondaryTraitsAnalysis = async (
  userName: string | null,
  mainCharacter: Character,
  secondaryCharacter: Character | null,
  tertiaryCharacter: Character | null,
  language: string
): Promise<{ secondaryAnalysisText: any }> => {
  if (!mainCharacter) {
    throw new Error('Personagem principal é obrigatório');
  }

  const prompt = `
    Aja como um conselheiro espiritual e escritor. Gere uma análise "Mosaico da Alma" para um usuário.
    A análise deve ser um parágrafo coeso e perspicaz (cerca de 120 palavras), explicando como seus três principais traços de personalidade, representados por personagens bíblicos, funcionam juntos.
    A saída DEVE ser um objeto JSON com chaves "pt", "en" e "es" para as traduções.

    CONTEXTO:
    - Nome do Usuário: ${userName || 'o usuário'}
    - Personagem Principal (traço mais forte): ${getTranslatedValue(mainCharacter.name, 'pt')}
    - Personagem Secundário (2º traço): ${secondaryCharacter ? getTranslatedValue(secondaryCharacter.name, 'pt') : 'Nenhum'}
    - Personagem Terciário (3º traço): ${tertiaryCharacter ? getTranslatedValue(tertiaryCharacter.name, 'pt') : 'Nenhum'}

    INSTRUÇÕES:
    1. Comece reconhecendo a identificação principal do usuário com ${getTranslatedValue(mainCharacter.name, 'pt')}.
    2. Se um personagem secundário estiver disponível, descreva como as qualidades de ${secondaryCharacter ? getTranslatedValue(secondaryCharacter.name, 'pt') : 'o traço secundário'} adicionam profundidade, nuance ou uma dimensão diferente à personalidade principal.
    3. Se um personagem terciário estiver disponível, explique como os traços de ${tertiaryCharacter ? getTranslatedValue(tertiaryCharacter.name, 'pt') : 'o terceiro traço'} podem atuar como um suporte ou uma influência de equilíbrio.
    4. Conclua com uma reflexão encorajadora sobre como esta "tríade" única de traços forma uma identidade espiritual bela e complexa para ${userName || 'o usuário'}.
    5. O tom deve ser inspirador e focado no crescimento.
    6. CRUCIALMENTE, sua resposta inteira deve ser APENAS o objeto JSON válido, sem texto introdutório, markdown ou explicações.
  `;
  
  const schema = {
    type: Type.OBJECT,
    properties: {
      pt: { type: Type.STRING, description: "A análise 'Mosaico da Alma' em português." },
      en: { type: Type.STRING, description: "The 'Soul Mosaic' analysis in English." },
      es: { type: Type.STRING, description: "El análisis 'Mosaico del Alma' en español." }
    },
    required: ['pt', 'en', 'es']
  };

  try {
    const rawText = await callGeminiAPI(prompt, schema);
    return { secondaryAnalysisText: cleanAndParseJson(rawText) };
  } catch (error) {
    console.error('Error generating secondary traits analysis:', error);
    throw new Error(`Erro ao gerar análise de traços secundários: ${getErrorMessage(error)}`);
  }
};