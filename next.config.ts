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
      /* Artículos a los que WordPress cambió el slug. Search Console sigue
         reportando impresiones en la URL vieja, que hoy funciona solo porque
         WordPress guarda su propia redirección de cambio de slug —una red que
         este sitio no hereda—. Sin estas reglas, la de patrón de más abajo las
         mandaría a /recursos/articulos/<slug-viejo>/, que no existe: un 404
         en las URLs con más impresiones del sitio.

         VAN ANTES QUE LA REGLA DE PATRÓN A PROPÓSITO. Next evalúa en orden y
         se queda con la primera coincidencia; detrás de la genérica, estas no
         llegarían a evaluarse nunca.

         La fecha se captura en vez de fijarse: lo que identifica al artículo
         es el slug, y así la regla vale sea cual sea el día que llevara la URL
         indexada. Los grupos se nombran igual que en la regla genérica aunque
         no se usen en el destino, porque el patrón los exige.

         Equivalencias establecidas por título, no por parecido de slug: en las
         cuatro, el slug viejo es el titular del artículo pasado a slug, y ese
         titular coincide palabra por palabra con el del artículo en
         ARTICULOS. */
      {
        source: '/:year(\\d{4})/:month(\\d{2})/:day(\\d{2})/tipos-de-stakeholders-en-una-empresa-y-como-gestionarlos-correctamente/',
        destination: '/recursos/articulos/guia-sobre-los-stakeholders/',
        permanent: true,
      },
      {
        source: '/:year(\\d{4})/:month(\\d{2})/:day(\\d{2})/9-consejos-para-incorporar-la-responsabilidad-social-empresarial-en-pymes/',
        destination: '/recursos/articulos/guia-responsabilidad-social-empresarial-pymes/',
        permanent: true,
      },
      {
        source: '/:year(\\d{4})/:month(\\d{2})/:day(\\d{2})/analisis-de-materialidad-como-definir-prioridades-asg-en-tu-empresa/',
        destination: '/recursos/articulos/guia-analisis-de-materialidad/',
        permanent: true,
      },
      {
        source: '/:year(\\d{4})/:month(\\d{2})/:day(\\d{2})/webinar-del-donativo-al-impacto-como-calcular-el-retorno-social-de-tus-proyectos-con-participacion-especial-de-bmw-group-planta-slp/',
        destination: '/recursos/articulos/guia-calcular-retorno-social/',
        permanent: true,
      },
      {
        source: '/:year(\\d{4})/:month(\\d{2})/:day(\\d{2})/:slug/',
        destination: '/recursos/articulos/:slug/',
        permanent: true,
      },
      { source: '/category/:path*', destination: '/recursos/articulos/', permanent: true },
      { source: '/tag/:path*', destination: '/recursos/articulos/', permanent: true },
      { source: '/blog/:path*', destination: '/recursos/articulos/', permanent: true },
      /* Antes que /portfolios/:path*, que manda todo el tipo de contenido al
         índice: este es el único portfolio con impresiones y su artículo sí
         existe, así que aterriza en él y no en un listado. */
      { source: '/portfolios/panorama-de-la-responsabilidad-social-en-mexico-2019/', destination: '/recursos/articulos/panorama-de-la-responsabilidad-social-en-mexico-2019/', permanent: true },
      { source: '/portfolios/:path*', destination: '/recursos/articulos/', permanent: true },
      { source: '/news/:path*', destination: '/recursos/articulos/', permanent: true },
      /* Casos de éxito. Cambió el prefijo —de /caso-de-exito/ singular a
         /casos-de-exito/— y además tres de los cinco cambiaron de slug: el
         viejo era el titular narrativo del caso y el nuevo es el nombre del
         cliente. El mapeo se estableció abriendo cada página vieja y leyendo
         de quién era, no por parecido de slug, que aquí engaña: "el reto de
         ISO 26000 en grupo BAL" es la página de Vestolit. */
      { source: '/caso-de-exito/profuturo/', destination: '/casos-de-exito/profuturo/', permanent: true },
      { source: '/caso-de-exito/la-esperanza/', destination: '/casos-de-exito/la-esperanza/', permanent: true },
      { source: '/caso-de-exito/de-la-crisis-de-suministro-a-la-sostenibilidad-rentable/', destination: '/casos-de-exito/heineken-mexico/', permanent: true },
      { source: '/caso-de-exito/el-reto-de-iso-26000-en-grupo-bal/', destination: '/casos-de-exito/vestolit/', permanent: true },
      { source: '/caso-de-exito/un-cambio-comienza-desde-adentro/', destination: '/casos-de-exito/bmw/', permanent: true },
      /* Las cuatro categorías de servicio del WordPress son exactamente los
         cuatro cuadrantes de /servicio/, que ya tienen ancla propia en esa
         página (ANCLAS, en servicios-cuadrantes.tsx). Se enlaza al ancla y no
         al índice pelado para no perder el destino concreto. */
      { source: '/categoria-de-servicio/donde-estoy/', destination: '/servicio/#donde-estoy', permanent: true },
      { source: '/categoria-de-servicio/a-donde-voy/', destination: '/servicio/#adonde-voy', permanent: true },
      { source: '/categoria-de-servicio/como-lo-hago/', destination: '/servicio/#como-lo-hago', permanent: true },
      { source: '/categoria-de-servicio/como-comunico/', destination: '/servicio/#como-comunico', permanent: true },
      /* Páginas sueltas del WordPress viejo. Las tres últimas —eventos y
         patrocinio de marca— son de una línea de negocio que el sitio nuevo no
         recoge: no hay equivalente, así que van al índice de servicios, que es
         lo más cercano, y no a la Home. */
      { source: '/asesoria-en-responsabilidad-social/', destination: '/servicio/acompanamiento-sostenibilidad/', permanent: true },
      { source: '/proyectos/', destination: '/casos-de-exito/', permanent: true },
      { source: '/reputacion-corporativa-2/', destination: '/servicio/estrategia-de-comunicacion-en-sostenibilidad/', permanent: true },
      { source: '/traje-a-la-medida/', destination: '/servicio/', permanent: true },
      { source: '/organizamos-su-evento/', destination: '/servicio/', permanent: true },
      { source: '/posiciones-su-marca-en-rse/', destination: '/servicio/', permanent: true },
      { source: '/su-marca-en-nuestros-proyectos-innovadores-de-rse/', destination: '/servicio/', permanent: true },
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
      /* PROVISIONAL. Esta URL es la del servicio de formación en línea
         "Universidad ResponSable", que no se migró al catálogo: no está en
         CUADRANTES ni en contenido-servicios.ts, así que su ruta servía un 404
         pese a seguir recibiendo tráfico en Search Console. Va al servicio de
         formación vivo, que es el destino más cercano, no porque sean el mismo
         servicio. RETIRAR si Universidad ResponSable se da de alta y recupera
         su ruta propia: entonces este redirect la secuestraría.

         Es además el único origen de esta lista que ya cuelga de /servicio/,
         porque en el WordPress esa página vivía bajo ese mismo prefijo. */
      { source: '/servicio/cursos-online-universidad-responsable/', destination: '/servicio/cursos-talleres-para-empresas/', permanent: true },
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
