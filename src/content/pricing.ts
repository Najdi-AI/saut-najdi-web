export const CREDIT_COST = { voiceMinute: 100, textConversation: 56 } as const;

export const plans = [
  { key: "essential", ar: "أساسي", en: "Essential", monthlySar: 990, credits: 80_000, extraVoiceSar: 1.20, extraTextSar: 0.60 },
  { key: "growth", ar: "نمو", en: "Growth", monthlySar: 2_900, credits: 240_000, extraVoiceSar: 1.10, extraTextSar: 0.55 },
  { key: "expansion", ar: "توسّع", en: "Expansion", monthlySar: 6_900, credits: 580_000, extraVoiceSar: 0.90, extraTextSar: 0.50 },
] as const;

export function voiceMinutes(credits: number): number {
  return Math.floor(credits / CREDIT_COST.voiceMinute);
}

export function textConversations(credits: number): number {
  return Math.floor(credits / CREDIT_COST.textConversation);
}
