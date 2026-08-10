import type { ArticuloBlock } from "@/lib/articulos-content";

export type EntradaIndice = {
  id: string;
  texto: string;
  hijos: { id: string; texto: string }[];
};

/**
 * Entidades con nombre que aparecen en el export de WordPress. Las numéricas se
 * resuelven aparte, por código.
 */
const ENTIDADES: Record<string, string> = {
  nbsp: "\u00a0",
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  hellip: "…",
  mdash: "—",
  ndash: "–",
  laquo: "«",
  raquo: "»",
  lsquo: "\u2018",
  rsquo: "\u2019",
  ldquo: "\u201c",
  rdquo: "\u201d",
  deg: "°",
  ordm: "º",
  ordf: "ª",
  eacute: "é",
  aacute: "á",
  iacute: "í",
  oacute: "ó",
  uacute: "ú",
  ntilde: "ñ",
  Ntilde: "Ñ",
  uuml: "ü",
};

/**
 * Decodifica entidades HTML en un texto extraído del markup.
 *
 * Hace falta porque el índice se construye a partir del HTML del artículo: ahí
 * `&nbsp;` es markup correcto y debe quedarse, pero al pasarlo a texto plano se
 * vería literal. La decodificación va aquí, en la extracción, y no en el
 * contenido: decodificarlo en origen rompería el HTML.
 */
function decodificar(texto: string) {
  return texto.replace(
    /&(#x?[0-9a-fA-F]+|[a-zA-Z][a-zA-Z0-9]*);/g,
    (completo, cuerpo: string) => {
      if (cuerpo.startsWith("#")) {
        const hex = cuerpo[1] === "x" || cuerpo[1] === "X";
        const punto = Number.parseInt(
          hex ? cuerpo.slice(2) : cuerpo.slice(1),
          hex ? 16 : 10,
        );
        return Number.isFinite(punto) ? String.fromCodePoint(punto) : completo;
      }
      return ENTIDADES[cuerpo] ?? completo;
    },
  );
}

/**
 * Texto plano de un encabezado: se quitan las etiquetas, se decodifican las
 * entidades y se recortan los espacios sobrantes — incluidos los no separables,
 * que `trim()` por sí solo no elimina y dejaban títulos empezando por espacio.
 */
function textoPlano(html: string) {
  return decodificar(html.replace(/<[^>]+>/g, ""))
    .replace(/[\s\u00a0]+/g, " ")
    .replace(/^[\s\u00a0]+|[\s\u00a0]+$/g, "");
}

/** Slug ASCII a partir del texto del encabezado. */
function idDesdeTexto(texto: string) {
  return (
    texto
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "seccion"
  );
}

/**
 * Inyecta un `id` en cada h2/h3 del contenido y devuelve el índice jerárquico.
 *
 * Los id salen del texto del encabezado para que sean estables entre compilados
 * —un índice por posición cambiaría al insertar una sección y rompería los
 * enlaces guardados—. Las colisiones se resuelven con un sufijo numérico, que
 * hace falta porque hay artículos con encabezados repetidos.
 *
 * Se ejecuta en el servidor durante el prerenderizado: el HTML ya llega con los
 * anclajes puestos, sin manipular el DOM en cliente.
 */
export function prepararIndice(blocks: ArticuloBlock[]) {
  const usados = new Map<string, number>();
  const indice: EntradaIndice[] = [];

  const conAnclas = blocks.map((bloque) => {
    if (bloque.t !== "html") return bloque;

    const html = bloque.html.replace(
      /<(h2|h3)([^>]*)>([\s\S]*?)<\/\1>/g,
      (completo, etiqueta: string, atributos: string, interior: string) => {
        const texto = textoPlano(interior);
        if (!texto) return completo;

        const base = idDesdeTexto(texto);
        const repeticiones = usados.get(base) ?? 0;
        usados.set(base, repeticiones + 1);
        const id = repeticiones === 0 ? base : `${base}-${repeticiones + 1}`;

        if (etiqueta === "h2" || indice.length === 0) {
          // Un h3 antes del primer h2 se promueve a raíz: si no, quedaría
          // huérfano y desaparecería del índice.
          indice.push({ id, texto, hijos: [] });
        } else {
          indice[indice.length - 1].hijos.push({ id, texto });
        }

        return `<${etiqueta}${atributos} id="${id}">${interior}</${etiqueta}>`;
      },
    );

    return { ...bloque, html };
  });

  const total = indice.reduce((n, e) => n + 1 + e.hijos.length, 0);
  return { blocks: conAnclas, indice, total };
}
