import Image from "next/image";
import type { ArticuloBlock } from "@/lib/articulos-content";

/**
 * El contenido de una articulo llega troceado en bloques y no como un único string
 * de HTML: las galerías y los videos tienen que ser componentes de React para
 * poder usar next/image y un iframe con proporción fija, y eso es imposible
 * dentro de dangerouslySetInnerHTML. El pipeline deja el HTML a un lado y esos
 * dos casos a otro; aquí se vuelven a intercalar en orden.
 */
export function ArticuloBody({ blocks }: { blocks: ArticuloBlock[] }) {
  return (
    <div className="flex flex-col">
      {blocks.map((block, i) => {
        if (block.t === "html") {
          return (
            <div
              key={i}
              className="articulo-prose"
              dangerouslySetInnerHTML={{ __html: block.html }}
            />
          );
        }

        if (block.t === "gallery") {
          return (
            <div
              key={i}
              className="my-8 grid gap-4 sm:grid-cols-2"
              /*
                Una sola imagen no debe partirse a media columna: las galerías
                que trae el export son casi todas de una imagen, y en ese caso
                el grid de dos columnas la dejaría a la mitad del ancho.
              */
              style={block.images.length === 1 ? { gridTemplateColumns: "1fr" } : undefined}
            >
              {block.images.map((img) => (
                <Image
                  key={img.src}
                  src={img.src}
                  alt={img.alt}
                  width={img.w}
                  height={img.h}
                  sizes="(min-width: 768px) 720px, 100vw"
                  className="h-auto w-full rounded-sm"
                />
              ))}
            </div>
          );
        }

        return (
          <div key={i} className="my-8 aspect-video w-full overflow-hidden rounded-sm bg-navy">
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${block.id}`}
              title="Video de YouTube"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              loading="lazy"
              className="size-full border-0"
            />
          </div>
        );
      })}
    </div>
  );
}
