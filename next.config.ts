import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  trailingSlash: true,
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
      { source: '/sigamos-en-contacto/', destination: '/contacto/', permanent: true },
      { source: '/mapa-del-sitio/', destination: '/', permanent: true },
      { source: '/gracias/', destination: '/', permanent: true },
      { source: '/historia/', destination: '/nosotros/', permanent: true },
    ];
  },
};

export default nextConfig;
