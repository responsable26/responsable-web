/*
  Plantilla del correo que recibe ResponSable por cada envío.

  Escrita para clientes de correo, no para navegadores: maquetación con tablas
  anidadas y estilos en línea, sin hoja de estilos, sin flexbox ni grid y sin
  media queries. Outlook para Windows renderiza con el motor de Word, que no
  entiende ninguna de las tres cosas; Gmail además elimina cualquier <style> en
  buena parte de sus vistas.

  Consecuencias de eso que se ven en el código:
  - El ancho va en el atributo width además de en el style, porque Word ignora
    el segundo.
  - Los espacios son padding de <td> y filas espaciadoras, nunca margin: Word
    aplica los márgenes de forma impredecible.
  - El logotipo es el PNG y no el SVG de /brand/logotipo.svg: ni Gmail ni
    Outlook rasterizan SVG. Va con URL absoluta a producción porque el correo
    se abre fuera del sitio.
  - Los border-radius se dejan puestos aun sabiendo que Word los ignora: donde
    no se aplican, la caja sale cuadrada y no se rompe nada.
*/

const NAVY = "#222955";
const MAGENTA = "#EA157A";
const OFF_WHITE = "#f7f7fb";
const BORDE = "#e3e3ee";
const TEXTO = "#2b2b38";
const TEXTO_SUAVE = "#6b6b7d";

const LOGO = "https://responsable.net/brand/isotipo.png";

export type LineaCorreo = { etiqueta: string; valor: string };

export type DatosCorreo = {
  /** Rótulo del tipo de solicitud, para el encabezado y el asunto. */
  asunto: string;
  /** Campos del formulario con contenido, en su orden. */
  datos: readonly LineaCorreo[];
  /** El texto libre, aparte del resto por ser lo que se lee primero. */
  mensaje: string;
  /** Origen, página, gclid y referrer: solo los que traen valor. */
  tecnicos: readonly LineaCorreo[];
};

function escapar(texto: string): string {
  return texto
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Una fila etiqueta/valor del bloque de datos. La etiqueta va encima y no al
 *  lado: en el ancho de un móvil, dos columnas dejan el valor en un canal de
 *  pocos caracteres y las direcciones largas se parten. */
function fila({ etiqueta, valor }: LineaCorreo): string {
  return `
          <tr>
            <td style="padding:0 0 14px 0;font-family:Helvetica,Arial,sans-serif;">
              <div style="font-size:11px;letter-spacing:0.06em;text-transform:uppercase;color:${TEXTO_SUAVE};padding-bottom:3px;">${escapar(etiqueta)}</div>
              <div style="font-size:15px;line-height:1.45;color:${TEXTO};">${escapar(valor).replace(/\n/g, "<br>")}</div>
            </td>
          </tr>`;
}

function filaTecnica({ etiqueta, valor }: LineaCorreo): string {
  return `
          <tr>
            <td style="padding:0 0 6px 0;font-family:Helvetica,Arial,sans-serif;font-size:12px;line-height:1.5;color:${TEXTO_SUAVE};word-break:break-all;">
              <strong style="color:${TEXTO};font-weight:600;">${escapar(etiqueta)}:</strong> ${escapar(valor)}
            </td>
          </tr>`;
}

export function correoHtml({
  asunto,
  datos,
  mensaje,
  tecnicos,
}: DatosCorreo): string {
  return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${escapar(asunto)}</title>
</head>
<body style="margin:0;padding:0;background-color:${OFF_WHITE};">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${OFF_WHITE};">
    <tr>
      <td align="center" style="padding:24px 12px;">

        <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px;max-width:100%;background-color:#ffffff;border:1px solid ${BORDE};border-radius:8px;">

          <tr>
            <td style="background-color:${NAVY};padding:24px 28px;border-radius:8px 8px 0 0;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td width="44" valign="middle" style="width:44px;">
                    <img src="${LOGO}" width="40" height="40" alt="ResponSable" style="display:block;width:40px;height:40px;border:0;">
                  </td>
                  <td valign="middle" style="font-family:Helvetica,Arial,sans-serif;padding-left:14px;">
                    <div style="font-size:11px;letter-spacing:0.1em;text-transform:uppercase;color:#ffffff;opacity:0.75;">ResponSable</div>
                    <div style="font-size:19px;font-weight:bold;color:#ffffff;padding-top:2px;">${escapar(asunto)}</div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr><td style="background-color:${MAGENTA};font-size:0;line-height:0;height:4px;">&nbsp;</td></tr>

          <tr>
            <td style="padding:28px 28px 8px 28px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">${datos.map(fila).join("")}
              </table>
            </td>
          </tr>
${
  mensaje
    ? `
          <tr>
            <td style="padding:8px 28px 4px 28px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${OFF_WHITE};border-left:4px solid ${MAGENTA};border-radius:0 4px 4px 0;">
                <tr>
                  <td style="padding:16px 18px;font-family:Helvetica,Arial,sans-serif;">
                    <div style="font-size:11px;letter-spacing:0.06em;text-transform:uppercase;color:${TEXTO_SUAVE};padding-bottom:6px;">Mensaje</div>
                    <div style="font-size:15px;line-height:1.6;color:${TEXTO};">${escapar(mensaje).replace(/\n/g, "<br>")}</div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>`
    : ""
}
${
  tecnicos.length > 0
    ? `
          <tr>
            <td style="padding:20px 28px 24px 28px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-top:1px solid ${BORDE};">
                <tr><td style="height:16px;font-size:0;line-height:0;">&nbsp;</td></tr>
                <tr>
                  <td style="font-family:Helvetica,Arial,sans-serif;font-size:11px;letter-spacing:0.06em;text-transform:uppercase;color:${TEXTO_SUAVE};padding-bottom:8px;">Datos de origen</td>
                </tr>
              </table>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">${tecnicos.map(filaTecnica).join("")}
              </table>
            </td>
          </tr>`
    : ""
}

          <tr>
            <td style="background-color:${OFF_WHITE};padding:14px 28px;border-top:1px solid ${BORDE};border-radius:0 0 8px 8px;font-family:Helvetica,Arial,sans-serif;font-size:11px;line-height:1.5;color:${TEXTO_SUAVE};">
              Enviado desde el formulario de responsable.net
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>
</body>
</html>`;
}

/** Alternativa en texto plano, para el cliente que no renderice HTML. Lleva la
 *  misma información y en el mismo orden: no es un resumen. */
export function correoTexto({
  asunto,
  datos,
  mensaje,
  tecnicos,
}: DatosCorreo): string {
  const bloques = [
    asunto.toUpperCase(),
    "=".repeat(asunto.length),
    "",
    datos.map((d) => `${d.etiqueta}: ${d.valor}`).join("\n"),
  ];
  if (mensaje) bloques.push("", "MENSAJE", "-------", mensaje);
  if (tecnicos.length > 0) {
    bloques.push(
      "",
      "DATOS DE ORIGEN",
      "---------------",
      tecnicos.map((t) => `${t.etiqueta}: ${t.valor}`).join("\n"),
    );
  }
  bloques.push("", "Enviado desde el formulario de responsable.net");
  return bloques.join("\n");
}
