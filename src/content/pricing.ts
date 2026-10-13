export const CREDIT_COST = { voiceMinute: 10, textConversation: 4, voiceClone: 2 } as const;

export const plans = [
  { key: "essential", ar: "أساسي", en: "Essential", monthlySar: 990, credits: 9_000, withinVoiceSar: 1.10, withinTextSar: 0.44 },
  { key: "growth", ar: "نمو", en: "Growth", monthlySar: 2_900, credits: 29_000, withinVoiceSar: 1.00, withinTextSar: 0.40 },
  { key: "expansion", ar: "توسّع", en: "Expansion", monthlySar: 6_900, credits: 76_666, withinVoiceSar: 0.90, withinTextSar: 0.36 },
] as const;

// Reference values only: v4 credit plans do not charge overage.
export function formatSarRate(value: number): string {
  return new Intl.NumberFormat("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 3 }).format(value);
}

export function voiceMinutes(credits: number): number {
  return Math.floor(credits / CREDIT_COST.voiceMinute);
}

export function textConversations(credits: number): number {
  return Math.floor(credits / CREDIT_COST.textConversation);
}
