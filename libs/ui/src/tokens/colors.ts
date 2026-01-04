/**
 * 모행 디자인 시스템 - 컬러 토큰
 * Figma 디자인 시스템에서 추출한 색상 값
 */

export const colors = {
  // White & Black
  white: {
    white100: '#FFFFFF',
  },
  black: {
    black100: '#000000',
  },

  // Gray Scale
  gray: {
    50: '#FAFAFA',
    200: '#D4D4D8',
    300: '#A1A1AA',
    500: '#525252',
    600: '#404040',
    700: '#262626',
    800: '#171717',
  },

  // Primary Color
  primary: {
    500: '#00CCFF',
  },

  // Yellow & Green
  yellowGreen: {
    yellow100: '#FEE500',
    green100: '#00C950',
  },

  // System Colors
  system: {
    error500: '#F61C1C',
  },
} as const;

// Type helper for color values
export type ColorToken = typeof colors;
export type GrayColor = keyof typeof colors.gray;
export type SystemColor = keyof typeof colors.system;
export type PrimaryColor = keyof typeof colors.primary;
