export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: any }
  | any[]

export interface KeyVerse {
    texto: Json;
    referencia: Json;
}

export interface RelationshipAnalysis {
    title: Json;
    text: Json;
}

export interface Devotional {
    verse: Json;
    reference: Json;
    reflection: Json;
}

export interface StudyPlanReading {
    reference: Json;
    description: Json;
}

export interface StudyPlan {
    readings: StudyPlanReading[];
    reflectionQuestions: Json[];
    prayer: Json;
}

export type Database = {
  public: {
    Tables: {
      qsb_characters: {
        Row: {
          analysis: Json | null
          areasForVigilance: Json | null
          audio: string | null
          dailyDevotionals: Json | null
          description: Json | null
          gender: string | null
          id: string
          imagePromptDescription: string | null
          imageUrl: string | null
          keyVerses: Json | null
          mainTrait: string
          name: Json
          relationshipAnalyses: Json | null
          strengthsInFaith: Json | null
          studyPlan: Json | null
          tagline: Json | null
          tags: Json | null
        }
        Insert: {
          analysis?: Json | null
          areasForVigilance?: Json | null
          audio?: string | null
          dailyDevotionals?: Json | null
          description?: Json | null
          gender?: string | null
          id: string
          imagePromptDescription?: string | null
          imageUrl?: string | null
          keyVerses?: Json | null
          mainTrait: string
          name: Json
          relationshipAnalyses?: Json | null
          strengthsInFaith?: Json | null
          studyPlan?: Json | null
          tagline?: Json | null
          tags?: Json | null
        }
        Update: {
          analysis?: Json | null
          areasForVigilance?: Json | null
          audio?: string | null
          dailyDevotionals?: Json | null
          description?: Json | null
          gender?: string | null
          id?: string
          imagePromptDescription?: string | null
          imageUrl?: string | null
          keyVerses?: Json | null
          mainTrait?: string
          name?: Json
          relationshipAnalyses?: Json | null
          strengthsInFaith?: Json | null
          studyPlan?: Json | null
          tagline?: Json | null
          tags?: Json | null
        }
        Relationships: []
      }
      qsb_profiles: {
        Row: {
          acesso: string | null
          created_at: string
          email: string
          nome: string | null
          personagem: string | null
          relatorio: Json | null
          secondary_analysis: Json | null
          tipo_1: number | null
          tipo_2: number | null
          tipo_3: number | null
          tipo_4: number | null
          tipo_5: number | null
          tipo_6: number | null
          tipo_7: number | null
          tipo_8: number | null
          tipo_9: number | null
          tipos: number | null
        }
        Insert: {
          acesso?: string | null
          created_at?: string
          email: string
          nome?: string | null
          personagem?: string | null
          relatorio?: Json | null
          secondary_analysis?: Json | null
          tipo_1?: number | null
          tipo_2?: number | null
          tipo_3?: number | null
          tipo_4?: number | null
          tipo_5?: number | null
          tipo_6?: number | null
          tipo_7?: number | null
          tipo_8?: number | null
          tipo_9?: number | null
          tipos?: number | null
        }
        Update: {
          acesso?: string | null
          created_at?: string
          email?: string
          nome?: string | null
          personagem?: string | null
          relatorio?: Json | null
          secondary_analysis?: Json | null
          tipo_1?: number | null
          tipo_2?: number | null
          tipo_3?: number | null
          tipo_4?: number | null
          tipo_5?: number | null
          tipo_6?: number | null
          tipo_7?: number | null
          tipo_8?: number | null
          tipo_9?: number | null
          tipos?: number | null
        }
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}