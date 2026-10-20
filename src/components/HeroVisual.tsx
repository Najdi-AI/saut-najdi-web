import type { Locale } from "@/lib/i18n";
import { SwitchboardFigure } from "./anatomy/switchboard/figure";

/**
 * The hero visual: the Najdi switchboard (NAJ-897), a crafted isometric
 * figure whose working is the product. A line lamp rings, the agent's plug
 * answers, the dialect dial clicks to «سعودي», the stamp prints the booking
 * card, and on every other call the patch cord moves to the jack engraved
 * «موظفك» while a summary ticket comes out: the site's four steps.
 *
 * W4's voice demo lives on the speaker's hub: the same play control
 * (useVoiceClip, public/audio/home-hero.m4a + home-hero.json), the same
 * labels and caption. While the clip plays the machine follows its turns,
 * and the readout carries each spoken line, as the bubbles did.
 *
 * Server component: the drawing is server-rendered and only the motion
 * ships to the client (anatomy/switchboard/live.tsx).
 */
export function HeroVisual({ locale }: { locale: Locale }) {
  return (
    <div className="relative mx-auto w-full max-w-[520px] lg:max-w-[560px]">
      <SwitchboardFigure locale={locale} />
    </div>
  );
}
