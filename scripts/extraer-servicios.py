"""Extrae los .docx de servicio a JSON estructurado, aplicando la limpieza pedida.

Uso, desde la raíz del repositorio:

    python3 scripts/extraer-servicios.py > /tmp/servicios.json
    python3 scripts/generar-contenido-servicios.py /tmp/servicios.json
    npx prettier --write src/lib/contenido-servicios.ts

Lee contenido/servicios/*.docx sin dependencias externas: un .docx es un zip con
un XML dentro.

═══════════════════════════════════════════════════════════════════════════════
CONVERSIÓN A TRATAMIENTO DE USTED — NO LA DESHAGA AL VOLVER A EXTRAER
═══════════════════════════════════════════════════════════════════════════════

Los diez .docx están redactados en tú. Todo el sitio va en usted, así que la
conversión se aplica AQUÍ, en el extractor, y no editando
src/lib/contenido-servicios.ts.

El motivo es que ese TypeScript es contenido generado: cualquier corrección que
se le haga a mano se pierde en cuanto alguien vuelva a lanzar la extracción, y
volvería a publicarse el tuteo sin que nadie se diera cuenta. Poniéndola aquí,
la conversión es parte de la extracción y sobrevive a repetirla.

Se aplica en tres capas, en este orden:

  1. ERRATAS         — erratas puntuales confirmadas con André.
  2. USTED_FRASES    — sustitución de la cadena completa. Es la capa para todo
                       lo que exige cambiar una forma verbal, porque el mismo
                       verbo puede ser imperativo dirigido al lector («Evalúa tu
                       madurez») o tercera persona describiendo el servicio
                       («Evalúa las siete materias fundamentales»), y ninguna
                       expresión regular distingue los dos casos. Cadena
                       completa = decisión explícita y auditable, una por una.
  3. USTED_PALABRAS  — pronombres y posesivos, que sí son inequívocos.

Y al final, un guardián: si tras convertir queda alguna marca de tuteo, la
extracción falla y las lista. Si un .docx nuevo trae copy en tú que estas tablas
no contemplan, se entera aquí y no en producción.

Las entradas de REESCRITOS no son traducción literal: son frases que en usted
resultaban forzadas y se redactaron de nuevo conservando la intención. Están
marcadas para que André pueda revisarlas.
"""
import zipfile, os, re, json, unicodedata
import xml.etree.ElementTree as ET

W = "{http://schemas.openxmlformats.org/wordprocessingml/2006/main}"
DIR = "contenido/servicios"

ARCHIVOS = [
    "_🟢Informe_sostenibilidad_final.docx",
    "🟢Acompanamiento_sostenibilidad_final.docx",
    "🟢Diagnostico_ISO_26000_final.docx",
    "🟢Diagnostico_sostenibilidad_final.docx",
    "🟢Estrategia_comunicacion_sostenibilidad_9_5.docx",
    "🟢Estrategia_sostenibilidad_final.docx",
    "🟢Pagina_Cursos_Talleres_Sostenibilidad.docx",
    "🟢Pagina_Distintivo_ESR.docx",
    "🟢ROI_inversion_social.docx",
    "🟢SROI_retorno_social_sobre_inversion_9_5.docx",
]


def norm(s):
    s = unicodedata.normalize("NFD", s.lower())
    s = "".join(c for c in s if unicodedata.category(c) != "Mn")
    return re.sub(r"\s+", " ", re.sub(r"[^a-z0-9 ]+", " ", s)).strip()


def texto(p):
    t = "".join(n.text or "" for n in p.iter(W + "t"))
    return re.sub(r"\s+", " ", t).strip()


def lineas(p):
    """Como texto(), pero un salto de línea manual (w:br) parte en dos.

    El CTA de ISO 26000 mete subtítulo y descripción en un solo párrafo separados
    por un salto, así que sin esto llegarían pegados.
    """
    partes, actual = [], []
    for n in p.iter():
        if n.tag == W + "t":
            actual.append(n.text or "")
        elif n.tag == W + "br":
            partes.append("".join(actual))
            actual = []
    partes.append("".join(actual))
    return [re.sub(r"\s+", " ", x).strip() for x in partes if x.strip()]


# Etiquetas de sección y de campo. El orden importa: se prueba la más larga.
SECCIONES = [
    ("hero", ["hero"]),
    ("para", ["para que sirve"]),
    ("beneficios", ["beneficios del servicio"]),
    ("proceso", ["proceso"]),
    ("faq", ["preguntas frecuentes"]),
    ("cta", ["call to action cta", "call to action", "cta"]),
]
CAMPOS = [
    ("h_titulo", ["titulo del servicio h1", "titulo del servicio"]),
    ("h_desc", ["descripcion general del servicio", "descripcion general"]),
    ("h_sub", ["subtitulo principal"]),
    ("h_puntos", ["puntos descriptivos lista con bullets", "puntos descriptivos"]),
    ("p_titulo", ["titulo dos h2", "titulo dos"]),
    ("p_sub", ["subtitulo dos h3", "subtitulo dos"]),
    ("p_desc", ["descripcion dos p", "descripcion dos"]),
    ("b_titulo", ["titulo tres h2", "titulo tres"]),
    ("b_sub", ["subtitulo tres h3", "subtitulo tres"]),
    ("b_desc", ["descripcion tres p", "descripcion tres"]),
    ("pr_desc", ["descripcion del proceso", "descripcion proceso"]),
    ("pr_pasos", ["pasos"]),
    ("c_sub", ["subtitulo cta"]),
    ("c_desc", ["descripcion cta"]),
]
VERSIONES = ["version aun mas corta", "version corta"]


def casa(t, alternativas):
    """Devuelve el resto del párrafo si empieza por una de las etiquetas.

    Acompañamiento fusiona etiqueta y contenido en el mismo párrafo, así que no
    basta con comparar: hay que partir por donde acaba la etiqueta.
    """
    n = norm(t)
    for alt in alternativas:
        if n == alt:
            return ""
        if n.startswith(alt):
            # Recorta sobre el texto original contando caracteres normalizados.
            for corte in range(len(t), 0, -1):
                if norm(t[:corte]) == alt:
                    return t[corte:].strip()
    return None


def parsear(nombre):
    z = zipfile.ZipFile(os.path.join(DIR, nombre))
    body = ET.fromstring(z.read("word/document.xml")).find(W + "body")

    bloques = []  # (tipo, dato) en orden
    for el in body:
        tag = el.tag.replace(W, "")
        if tag == "tbl":
            filas = []
            for tr in el.findall(W + "tr"):
                filas.append([[x for p in tc.findall(W + "p") for x in lineas(p)]
                              for tc in tr.findall(W + "tc")])
            bloques.append(("tabla", filas))
        elif tag == "p":
            t = texto(el)
            if not t:
                continue
            pr = el.find(W + "pPr")
            lista = pr is not None and pr.find(W + "numPr") is not None
            bloques.append(("lista" if lista else "p", t))

    doc = {"archivo": nombre, "link": None, "secciones": {}, "descartado": []}

    # --- Cabecera de control: todo lo anterior a "Hero" ---
    inicio = 0
    for i, (tipo, d) in enumerate(bloques):
        if tipo == "p" and norm(d) == "hero":
            inicio = i + 1
            break
    for tipo, d in bloques[:inicio]:
        if tipo == "p":
            m = re.search(r"(?:K?LINK|Web|Link web|Link)\s*:?\s*(https?://\S+)", d, re.I)
            if m:
                doc["link"] = m.group(1)
            doc["descartado"].append(("cabecera", d[:90]))
        else:
            doc["descartado"].append(("cabecera-tabla", str(d)[:90]))

    # --- Reparto por secciones ---
    sec_actual = "hero"
    secs = {"hero": []}
    for tipo, d in bloques[inicio:]:
        if tipo == "p":
            for clave, alts in SECCIONES:
                if norm(d) in alts:
                    if clave in secs:
                        doc["descartado"].append(("seccion-duplicada", d))
                    else:
                        secs[clave] = []
                    sec_actual = clave
                    break
            else:
                secs[sec_actual].append((tipo, d))
                continue
            continue
        secs[sec_actual].append((tipo, d))
    doc["_secs"] = secs
    return doc


def campos_de(items):
    """Agrupa (tipo,texto) por etiqueta de campo. Devuelve None si no hay etiquetas."""
    grupos, actual, hubo = {}, None, False
    for tipo, d in items:
        if tipo == "p":
            hallado = None
            for clave, alts in CAMPOS:
                r = casa(d, alts)
                if r is not None:
                    hallado = (clave, r)
                    break
            if hallado:
                hubo = True
                actual = hallado[0]
                grupos.setdefault(actual, [])
                if hallado[1]:
                    grupos[actual].append(("p", hallado[1]))
                continue
        grupos.setdefault(actual, []).append((tipo, d))
    return grupos if hubo else None


def elegir_version(parrafos):
    """Aplica la decisión editorial: se publica la VERSION CORTA."""
    idx = {}
    for i, (tipo, d) in enumerate(parrafos):
        n = norm(d)
        for v in VERSIONES:
            if n == v and v not in idx:
                idx[v] = i
    if "version corta" not in idx:
        return [d for _, d in parrafos], []
    ini = idx["version corta"] + 1
    fin = len(parrafos)
    if "version aun mas corta" in idx and idx["version aun mas corta"] > idx["version corta"]:
        fin = idx["version aun mas corta"]
    elegido = [d for _, d in parrafos[ini:fin]]
    desc = [d for _, d in parrafos[:idx["version corta"]]]
    if fin < len(parrafos):
        desc += [d for _, d in parrafos[fin:]]
    return elegido, desc


def limpiar(parrafos):
    """Quita notas de redacción."""
    fuera, queda = [], []
    for p in parrafos:
        if re.match(r"^\s*Propuesta\s*:", p, re.I):
            fuera.append(p)
        else:
            queda.append(p)
    return queda, fuera


# ── Capa 1: erratas ──────────────────────────────────────────────────────────
ERRATAS = {
    "Demuestra impactó con evidencia defendible":
        "Demuestra impacto con evidencia defendible",
}

# ── Capa 2: cadenas completas que exigen cambiar formas verbales ─────────────
# Frases redactadas de nuevo porque en usted no funcionaban traducidas.
REESCRITOS = {"Dale norte a tu sostenibilidad"}

USTED_FRASES = {
    # Informe de sostenibilidad
    "Convierte tu gestión de sostenibilidad en una narrativa clara":
        "Convierta su gestión de sostenibilidad en una narrativa clara",
    "Haz que tu informe sí comunique valor":
        "Haga que su informe sí comunique valor",
    # Acompañamiento en sostenibilidad
    "Avanza tu agenda de sostenibilidad con apoyo experto":
        "Avance su agenda de sostenibilidad con apoyo experto",
    # Diagnóstico ISO 26000
    "Evalúa tu madurez con ISO 26000":
        "Evalúe su madurez con ISO 26000",
    # Diagnóstico de sostenibilidad
    "Mide tu madurez antes de decidir dónde invertir":
        "Mida su madurez antes de decidir dónde invertir",
    "Conoce tu nivel de madurez y define qué sigue":
        "Conozca su nivel de madurez y defina qué sigue",
    # Estrategia de comunicación en sostenibilidad
    "Comunica sostenibilidad con evidencia, contexto y criterio":
        "Comunique sostenibilidad con evidencia, contexto y criterio",
    "Recibe una matriz práctica para decidir qué comunicar, a quién, por qué "
    "canal y con qué sustento, según riesgos y prioridades ESG.":
        "Reciba una matriz práctica para decidir qué comunicar, a quién, por qué "
        "canal y con qué sustento, según riesgos y prioridades ESG.",
    "Convierte avances en confianza verificable":
        "Convierta avances en confianza verificable",
    # Estrategia de sostenibilidad
    # REESCRITO: «Dale norte a» no tiene equivalente en usted que no suene
    # rígido («Dele norte a su sostenibilidad»). «Ponga rumbo» conserva la idea
    # de fijar una dirección y usa el mismo vocabulario que el titular del
    # bloque siguiente de ese documento, «Sostenibilidad con rumbo».
    "Dale norte a tu sostenibilidad":
        "Ponga rumbo a su sostenibilidad",
    "Ordena tus prioridades de sostenibilidad":
        "Ordene sus prioridades de sostenibilidad",
    # Cursos y talleres
    "Activa hoy las capacidades que tu estrategia de sostenibilidad necesita":
        "Active hoy las capacidades que su estrategia de sostenibilidad necesita",
    # Distintivo ESR
    "Postula con claridad, evidencia y control":
        "Postule con claridad, evidencia y control",
    # «Fortalece» se queda en tercera persona: el sujeto es el servicio, no el
    # lector. Solo cambia «postulas», que sí va dirigido a él.
    "Fortalece la gestión de la RSE mientras postulas":
        "Fortalece la gestión de la RSE mientras postula",
    "Logra una postulación ordenada, bien sustentada y adaptada al nivel de "
    "apoyo que tu empresa necesita.":
        "Logre una postulación ordenada, bien sustentada y adaptada al nivel de "
        "apoyo que su empresa necesita.",
    "Elige el acompañamiento adecuado para tu postulación":
        "Elija el acompañamiento adecuado para su postulación",
    "ResponSable te ayuda a postular al Distintivo ESR sin convertir el proceso "
    "en una persecución de documentos. Definimos responsabilidades, ordenamos "
    "evidencias y ajustamos el apoyo a la capacidad de tu equipo, desde "
    "capacitación hasta gestión integral. Así reduces retrabajos, fortaleces la "
    "documentación de prácticas reales y aprovechas la postulación para "
    "profesionalizar tu gestión.":
        "ResponSable le ayuda a postular al Distintivo ESR sin convertir el proceso "
        "en una persecución de documentos. Definimos responsabilidades, ordenamos "
        "evidencias y ajustamos el apoyo a la capacidad de su equipo, desde "
        "capacitación hasta gestión integral. Así reduce retrabajos, fortalece la "
        "documentación de prácticas reales y aprovecha la postulación para "
        "profesionalizar su gestión.",
    # ROI de la inversión social
    "Convierte inversión social en decisiones de negocio":
        "Convierta inversión social en decisiones de negocio",
    "Obtén un caso de negocio defendible para priorizar inversión social con "
    "drivers, KPIs internos, riesgos y escenarios conservadores.":
        "Obtenga un caso de negocio defendible para priorizar inversión social con "
        "drivers, KPIs internos, riesgos y escenarios conservadores.",
    "Construye tu caso de negocio":
        "Construya su caso de negocio",
    # SROI (la clave ya viene con la errata corregida por la capa 1)
    "Demuestra impacto con evidencia defendible":
        "Demuestre impacto con evidencia defendible",
    "Obtén evidencia clara para decidir qué programas sociales sostener, "
    "ajustar, escalar o replantear.":
        "Obtenga evidencia clara para decidir qué programas sociales sostener, "
        "ajustar, escalar o replantear.",
    "Convierte impacto en decisiones":
        "Convierta impacto en decisiones",
}

# ── Capa 3: pronombres y posesivos ───────────────────────────────────────────
# Inequívocos en español: no hay lectura en la que «tus» no sea posesivo de tú.
# «tú», «ti» y «contigo» no aparecen hoy en ningún documento; van por si una
# extracción futura los trae.
USTED_PALABRAS = [
    (r"\bTus\b", "Sus"), (r"\btus\b", "sus"),
    (r"\bTu\b", "Su"), (r"\btu\b", "su"),
    (r"\bTú\b", "Usted"), (r"\btú\b", "usted"),
    (r"\bTe\b", "Le"), (r"\bte\b", "le"),
    (r"\bti\b", "usted"),
    (r"\bContigo\b", "Con usted"), (r"\bcontigo\b", "con usted"),
    (r"\bRecibes\b", "Recibe"), (r"\brecibes\b", "recibe"),
]

# Marcas que no deben sobrevivir a la conversión.
RESIDUO = re.compile(
    r"\b(tu|tus|tú|ti|te|contigo|tuyo|tuya|puedes|quieres|necesitas|tienes|"
    r"debes|obtienes|recibes|logras|reduces|fortaleces|aprovechas|decides|"
    r"sabes|buscas|postulas|conoces|defines|eliges|construyes|mides|evalúas)\b",
    re.I,
)


def a_usted(texto):
    texto = ERRATAS.get(texto, texto)
    if texto in USTED_FRASES:
        return USTED_FRASES[texto]
    for patron, reemplazo in USTED_PALABRAS:
        texto = re.sub(patron, reemplazo, texto)
    return texto


def convertir(nodo):
    if isinstance(nodo, str):
        return a_usted(nodo)
    if isinstance(nodo, list):
        return [convertir(x) for x in nodo]
    if isinstance(nodo, dict):
        return {k: convertir(v) for k, v in nodo.items()}
    return nodo


salida = []
for nombre in ARCHIVOS:
    doc = parsear(nombre)
    secs = doc.pop("_secs")
    r = {"archivo": nombre, "link": doc["link"], "avisos": [], "descartado": doc["descartado"]}

    def bloque(clave_sec, campos_pos, campos_lab):
        """Extrae (titulo, subtitulo, descripcion[], puntos[], tablas[]) de una sección."""
        items = secs.get(clave_sec, [])
        tablas = [d for t, d in items if t == "tabla"]
        parr = [(t, d) for t, d in items if t in ("p", "lista")]
        g = campos_de(parr)
        out = {}
        if g:
            for destino, clave in campos_lab.items():
                vals = g.get(clave, [])
                out[destino] = vals
        else:
            solo_p = [(t, d) for t, d in parr if t == "p"]
            bullets = [(t, d) for t, d in parr if t == "lista"]
            for destino, i in campos_pos.items():
                if i == "bullets":
                    out[destino] = bullets
                elif i == "resto":
                    out[destino] = solo_p[len(campos_pos) - 2:]
                else:
                    out[destino] = solo_p[i:i + 1]
        out["_tablas"] = tablas
        return out

    # HERO
    h = bloque("hero",
               {"titulo": 0, "subtitulo": 1, "descripcion": "resto", "puntos": "bullets"},
               {"titulo": "h_titulo", "subtitulo": "h_sub", "descripcion": "h_desc", "puntos": "h_puntos"})
    desc, descartados = elegir_version(h["descripcion"])
    desc, notas = limpiar(desc)
    if notas:
        r["avisos"].append(f"nota de redacción eliminada del hero: {notas[0][:60]}…")
    titulo_vals = [d for _, d in h["titulo"]]
    if len(titulo_vals) > 1:
        r["avisos"].append(f"hero: el campo título traía {len(titulo_vals)} párrafos; se usó el primero, sobra «{titulo_vals[1][:60]}…»")
    r["hero"] = {
        "titulo": titulo_vals[0] if titulo_vals else None,
        "subtitulo": ([d for _, d in h["subtitulo"]] or [None])[0],
        "descripcion": desc,
        "puntos": [d for _, d in h["puntos"]],
        "_desc_largas": len(descartados),
    }

    # PARA QUE SIRVE / BENEFICIOS
    for clave, pre, destino in (("para", "p_", "paraQueSirve"), ("beneficios", "b_", "beneficios")):
        b = bloque(clave,
                   {"titulo": 0, "subtitulo": 1, "descripcion": "resto"},
                   {"titulo": pre + "titulo", "subtitulo": pre + "sub", "descripcion": pre + "desc"})
        d2, largas = elegir_version(b["descripcion"])
        r[destino] = {
            "titulo": ([x for _, x in b["titulo"]] or [None])[0],
            "subtitulo": ([x for _, x in b["subtitulo"]] or [None])[0],
            "descripcion": d2,
            "_desc_largas": len(largas),
        }
        if b["_tablas"]:
            t = b["_tablas"][0]
            r[destino]["tabla"] = {
                "encabezados": [" ".join(c) for c in t[0]],
                "filas": [[" ".join(c) for c in fila] for fila in t[1:]],
            }

    # PROCESO
    pr = bloque("proceso", {"descripcion": "resto"}, {"descripcion": "pr_desc", "pasos": "pr_pasos"})
    pdesc = [d for _, d in pr.get("descripcion", [])]
    if not pdesc:
        pdesc = [d for t, d in secs.get("proceso", []) if t == "p"]
    tabla_pasos = pr["_tablas"][0] if pr["_tablas"] else []
    r["proceso"] = {
        "descripcion": pdesc[0] if pdesc else None,
        # Se descarta la fila 0: es la fila de instrucciones de la plantilla.
        "pasos": [{"titulo": " ".join(f[1]), "descripcion": " ".join(f[2])}
                  for f in tabla_pasos[1:] if len(f) >= 3],
    }
    if tabla_pasos:
        r["descartado"].append(("fila-instrucciones", " | ".join(" ".join(c) for c in tabla_pasos[0])))

    # FAQ
    tfaq = [d for t, d in secs.get("faq", []) if t == "tabla"]
    filas = tfaq[0] if tfaq else []
    r["faq"] = [{"pregunta": " ".join(f[1]), "respuesta": " ".join(f[2])}
                for f in filas[1:] if len(f) >= 3]
    if filas:
        r["descartado"].append(("fila-instrucciones-faq", " | ".join(" ".join(c) for c in filas[0])))

    # CTA
    items_cta = secs.get("cta", [])
    tcta = [d for t, d in items_cta if t == "tabla"]
    g = campos_de([(t, d) for t, d in items_cta if t != "tabla"])
    if g and (g.get("c_sub") or g.get("c_desc")):
        sub = ([d for _, d in g.get("c_sub", [])] or [None])[0]
        des = [d for _, d in g.get("c_desc", [])]
    elif tcta:
        celda = tcta[0][0][0]
        sub, des = celda[0], celda[1:]
    else:
        sub, des = None, []
    # Diagnóstico de sostenibilidad no rotula el CTA: queda como tabla suelta al final.
    if sub is None:
        for clave in ("faq", "proceso"):
            sueltas = [d for t, d in secs.get(clave, []) if t == "tabla"]
            if len(sueltas) > 1:
                celda = sueltas[-1][0][0]
                sub, des = celda[0], celda[1:]
                r["avisos"].append("CTA sin rótulo: se tomó la tabla final del documento")
                break
    r["cta"] = {"subtitulo": sub, "descripcion": " ".join(des) if des else None}

    salida.append(r)

import sys

# La conversión a usted se aplica sobre el resultado ya limpio, de modo que las
# claves de USTED_FRASES coinciden con el texto tal y como sale del documento
# —sin cabecera, sin filas de instrucciones y con la VERSION CORTA ya elegida—.
CAMPOS_CONTENIDO = ("hero", "paraQueSirve", "beneficios", "proceso", "faq", "cta")
cambios = {}
for r in salida:
    for campo in CAMPOS_CONTENIDO:
        antes = json.dumps(r[campo], ensure_ascii=False)
        r[campo] = convertir(r[campo])
        despues = json.dumps(r[campo], ensure_ascii=False)
        if antes != despues:
            cambios[campo] = cambios.get(campo, 0) + 1

# Guardián: ninguna marca de tuteo puede sobrevivir. Si un documento nuevo trae
# copy que las tablas no contemplan, la extracción se detiene aquí.
residuos = []


def buscar(nodo, ruta):
    if isinstance(nodo, str):
        if RESIDUO.search(nodo):
            residuos.append((ruta, nodo))
    elif isinstance(nodo, list):
        for x in nodo:
            buscar(x, ruta)
    elif isinstance(nodo, dict):
        for k, v in nodo.items():
            buscar(v, f"{ruta}.{k}")


for r in salida:
    for campo in CAMPOS_CONTENIDO:
        buscar(r[campo], f"{r['archivo']}.{campo}")

if residuos:
    print("\nTUTEO SIN CONVERTIR — añada estas cadenas a USTED_FRASES:",
          file=sys.stderr)
    for ruta, texto in residuos:
        print(f"  [{ruta}] {texto}", file=sys.stderr)
    sys.exit(1)

print(f"conversión a usted: {sum(cambios.values())} bloques tocados "
      f"({', '.join(f'{k}={v}' for k, v in sorted(cambios.items()))})",
      file=sys.stderr)
print(json.dumps(salida, ensure_ascii=False, indent=1))
