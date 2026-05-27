import type { LocaleKeys, SupportedLanguage } from '../types/i18n';
import { COLORS } from '../types/theme';

export type MockDreamEmotion =
  | 'joy'
  | 'calm'
  | 'anxiety'
  | 'nightmare'
  | 'neutral';

export type MockEmotionFilter = 'all' | Exclude<MockDreamEmotion, 'neutral'>;

export type MockSymbol = {
  symbol: string;
  meaning: string;
};

export type MockSymbolKeyPair = {
  symbolKey: keyof LocaleKeys;
  meaningKey: keyof LocaleKeys;
};

export const MOCK_AUTH = {
  defaultEmail: 'demo@dreamnest.app',
  fallbackEmail: 'demo@dreamnest.app',
  demoUserId: 'demo-user',
  backendToken: 'demo-backend-token',
} as const;

export const MOCK_EMOTION_STYLES: Record<
  MockDreamEmotion,
  {
    bg: string;
    border: string;
    text: string;
    colorCode: string;
    icon: string;
    labelKey: keyof LocaleKeys;
  }
> = {
  joy: {
    bg: 'rgba(123, 110, 246, 0.15)',
    border: 'rgba(123, 110, 246, 0.4)',
    text: COLORS.primaryAccent,
    colorCode: COLORS.primaryAccent,
    icon: '✨',
    labelKey: 'emotionJoy',
  },
  calm: {
    bg: 'rgba(91, 196, 160, 0.15)',
    border: 'rgba(91, 196, 160, 0.4)',
    text: COLORS.success,
    colorCode: COLORS.success,
    icon: '🍃',
    labelKey: 'emotionCalm',
  },
  anxiety: {
    bg: 'rgba(232, 155, 77, 0.15)',
    border: 'rgba(232, 155, 77, 0.4)',
    text: '#E89B4D',
    colorCode: '#E89B4D',
    icon: '🌪️',
    labelKey: 'emotionAnxiety',
  },
  nightmare: {
    bg: 'rgba(224, 107, 139, 0.15)',
    border: 'rgba(224, 107, 139, 0.4)',
    text: COLORS.error,
    colorCode: COLORS.error,
    icon: '👿',
    labelKey: 'emotionNightmare',
  },
  neutral: {
    bg: 'rgba(139, 130, 176, 0.15)',
    border: 'rgba(139, 130, 176, 0.4)',
    text: COLORS.textMuted,
    colorCode: COLORS.textMuted,
    icon: '💭',
    labelKey: 'emotionNeutral',
  },
};

export const MOCK_DREAM_HISTORY = [
  {
    id: 'moon-garden',
    titleKey: 'dreamOneTitle',
    dreamContentKey: 'dreamOneContent',
    interpretationKey: 'dreamOneInterpretation',
    emotionKey: 'dreamOneEmotion',
    emotionColor: COLORS.primaryAccent,
    createdAtKey: 'dreamOneDate',
    aiKeywords: ['journalKeywordSubconscious', 'journalKeywordDreamSymbol'],
    confidenceScore: 92,
    isFavorite: false,
  },
  {
    id: 'orange-train',
    titleKey: 'dreamTwoTitle',
    dreamContentKey: 'dreamTwoContent',
    interpretationKey: 'dreamTwoInterpretation',
    emotionKey: 'dreamTwoEmotion',
    emotionColor: COLORS.secondaryAccent,
    createdAtKey: 'dreamTwoDate',
    aiKeywords: ['journalKeywordSubconscious', 'journalKeywordDreamSymbol'],
    confidenceScore: 88,
    isFavorite: false,
  },
] as const;

export const MOCK_LOCALIZED_DREAM_TEXT_KEYS = [
  'dreamOneTitle',
  'dreamOneDate',
  'dreamOneEmotion',
  'dreamOneSummary',
  'dreamOneContent',
  'dreamOneInterpretation',
  'dreamTwoTitle',
  'dreamTwoDate',
  'dreamTwoEmotion',
  'dreamTwoSummary',
  'dreamTwoContent',
  'dreamTwoInterpretation',
  'dreamDetailKicker',
  'dreamDetailNotFoundTitle',
  'dreamDetailDreamLabel',
  'dreamDetailInterpretationLabel',
  'dreamDetailMissingBody',
  'journalKicker',
  'journalTitle',
  'journalSubtitle',
  'commonToday',
] as const satisfies ReadonlyArray<keyof LocaleKeys>;

export const MOCK_HOME_EMOTION_WAVES = [
  { label: '05-18', height: 42, color: COLORS.primaryAccent },
  { label: '05-19', height: 78, color: COLORS.primaryAccent },
  { label: '05-20', height: 58, color: COLORS.primaryAccent },
  {
    label: '05-21',
    height: 92,
    color: COLORS.secondaryAccent,
    highlight: true,
  },
  { label: '05-22', height: 64, color: COLORS.primaryAccent },
  { label: '05-23', height: 86, color: COLORS.primaryAccent },
  { labelKey: 'commonToday', height: 96, color: COLORS.success },
] as const;

export const MOCK_DREAM_EMOTIONS: MockDreamEmotion[] = [
  'joy',
  'calm',
  'anxiety',
  'nightmare',
  'neutral',
];

export const MOCK_JOURNAL_FILTERS: Array<{
  key: MockEmotionFilter;
  labelKey?: keyof LocaleKeys;
  label?: string;
  emoji: string;
}> = [
  { key: 'all', labelKey: 'journalFilterAll', emoji: '🌌' },
  { key: 'joy', labelKey: 'emotionJoy', emoji: '✨' },
  { key: 'calm', labelKey: 'emotionCalm', emoji: '🍃' },
  { key: 'anxiety', labelKey: 'emotionAnxiety', emoji: '🌪' },
  { key: 'nightmare', labelKey: 'emotionNightmare', emoji: '👿' },
];

export const MOCK_DREAM_DETAIL_BY_ID = {
  'moon-garden': {
    createdTime: '07:02 AM',
    confidenceScore: 92,
    symbols: [
      {
        symbolKey: 'dreamDetailMoonSymbolOne',
        meaningKey: 'dreamDetailMoonMeaningOne',
      },
      {
        symbolKey: 'dreamDetailMoonSymbolTwo',
        meaningKey: 'dreamDetailMoonMeaningTwo',
      },
      {
        symbolKey: 'dreamDetailMoonSymbolThree',
        meaningKey: 'dreamDetailMoonMeaningThree',
      },
    ],
    guidanceKey: 'dreamDetailGuidanceMoon',
  },
  'orange-train': {
    createdTime: '07:02 AM',
    confidenceScore: 88,
    symbols: [
      {
        symbolKey: 'dreamDetailTrainSymbolOne',
        meaningKey: 'dreamDetailTrainMeaningOne',
      },
      {
        symbolKey: 'dreamDetailTrainSymbolTwo',
        meaningKey: 'dreamDetailTrainMeaningTwo',
      },
      {
        symbolKey: 'dreamDetailTrainSymbolThree',
        meaningKey: 'dreamDetailTrainMeaningThree',
      },
    ],
    guidanceKey: 'dreamDetailGuidanceTrain',
  },
} as const;

export const MOCK_DEFAULT_DREAM_DETAIL = {
  createdTime: '07:02 AM',
  confidenceScore: 88,
  symbols: [
    {
      symbolKey: 'dreamDetailDefaultSymbol',
      meaningKey: 'dreamDetailDefaultMeaning',
    },
  ],
  guidanceKey: 'dreamDetailGuidanceDefault',
} as const;

export const MOCK_DREAM_ANALYSIS = {
  joy: {
    titleKey: 'dreamResultAnalysisJoyTitle',
    themeKey: 'dreamResultAnalysisJoyTheme',
    symbolKeys: [
      {
        symbolKey: 'dreamResultAnalysisJoySymbolOne',
        meaningKey: 'dreamResultAnalysisJoyMeaningOne',
      },
      {
        symbolKey: 'dreamResultAnalysisJoySymbolTwo',
        meaningKey: 'dreamResultAnalysisJoyMeaningTwo',
      },
      {
        symbolKey: 'dreamResultAnalysisJoySymbolThree',
        meaningKey: 'dreamResultAnalysisJoyMeaningThree',
      },
      {
        symbolKey: 'dreamResultAnalysisJoySymbolFour',
        meaningKey: 'dreamResultAnalysisJoyMeaningFour',
      },
    ],
    keywordKeys: [
      'dreamResultAnalysisJoyKeywordOne',
      'dreamResultAnalysisJoyKeywordTwo',
      'dreamResultAnalysisJoyKeywordThree',
    ],
    confidence: 94,
  },
  calm: {
    titleKey: 'dreamResultAnalysisCalmTitle',
    themeKey: 'dreamResultAnalysisCalmTheme',
    symbolKeys: [
      {
        symbolKey: 'dreamResultAnalysisCalmSymbolOne',
        meaningKey: 'dreamResultAnalysisCalmMeaningOne',
      },
      {
        symbolKey: 'dreamResultAnalysisCalmSymbolTwo',
        meaningKey: 'dreamResultAnalysisCalmMeaningTwo',
      },
      {
        symbolKey: 'dreamResultAnalysisCalmSymbolThree',
        meaningKey: 'dreamResultAnalysisCalmMeaningThree',
      },
    ],
    keywordKeys: [
      'dreamResultAnalysisCalmKeywordOne',
      'dreamResultAnalysisCalmKeywordTwo',
      'dreamResultAnalysisCalmKeywordThree',
    ],
    confidence: 96,
  },
  default: {
    titleKey: 'dreamResultAnalysisDefaultTitle',
    themeKey: 'dreamResultAnalysisDefaultTheme',
    symbolKeys: [
      {
        symbolKey: 'dreamResultAnalysisDefaultSymbolOne',
        meaningKey: 'dreamResultAnalysisDefaultMeaningOne',
      },
      {
        symbolKey: 'dreamResultAnalysisDefaultSymbolTwo',
        meaningKey: 'dreamResultAnalysisDefaultMeaningTwo',
      },
      {
        symbolKey: 'dreamResultAnalysisDefaultSymbolThree',
        meaningKey: 'dreamResultAnalysisDefaultMeaningThree',
      },
    ],
    keywordKeys: [
      'dreamResultAnalysisDefaultKeywordOne',
      'dreamResultAnalysisDefaultKeywordTwo',
      'dreamResultAnalysisDefaultKeywordThree',
    ],
    confidence: 90,
  },
} as const;

export type MockArchetypeKey = 'self' | 'persona' | 'shadow' | 'anima' | 'sage';

export const MOCK_PROFILE = {
  defaultArchetype: 'self' as MockArchetypeKey,
  integrationRatio: 84,
  archetypes: {
    self: {
      titleKey: 'profileArchetypeSelfTitle',
      tabKey: 'profileArchetypeSelfTab',
      ratio: 84,
      textKey: 'profileArchetypeSelfText',
      color: COLORS.secondaryAccent,
      border: 'rgba(240, 168, 110, 0.4)',
      bg: 'rgba(240, 168, 110, 0.08)',
      emoji: '✨',
    },
    persona: {
      titleKey: 'profileArchetypePersonaTitle',
      tabKey: 'profileArchetypePersonaTab',
      ratio: 65,
      textKey: 'profileArchetypePersonaText',
      color: COLORS.primaryAccent,
      border: 'rgba(123, 110, 246, 0.4)',
      bg: 'rgba(123, 110, 246, 0.08)',
      emoji: '🎭',
    },
    shadow: {
      titleKey: 'profileArchetypeShadowTitle',
      tabKey: 'profileArchetypeShadowTab',
      ratio: 48,
      textKey: 'profileArchetypeShadowText',
      color: COLORS.error,
      border: 'rgba(224, 107, 139, 0.4)',
      bg: 'rgba(224, 107, 139, 0.08)',
      emoji: '👿',
    },
    anima: {
      titleKey: 'profileArchetypeAnimaTitle',
      tabKey: 'profileArchetypeAnimaTab',
      ratio: 72,
      textKey: 'profileArchetypeAnimaText',
      color: COLORS.success,
      border: 'rgba(91, 196, 160, 0.4)',
      bg: 'rgba(91, 196, 160, 0.08)',
      emoji: '🍃',
    },
    sage: {
      titleKey: 'profileArchetypeSageTitle',
      tabKey: 'profileArchetypeSageTab',
      ratio: 58,
      textKey: 'profileArchetypeSageText',
      color: '#E89B4D',
      border: 'rgba(232, 155, 77, 0.4)',
      bg: 'rgba(232, 155, 77, 0.08)',
      emoji: '🦉',
    },
  },
} as const;

export const MOCK_SETTINGS = [
  { labelKey: 'profileSettingAccount', valueKey: 'profileSettingAccountValue' },
  { labelKey: 'profileSettingStorage', valueKey: 'profileSettingStorageValue' },
  { labelKey: 'profileSettingPrivacy', valueKey: 'profileSettingPrivacyValue' },
] as const satisfies ReadonlyArray<{
  labelKey: keyof LocaleKeys;
  valueKey: keyof LocaleKeys;
}>;

export const MOCK_LANGUAGE_OPTIONS: Array<{
  value: SupportedLanguage;
  labelKey: keyof LocaleKeys;
}> = [
  { value: 'en', labelKey: 'profileLanguageEnglish' },
  { value: 'zh-Hant', labelKey: 'profileLanguageTraditionalChinese' },
  { value: 'zh-Hans', labelKey: 'profileLanguageSimplifiedChinese' },
];
