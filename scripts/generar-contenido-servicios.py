import json

"""Da forma de TypeScript al JSON que produce extraer-servicios.py.

    python3 scripts/extraer-servicios.py > /tmp/servicios.json
    python3 scripts/generar-contenido-servicios.py /tmp/servicios.json
    npx prettier --write src/lib/contenido-servicios.ts

Se ejecuta desde la raíz del repositorio. Sobrescribe
src/lib/contenido-servicios.ts por completo: ese archivo no se edita a mano.
"""
import sys

D = sys.argv[1] if len(sys.argv) > 1 else "servicios.json"
datos = {r["archivo"]: r for r in json.load(open(D))}

# (archivo, slug, nombre exacto en servicios.ts, slug pendiente de validar)
#
# Los slugs de Estrategia de comunicación y Distintivo ESR no salen del campo
# LINK de su documento —uno apuntaba a la URL de otro servicio y el otro no
# traía URL—, pero André ya los aprobó y tienen redirect desde su URL vieja de
# WordPress, así que van en False como el resto. La cuarta columna se conserva
# para el próximo documento cuyo LINK no sirva.
ORDEN = [
    ("🟢SROI_retorno_social_sobre_inversion_9_5.docx", "sroi-social-return-on-investment",
     "SROI: Retorno Social Sobre la Inversión", False),
    ("🟢ROI_inversion_social.docx", "roi-rentabilidad-de-la-sostenibilidad",
     "ROI de la inversión social", False),
    ("🟢Diagnostico_sostenibilidad_final.docx", "diagnostico-de-sostenibilidad",
     "Diagnóstico de Sostenibilidad", False),
    ("🟢Diagnostico_ISO_26000_final.docx", "iso-26000",
     "Diagnóstico ISO 26000", False),
    ("🟢Estrategia_comunicacion_sostenibilidad_9_5.docx", "estrategia-de-comunicacion-en-sostenibilidad",
     "Estrategia de Comunicación en Sostenibilidad", False),
    ("🟢Pagina_Distintivo_ESR.docx", "distintivo-esr", "Distintivo ESR", False),
    ("🟢Pagina_Cursos_Talleres_Sostenibilidad.docx", "cursos-talleres-para-empresas",
     "Cursos y talleres de sostenibilidad para empresas", False),
    ("🟢Acompanamiento_sostenibilidad_final.docx", "acompanamiento-sostenibilidad",
     "Acompañamiento en sostenibilidad", False),
    ("🟢Estrategia_sostenibilidad_final.docx", "estrategia-sostenibilidad",
     "Estrategia de Sostenibilidad", False),
    ("_🟢Informe_sostenibilidad_final.docx", "informe-de-sostenibilidad",
     "Informe de Sostenibilidad", False),
]

# Sin normalización de texto aquí a propósito: erratas y conversión a usted se
# aplican en extraer.py, que es lo que se vuelve a ejecutar cuando cambian los
# .docx. Este script solo da forma de TypeScript a lo que ya viene resuelto.


def s(v):
    return json.dumps(v, ensure_ascii=False)


def lista(vs, ind):
    if not vs:
        return "[]"
    p = " " * ind
    return "[\n" + "".join(f"{p}  {s(v)},\n" for v in vs) + p + "]"


CAB = '''/**
 * Contenido editorial de las páginas de servicio, validado por el cliente.
 *
 * Origen: los diez .docx de contenido/servicios/. Este módulo es la traducción
 * fiel de esos documentos, no una reescritura: el texto se extrajo literal y las
 * únicas intervenciones fueron las acordadas con André —descartar la cabecera de
 * control de cada documento, la fila de instrucciones de las tablas, la nota de
 * redacción de Acompañamiento y las imágenes sueltas del final, elegir la
 * VERSION CORTA donde el documento ofrecía alternativas, corregir dos erratas
 * puntuales y convertir el copy a tratamiento de usted—.
 *
 * NO EDITE ESTE ARCHIVO A MANO. Es generado: cualquier corrección se pierde en
 * cuanto alguien vuelva a extraer los .docx. Los documentos originales están en
 * tú y la conversión a usted vive en el extractor, junto con las erratas y la
 * elección de versión. Un cambio de fondo se hace en el .docx; un cambio de
 * tratamiento o de redacción, en las tablas del extractor.
 *
 * Módulo de datos puro, como servicios.ts y casos.ts: sin JSX ni "use client".
 *
 * Lo consume la ruta dinámica /servicio/[slug]/. El `slug` sale del campo LINK
 * de cada documento, para conservar las URL que ya indexa el sitio actual. Los
 * dos documentos cuyo LINK no servía —Estrategia de comunicación apuntaba a la
 * URL de otro servicio y Distintivo ESR no traía URL— llevan un slug propuesto
 * por nosotros y aprobado por André, con su redirect desde la URL vieja de
 * WordPress en next.config.ts.
 *
 * Estudio de Doble Materialidad no está aquí: no tiene documento y su página
 * existente se mantiene como está.
 */

/** Un paso de la sección Proceso. Los documentos traen entre cuatro y cinco. */
export type PasoProceso = {
  /** Dos o tres palabras, según la plantilla de los documentos. */
  titulo: string;
  descripcion: string;
};

export type Pregunta = {
  pregunta: string;
  respuesta: string;
};

/**
 * Tabla de dos columnas dentro de un bloque.
 *
 * Hoy solo la usa Acompañamiento en sostenibilidad («Tipo de apoyo / Cómo se
 * traduce en valor»). Se modela en el tipo aunque sea de un solo servicio
 * porque es contenido validado, no una peculiaridad de formato del documento.
 */
export type TablaBloque = {
  encabezados: [string, string];
  filas: [string, string][];
};

/**
 * Los bloques «¿Para qué sirve?» y «Beneficios del servicio», que comparten
 * forma: un titular, un subtítulo y varios párrafos.
 */
export type BloqueServicio = {
  titulo: string;
  subtitulo: string;
  descripcion: string[];
  tabla?: TablaBloque;
};

export type ContenidoServicio = {
  /** Ruta prevista bajo /servicio/. Ver `slugPorValidar`. */
  slug: string;
  /**
   * Nombre del servicio, exactamente como aparece en `nombre` dentro de
   * servicios.ts. Es la única llave entre los dos módulos: la rueda de la Home
   * podrá enlazar a estas páginas resolviendo por este campo cuando existan.
   * Si se renombra un servicio en el catálogo, hay que renombrarlo también aquí.
   */
  servicio: string;
  /**
   * El slug no viene del campo LINK del documento sino de una propuesta nuestra,
   * y sigue pendiente de validación. Hoy no lo lleva ninguno: los dos que lo
   * llevaban quedaron aprobados. Se conserva para el próximo documento cuyo
   * LINK no sirva, para que no se publique una ruta que nadie ha revisado.
   */
  slugPorValidar?: true;
  hero: {
    titulo: string;
    subtitulo: string;
    descripcion: string[];
    /** Cuatro en todos los servicios. */
    puntos: string[];
  };
  paraQueSirve: BloqueServicio;
  beneficios: BloqueServicio;
  proceso: {
    descripcion: string;
    pasos: PasoProceso[];
  };
  /** Ocho en todos los servicios. */
  faq: Pregunta[];
  cta: {
    subtitulo: string;
    descripcion: string;
  };
};

export const CONTENIDO_SERVICIOS: ContenidoServicio[] = [
'''

out = [CAB]
for archivo, slug, servicio, propuesto in ORDEN:
    r = datos[archivo]
    h, p, b, pr, c = r["hero"], r["paraQueSirve"], r["beneficios"], r["proceso"], r["cta"]
    out.append("  {\n")
    out.append(f"    slug: {s(slug)},\n")
    out.append(f"    servicio: {s(servicio)},\n")
    if propuesto:
        out.append("    slugPorValidar: true,\n")
    out.append("    hero: {\n")
    out.append(f"      titulo: {s(h['titulo'])},\n")
    out.append(f"      subtitulo: {s(h['subtitulo'])},\n")
    out.append(f"      descripcion: {lista(h['descripcion'], 6)},\n")
    out.append(f"      puntos: {lista(h['puntos'], 6)},\n")
    out.append("    },\n")
    for clave, bloque in (("paraQueSirve", p), ("beneficios", b)):
        out.append(f"    {clave}: {{\n")
        out.append(f"      titulo: {s(bloque['titulo'])},\n")
        out.append(f"      subtitulo: {s(bloque['subtitulo'])},\n")
        out.append(f"      descripcion: {lista(bloque['descripcion'], 6)},\n")
        if "tabla" in bloque:
            t = bloque["tabla"]
            out.append("      tabla: {\n")
            out.append(f"        encabezados: [{s(t['encabezados'][0])}, {s(t['encabezados'][1])}],\n")
            out.append("        filas: [\n")
            for fila in t["filas"]:
                out.append(f"          [{s(fila[0])}, {s(fila[1])}],\n")
            out.append("        ],\n")
            out.append("      },\n")
        out.append("    },\n")
    out.append("    proceso: {\n")
    out.append(f"      descripcion: {s(pr['descripcion'])},\n")
    out.append("      pasos: [\n")
    for paso in pr["pasos"]:
        out.append("        {\n")
        out.append(f"          titulo: {s(paso['titulo'])},\n")
        out.append(f"          descripcion: {s(paso['descripcion'])},\n")
        out.append("        },\n")
    out.append("      ],\n")
    out.append("    },\n")
    out.append("    faq: [\n")
    for q in r["faq"]:
        out.append("      {\n")
        out.append(f"        pregunta: {s(q['pregunta'])},\n")
        out.append(f"        respuesta: {s(q['respuesta'])},\n")
        out.append("      },\n")
    out.append("    ],\n")
    out.append("    cta: {\n")
    out.append(f"      subtitulo: {s(c['subtitulo'])},\n")
    out.append(f"      descripcion: {s(c['descripcion'])},\n")
    out.append("    },\n")
    out.append("  },\n")

out.append("""];

export function getContenidoServicio(
  slug: string,
): ContenidoServicio | undefined {
  return CONTENIDO_SERVICIOS.find((s) => s.slug === slug);
}

/**
 * Contenido de un servicio a partir de su nombre exacto en servicios.ts.
 *
 * Devuelve undefined mientras ese servicio no tenga documento validado, que hoy
 * es el caso de la mayoría del catálogo. Es el camino inverso de
 * `rutaDeServicio` en casos.ts: aquel resuelve la ruta ya publicada, este dice
 * si existe contenido para publicarla.
 */
export function contenidoDeServicio(
  nombre: string,
): ContenidoServicio | undefined {
  return CONTENIDO_SERVICIOS.find((s) => s.servicio === nombre);
}
""")

open("src/lib/contenido-servicios.ts", "w").write("".join(out))
print("escrito src/lib/contenido-servicios.ts")
