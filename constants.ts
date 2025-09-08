import { Question, EneagramaTrait } from './types';

export const TEST_QUESTIONS: Question[] = [
  // Tipo 1: Íntegro
  {
    textKey: "q1_text",
    answers: [
      { textKey: "q1_a1", trait: EneagramaTrait.INTEGRO },
      { textKey: "q1_a2", trait: EneagramaTrait.MORDOMO },
      { textKey: "q1_a3", trait: EneagramaTrait.SERVO },
      { textKey: "q1_a4", trait: EneagramaTrait.PACIFICADOR },
    ],
  },
  {
    textKey: "q2_text",
    answers: [
      { textKey: "q2_a1", trait: EneagramaTrait.INTEGRO },
      { textKey: "q2_a2", trait: EneagramaTrait.ADORADOR },
      { textKey: "q2_a3", trait: EneagramaTrait.MORDOMO },
      { textKey: "q2_a4", trait: EneagramaTrait.FIEL },
    ],
  },
  {
    textKey: "q3_text",
    answers: [
      { textKey: "q3_a1", trait: EneagramaTrait.INTEGRO },
      { textKey: "q3_a2", trait: EneagramaTrait.PROTETOR },
      { textKey: "q3_a3", trait: EneagramaTrait.CELEBRANTE },
      { textKey: "q3_a4", trait: EneagramaTrait.SERVO },
    ],
  },
  {
    textKey: "q4_text",
    answers: [
      { textKey: "q4_a1", trait: EneagramaTrait.INTEGRO },
      { textKey: "q4_a2", trait: EneagramaTrait.PROTETOR },
      { textKey: "q4_a3", trait: EneagramaTrait.ADORADOR },
      { textKey: "q4_a4", trait: EneagramaTrait.PACIFICADOR },
    ],
  },
  // Tipo 2: Servo
  {
    textKey: "q5_text",
    answers: [
      { textKey: "q5_a1", trait: EneagramaTrait.SERVO },
      { textKey: "q5_a2", trait: EneagramaTrait.MORDOMO },
      { textKey: "q5_a3", trait: EneagramaTrait.SABIO },
      { textKey: "q5_a4", trait: EneagramaTrait.CELEBRANTE },
    ],
  },
  {
    textKey: "q6_text",
    answers: [
      { textKey: "q6_a1", trait: EneagramaTrait.SERVO },
      { textKey: "q6_a2", trait: EneagramaTrait.SABIO },
      { textKey: "q6_a3", trait: EneagramaTrait.CELEBRANTE },
      { textKey: "q6_a4", trait: EneagramaTrait.PACIFICADOR },
    ],
  },
  {
    textKey: "q7_text",
    answers: [
      { textKey: "q7_a1", trait: EneagramaTrait.SERVO },
      { textKey: "q7_a2", trait: EneagramaTrait.ADORADOR },
      { textKey: "q7_a3", trait: EneagramaTrait.FIEL },
      { textKey: "q7_a4", trait: EneagramaTrait.CELEBRANTE },
    ],
  },
  {
    textKey: "q8_text",
    answers: [
      { textKey: "q8_a1", trait: EneagramaTrait.SERVO },
      { textKey: "q8_a2", trait: EneagramaTrait.INTEGRO },
      { textKey: "q8_a3", trait: EneagramaTrait.PROTETOR },
      { textKey: "q8_a4", trait: EneagramaTrait.PACIFICADOR },
    ],
  },
  // Tipo 3: Mordomo
  {
    textKey: "q9_text",
    answers: [
      { textKey: "q9_a1", trait: EneagramaTrait.MORDOMO },
      { textKey: "q9_a2", trait: EneagramaTrait.FIEL },
      { textKey: "q9_a3", trait: EneagramaTrait.CELEBRANTE },
      { textKey: "q9_a4", trait: EneagramaTrait.PACIFICADOR },
    ],
  },
  {
    textKey: "q10_text",
    answers: [
      { textKey: "q10_a1", trait: EneagramaTrait.MORDOMO },
      { textKey: "q10_a2", trait: EneagramaTrait.SABIO },
      { textKey: "q10_a3", trait: EneagramaTrait.FIEL },
      { textKey: "q10_a4", trait: EneagramaTrait.PACIFICADOR },
    ],
  },
  {
    textKey: "q11_text",
    answers: [
      { textKey: "q11_a1", trait: EneagramaTrait.MORDOMO },
      { textKey: "q11_a2", trait: EneagramaTrait.PROTETOR },
      { textKey: "q11_a3", trait: EneagramaTrait.FIEL },
      { textKey: "q11_a4", trait: EneagramaTrait.SABIO },
    ],
  },
  {
    textKey: "q12_text",
    answers: [
      { textKey: "q12_a1", trait: EneagramaTrait.MORDOMO },
      { textKey: "q12_a2", trait: EneagramaTrait.INTEGRO },
      { textKey: "q12_a3", trait: EneagramaTrait.SERVO },
      { textKey: "q12_a4", trait: EneagramaTrait.ADORADOR },
    ],
  },
  // Tipo 4: Adorador
  {
    textKey: "q13_text",
    answers: [
      { textKey: "q13_a1", trait: EneagramaTrait.ADORADOR },
      { textKey: "q13_a2", trait: EneagramaTrait.PACIFICADOR },
      { textKey: "q13_a3", trait: EneagramaTrait.CELEBRANTE },
      { textKey: "q13_a4", trait: EneagramaTrait.PROTETOR },
    ],
  },
  {
    textKey: "q14_text",
    answers: [
      { textKey: "q14_a1", trait: EneagramaTrait.ADORADOR },
      { textKey: "q14_a2", trait: EneagramaTrait.SABIO },
      { textKey: "q14_a3", trait: EneagramaTrait.CELEBRANTE },
      { textKey: "q14_a4", trait: EneagramaTrait.PROTETOR },
    ],
  },
  {
    textKey: "q15_text",
    answers: [
      { textKey: "q15_a1", trait: EneagramaTrait.ADORADOR },
      { textKey: "q15_a2", trait: EneagramaTrait.PROTETOR },
      { textKey: "q15_a3", trait: EneagramaTrait.SERVO },
      { textKey: "q15_a4", trait: EneagramaTrait.MORDOMO },
    ],
  },
  {
    textKey: "q16_text",
    answers: [
      { textKey: "q16_a1", trait: EneagramaTrait.ADORADOR },
      { textKey: "q16_a2", trait: EneagramaTrait.INTEGRO },
      { textKey: "q16_a3", trait: EneagramaTrait.FIEL },
      { textKey: "q16_a4", trait: EneagramaTrait.MORDOMO },
    ],
  },
  // Tipo 5: Sábio
  {
    textKey: "q17_text",
    answers: [
      { textKey: "q17_a1", trait: EneagramaTrait.SABIO },
      { textKey: "q17_a2", trait: EneagramaTrait.PROTETOR },
      { textKey: "q17_a3", trait: EneagramaTrait.FIEL },
      { textKey: "q17_a4", trait: EneagramaTrait.SERVO },
    ],
  },
  {
    textKey: "q18_text",
    answers: [
      { textKey: "q18_a1", trait: EneagramaTrait.SABIO },
      { textKey: "q18_a2", trait: EneagramaTrait.CELEBRANTE },
      { textKey: "q18_a3", trait: EneagramaTrait.MORDOMO },
      { textKey: "q18_a4", trait: EneagramaTrait.PROTETOR },
    ],
  },
  {
    textKey: "q19_text",
    answers: [
      { textKey: "q19_a1", trait: EneagramaTrait.SABIO },
      { textKey: "q19_a2", trait: EneagramaTrait.MORDOMO },
      { textKey: "q19_a3", trait: EneagramaTrait.SERVO },
      { textKey: "q19_a4", trait: EneagramaTrait.PROTETOR },
    ],
  },
  {
    textKey: "q20_text",
    answers: [
      { textKey: "q20_a1", trait: EneagramaTrait.SABIO },
      { textKey: "q20_a2", trait: EneagramaTrait.INTEGRO },
      { textKey: "q20_a3", trait: EneagramaTrait.FIEL },
      { textKey: "q20_a4", trait: EneagramaTrait.CELEBRANTE },
    ],
  },
  // Tipo 6: Fiel
  {
    textKey: "q21_text",
    answers: [
      { textKey: "q21_a1", trait: EneagramaTrait.FIEL },
      { textKey: "q21_a2", trait: EneagramaTrait.PROTETOR },
      { textKey: "q21_a3", trait: EneagramaTrait.ADORADOR },
      { textKey: "q21_a4", trait: EneagramaTrait.INTEGRO },
    ],
  },
  {
    textKey: "q22_text",
    answers: [
      { textKey: "q22_a1", trait: EneagramaTrait.FIEL },
      { textKey: "q22_a2", trait: EneagramaTrait.CELEBRANTE },
      { textKey: "q22_a3", trait: EneagramaTrait.SABIO },
      { textKey: "q22_a4", trait: EneagramaTrait.PROTETOR },
    ],
  },
  {
    textKey: "q23_text",
    answers: [
      { textKey: "q23_a1", trait: EneagramaTrait.FIEL },
      { textKey: "q23_a2", trait: EneagramaTrait.PROTETOR },
      { textKey: "q23_a3", trait: EneagramaTrait.INTEGRO },
      { textKey: "q23_a4", trait: EneagramaTrait.CELEBRANTE },
    ],
  },
  {
    textKey: "q24_text",
    answers: [
      { textKey: "q24_a1", trait: EneagramaTrait.FIEL },
      { textKey: "q24_a2", trait: EneagramaTrait.SABIO },
      { textKey: "q24_a3", trait: EneagramaTrait.PROTETOR },
      { textKey: "q24_a4", trait: EneagramaTrait.PACIFICADOR },
    ],
  },
  // Tipo 7: Celebrante
  {
    textKey: "q25_text",
    answers: [
      { textKey: "q25_a1", trait: EneagramaTrait.CELEBRANTE },
      { textKey: "q25_a2", trait: EneagramaTrait.ADORADOR },
      { textKey: "q25_a3", trait: EneagramaTrait.FIEL },
      { textKey: "q25_a4", trait: EneagramaTrait.MORDOMO },
    ],
  },
  {
    textKey: "q26_text",
    answers: [
      { textKey: "q26_a1", trait: EneagramaTrait.CELEBRANTE },
      { textKey: "q26_a2", trait: EneagramaTrait.MORDOMO },
      { textKey: "q26_a3", trait: EneagramaTrait.SABIO },
      { textKey: "q26_a4", trait: EneagramaTrait.PACIFICADOR },
    ],
  },
  {
    textKey: "q27_text",
    answers: [
      { textKey: "q27_a1", trait: EneagramaTrait.CELEBRANTE },
      { textKey: "q27_a2", trait: EneagramaTrait.ADORADOR },
      { textKey: "q27_a3", trait: EneagramaTrait.INTEGRO },
      { textKey: "q27_a4", trait: EneagramaTrait.PROTETOR },
    ],
  },
  {
    textKey: "q28_text",
    answers: [
      { textKey: "q28_a1", trait: EneagramaTrait.CELEBRANTE },
      { textKey: "q28_a2", trait: EneagramaTrait.SABIO },
      { textKey: "q28_a3", trait: EneagramaTrait.SERVO },
      { textKey: "q28_a4", trait: EneagramaTrait.MORDOMO },
    ],
  },
  // Tipo 8: Protetor
  {
    textKey: "q29_text",
    answers: [
      { textKey: "q29_a1", trait: EneagramaTrait.PROTETOR },
      { textKey: "q29_a2", trait: EneagramaTrait.INTEGRO },
      { textKey: "q29_a3", trait: EneagramaTrait.SERVO },
      { textKey: "q29_a4", trait: EneagramaTrait.PACIFICADOR },
    ],
  },
  {
    textKey: "q30_text",
    answers: [
      { textKey: "q30_a1", trait: EneagramaTrait.PROTETOR },
      { textKey: "q30_a2", trait: EneagramaTrait.FIEL },
      { textKey: "q30_a3", trait: EneagramaTrait.SABIO },
      { textKey: "q30_a4", trait: EneagramaTrait.SERVO },
    ],
  },
  {
    textKey: "q31_text",
    answers: [
      { textKey: "q31_a1", trait: EneagramaTrait.PROTETOR },
      { textKey: "q31_a2", trait: EneagramaTrait.ADORADOR },
      { textKey: "q31_a3", trait: EneagramaTrait.SERVO },
      { textKey: "q31_a4", trait: EneagramaTrait.PACIFICADOR },
    ],
  },
  {
    textKey: "q32_text",
    answers: [
      { textKey: "q32_a1", trait: EneagramaTrait.PROTETOR },
      { textKey: "q32_a2", trait: EneagramaTrait.SABIO },
      { textKey: "q32_a3", trait: EneagramaTrait.ADORADOR },
      { textKey: "q32_a4", trait: EneagramaTrait.INTEGRO },
    ],
  },
  // Tipo 9: Pacificador
  {
    textKey: "q33_text",
    answers: [
      { textKey: "q33_a1", trait: EneagramaTrait.PACIFICADOR },
      { textKey: "q33_a2", trait: EneagramaTrait.PROTETOR },
      { textKey: "q33_a3", trait: EneagramaTrait.INTEGRO },
      { textKey: "q33_a4", trait: EneagramaTrait.FIEL },
    ],
  },
  {
    textKey: "q34_text",
    answers: [
      { textKey: "q34_a1", trait: EneagramaTrait.PACIFICADOR },
      { textKey: "q34_a2", trait: EneagramaTrait.SERVO },
      { textKey: "q34_a3", trait: EneagramaTrait.SABIO },
      { textKey: "q34_a4", trait: EneagramaTrait.INTEGRO },
    ],
  },
  {
    textKey: "q35_text",
    answers: [
      { textKey: "q35_a1", trait: EneagramaTrait.PACIFICADOR },
      { textKey: "q35_a2", trait: EneagramaTrait.CELEBRANTE },
      { textKey: "q35_a3", trait: EneagramaTrait.ADORADOR },
      { textKey: "q35_a4", trait: EneagramaTrait.MORDOMO },
    ],
  },
  {
    textKey: "q36_text",
    answers: [
      { textKey: "q36_a1", trait: EneagramaTrait.PACIFICADOR },
      { textKey: "q36_a2", trait: EneagramaTrait.INTEGRO },
      { textKey: "q36_a3", trait: EneagramaTrait.SERVO },
      { textKey: "q36_a4", trait: EneagramaTrait.CELEBRANTE },
    ],
  },
  // Perguntas Gerais
  {
    textKey: "q37_text",
    answers: [
      { textKey: "q37_a1", trait: EneagramaTrait.PACIFICADOR },
      { textKey: "q37_a2", trait: EneagramaTrait.FIEL },
      { textKey: "q37_a3", trait: EneagramaTrait.ADORADOR },
      { textKey: "q37_a4", trait: EneagramaTrait.CELEBRANTE },
    ],
  },
  {
    textKey: "q38_text",
    answers: [
      { textKey: "q38_a1", trait: EneagramaTrait.PROTETOR },
      { textKey: "q38_a2", trait: EneagramaTrait.SERVO },
      { textKey: "q38_a3", trait: EneagramaTrait.FIEL },
      { textKey: "q38_a4", trait: EneagramaTrait.SABIO },
    ],
  },
  {
    textKey: "q39_text",
    answers: [
      { textKey: "q39_a1", trait: EneagramaTrait.INTEGRO },
      { textKey: "q39_a2", trait: EneagramaTrait.FIEL },
      { textKey: "q39_a3", trait: EneagramaTrait.CELEBRANTE },
      { textKey: "q39_a4", trait: EneagramaTrait.PROTETOR },
    ],
  },
  {
    textKey: "q40_text",
    answers: [
      { textKey: "q40_a1", trait: EneagramaTrait.INTEGRO },
      { textKey: "q40_a2", trait: EneagramaTrait.CELEBRANTE },
      { textKey: "q40_a3", trait: EneagramaTrait.FIEL },
      { textKey: "q40_a4", trait: EneagramaTrait.PACIFICADOR },
    ],
  },
];

export const ENEAGRAMA_FILTER_NAMES: { [key: string]: string } = {
  'all': 'filter_all',
  [EneagramaTrait.INTEGRO]: 'filter_type1',
  [EneagramaTrait.SERVO]: 'filter_type2',
  [EneagramaTrait.MORDOMO]: 'filter_type3',
  [EneagramaTrait.ADORADOR]: 'filter_type4',
  [EneagramaTrait.SABIO]: 'filter_type5',
  [EneagramaTrait.FIEL]: 'filter_type6',
  [EneagramaTrait.CELEBRANTE]: 'filter_type7',
  [EneagramaTrait.PROTETOR]: 'filter_type8',
  [EneagramaTrait.PACIFICADOR]: 'filter_type9',
};