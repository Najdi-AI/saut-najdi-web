export const CREDIT_COST = { voiceMinute: 100, textConversation: 56 } as const;

export const plans = [
  { key: "essential", ar: "أساسي", en: "Essential", monthlySar: 990, credits: 80_000, withinVoiceSar: 1.20, withinTextSar: 0.60, extraVoiceSar: 1.32, extraTextSar: 0.66 },
  { key: "growth", ar: "نمو", en: "Growth", monthlySar: 2_900, credits: 240_000, withinVoiceSar: 1.10, withinTextSar: 0.55, extraVoiceSar: 1.21, extraTextSar: 0.605 },
  { key: "expansion", ar: "توسّع", en: "Expansion", monthlySar: 6_900, credits: 580_000, withinVoiceSar: 0.90, withinTextSar: 0.50, extraVoiceSar: 0.99, extraTextSar: 0.55 },
] as const;

// Preserve the exact three-decimal Growth conversation rate (SAR 0.605).
export function formatSarRate(value: number): string {
  return new Intl.NumberFormat("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 3 }).format(value);
}

export function voiceMinutes(credits: number): number {
  return Math.floor(credits / CREDIT_COST.voiceMinute);
}

export function textConversations(credits: number): number {
  return Math.floor(credits / CREDIT_COST.textConversation);
}
