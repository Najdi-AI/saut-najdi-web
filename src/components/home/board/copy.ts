import type { Locale } from "@/lib/i18n";
import type { Knob } from "./model";

/**
 * The missed-calls board (Try 3 index.html #board and try.js). {braced}
 * names are filled with figures, which render as Latin digits in LTR
 * islands. Every figure is an estimate from the visitor's own numbers.
 */
export const boardCopy = {
  ar: {
    title: "مكالمة فاتت؟ فلوس راحت.",
    lead: "شغّل يوم من مكالماتك بعد الدوام وشوف كم يروح عليك، بعدين خلّ صوت نجدي يرد على نفس المكالمات.",
    tiles: "مكالمات يوم واحد بعد الدوام",
    legend: "كل مربع مكالمة بعد الدوام. المكالمة اللي تفوت تخسّرك بالمتوسط {per} ر.س: حجز بـ {value} ر.س، و{book} منهم كانوا بيحجزون.",
    play: "شغّل اليوم",
    save: "خلّ صوت نجدي يرد",
    reset: "أعد اليوم",
    perDay: "ر.س باليوم",
    without: "بدون صوت نجدي",
    with: "مع صوت نجدي",
    month: { idle: "بالشهر", loss: "يروح عليك بالشهر", profit: "ممكن يرجع لك بالشهر" },
    sar: "ر.س",
    cap: "تقدير: اليوم × {days}، محسوب من أرقامك أنت، مو رقم مضمون.",
    calc: "حط أرقام نشاطك",
    knobs: {
      calls: "مكالمات بعد الدوام باليوم",
      miss: "نسبة اللي ما ينرد عليها",
      book: "نسبة اللي كانوا بيحجزون",
      value: "قيمة الحجز الواحد",
    } satisfies Record<Knob, string>,
    riyals: "{n} ريال",
    status: {
      loss: "خلص اليوم: فاتك بالمتوسط {missed} مكالمة، يعني {day} ر.س باليوم.",
      none: "خلص اليوم: على هالأرقام ما فاتك شي.",
      profit: "نفس المكالمات، رد عليها صوت نجدي: {day} ر.س باليوم ممكن ترجع لك.",
    },
    call: {
      idle: "مكالمة {t}",
      answered: "مكالمة {t}، انرد عليها",
      missed: "مكالمة {t}، فاتت، ناقص {v} ريال",
      saved: "مكالمة {t}، رد عليها صوت نجدي، زائد {v} ريال",
    },
    am: "ص",
    pm: "م",
  },
  en: {
    title: "A missed call is money gone.",
    lead: "Play a day of your after-hours calls and see what slips away, then let Saut Najdi answer the same calls.",
    tiles: "One day of after-hours calls",
    legend: "Each square is an after-hours call. A missed call costs you {per} SAR on average: a {value} SAR booking, and {book} of these callers would have booked.",
    play: "Play the day",
    save: "Let Saut Najdi answer",
    reset: "Reset the day",
    perDay: "SAR a day",
    without: "Without Saut Najdi",
    with: "With Saut Najdi",
    month: { idle: "Each month", loss: "Lost each month", profit: "Could come back each month" },
    sar: "SAR",
    cap: "An estimate: the day × {days}, worked out from your own numbers, not a guaranteed figure.",
    calc: "Enter your numbers",
    knobs: {
      calls: "After-hours calls a day",
      miss: "Share that go unanswered",
      book: "Share who would have booked",
      value: "Value of one booking",
    } satisfies Record<Knob, string>,
    riyals: "{n} riyals",
    status: {
      loss: "Day done: on average you missed {missed} calls, that is {day} SAR a day.",
      none: "Day done: with these numbers you missed nothing.",
      profit: "Same calls, answered by Saut Najdi: {day} SAR a day could come back to you.",
    },
    call: {
      idle: "Call at {t}",
      answered: "Call at {t}, answered",
      missed: "Call at {t}, missed, minus {v} riyals",
      saved: "Call at {t}, answered by Saut Najdi, plus {v} riyals",
    },
    am: "am",
    pm: "pm",
  },
} satisfies Record<Locale, unknown>;

export type BoardCopy = (typeof boardCopy)[Locale];
