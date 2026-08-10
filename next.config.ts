import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  trailingSlash: true,
  images: {
    /* Miniaturas de los videos testimoniales. Es el único origen remoto del
       sitio; todo lo demás se sirve desde /public. */
    remotePatterns: [{ protocol: 'https', hostname: 'i.ytimg.com' }],
  },
  async redirects() {
    return [
      {
        source: '/:year(\\d{4})/:month(\\d{2})/:day(\\d{2})/:slug/',
        destination: '/recursos/articulos/:slug/',
        permanent: true,
      },
      { source: '/category/:path*', destination: '/recursos/articulos/', permanent: true },
      { source: '/tag/:path*', destination: '/recursos/articulos/', permanent: true },
      { source: '/blog/:path*', destination: '/recursos/articulos/', permanent: true },
      { source: '/portfolios/:path*', destination: '/recursos/articulos/', permanent: true },
      { source: '/news/:path*', destination: '/recursos/articulos/', permanent: true },
      { source: '/aviso-de-privacidad/', destination: '/legal/aviso-privacidad/', permanent: true },
      { source: '/terminos-y-condiciones/', destination: '/legal/terminos-y-condiciones/', permanent: true },
      /* /contacto/ dejó de existir: el modal es el único canal. Ambos destinos
         llevan a la Home con el parámetro que lo abre. El de
         /sigamos-en-contacto/ ya existía apuntando a /contacto/ y se reapunta
         aquí en lugar de añadir uno nuevo. */
      { source: '/contacto/', destination: '/?contacto=1', permanent: true },
      { source: '/sigamos-en-contacto/', destination: '/?contacto=1', permanent: true },
      { source: '/mapa-del-sitio/', destination: '/', permanent: true },
      { source: '/gracias/', destination: '/', permanent: true },
      { source: '/historia/', destination: '/nosotros/', permanent: true },
      /* Rutas del WordPress viejo que la auditoría de enlaces detectó como 404
         y que corresponden a casos de éxito. */
      { source: '/heineken/', destination: '/casos-de-exito/heineken-mexico/', permanent: true },
      { source: '/confian-en-nosotros/', destination: '/casos-de-exito/', permanent: true },
      /* Páginas de servicio del WordPress viejo.

         Ninguna vive bajo /servicio/: todas cuelgan de la raíz y usan el
         vocabulario «RSE» de la marca anterior. El campo LINK de los documentos
         de contenido no sirve como referencia para esto —apunta al destino
         previsto en el sitio nuevo, no a la URL que existe hoy—, así que el
         origen de cada regla se tomó del sitemap de producción y se confirmó
         una por una contra el <title> de la página, no por parecido de slug.

         Solo están los servicios que ya tienen contenido documentado en
         contenido-servicios.ts. Los demás siguen en el reporte, pendientes.

         Estrategia de comunicación aparece dos veces porque el WordPress tiene
         dos páginas distintas para ese servicio. */
      { source: '/acompanamiento-rse/', destination: '/servicio/acompanamiento-sostenibilidad/', permanent: true },
      { source: '/comunicacion-en-rse/', destination: '/servicio/estrategia-de-comunicacion-en-sostenibilidad/', permanent: true },
      { source: '/estrategia-de-comunicacion-en-rse/', destination: '/servicio/estrategia-de-comunicacion-en-sostenibilidad/', permanent: true },
      { source: '/cursos-y-talleres-de-rse-en-mexico/', destination: '/servicio/cursos-talleres-para-empresas/', permanent: true },
      { source: '/diagnostico-sostenibilidad/', destination: '/servicio/diagnostico-de-sostenibilidad/', permanent: true },
      { source: '/estrategia-de-sostenibilidad-y-rse/', destination: '/servicio/estrategia-sostenibilidad/', permanent: true },
      /* La excepción a la regla de arriba: Estudio de Doble Materialidad no
         tiene documento en contenido-servicios.ts, pero su página ya está
         publicada y es la única de las pendientes con un destino real. Dejarla
         fuera mantenía un 404 evitable. */
      { source: '/estudio-de-materialidad-2/', destination: '/servicio/estudio-doble-materialidad/', permanent: true },
      { source: '/informe-de-sostenibilidad/', destination: '/servicio/informe-de-sostenibilidad/', permanent: true },
      { source: '/norma-iso-26000/', destination: '/servicio/iso-26000/', permanent: true },
      /* Convive con el artículo /6-tips-para-postular-al-distintivo-esr-del-cemefi/,
         que es otra URL y ya resuelve por la regla de artículos. */
      { source: '/postular-al-distintivo-esr-del-cemefi/', destination: '/servicio/distintivo-esr/', permanent: true },
    ];
  },
};

export default nextConfig;
