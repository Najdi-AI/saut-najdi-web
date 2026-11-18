/**
 * One call's journey in seven steps (/how-it-works). HowItWorksPage renders
 * them and pageFactory's HowTo graph reads the same list, so they are written
 * once, here. The seven-step shape is fixed by JourneySteps' icon list.
 */
export const journeySteps = {
  ar: [
    {
      title: "الرنة الأولى — الوكيل يرد",
      body: "بأي وقت: بعد الدوام، يوم الجمعة، وقت الذروة. ما في انتظار.",
    },
    {
      title: "الكلام يصير نص لحظياً",
      body: "مبني على اللهجات السعودية — «أبغى أحجز بكرة» يفهمها زي ما تنقال.",
    },
    {
      title: "الوكيل يفهم القصد",
      body: "حجز؟ سعر؟ تعديل موعد؟ يرد من أسعارك وأوقاتك وتاريخ العميل معك.",
    },
    {
      title: "يرد بلهجة عميلك",
      body: "صوت طبيعي. وإذا قاطعه العميل يسكت ويسمع، ويقرأ رقم الحجز رقم رقم.",
    },
    {
      title: "ينفذ — مو بس يتكلم",
      body: "يتحقق من الفاضي ويحجز، يسجل تفاصيل الطلب، ويسجل طلب اتصال برا الدوام.",
    },
    {
      title: "وإذا احتاج الموضوع إنسان؟ موظفك يستلم",
      body: "المكالمة تروح لموظفك ومعها النص والملخص وتاريخ العميل، والعميل ما يعيد كلمة. وفريقك يتابع المكالمات الحية ويستلمها من اللوحة.",
    },
    {
      title: "كل شي في لوحتك",
      body: "التسجيل والنص وملخص عربي: ليش اتصل ووش صار. مع أرقام نشاطك محسوبة من مكالماتك.",
    },
  ],
  en: [
    {
      title: "The first ring — the agent answers",
      body: "Any hour: after close, on a Friday, at peak. No hold queue.",
    },
    {
      title: "Speech becomes text, in real time",
      body: "Built on Saudi dialects — it understands how people actually talk, not textbook Arabic.",
    },
    {
      title: "The agent works out the intent",
      body: "A booking? A price? A reschedule? It answers from your prices, hours and the caller's history with you.",
    },
    {
      title: "It replies in your customer's dialect",
      body: "Natural speech. Interrupt it and it stops and listens, and it reads booking codes digit by digit.",
    },
    {
      title: "It acts — not just talks",
      body: "Checks availability and books, records order details, and logs a callback request when you're closed.",
    },
    {
      title: "And when it needs a human? Your employee takes over",
      body: "The call arrives with the transcript, summary and customer history, so the caller never repeats a word. Your team can also watch live calls and take one over.",
    },
    {
      title: "Everything lands in your dashboard",
      body: "Recording, transcript and a clear summary of what happened — plus your own activity numbers, worked out from your calls.",
    },
  ],
} as const;
