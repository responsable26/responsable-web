import Script from "next/script";

/*
  Google Tag Manager. Va montado en el layout raíz, así que carga en todas las
  páginas del sitio.

  strategy="afterInteractive" y no "beforeInteractive": GTM no participa en el
  pintado ni lo necesita nada de la primera vista, así que adelantarlo solo le
  robaría red y CPU al contenido. Con afterInteractive el script se inyecta una
  vez la página ya es interactiva —fuera de la ruta crítica de LCP— y sin
  bloquear la hidratación. Tampoco "lazyOnload", que espera al tiempo muerto
  del navegador: en una visita que rebota rápido, ese momento puede no llegar y
  la visita no se contaría.

  El fragmento es el que da GTM literalmente, sin adaptarlo: define dataLayer si
  no existe, marca gtm.start y añade el <script> del contenedor. Se deja tal
  cual para que se pueda comparar con el que publica Google.
*/

export const GTM_ID = "GTM-W6VK282S";

export function GoogleTagManager() {
  return (
    <Script id="gtm" strategy="afterInteractive">
      {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');`}
    </Script>
  );
}

/**
 * El <noscript> del contenedor, que GTM pide como primer elemento del <body>.
 *
 * Va aparte del <Script> porque tiene que estar en el marcado del documento y
 * no inyectarse: sin JavaScript, nada puede insertarlo. El iframe queda oculto
 * y fuera del flujo; aria-hidden y title lo sacan del árbol de accesibilidad,
 * que si no anuncia un marco sin nombre.
 */
export function GoogleTagManagerNoScript() {
  return (
    <noscript>
      <iframe
        src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
        height="0"
        width="0"
        style={{ display: "none", visibility: "hidden" }}
        title="Google Tag Manager"
        aria-hidden="true"
      />
    </noscript>
  );
}
