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
    ];
  },
};

export default nextConfig;
