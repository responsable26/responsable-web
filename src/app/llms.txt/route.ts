import { ARTICULOS } from "@/lib/articulos";
import { CASOS_PUBLICOS } from "@/lib/casos";
import { getContenidoServicio } from "@/lib/contenido-servicios";
import { UNIVERSIDAD } from "@/lib/contenido-universidad";
import {
  CIFRAS_NOSOTROS,
  DESCRIPCION_CASOS,
  DESCRIPCION_NOSOTROS,
  DESCRIPCION_RECURSOS,
  DESCRIPCION_SERVICIOS,
  descripcionCaso,
} from "@/lib/meta-descripciones";
import {
  BASE,
  DESCRIPCION_ORGANIZACION,
  ORGANIZACION_JSON_LD,
} from "@/lib/schema-organizacion";
import { CUADRANTES } from "@/lib/servicios";

/*
  /llms.txt, en el formato propuesto en llmstxt.org: H1 con el nombre, cita con
  la descripción, un párrafo de contexto y secciones H2 con listas de enlaces.

  Se genera a partir de los mismos datos que las páginas —catálogo de
  servicios, casos, artículos y meta descriptions de meta-descripciones.ts—, así
  que se actualiza solo cuando cambia el contenido. Estático: se resuelve en el
  build, como el sitemap.
*/
export const dynamic = "force-static";

/** Una línea de lista: enlace absoluto y descripción de una línea. */
function enlace(titulo: string, ruta: string, descripcion: string): string {
  return `- [${titulo}](${BASE}${ruta}): ${descripcion.replace(/\s+/g, " ").trim()}`;
}

/**
 * Comprueba que la ruta de un servicio del catálogo corresponde a una página
 * que existe. Mejor un build roto que un enlace a una página inexistente.
 */
function comprobarPaginaServicio(ruta: string): void {
  if (ruta === "/servicio/estudio-doble-materialidad/") return;
  if (ruta === `/servicio/${UNIVERSIDAD.slug}/`) return;
  const slug = ruta.replace(/^\/servicio\/|\/$/g, "");
  if (!getContenidoServicio(slug)) {
    throw new Error(`llms.txt: el servicio ${ruta} no tiene página propia`);
  }
}

function generar(): string {
  /* Las páginas de servicio, en el orden del catálogo: las que tienen ruta
     propia y no están marcadas como no enlazables. */
  const servicios = CUADRANTES.flatMap((c) => c.servicios).filter(
    (s) => s.href && !s.noEnlazable,
  );

  const conTituloSeo = ARTICULOS.filter((a) => a.tituloSeo);
  const resto = ARTICULOS.filter((a) => !a.tituloSeo);

  const org = ORGANIZACION_JSON_LD;
  const zona = org.areaServed.map((z) => z.name).join(" y ");
  const cifras = CIFRAS_NOSOTROS.map(
    (c) =>
      `${c.valor} ${c.etiqueta.charAt(0).toLowerCase()}${c.etiqueta.slice(1)}`,
  ).join("; ");

  return [
    "# ResponSable",
    "",
    `> ${DESCRIPCION_ORGANIZACION}`,
    "",
    `ResponSable es una marca de ${org.legalName}, fundada en ${org.foundingDate}. Opera en ${zona}. Cifras: ${cifras}.`,
    "",
    "## Servicios",
    "",
    enlace("Servicios", "/servicio/", DESCRIPCION_SERVICIOS),
    /* La descripción completa del catálogo, no la meta description de la
       página, que va recortada a 160 caracteres. */
    ...servicios.map((s) => {
      comprobarPaginaServicio(s.href as string);
      return enlace(s.nombre, s.href as string, s.descripcion);
    }),
    "",
    "## Casos de éxito",
    "",
    enlace("Casos de éxito", "/casos-de-exito/", DESCRIPCION_CASOS),
    ...CASOS_PUBLICOS.map((caso) =>
      enlace(
        `Caso de éxito: ${caso.cliente}`,
        `/casos-de-exito/${caso.slug}/`,
        descripcionCaso(caso),
      ),
    ),
    "",
    "## Empresa",
    "",
    enlace("Nosotros", "/nosotros/", DESCRIPCION_NOSOTROS),
    "",
    "## Recursos",
    "",
    enlace("Centro de Recursos", "/recursos/", DESCRIPCION_RECURSOS),
    ...conTituloSeo.map((a) =>
      enlace(a.titulo, `/recursos/articulos/${a.slug}/`, a.excerpt),
    ),
    "",
    "## Optional",
    "",
    ...resto.map((a) =>
      enlace(a.titulo, `/recursos/articulos/${a.slug}/`, a.excerpt),
    ),
    "",
  ].join("\n");
}

export function GET(): Response {
  return new Response(generar(), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
