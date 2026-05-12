export const SERVICE_END_AT = new Date('2026-05-13T00:00:00+09:00').getTime();

export const SERVICE_END_DISPLAY_TEXT = '2026. 05. 12. 23시 59분';

export const getIsServiceEnded = (now = Date.now()) => now >= SERVICE_END_AT;
