import type { Json, KeyVerse as DbKeyVerse, RelationshipAnalysis as DbRelationshipAnalysis, Devotional as DbDevotional, StudyPlan as DbStudyPlan } from './services/database.types';

export enum EneagramaTrait {
    INTEGRO = 'TIPO_UM_PERFECCIONISTA',
    SERVO = 'TIPO_DOIS_PRESTATIVO',
    MORDOMO = 'TIPO_TRES_BEM_SUCEDIDO',
    ADORADOR = 'TIPO_QUATRO_INDIVIDUALISTA',
    SABIO = 'TIPO_CINCO_INVESTIGADOR',
    FIEL = 'TIPO_SEIS_LEAL',
    CELEBRANTE = 'TIPO_SETE_ENTUSIASTA',
    PROTETOR = 'TIPO_OITO_DESAFIADOR',
    PACIFICADOR = 'TIPO_NOVE_PACIFICADOR',
}

export interface UserInfo {
    nome?: string | null;
    acesso?: string | null;
    tipos?: number | null;
    relatorio?: Json | null;
    secondary_analysis?: Json | null;
    personagem?: string | null;
    tipo_1?: number | null;
    tipo_2?: number | null;
    tipo_3?: number | null;
    tipo_4?: number | null;
    tipo_5?: number | null;
    tipo_6?: number | null;
    tipo_7?: number | null;
    tipo_8?: number | null;
    tipo_9?: number | null;
}

export interface UserProfile extends UserInfo {
    email: string;
    created_at: string;
}

export interface Answer {
  textKey: string;
  trait: EneagramaTrait;
}

export interface Question {
  textKey: string;
  answers: Answer[];
}

export type Scores = {
  [key in EneagramaTrait]: number;
};

// Re-exporting with updated local types if needed, or just re-exporting
export type { RelationshipAnalysis, Devotional, StudyPlan } from './services/database.types';

// More specific types for front-end usage
export interface KeyVerse {
    texto: Json;
    referencia: Json;
}

export interface StudyPlanReading {
    reference: Json;
    description: Json;
}

export interface Character {
  id: string;
  name: Json;
  mainTrait: EneagramaTrait;
  tagline: Json | null;
  imageUrl: string | null;
  imagePromptDescription: string | null;
  tags: Json | null;
  gender: 'male' | 'female' | 'other' | null;
  description: Json | null;
  analysis: Json | null;
  strengthsInFaith: Json | null;
  areasForVigilance: Json | null;
  keyVerses: Json | null;
  relationshipAnalyses: Json | null;
  dailyDevotionals: Json | null;
  studyPlan: Json | null;
  audio?: string | null;
}

export interface PersonalizedAnalysis {
    compatibilityAnalysis: Json;
}

export interface PixQrCodeData {
  id: string;
  brCode: string;
  brCodeBase64: string;
  expiresAt: string;
}

export interface PaymentStatusData {
  id: string;
  status: 'PENDING' | 'PAID' | 'EXPIRED';
}

export type Screen = 'welcome' | 'email' | 'verify' | 'askName' | 'teste' | 'results' | 'gallery' | 'about' | 'admin' | 'characterForm';