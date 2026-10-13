// Haroon's October 8 v4 decisions, NAJ-834. Commercial terms are not proof of runtime activation.
export const billingTerms = {
  en: {
    units: "AI voice uses 10 credits per minute, billed per second for AI-handled time only. Human takeover time, including ringing and hold after handoff, is free. A text conversation uses 4 credits only if the AI replies within its 24-hour window; human-only conversations and staff AI tools are free.",
    zero: "No overage charges. Under these plan terms, a call in progress finishes when credits run out; new calls go to your team or voicemail and the AI stops replying to new messages until credits are available again. Usage alerts are at 85% and 100%. We confirm this routing and credit controls before activation.",
    more: "Need more credits? Contact us to arrange a paid plan upgrade or a one-off credit pack. There is no prepaid SAR wallet or automatic top-up on these credit plans.",
    packs: "One-off credit packs, excluding VAT: 2,500 credits for SAR 275; 7,500 for SAR 750; 20,000 for SAR 1,900. Valid while your subscription is active, for up to 12 months. Contact us to confirm availability and purchase terms.",
    annual: "Annual billing is 5% off; credits are still released monthly. Quarterly and half-year terms are by contract only.",
    expiry: "The monthly plan pool expires at the end of each billing month and cannot be exchanged for cash. Cancellation and refunds follow the published policy and your signed agreement.",
    trial: "1,000 shared credits over 14 days, activated by our team after a demo. Equivalent to about 100 AI voice minutes or 250 AI conversations if used for one type only. No separate per-unit caps; the trial ends after 14 days or at zero credits.",
    setup: "Setup and integration are quoted to your requirements and may be waived. Contact us for a written quote and payment arrangements; there is no fixed setup price or instant checkout.",
    cloning: "Growth: up to 1 active cloned voice. Expansion: up to 3. Each new clone costs 2 credits once it is ready. Trial and Essential use standard voices; Enterprise terms are by contract.",
    byoc: "At launch, connect your own phone line or PBX (BYOC). Telephone carrier fees are separate. Number provisioning and capacity must be confirmed with our team before activation.",
  },
  ar: {
    units: "الدقيقة مع الذكاء الاصطناعي = 10 نقاط، وتُحتسب بالثانية للوقت الذي يتولاه الوكيل فقط. وقت الموظف بعد التحويل، بما فيه الرنين والانتظار، مجاني. المحادثة النصية = 4 نقاط فقط إذا رد الذكاء الاصطناعي خلال نافذتها البالغة 24 ساعة؛ المحادثات البشرية فقط وأدوات الذكاء الاصطناعي للموظفين مجانية.",
    zero: "لا رسوم تجاوز للحصة. وفق شروط الباقة، تكتمل المكالمة الجارية عند نفاد النقاط، وتتحول المكالمات الجديدة لفريقك أو البريد الصوتي، ويتوقف الذكاء الاصطناعي عن الرد على الرسائل الجديدة حتى تتوفر نقاط مجدداً. التنبيهات عند استهلاك 85% و100%. نؤكد إعدادات التحويل وضوابط الحصة قبل التفعيل.",
    more: "تحتاج نقاطاً أكثر؟ تواصل معنا لترتيب ترقية مدفوعة أو حزمة نقاط لمرة واحدة. باقات النقاط لا تستخدم محفظة ريال مسبقة الدفع ولا شحناً تلقائياً.",
    packs: "حزم لمرة واحدة، قبل الضريبة: 2,500 نقطة مقابل 275 ر.س؛ 7,500 مقابل 750 ر.س؛ 20,000 مقابل 1,900 ر.س. تسري أثناء الاشتراك النشط ولمدة أقصاها 12 شهراً. تواصل معنا لتأكيد التوفر وشروط الشراء.",
    annual: "خصم 5% عند الفوترة السنوية، مع إتاحة النقاط شهرياً. الفوترة الربع سنوية والنصف سنوية حسب العقد فقط.",
    expiry: "تنتهي حصة الباقة الشهرية بنهاية شهر الفوترة ولا تُستبدل بنقد. الإلغاء والاسترداد حسب السياسة المنشورة والاتفاقية الموقعة.",
    trial: "1,000 نقطة مشتركة خلال 14 يوماً، يفعّلها فريقنا بعد عرض تعريفي. تعادل نحو 100 دقيقة مع الذكاء الاصطناعي أو 250 محادثة إذا استُخدمت لنوع واحد فقط. لا حدود منفصلة لكل نوع؛ تنتهي التجربة بعد 14 يوماً أو عند نفاد النقاط.",
    setup: "التجهيز والربط بعرض سعر حسب احتياج منشأتك، وقد تُعفى رسومهما. تواصل معنا للحصول على عرض مكتوب وترتيبات الدفع؛ لا سعر ثابت للتجهيز ولا شراء فوري.",
    cloning: "نمو: صوت مستنسخ نشط واحد كحد أقصى. توسّع: حتى 3 أصوات نشطة. كل صوت جديد يستهلك نقطتين مرة واحدة عند جاهزيته. التجربة وأساسي تستخدمان الأصوات الجاهزة؛ ومؤسسات حسب العقد.",
    byoc: "عند الإطلاق، اربط خطك الهاتفي أو مقسمك الحالي (BYOC). رسوم مشغل الاتصالات منفصلة. يُؤكد تجهيز الأرقام وسعة الخط مع فريقنا قبل التفعيل.",
  },
} as const;
