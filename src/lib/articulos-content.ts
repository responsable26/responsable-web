import { readFile } from "node:fs/promises";
import path from "node:path";

/** Bloque de HTML ya saneado del export de WordPress. */
export type ArticuloBlockHtml = { t: "html"; html: string };
/** Galería de WordPress convertida a grid; se pinta con next/image. */
export type ArticuloBlockGallery = {
  t: "gallery";
  images: { src: string; w: number; h: number; alt: string }[];
};
/** Embed de YouTube (bloque legacy o shortcode del tema antiguo). */
export type ArticuloBlockYoutube = { t: "youtube"; id: string };

export type ArticuloBlock = ArticuloBlockHtml | ArticuloBlockGallery | ArticuloBlockYoutube;

/**
 * Lee el contenido de una nota. Solo se llama desde componentes de servidor
 * durante el prerenderizado (todas las notas son estáticas vía
 * generateStaticParams), así que el fs se toca en build, nunca en runtime.
 */
export async function getArticuloBlocks(slug: string): Promise<ArticuloBlock[]> {
  const file = path.join(process.cwd(), "src/content/articulos", `${slug}.json`);
  const raw = await readFile(file, "utf8");
  return (JSON.parse(raw) as { blocks: ArticuloBlock[] }).blocks;
}
