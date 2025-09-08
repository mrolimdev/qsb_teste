import { UserInfo, Scores, EneagramaTrait } from '../types';

export const getScoresFromUserInfo = (ui: UserInfo | null): Scores | null => {
    // Check for a definite non-null score to avoid returning a half-empty object. tipo_1 is a good candidate.
    if (!ui || ui.tipo_1 === null || typeof ui.tipo_1 === 'undefined') {
        return null;
    }

    return {
        [EneagramaTrait.INTEGRO]: ui.tipo_1 || 0,
        [EneagramaTrait.SERVO]: ui.tipo_2 || 0,
        [EneagramaTrait.MORDOMO]: ui.tipo_3 || 0,
        [EneagramaTrait.ADORADOR]: ui.tipo_4 || 0,
        [EneagramaTrait.SABIO]: ui.tipo_5 || 0,
        [EneagramaTrait.FIEL]: ui.tipo_6 || 0,
        [EneagramaTrait.CELEBRANTE]: ui.tipo_7 || 0,
        [EneagramaTrait.PROTETOR]: ui.tipo_8 || 0,
        [EneagramaTrait.PACIFICADOR]: ui.tipo_9 || 0,
    };
};
