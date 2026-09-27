import type { Locale } from "@/lib/i18n";
import type { LegalDoc } from "@/content/legal";

/** NAJ-687 policy selected by Sultan on 2026-09-27. Allowance wording reflects the approved shared-credit model. */
export const refundPolicy: Record<Locale, LegalDoc> = {
  "ar": {
    "title": "سياسة الاسترداد والإلغاء",
    "updated": "آخر تحديث: سبتمبر 2026",
    "intro": "توضح هذه السياسة كيف تُلغي منشأتك اشتراكها في صوت نجدي، ومتى يُسترد ما دفعته وكيف. تنطبق على اشتراكات المنشآت ورصيد الاستخدام المدفوعين لشركة صوت نجدي. إذا تضمنت اتفاقية الاشتراك الموقعة مع منشأتك حكماً مختلفاً، فالاتفاقية هي المرجع.",
    "sections": [
      {
        "h": "1. كيف تُحتسب الفوترة",
        "blocks": [
          {
            "kind": "unordered",
            "items": [
              "تُفوتر رسوم الباقة مقدماً عن كل شهر، وتشمل رصيداً شهرياً مشتركاً للمكالمات والمحادثات. تخصم دقيقة المكالمة بالذكاء الاصطناعي 100 رصيد، وتخصم المحادثة النصية القابلة للفوترة خلال 24 ساعة 56 رصيداً.",
              "إذا بدأ الاشتراك خلال الشهر، تُحتسب رسوم الشهر الأول بعدد أيامه المتبقية، ويُمنح الرصيد الشهري المشمول كاملاً.",
              "ما يتجاوز الرصيد الشهري المشمول يُفوتر بعد انتهاء الشهر على الفاتورة التالية، بأسعار باقتك.",
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
            "text": "إذا حصلت منشأتك على فترة تجريبية، فمدتها 14 يوماً، دون بطاقة ودون أي رسوم، وتنتهي تلقائياً. لا يوجد فيها ما يُلغى أو يُسترد."
          }
        ]
      },
      {
        "h": "3. إلغاء الاشتراك",
        "blocks": [
          {
            "kind": "unordered",
            "items": [
              "يمكنك إلغاء الاشتراك في أي وقت بطلب مكتوب من مدير حساب المنشأة إلى billing@sautnajdi.ai.",
              "يسري الإلغاء في نهاية الشهر الذي يصلنا فيه الطلب، وتستمر الخدمة حتى ذلك التاريخ.",
              "لا تصدر فاتورة برسوم أي شهر بعد تاريخ سريان الإلغاء.",
              "رسوم الشهر الجاري لا يُسترد منها ما يقابل الأيام المتبقية، إلا في الحالة 1 من البند 6.",
              "الاستخدام الزائد عن الرصيد الشهري المشمول في الشهر الأخير يُفوتر في الفاتورة الختامية."
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
              "الترقية: تسري من أول الشهر الجاري، فيُحتسب الشهر كاملاً بسعر الباقة الجديدة ورصيدها الشهري، ويُفوتر الفرق.",
              "التخفيض: يسري من بداية الشهر التالي، ولا يترتب عليه استرداد عن الشهر الجاري.",
              "تُرسل طلبات التغيير إلى billing@sautnajdi.ai، ويعتمدها فريقنا."
            ]
          }
        ]
      },
      {
        "h": "5. رصيد الاستخدام",
        "blocks": [
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
              "الفاتورة الأولى خلال 7 أيام من بدء الاشتراك: إذا طلبت الإلغاء خلال 7 أيام من بدء الاشتراك ولم تُستخدم الخدمة، أي لم يُرد عبر حساب منشأتك على أي مكالمة أو محادثة، نرد مبلغ الفاتورة الأولى كاملاً بإشعار دائن، ويُلغى الاشتراك.",
              "الدفع المكرر: إذا دُفعت الفاتورة نفسها أكثر من مرة، يُرد المبلغ الزائد كاملاً.",
              "خطأ في الفوترة: إذا ثبت أن مبلغاً فُوتر دون استحقاق، نصحح الفاتورة بإشعار دائن، ونرد الفرق أو نخصمه من فاتورتك التالية حسب اختيارك.",
              "رصيد الاستخدام المتبقي عند انتهاء الاشتراك، وفق البند 5.",
              "إنهاء الخدمة من جهتنا لسبب لا يعود إلى منشأتك: نرد رسوم أي فترة مدفوعة لم نقدم فيها الخدمة، مع رصيد الاستخدام المتبقي."
            ]
          },
          {
            "kind": "paragraph",
            "text": "ولا يُسترد ما يلي:"
          },
          {
            "kind": "unordered",
            "items": [
              "رسوم الشهر الجاري، إلا في الحالة 1 أعلاه.",
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
    "updated": "Last updated: September 2026",
    "intro": "This policy explains how a business cancels its Saut Najdi subscription, and when and how payments are refunded. It applies to business subscriptions and usage balance paid to SAUT NAJDI Company. Where the subscription agreement signed with your business says otherwise, the agreement prevails.",
    "sections": [
      {
        "h": "1. How billing works",
        "blocks": [
          {
            "kind": "unordered",
            "items": [
              "The plan fee is billed monthly in advance and includes a monthly shared credit pool for call minutes and conversations. One AI call minute uses 100 credits, and one billable 24-hour text conversation uses 56 credits.",
              "If a subscription starts mid-month, the first month's fee is prorated by the remaining days, and the full monthly credit pool is granted for that month.",
              "Usage above the monthly credit pool is billed after the month ends, on the next invoice, at your plan's rates.",
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
            "text": "If your business was given a pilot, it lasts 14 days, requires no card, carries no charge, and ends automatically. There is nothing to cancel or refund."
          }
        ]
      },
      {
        "h": "3. Cancelling a subscription",
        "blocks": [
          {
            "kind": "unordered",
            "items": [
              "You can cancel at any time by a written request from your business's account administrator to billing@sautnajdi.ai.",
              "Cancellation takes effect at the end of the month in which we receive the request; the service keeps running until then.",
              "No fee is invoiced for any month after the cancellation takes effect.",
              "The current month's fee is not refunded for the days remaining, except under case 1 of section 6.",
              "Usage above the monthly credit pool in the final month is billed on the final invoice."
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
              "Upgrade: effective from the 1st of the current month — the whole month is billed at the new plan's price and monthly credit pool, and the difference is invoiced.",
              "Downgrade: effective from the start of the next month, with no refund for the current month.",
              "Send plan-change requests to billing@sautnajdi.ai; our team approves them."
            ]
          }
        ]
      },
      {
        "h": "5. Usage balance",
        "blocks": [
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
              "First invoice, within 7 days of the subscription starting: if you cancel within 7 days of the subscription starting and the service has not been used — no call or conversation has been answered through your business's account — we refund the first invoice in full by credit note, and the subscription ends.",
              "Duplicate payment: if the same invoice was paid more than once, the extra amount is refunded in full.",
              "Billing error: if an amount is shown to have been billed in error, we correct the invoice with a credit note and either refund the difference or deduct it from your next invoice, as you prefer.",
              "Remaining usage balance when the subscription ends, per section 5.",
              "Termination by us for a reason not attributable to your business: we refund fees for any paid period in which we did not provide the service, plus any remaining usage balance."
            ]
          },
          {
            "kind": "paragraph",
            "text": "The following are not refundable:"
          },
          {
            "kind": "unordered",
            "items": [
              "The current month's fee, except under case 1 above.",
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
