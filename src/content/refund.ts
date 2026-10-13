import type { Locale } from "@/lib/i18n";
import type { LegalDoc } from "@/content/legal";

/** NAJ-687 policy selected by Sultan on 2026-09-27. Allowance wording reflects the approved shared-credit model. */
export const refundPolicy: Record<Locale, LegalDoc> = {
  "ar": {
    "title": "سياسة الاسترداد والإلغاء",
    "updated": "آخر تحديث: 13 أكتوبر 2026",
    "intro": "توضح هذه السياسة كيف تُلغي منشأتك اشتراكها في صوت نجدي، ومتى يُسترد ما دفعته وكيف. تنطبق على اشتراكات المنشآت ورصيد الاستخدام المدفوعين لشركة صوت نجدي. إذا تضمنت اتفاقية الاشتراك الموقعة مع منشأتك حكماً مختلفاً، فالاتفاقية هي المرجع. باقات النقاط الحالية لا تتضمن محفظة ريال مسبقة الدفع. أحكام الرصيد النقدي أدناه تخص الاتفاقيات السابقة التي تتضمنه فقط، ولا تغيّر حقوقها. أحكام الفوترة الشهرية والتجزئة والإلغاء والتخفيض واسترداد رسوم الاشتراك الواردة هنا تخص الاشتراكات الشهرية. تُؤكد شروط الفوترة السنوية أو مدد العقد الأخرى، بما فيها الإلغاء والتغيير والاسترداد، في اتفاقية مكتوبة قبل الدفع.",
    "sections": [
      {
        "h": "1. كيف تُحتسب الفوترة",
        "blocks": [
          {
            "kind": "unordered",
            "items": [
              "للاشتراك الشهري، تُفوتر رسوم الباقة مقدماً عن كل شهر وتشمل حصة نقاط شهرية مشتركة للمكالمات والمحادثات. دقيقة المكالمة مع الذكاء الاصطناعي تستهلك 10 نقاط، والمحادثة النصية التي يرد فيها الذكاء الاصطناعي خلال نافذة 24 ساعة تستهلك 4 نقاط.",
              "إذا بدأ اشتراك شهري خلال الشهر، تُحتسب رسوم الشهر الأول بعدد أيامه المتبقية، وتُمنح حصة النقاط الشهرية المشمولة كاملة.",
              "باقات النقاط الحالية بلا رسوم تجاوز. عند نفاد الحصة تكتمل المكالمة الجارية، وتتوقف المكالمات والردود الآلية الجديدة حتى تتوفر نقاط؛ ويُؤكد تحويل المكالمات لفريقك أو البريد الصوتي قبل التفعيل.",
              "الأسعار بالريال السعودي، وتُضاف إليها ضريبة القيمة المضافة 15% في الفاتورة الضريبية.",
              "الدفع بالبطاقات البنكية (مدى والبطاقات الائتمانية) عبر بوابة الدفع «ميسّر»، أو بالتحويل البنكي."
            ]
          }
        ]
      },
      {
        "h": "2. الفترة التجريبية",
        "blocks": [
          {
            "kind": "paragraph",
            "text": "التجربة 14 يوماً بحصة 1,000 نقطة، يفعّلها فريقنا بعد عرض تعريفي. تنتهي عند نفاد النقاط أو انقضاء المدة، بلا حدود منفصلة للدقائق والمحادثات، ودون بطاقة أو رسوم."
          }
        ]
      },
      {
        "h": "3. إلغاء الاشتراك",
        "blocks": [
          {
            "kind": "unordered",
            "items": [
              "يمكنك طلب إلغاء الاشتراك في أي وقت بطلب مكتوب من مدير حساب المنشأة إلى billing@sautnajdi.ai؛ ويعتمد تاريخ السريان على مدة اشتراكك واتفاقيتك.",
              "للاشتراكات الشهرية، يسري الإلغاء في نهاية الشهر الذي يصلنا فيه الطلب، وتستمر الخدمة حتى ذلك التاريخ.",
              "للاشتراكات الشهرية، لا تصدر فاتورة برسوم أي شهر بعد تاريخ سريان الإلغاء.",
              "للاشتراكات الشهرية، لا يُسترد من رسوم الشهر الجاري ما يقابل الأيام المتبقية، إلا في الحالة 1 من البند 6.",
              "لا تُضاف رسوم تجاوز لحصة النقاط في الفاتورة الختامية للباقات الحالية."
            ]
          }
        ]
      },
      {
        "h": "4. تغيير الباقة",
        "blocks": [
          {
            "kind": "unordered",
            "items": [
              "الترقية: تتطلب الدفع لتفعيل الباقة الجديدة. يوضح العرض المكتوب قيمة الفرق وتاريخ التفعيل.",
              "تخفيض الاشتراك الشهري: يسري من بداية الشهر التالي، ولا يترتب عليه استرداد عن الشهر الجاري.",
              "تُرسل طلبات التغيير إلى billing@sautnajdi.ai، ويعتمدها فريقنا."
            ]
          }
        ]
      },
      {
        "h": "5. الرصيد النقدي للاتفاقيات السابقة فقط",
        "blocks": [
          {
            "kind": "paragraph",
            "text": "هذا البند لا ينطبق على باقات النقاط الحالية. لزيادة النقاط، تواصل معنا لترقية مدفوعة أو حزمة لمرة واحدة؛ الحزمة صالحة أثناء الاشتراك النشط ولمدة أقصاها 12 شهراً. شروط شرائها واستردادها تُؤكد قبل الدفع."
          },
          {
            "kind": "unordered",
            "items": [
              "رصيد الاستخدام مبلغ تدفعه مقدماً (250 ريالاً كحد أدنى)، ويُخصم منه ما يتجاوز الرصيد الشهري المشمول في باقتك بأسعار باقتك.",
              "يصدر عند كل شحن للرصيد فاتورة ضريبية مستقلة.",
              "صلاحية الرصيد 12 شهراً من تاريخ الدفع، وما لم يُستخدم خلالها تنتهي صلاحيته ولا يُسترد.",
              "لا يُسترد الرصيد أثناء سريان الاشتراك.",
              "عند انتهاء الاشتراك، يُسترد الرصيد المتبقي غير منتهي الصلاحية، بعد إصدار الفاتورة الختامية وخصم ما يستحق فيها.",
              "يمكنك إلغاء طلب شحن الرصيد في أي وقت قبل دفعه."
            ]
          }
        ]
      },
      {
        "h": "6. متى يُسترد المبلغ",
        "blocks": [
          {
            "kind": "paragraph",
            "text": "نرد المبلغ شاملاً ضريبة القيمة المضافة في الحالات التالية:"
          },
          {
            "kind": "ordered",
            "items": [
              "الفاتورة الأولى للاشتراك الشهري خلال 7 أيام من بدء الاشتراك: إذا طلبت الإلغاء خلال 7 أيام من بدء الاشتراك ولم تُستخدم الخدمة، أي لم يُرد عبر حساب منشأتك على أي مكالمة أو محادثة، نرد مبلغ الفاتورة الأولى كاملاً بإشعار دائن، ويُلغى الاشتراك.",
              "الدفع المكرر: إذا دُفعت الفاتورة نفسها أكثر من مرة، يُرد المبلغ الزائد كاملاً.",
              "خطأ في الفوترة: إذا ثبت أن مبلغاً فُوتر دون استحقاق، نصحح الفاتورة بإشعار دائن، ونرد الفرق أو نخصمه من فاتورتك التالية حسب اختيارك.",
              "رصيد الاستخدام المتبقي عند انتهاء الاشتراك، وفق البند 5.",
              "للاشتراكات الشهرية، إنهاء الخدمة من جهتنا لسبب لا يعود إلى منشأتك: نرد رسوم أي فترة مدفوعة لم نقدم فيها الخدمة، مع رصيد الاستخدام المتبقي."
            ]
          },
          {
            "kind": "paragraph",
            "text": "ولا يُسترد ما يلي:"
          },
          {
            "kind": "unordered",
            "items": [
              "رسوم الشهر الجاري للاشتراكات الشهرية، إلا في الحالة 1 أعلاه.",
              "قيمة الاستخدام الذي تم فعلاً.",
              "رصيد الاستخدام المنتهية صلاحيته.",
              "رسوم الإعداد والتهيئة التي تُدفع مرة واحدة، بعد بدء العمل عليها."
            ]
          }
        ]
      },
      {
        "h": "7. طريقة طلب الاسترداد",
        "blocks": [
          {
            "kind": "unordered",
            "items": [
              "أرسل الطلب من بريد مدير حساب المنشأة إلى billing@sautnajdi.ai، مع رقم الفاتورة وسبب الطلب.",
              "نرد عليك بقرارنا خلال 5 أيام عمل.",
              "عند الموافقة نصدر إشعاراً دائناً وفق متطلبات هيئة الزكاة والضريبة والجمارك، ونعيد المبلغ إلى وسيلة الدفع الأصلية متى أمكن، أو بتحويل بنكي إلى حساب باسم المنشأة.",
              "قد يستغرق وصول المبلغ إلى البطاقة حتى 14 يوماً حسب البنك المُصدر.",
              "لا نخصم أي رسوم إدارية من المبلغ المسترد."
            ]
          }
        ]
      },
      {
        "h": "8. تعليق الخدمة لعدم السداد",
        "blocks": [
          {
            "kind": "paragraph",
            "text": "إذا لم تُسدد فاتورة في موعد استحقاقها، يحق لنا تعليق الخدمة بعد إشعارك، وتُستأنف فور السداد. التعليق لا يُعد إلغاءً للاشتراك، ولا يُسقط المبالغ المستحقة."
          }
        ]
      },
      {
        "h": "9. تغيير الأسعار",
        "blocks": [
          {
            "kind": "paragraph",
            "text": "نُشعرك قبل 30 يوماً على الأقل من تطبيق أي سعر جديد على اشتراكك، ويمكنك إلغاء الاشتراك قبل سريانه دون أي رسوم إضافية."
          }
        ]
      },
      {
        "h": "10. بيانات المنشأة والتواصل",
        "blocks": [
          {
            "kind": "paragraph",
            "text": "شركة صوت نجدي (SAUT NAJDI Company)"
          },
          {
            "kind": "paragraph",
            "text": "السجل التجاري: 7054897538"
          },
          {
            "kind": "paragraph",
            "text": "الرقم الضريبي: 314931940900003"
          },
          {
            "kind": "paragraph",
            "text": "العنوان الوطني: مبنى 3848، شارع عبدالله العنقري، حي الورود، الرياض 12254، الرقم الإضافي 7427، المملكة العربية السعودية"
          },
          {
            "kind": "paragraph",
            "text": "البريد الإلكتروني للفوترة: billing@sautnajdi.ai"
          }
        ]
      }
    ]
  },
  "en": {
    "title": "Refund & Cancellation Policy",
    "updated": "Last updated: 13 October 2026",
    "intro": "This policy explains how a business cancels its Saut Najdi subscription, and when and how payments are refunded. It applies to business subscriptions and usage balance paid to SAUT NAJDI Company. Where the subscription agreement signed with your business says otherwise, the agreement prevails. Current credit plans do not include a prepaid SAR wallet. Monetary-balance terms below apply only to legacy agreements that include one, without changing their existing rights. The monthly billing, proration, cancellation, downgrade and subscription-fee refund clauses here apply to monthly subscriptions. Annual and other contracted billing terms, including cancellation, plan changes and refunds, are confirmed in a written agreement before payment.",
    "sections": [
      {
        "h": "1. How billing works",
        "blocks": [
          {
            "kind": "unordered",
            "items": [
              "For monthly subscriptions, the plan fee is billed monthly in advance and includes a shared monthly credit pool for calls and conversations. One AI call minute uses 10 credits, and a text conversation in which the AI replies during its 24-hour window uses 4 credits.",
              "If a monthly subscription starts mid-month, the first month's fee is prorated by the remaining days, and the full monthly credit pool is granted for that month.",
              "Current credit plans have no overage charges. At zero, a call in progress finishes and new AI calls and replies stop until credits are available; routing to your team or voicemail is confirmed before activation.",
              "Prices are in Saudi riyals (SAR); 15% VAT is added on the tax invoice.",
              "Payment is by bank card (mada and credit cards) through the Moyasar payment gateway, or by bank transfer."
            ]
          }
        ]
      },
      {
        "h": "2. Pilot",
        "blocks": [
          {
            "kind": "paragraph",
            "text": "The trial provides 1,000 credits over 14 days, activated by our team after a demo. It ends at zero credits or the end of the period, with no separate minute or conversation caps, no card and no charge."
          }
        ]
      },
      {
        "h": "3. Cancelling a subscription",
        "blocks": [
          {
            "kind": "unordered",
            "items": [
              "You can request cancellation at any time in writing from your business's account administrator to billing@sautnajdi.ai; the effective date follows your subscription term and agreement.",
              "For monthly subscriptions, cancellation takes effect at the end of the month in which we receive the request; the service keeps running until then.",
              "For monthly subscriptions, no fee is invoiced for any month after cancellation takes effect.",
              "For monthly subscriptions, the current month's fee is not refunded for the days remaining, except under case 1 of section 6.",
              "No credit-pool overage charges are added to the final invoice for current plans."
            ]
          }
        ]
      },
      {
        "h": "4. Changing plans",
        "blocks": [
          {
            "kind": "unordered",
            "items": [
              "Upgrade: payment is required to activate the new plan. The written offer confirms the price difference and activation date.",
              "Monthly subscription downgrade: effective from the start of the next month, with no refund for the current month.",
              "Send plan-change requests to billing@sautnajdi.ai; our team approves them."
            ]
          }
        ]
      },
      {
        "h": "5. Monetary usage balance — legacy agreements only",
        "blocks": [
          {
            "kind": "paragraph",
            "text": "This section does not apply to current credit plans. Contact us for a paid upgrade or a one-off credit pack; packs remain valid during an active subscription for up to 12 months. Purchase and refund terms are confirmed before payment."
          },
          {
            "kind": "unordered",
            "items": [
              "Usage balance is an amount you pay in advance (minimum SAR 250). Usage above your plan's monthly credit pool is drawn from it at your plan's rates.",
              "Each top-up receives its own tax invoice.",
              "A balance is valid for 12 months from payment; any amount unused by then expires and is not refunded.",
              "Balance is not refunded while the subscription is active.",
              "When the subscription ends, the remaining unexpired balance is refunded after the final invoice is issued and its charges are deducted.",
              "You can cancel a top-up request at any time before it is paid."
            ]
          }
        ]
      },
      {
        "h": "6. When we refund",
        "blocks": [
          {
            "kind": "paragraph",
            "text": "We refund the amount, including VAT, in these cases:"
          },
          {
            "kind": "ordered",
            "items": [
              "First invoice for a monthly subscription, within 7 days of the subscription starting: if you cancel within 7 days of the subscription starting and the service has not been used — no call or conversation has been answered through your business's account — we refund the first invoice in full by credit note, and the subscription ends.",
              "Duplicate payment: if the same invoice was paid more than once, the extra amount is refunded in full.",
              "Billing error: if an amount is shown to have been billed in error, we correct the invoice with a credit note and either refund the difference or deduct it from your next invoice, as you prefer.",
              "Remaining usage balance when the subscription ends, per section 5.",
              "For monthly subscriptions, termination by us for a reason not attributable to your business: we refund fees for any paid period in which we did not provide the service, plus any remaining usage balance."
            ]
          },
          {
            "kind": "paragraph",
            "text": "The following are not refundable:"
          },
          {
            "kind": "unordered",
            "items": [
              "The current month's fee for monthly subscriptions, except under case 1 above.",
              "Usage that has already taken place.",
              "Expired usage balance.",
              "One-time setup and onboarding fees once work on them has started."
            ]
          }
        ]
      },
      {
        "h": "7. How to request a refund",
        "blocks": [
          {
            "kind": "unordered",
            "items": [
              "Email billing@sautnajdi.ai from your business's account administrator address, with the invoice number and the reason.",
              "We reply with our decision within 5 business days.",
              "Once approved, we issue a credit note in line with ZATCA requirements and return the amount to the original payment method where possible, or by bank transfer to an account in the business's name.",
              "A card refund can take up to 14 days to arrive, depending on the issuing bank.",
              "We deduct no administrative fee from refunds."
            ]
          }
        ]
      },
      {
        "h": "8. Suspension for non-payment",
        "blocks": [
          {
            "kind": "paragraph",
            "text": "If an invoice is not paid by its due date, we may suspend the service after notifying you, and resume it as soon as payment is made. Suspension does not cancel the subscription and does not waive amounts due."
          }
        ]
      },
      {
        "h": "9. Price changes",
        "blocks": [
          {
            "kind": "paragraph",
            "text": "We notify you at least 30 days before any new price applies to your subscription, and you may cancel before it takes effect at no additional charge."
          }
        ]
      },
      {
        "h": "10. Company details and contact",
        "blocks": [
          {
            "kind": "paragraph",
            "text": "SAUT NAJDI Company (شركة صوت نجدي)"
          },
          {
            "kind": "paragraph",
            "text": "Commercial Registration: 7054897538"
          },
          {
            "kind": "paragraph",
            "text": "VAT number: 314931940900003"
          },
          {
            "kind": "paragraph",
            "text": "National address: Building 3848, Abdullah Al-Anqari St., Al Woroud District, Riyadh 12254, Additional No. 7427, Saudi Arabia"
          },
          {
            "kind": "paragraph",
            "text": "Billing email: billing@sautnajdi.ai"
          }
        ]
      }
    ]
  }
};
