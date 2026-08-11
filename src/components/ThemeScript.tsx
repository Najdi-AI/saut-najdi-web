/**
 * Resolves the theme BEFORE first paint.
 *
 * This has to be a blocking inline script in <head>, not an effect: React
 * hydration runs after the browser has already painted, so doing it in a
 * component would show a white flash on every load for dark-theme visitors —
 * the one bug that makes a theme switcher feel broken.
 *
 * Precedence: an explicit choice the visitor made, else their OS setting.
 * Nothing is written to storage until they actually touch the toggle, so a
 * visitor who never does keeps following their OS if they change it later.
 *
 * The <html> element is server-rendered without the attribute and this adds
 * it, so the layout marks <html suppressHydrationWarning>.
 */
const SCRIPT = `(function(){try{
var s=localStorage.getItem('theme');
var d=s?s==='dark':matchMedia('(prefers-color-scheme: dark)').matches;
if(d)document.documentElement.setAttribute('data-theme','dark');
document.documentElement.style.colorScheme=d?'dark':'light';
}catch(e){}})();`;

export function ThemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: SCRIPT }} />;
}
