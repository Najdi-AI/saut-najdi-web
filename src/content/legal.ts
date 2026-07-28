import type { Locale } from "@/lib/i18n";

/**
 * Legal documents (blueprint §6.10) — precise فصحى / formal English.
 * The privacy policy carries the PDPL-required disclosures: what is
 * collected and why, storage location, every cross-border processor,
 * retention per data category, data-subject rights, and the
 * analytics/cookie note. Have counsel review before signing contracts.
 */

export interface LegalDoc {
  title: string;
  updated: string;
  intro: string;
  sections: { h: string; ps: string[] }[];
}

export const legal: Record<Locale, Record<"privacy" | "terms" | "dpa", LegalDoc>> = {
  ar: {
    privacy: {
      title: "سياسة الخصوصية",
      updated: "آخر تحديث: يوليو 2026",
      intro:
        "تُبيّن هذه السياسة كيف تجمع منصة صوت نجدي («المنصة») البيانات الشخصية وتعالجها وتخزنها، لزوّار هذا الموقع وللمنشآت المشتركة وعملائها المتصلين، بما يتوافق مع نظام حماية البيانات الشخصية السعودي (PDPL).",
      sections: [
        {
          h: "1. ما نجمعه ولماذا",
          ps: [
            "لزوّار الموقع: لا يجمع هذا الموقع بيانات تعريفية عن زواره. تُستخدم أداة قياس بلا ملفات تعريف ارتباط (Vercel Analytics) لإحصاءات مجمّعة عن الصفحات — دون معرّفات شخصية، ولذلك لا يعرض الموقع لافتة موافقة على ملفات تعريف الارتباط.",
            "لحجوزات العرض التعريفي: عند حجزك عرضاً نجمع — عبر خدمة Cal.com — اسمك وبريدك وجوالك واسم منشأتك وقطاعها وحجم مكالماتك التقريبي، لغرض وحيد هو التواصل معك وتجهيز العرض.",
            "للمنشآت المشتركة وعملائها: تعالج المنصة محتوى المكالمات والمحادثات النصية (الصوت، والنص، والملخصات)، وبيانات العملاء التي تُدخلها المنشأة (الأسماء، أرقام التواصل، التفضيلات، الحجوزات)، وسجلات الاستخدام — لغرض تشغيل خدمة الرد الآلي والتصعيد البشري التي تعاقدت عليها المنشأة.",
          ],
        },
        {
          h: "2. أين تُخزَّن البيانات",
          ps: [
            "التخزين الدائم لبيانات المنصة يتم في منطقة الخليج (الدوحة — me-central1) على Google Cloud عبر شبكة خاصة، مع نسخ احتياطية واستعادة لنقطة زمنية محددة.",
          ],
        },
        {
          h: "3. المعالجون ونقل البيانات عبر الحدود",
          ps: [
            "التزاماً بمتطلبات الإفصاح عن نقل البيانات عبر الحدود في النظام، نُبيّن الجهات التي تمر بياناتك عبرها:",
            "• مزوّدو المعالجة اللحظية للصوت والذكاء الاصطناعي (تحويل الكلام إلى نص، وفهم اللغة، وتوليد الصوت) — عبر نقاط معالجة عالمية.",
            "• خدمة التعرّف الضوئي على مستندات قاعدة المعرفة — عبر نقطة معالجة أوروبية.",
            "• Cal.com لحجوزات العرض التعريفي — معالج خارج المملكة.",
            "• Vercel لاستضافة هذا الموقع وقياس زياراته (بلا ملفات تعريف ارتباط).",
            "• نظام إدارة العلاقات الذي تصل إليه بيانات الحجوزات — يُسمّى في هذه السياسة فور اعتماده.",
          ],
        },
        {
          h: "4. مدد الاحتفاظ",
          ps: [
            "تسجيلات المكالمات: تُحذف تلقائياً بعد 90 يوماً من تاريخ المكالمة.",
            "النصوص والملخصات وسجل العملاء: يُحتفظ بها طوال مدة اشتراك المنشأة لتشغيل الخدمة وسياق العملاء، وتُعالَج وفق تعليمات المنشأة عند انتهاء الاشتراك.",
            "بيانات حجز العرض والتواصل: يُحتفظ بها للمدة اللازمة لمتابعة طلبك ثم لأغراض التعاقد إن تم.",
          ],
        },
        {
          h: "5. حقوقك",
          ps: [
            "لك — وفق نظام حماية البيانات الشخصية — حق العلم بمعالجة بياناتك، وطلب الاطلاع عليها، وتصحيحها، وطلب إتلافها ضمن الحدود النظامية. إذا كنت عميلاً لمنشأة مشتركة، تُوجَّه الطلبات إلى المنشأة بصفتها المتحكم بالبيانات، وتعينها المنصة على تنفيذها.",
            "للتواصل بشأن أي طلب: info@sautnajdi.com.",
          ],
        },
      ],
    },
    terms: {
      title: "شروط الخدمة",
      updated: "آخر تحديث: يوليو 2026",
      intro:
        "تحكم هذه الشروط استخدام موقع صوت نجدي وخدماته. باستخدامك الموقع أو حجزك عرضاً تعريفياً فأنت توافق عليها.",
      sections: [
        {
          h: "1. الخدمة",
          ps: [
            "صوت نجدي منصة رد آلي هجينة: وكيل صوتي بالذكاء الاصطناعي يرد على مكالمات عملاء المنشآت المشتركة ومحادثاتها النصية، مع تصعيد المكالمة إلى موظف بشري وفق قواعد تحددها المنشأة. تُقدَّم الخدمة للمنشآت بموجب اتفاقية اشتراك مستقلة، ولا يوجد تسجيل ذاتي عام.",
          ],
        },
        {
          h: "2. استخدام الموقع",
          ps: [
            "يُتاح محتوى الموقع للتعريف بالخدمة. لا يجوز إساءة استخدام الموقع أو محاولة الوصول غير المصرح به إلى أنظمة المنصة، ولا استخدام محتواه أو علامته التجارية دون إذن كتابي.",
          ],
        },
        {
          h: "3. حجز العروض",
          ps: [
            "حجوزات العرض التعريفي تتم عبر خدمة Cal.com وتخضع أيضاً لشروطها. المعلومات التي تقدمها في الحجز تُستخدم وفق سياسة الخصوصية.",
          ],
        },
        {
          h: "4. الملكية الفكرية",
          ps: [
            "جميع حقوق المنصة وعلامة «صوت نجدي / Saut Najdi» وشعارها ومحتوى هذا الموقع محفوظة لصوت نجدي.",
          ],
        },
        {
          h: "5. حدود المسؤولية",
          ps: [
            "يُقدَّم محتوى الموقع كما هو للتعريف العام، وتُحدَّد التزامات الخدمة ومستوياتها في اتفاقية الاشتراك الموقعة مع كل منشأة. لا يشكل محتوى الموقع وعداً تعاقدياً بذاته.",
          ],
        },
        {
          h: "6. النظام الواجب التطبيق",
          ps: [
            "تخضع هذه الشروط لأنظمة المملكة العربية السعودية، وتختص جهاتها القضائية بأي نزاع ينشأ عنها.",
          ],
        },
      ],
    },
    dpa: {
      title: "اتفاقية معالجة البيانات — ملخص",
      updated: "آخر تحديث: يوليو 2026",
      intro:
        "هذا ملخص عام لاتفاقية معالجة البيانات (DPA) التي توقعها المنشآت المشتركة ضمن التعاقد. النسخة الكاملة الموقعة هي المرجع الملزم — اطلبها عبر info@sautnajdi.com.",
      sections: [
        {
          h: "الأدوار",
          ps: [
            "المنشأة المشتركة هي المتحكم بالبيانات (تحدد أغراض المعالجة)، وصوت نجدي معالج للبيانات يعالجها وفق تعليمات المنشأة الموثقة وأحكام نظام حماية البيانات الشخصية.",
          ],
        },
        {
          h: "التزامات المعالجة",
          ps: [
            "• المعالجة لأغراض تشغيل الخدمة حصراً، ووفق تعليمات المنشأة.",
            "• التخزين الدائم في منطقة الخليج (الدوحة)، مع الإفصاح الكامل عن المعالجين الفرعيين وأماكنهم (انظر سياسة الخصوصية) وإشعار المنشأة قبل أي تغيير فيهم.",
            "• تدابير تقنية وتنظيمية: عزل بيانات كل منشأة على مستوى قاعدة البيانات، وأدوار وصلاحيات، وسجل تدقيق غير قابل للتعديل، وروابط وصول موقعة قصيرة الصلاحية.",
            "• حذف تسجيلات المكالمات تلقائياً بعد 90 يوماً، وتنفيذ تعليمات المنشأة في بياناتها عند انتهاء الاشتراك.",
            "• الإشعار عن أي حادثة تمس البيانات الشخصية وفق المدد النظامية.",
            "• إعانة المنشأة على تلبية طلبات أصحاب البيانات (الاطلاع، التصحيح، الإتلاف).",
          ],
        },
      ],
    },
  },
  en: {
    privacy: {
      title: "Privacy Policy",
      updated: "Last updated: July 2026",
      intro:
        "This policy explains how the Saut Najdi platform (“the platform”) collects, processes and stores personal data — for visitors of this website, for subscribed businesses, and for their calling customers — in line with Saudi Arabia's Personal Data Protection Law (PDPL).",
      sections: [
        {
          h: "1. What we collect and why",
          ps: [
            "Website visitors: this site does not collect identifying data about its visitors. A cookieless measurement tool (Vercel Analytics) provides aggregate page statistics without personal identifiers — which is why this site shows no cookie banner.",
            "Demo bookings: when you book a demo we collect — through Cal.com — your name, email, mobile number, business name, sector, and approximate call volume, for the sole purpose of contacting you and preparing the demo.",
            "Subscribed businesses and their customers: the platform processes call and text-conversation content (audio, transcripts, summaries), the customer records a business enters (names, contact numbers, preferences, bookings), and usage logs — to operate the AI answering and human-handoff service the business contracted for.",
          ],
        },
        {
          h: "2. Where data is stored",
          ps: [
            "Permanent platform storage is in the Gulf region (Doha — me-central1) on Google Cloud over private networking, with backups and point-in-time restore.",
          ],
        },
        {
          h: "3. Processors and cross-border transfers",
          ps: [
            "In line with the PDPL's cross-border transfer disclosure requirements, your data transits the following processors:",
            "• Realtime speech and AI providers (speech-to-text, language understanding, voice generation) — via global processing endpoints.",
            "• The OCR service for knowledge-base documents — via a European processing endpoint.",
            "• Cal.com for demo bookings — a processor outside Saudi Arabia.",
            "• Vercel for hosting this website and its cookieless analytics.",
            "• The CRM system receiving booking data — to be named in this policy once selected.",
          ],
        },
        {
          h: "4. Retention",
          ps: [
            "Call recordings: automatically deleted 90 days after the call.",
            "Transcripts, summaries and customer records: retained for the duration of the business's subscription to operate the service, then handled per the business's instructions at termination.",
            "Demo-booking and contact data: retained as long as needed to follow up on your request, then for contracting if it proceeds.",
          ],
        },
        {
          h: "5. Your rights",
          ps: [
            "Under the PDPL you have the right to know your data is processed, to access it, to correct it, and to request its destruction within the law's limits. If you are a customer of a subscribed business, requests go to that business as the data controller, and the platform assists in fulfilling them.",
            "For any request: info@sautnajdi.com.",
          ],
        },
      ],
    },
    terms: {
      title: "Terms of Service",
      updated: "Last updated: July 2026",
      intro:
        "These terms govern the use of the Saut Najdi website and services. By using the site or booking a demo you agree to them.",
      sections: [
        {
          h: "1. The service",
          ps: [
            "Saut Najdi is a hybrid AI answering platform: an AI voice agent that answers a subscribed business's customer calls and text conversations, with escalation to a human employee under rules the business defines. The service is provided to businesses under a separate subscription agreement; there is no public self-signup.",
          ],
        },
        {
          h: "2. Using the site",
          ps: [
            "Site content is provided to describe the service. You may not misuse the site, attempt unauthorised access to platform systems, or use its content or trademarks without written permission.",
          ],
        },
        {
          h: "3. Demo bookings",
          ps: [
            "Demo bookings run through Cal.com and are additionally subject to its terms. Information you provide in a booking is used per the privacy policy.",
          ],
        },
        {
          h: "4. Intellectual property",
          ps: [
            "All rights to the platform, the “صوت نجدي / Saut Najdi” brand, its logo, and this site's content are reserved to Saut Najdi.",
          ],
        },
        {
          h: "5. Liability",
          ps: [
            "Site content is provided as-is for general information; service obligations and levels are defined in the signed subscription agreement with each business. Site content is not itself a contractual promise.",
          ],
        },
        {
          h: "6. Governing law",
          ps: [
            "These terms are governed by the laws of the Kingdom of Saudi Arabia, whose courts have jurisdiction over any dispute arising from them.",
          ],
        },
      ],
    },
    dpa: {
      title: "Data Processing Agreement — Summary",
      updated: "Last updated: July 2026",
      intro:
        "This is a public summary of the Data Processing Agreement (DPA) subscribed businesses sign as part of contracting. The signed full version is the binding reference — request it at info@sautnajdi.com.",
      sections: [
        {
          h: "Roles",
          ps: [
            "The subscribed business is the data controller (it determines the purposes of processing); Saut Najdi is a data processor acting on the business's documented instructions and the PDPL.",
          ],
        },
        {
          h: "Processing commitments",
          ps: [
            "• Processing strictly to operate the service, per the business's instructions.",
            "• Permanent storage in the Gulf region (Doha), with full disclosure of sub-processors and their locations (see the privacy policy) and notice before any change to them.",
            "• Technical and organisational measures: tenant isolation enforced at the database level, roles and permissions, an append-only audit log, and short-lived signed access links.",
            "• Automatic deletion of call recordings after 90 days, and execution of the business's instructions for its data at termination.",
            "• Notification of any personal-data incident within statutory timelines.",
            "• Assistance with data-subject requests (access, correction, destruction).",
          ],
        },
      ],
    },
  },
};
