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
    400: '#6B6B6B',
    500: '#525252',
    600: '#404040',
    700: '#262626',
    800: '#171717',
  },

  // Primary Color
  primary: {
    50: '#E1F9FF',
    100: '#C1F4FF',
    200: '#B2F1FF',
    300: '#9FEDFF',
    400: '#82E2FF',
    500: '#00CCFF',
    600: '#54B5CC',
    700: '#4391A3',
    800: '#367482',
    900: '#152D33',
  },

  // Yellow & Green
  yellowGreen: {
    yellow100: '#FEE500',
    green100: '#00C950',
  },

  // System Colors
  system: {
    50: '#F96D6D',
    500: '#F61C1C',
    900: '#9E1212',
  },
} as const;

// Type helper for color values
export type ColorToken = typeof colors;
export type GrayColor = keyof typeof colors.gray;
export type SystemColor = keyof typeof colors.system;
export type PrimaryColor = keyof typeof colors.primary;
