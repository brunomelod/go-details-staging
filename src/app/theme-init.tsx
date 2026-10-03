/** Evita flash de tema errado antes do React hidratar. */
export function ThemeInitScript() {
  const script = `(function(){try{var t=localStorage.getItem('go-details-theme');document.documentElement.setAttribute('data-theme',t==='light'?'light':'dark');}catch(e){document.documentElement.setAttribute('data-theme','dark');}})();`;
  return (
    <script
      dangerouslySetInnerHTML={{ __html: script }}
    />
  );
}
