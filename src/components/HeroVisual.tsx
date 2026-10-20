import type { Locale } from "@/lib/i18n";
import { SwitchboardFigure } from "./anatomy/switchboard/figure";

/**
 * The hero visual: the Najdi switchboard (NAJ-897), a crafted isometric
 * figure whose working is the product. A line lamp rings, the agent's plug
 * answers, the dialect dial clicks to «سعودي», the stamp prints the booking
 * card, and on every other call the patch cord moves to the jack engraved
 * «موظفك» while a summary ticket comes out: the site's four steps.
 *
 * Centred stage (Sultan, 2026-10-20): the machine stands frameless under the
 * headline and the CTAs, large, on the hero's own background. It fills most
 * of the content width on desktop (up to 920 px) and the full width of a
 * phone: below sm it steps out of the container's 1.25rem gutters, so a
 * 390 px screen shows it edge to edge without scrolling sideways.
 *
 * W4's voice demo lives on the speaker's hub: the same play control
 * (useVoiceClip, public/audio/home-hero.m4a + home-hero.json), the same
 * labels and caption. While the clip plays the machine follows its turns.
 *
 * Server component: the drawing is server-rendered and only the motion
 * ships to the client (anatomy/switchboard/live.tsx).
 *
 * `data-fab-avoid` keeps the chat launcher tucked away while it would sit on
 * the machine (the speaker's play button and the dial), as it did over the
 * old hero photo's bubbles and mic. The photo itself now lives in the
 * «مو بس ذكاء… وراه ناس» section (HomePage.tsx).
 */
export function HeroVisual({ locale }: { locale: Locale }) {
  return (
    <div data-fab-avoid="" className="relative -mx-5 w-[calc(100%+2.5rem)] sm:mx-auto sm:w-full sm:max-w-[760px] lg:max-w-[920px]">
      <SwitchboardFigure locale={locale} />
    </div>
  );
}
