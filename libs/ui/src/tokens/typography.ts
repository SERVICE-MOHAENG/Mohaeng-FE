/**
 * 모행 디자인 시스템 - 타이포그래피 토큰
 * Figma 디자인 시스템에서 추출한 폰트 스타일
 */

export const typography = {
  // Font Family
  fontFamily: {
    gmarketSans: '"GMarketSans", sans-serif',
  },

  // Headline
  headline: {
    lHeadlineB: {
      fontFamily: '"GMarketSans", sans-serif',
      fontSize: '36px',
      fontWeight: 700,
      lineHeight: '100%',
      letterSpacing: '0',
    },
    mHeadlineB: {
      fontFamily: '"GMarketSans", sans-serif',
      fontSize: '42px',
      fontWeight: 700,
      lineHeight: 'normal',
      letterSpacing: '0',
    },
    LHeadlineB: {
      fontFamily: 'Pretendard',
      fontSize: '36px',
      fontWeight: 700,
      lineHeight: '100%',
      letterSpacing: '0',
    },
    LHeadlineM: {
      fontFamily: 'Pretendard',
      fontSize: '36px',
      fontWeight: 500,
      lineHeight: '100%',
      letterSpacing: '0',
    },
    HeadlineB: {
      fontFamily: 'Pretendard',
      fontSize: '32px',
      fontWeight: 700,
      lineHeight: '100%',
      letterSpacing: '0',
    },
    HeadlineM: {
      fontFamily: 'Pretendard',
      fontSize: '32px',
      fontWeight: 500,
      lineHeight: '100%',
      letterSpacing: '0',
    },
  },

  // Title
  title: {
    TitleB: {
      fontFamily: 'Pretendard',
      fontSize: '28px',
      fontWeight: 700,
      lineHeight: '100%',
      letterSpacing: '0',
    },
    TitleM: {
      fontFamily: 'Pretendard',
      fontSize: '28px',
      fontWeight: 500,
      lineHeight: '100%',
      letterSpacing: '0',
    },
    sTitleB: {
      fontFamily: 'Pretendard',
      fontSize: '24px',
      fontWeight: 700,
      lineHeight: '100%',
      letterSpacing: '0',
    },
    sTitleM: {
      fontFamily: 'Pretendard',
      fontSize: '24px',
      fontWeight: 500,
      lineHeight: '100%',
      letterSpacing: '0',
    },
  },

  // Body Text
  body: {
    BodyB: {
      fontFamily: 'Pretendard',
      fontSize: '16px',
      fontWeight: 700,
      lineHeight: '100%',
      letterSpacing: '0',
    },
    BodyM: {
      fontFamily: 'Pretendard',
      fontSize: '16px',
      fontWeight: 500,
      lineHeight: '100%',
      letterSpacing: '0',
    },
  },

  // Label Text
  label: {
    labelB: {
      fontFamily: 'Pretendard',
      fontSize: '12px',
      fontWeight: 700,
      lineHeight: '100%',
      letterSpacing: '0',
    },
    labelM: {
      fontFamily: 'Pretendard',
      fontSize: '12px',
      fontWeight: 500,
      lineHeight: '100%',
      letterSpacing: '0',
    },
    sLabelB: {
      fontFamily: 'Pretendard',
      fontSize: '10px',
      fontWeight: 700,
      lineHeight: '100%',
      letterSpacing: '0',
    },
    sLabelM: {
      fontFamily: 'Pretendard',
      fontSize: '10px',
      fontWeight: 500,
      lineHeight: '100%',
      letterSpacing: '0',
    },
  },
} as const;

// Type helper for typography values
export type TypographyToken = typeof typography;
export type HeadlineStyle = keyof typeof typography.headline;
export type BodyStyle = keyof typeof typography.body;
export type LabelStyle = keyof typeof typography.label;
