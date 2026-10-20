// ═══════════════════════════════════════════════════════════════
// ComboXplora · Apps Script del formulario "Mapa Cultural"
// Vive en el editor de Apps Script del Google Form (Extensiones → Apps Script).
// Este archivo es la copia versionada: si cambias algo allá, cámbialo acá también.
//
// Hace tres cosas:
//   1. onFormSubmit      — al llegar una respuesta: guarda en Supabase y avisa por correo.
//   2. avisarAprobados   — cada 10 min: a los eventos que Moisés aprobó les manda el
//                          correo "tu evento ya está publicado" con el enlace a su página.
//   3. (opcional) columna "Enlace de inscripción" del formulario → link_inscripcion.
//
// Activadores (reloj a la izquierda → Añadir activador):
//   • onFormSubmit    · Desde formulario · Al enviarse el formulario
//   • avisarAprobados · Basado en tiempo · Temporizador por minutos · Cada 10 minutos
//
// Propiedades del script (Configuración del proyecto → Propiedades del script):
//   • SUPABASE_KEY = service role key de Supabase (nunca la anon)
// ═══════════════════════════════════════════════════════════════

const SUPABASE_URL = 'https://pjmmidxdolzfvafzfvnh.supabase.co';
const ADMIN_EMAIL  = 'comboxplora@gmail.com';
const SITE_URL     = 'https://combo-xplora-web.vercel.app';

function getKey() {
  return PropertiesService.getScriptProperties().getProperty('SUPABASE_KEY');
}

function supabaseHeaders(extra) {
  return Object.assign({
    'apikey': getKey(),
    'Authorization': 'Bearer ' + getKey(),
  }, extra || {});
}

// ── 1. NUEVA RESPUESTA ──────────────────────────────────────────
function onFormSubmit(e) {
  const row = mapearPorEncabezado(e);

  const data = {
    email_respondente:    row['Correo electrónico'] || row['Dirección de correo electrónico'] || null,
    nombre_evento:        row['Nombre del evento'] || null,
    tipo_evento:          row['Tipo de evento'] || null,
    descripcion:          row['Breve descripción del evento'] || null,
    fecha_evento:         row['Fecha del evento'] || null,
    hora_inicio:          row['Hora de inicio del evento'] || null,
    hora_fin:             row['Hora de finalización del evento'] || null,
    direccion:            row['Dirección exacta del evento'] || null,
    link_maps:            row['Link de google maps'] || null,
    nombre_responsable:   row['Nombre completo del responsable del evento'] || null,
    email_contacto:       row['Correo de contacto'] || null,
    telefono:             row['Teléfono de contacto'] || null,
    tipo_espacio:         row['¿El evento se realiza en un espacio público o privado?'] || null,
    nombre_lugar:         row['Nombre del lugar o espacio (si aplica)'] || null,
    wifi:                 row['¿El lugar cuenta con conexión Wi-Fi disponible para asistentes?'] || null,
    accesible:            row['¿El espacio es accesible para personas con discapacidad (sillas de ruedas, rampas, baños adaptados, etc.)?'] || null,
    parqueadero:          row['¿Hay parqueadero disponible en el lugar o cerca?'] || null,
    banos:                row['¿Hay baños disponibles para el público?'] || null,
    detalles_adicionales: row['¿Algún detalle adicional que quieras compartir sobre el espacio o logística del evento?'] || null,
    acepta_promocion:     row['¿Aceptas que ComboXplora use esta información para promocionar tu evento?'] || null,
    // Opcional: si agregas al formulario una pregunta con este título exacto, llega sola.
    link_inscripcion:     row['Enlace de inscripción (Luma, Eventbrite u otro)'] || null,
  };

  guardarEnSupabase(data);
  enviarEmailAdmin(data);

  const emailUsuario = data.email_contacto || data.email_respondente;
  if (emailUsuario) {
    enviarConfirmacionUsuario(emailUsuario, data.nombre_responsable, data.nombre_evento);
  }
}

// Lee la fila por nombre de encabezado: no depende del orden de columnas del Sheet
function mapearPorEncabezado(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const resultado = {};
  headers.forEach((h, i) => { resultado[String(h).trim()] = e.values[i] || null; });
  return resultado;
}

function guardarEnSupabase(data) {
  const resp = UrlFetchApp.fetch(SUPABASE_URL + '/rest/v1/eventos', {
    method: 'post',
    contentType: 'application/json',
    headers: supabaseHeaders({ 'Prefer': 'return=minimal' }),
    payload: JSON.stringify(data),
    muteHttpExceptions: true,
  });
  if (resp.getResponseCode() >= 300) {
    console.error('Error Supabase:', resp.getContentText());
  }
}

// ── 2. AVISO AL ORGANIZADOR CUANDO SE APRUEBA ───────────────────
// Busca eventos aprobados, con página (slug) y sin aviso enviado, les manda el correo
// y marca aviso_aprobacion_enviado_at para no repetirlo.
function avisarAprobados() {
  const url = SUPABASE_URL + '/rest/v1/eventos'
    + '?select=id,slug,nombre_evento,nombre_responsable,email_contacto,email_respondente,fecha,hora_inicio,nombre_lugar,direccion,link_inscripcion'
    + '&status=eq.aprobado&slug=not.is.null&aviso_aprobacion_enviado_at=is.null'
    + '&order=created_at.asc&limit=20';

  const resp = UrlFetchApp.fetch(url, { headers: supabaseHeaders(), muteHttpExceptions: true });
  if (resp.getResponseCode() >= 300) {
    console.error('No se pudieron leer los eventos aprobados:', resp.getContentText());
    return;
  }

  const pendientes = JSON.parse(resp.getContentText());
  pendientes.forEach(function (ev) {
    const email = ev.email_contacto || ev.email_respondente;
    if (!email) {
      // Sin correo no hay a quién avisar: se marca para no reintentar cada 10 minutos
      marcarAvisado(ev.id);
      return;
    }
    try {
      enviarAvisoAprobacion(email, ev);
      marcarAvisado(ev.id);
      console.log('Aviso enviado:', ev.nombre_evento, '→', email);
    } catch (err) {
      console.error('No se pudo avisar', ev.nombre_evento, err);
    }
  });
}

function marcarAvisado(id) {
  UrlFetchApp.fetch(SUPABASE_URL + '/rest/v1/eventos?id=eq.' + encodeURIComponent(id), {
    method: 'patch',
    contentType: 'application/json',
    headers: supabaseHeaders({ 'Prefer': 'return=minimal' }),
    payload: JSON.stringify({ aviso_aprobacion_enviado_at: new Date().toISOString() }),
    muteHttpExceptions: true,
  });
}

// ── CORREOS ─────────────────────────────────────────────────────
function cabecera(subtitulo) {
  return '<body style="margin:0;padding:0;background:#f5f5f5;font-family:Arial,sans-serif">'
    + '<div style="max-width:600px;margin:40px auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08)">'
    + '<div style="background:#111827;padding:28px 32px;text-align:center">'
    + '<span style="font-size:22px;font-weight:900;color:#fff">Combo<span style="color:#F4C430">Xplora</span></span>'
    + '<p style="margin:4px 0 0;color:#6b7280;font-size:11px;letter-spacing:2px;text-transform:uppercase">' + subtitulo + '</p>'
    + '</div><div style="padding:32px">';
}

function pie() {
  return '</div><div style="background:#f9fafb;padding:20px 32px;border-top:1px solid #e5e7eb;text-align:center">'
    + '<p style="margin:0;color:#9ca3af;font-size:12px">© ' + new Date().getFullYear() + ' ComboXplora · Barranquilla, Colombia</p>'
    + '</div></div></body>';
}

function boton(texto, href, oscuro) {
  const bg = oscuro ? '#111827' : '#F4C430';
  const color = oscuro ? '#ffffff' : '#111827';
  return '<a href="' + href + '" style="display:inline-block;background:' + bg + ';color:' + color
    + ';font-weight:700;font-size:13px;padding:12px 24px;border-radius:8px;text-decoration:none;margin-right:8px;margin-bottom:8px">' + texto + '</a>';
}

function enviarAvisoAprobacion(email, ev) {
  const paginaUrl = SITE_URL + '/eventos/' + ev.slug;
  const agendaUrl = SITE_URL + '/eventos';
  const nombre = ev.nombre_responsable ? ev.nombre_responsable.split(' ')[0] : '';
  const cuando = [ev.fecha ? formatearFecha(ev.fecha) : '', ev.hora_inicio ? recortarHora(ev.hora_inicio) : ''].filter(Boolean).join(' · ');
  const donde = ev.nombre_lugar || ev.direccion || '';

  const html = cabecera('Mapa Cultural · Barranquilla')
    + '<h2 style="margin:0 0 8px;font-size:20px;color:#111827">¡Tu evento ya está publicado! 🎉</h2>'
    + '<p style="margin:0 0 20px;color:#6b7280;font-size:15px;line-height:1.6">Hola' + (nombre ? ' <strong style="color:#111827">' + nombre + '</strong>' : '')
    + ', revisamos <strong style="color:#111827">' + ev.nombre_evento + '</strong> y ya aparece en la agenda y en el mapa cultural de ComboXplora.</p>'
    + '<div style="background:#f9fafb;border-left:4px solid #2563EB;padding:14px 18px;border-radius:0 8px 8px 0;margin-bottom:24px">'
    + '<p style="margin:0;font-size:11px;color:#6b7280;font-weight:700;text-transform:uppercase;letter-spacing:0.5px">Tu página</p>'
    + '<p style="margin:6px 0 0;font-size:14px"><a href="' + paginaUrl + '" style="color:#2563EB;font-weight:700;word-break:break-all">' + paginaUrl + '</a></p>'
    + (cuando ? '<p style="margin:8px 0 0;font-size:13px;color:#374151">' + cuando + (donde ? ' · ' + donde : '') + '</p>' : '')
    + '</div>'
    + '<p style="margin:0 0 12px;color:#374151;font-size:14px;font-weight:700">Para que llegue más gente</p>'
    + '<ol style="margin:0 0 24px;padding-left:20px;color:#6b7280;font-size:14px;line-height:2">'
    + '<li>Comparte el enlace de tu página en WhatsApp e Instagram: se ve con imagen, fecha y cómo llegar.</li>'
    + '<li>Si usas Luma u otra plataforma para inscripciones, respóndenos este correo con el enlace y lo ponemos en el botón "Inscribirse".</li>'
    + '<li>Si cambia la fecha, el lugar o se cancela, avísanos respondiendo este correo.</li>'
    + '</ol>'
    + '<div style="margin-top:8px">' + boton('Ver mi página', paginaUrl, true) + boton('Ver la agenda', agendaUrl, false) + '</div>'
    + '<p style="margin:24px 0 0;color:#6b7280;font-size:14px">¿Preguntas? Escríbenos al <a href="https://wa.me/573122475789" style="color:#F4C430;font-weight:700">+57 312 247 5789</a>.</p>'
    + pie();

  MailApp.sendEmail({
    to: email,
    replyTo: ADMIN_EMAIL,
    subject: '✅ Tu evento "' + ev.nombre_evento + '" ya está en la agenda de ComboXplora',
    body: 'Tu evento ya está publicado: ' + paginaUrl,
    htmlBody: html,
  });
}

function enviarEmailAdmin(d) {
  const asunto = '🎉 Nuevo evento: ' + (d.nombre_evento || 'Sin nombre');

  function fila(label, valor) {
    if (!valor || valor === '-') return '';
    return '<tr><td style="padding:7px 12px;background:#f9fafb;border-radius:6px;font-size:11px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:0.5px;width:160px;vertical-align:top">' + label + '</td><td style="padding:7px 12px;font-size:14px;color:#111827;vertical-align:top">' + valor + '</td></tr><tr><td colspan="2" style="height:3px"></td></tr>';
  }
  function seccion(titulo, filas) {
    return '<div style="margin-bottom:24px"><p style="margin:0 0 10px;font-size:11px;font-weight:900;color:#6b7280;text-transform:uppercase;letter-spacing:1.5px;border-bottom:2px solid #f3f4f6;padding-bottom:6px">' + titulo + '</p><table style="width:100%;border-collapse:collapse">' + filas + '</table></div>';
  }

  const html = cabecera('Nuevo evento · Mapa Cultural')
    + '<h2 style="margin:0 0 20px;font-size:20px;color:#111827">📍 ' + (d.nombre_evento || 'Nuevo evento') + '</h2>'
    + seccion('Evento',
        fila('Tipo', d.tipo_evento) + fila('Descripción', d.descripcion) + fila('Fecha', d.fecha_evento)
        + fila('Horario', d.hora_inicio && d.hora_fin ? d.hora_inicio + ' – ' + d.hora_fin : (d.hora_inicio || d.hora_fin))
        + fila('Dirección', d.direccion)
        + fila('Google Maps', d.link_maps ? '<a href="' + d.link_maps + '" style="color:#F4C430">' + d.link_maps + '</a>' : null)
        + fila('Inscripción', d.link_inscripcion ? '<a href="' + d.link_inscripcion + '" style="color:#F4C430">' + d.link_inscripcion + '</a>' : null))
    + seccion('Responsable',
        fila('Nombre', d.nombre_responsable)
        + fila('Email', d.email_contacto ? '<a href="mailto:' + d.email_contacto + '" style="color:#F4C430">' + d.email_contacto + '</a>' : null)
        + fila('Teléfono', d.telefono))
    + seccion('Espacio',
        fila('Tipo', d.tipo_espacio) + fila('Lugar', d.nombre_lugar) + fila('Wi-Fi', d.wifi) + fila('Accesible', d.accesible)
        + fila('Parqueadero', d.parqueadero) + fila('Baños', d.banos) + fila('Detalles', d.detalles_adicionales))
    + fila('Acepta promoción', d.acepta_promocion)
    + '<div style="margin-top:24px">' + boton('Revisar en el admin', SITE_URL + '/admin/eventos', false) + '</div>'
    + pie();

  MailApp.sendEmail({ to: ADMIN_EMAIL, subject: asunto, body: asunto, htmlBody: html });
}

function enviarConfirmacionUsuario(email, nombre, nombreEvento) {
  const html = cabecera('Mapa Cultural · Barranquilla')
    + '<h2 style="margin:0 0 8px;font-size:20px;color:#111827">¡Recibimos tu evento! 🎉</h2>'
    + '<p style="margin:0 0 20px;color:#6b7280;font-size:15px;line-height:1.6">Hola <strong style="color:#111827">' + (nombre || '') + '</strong>, gracias por registrar tu evento en el Mapa Cultural de Barranquilla.</p>'
    + (nombreEvento ? '<div style="background:#f9fafb;border-left:4px solid #F4C430;padding:14px 18px;border-radius:0 8px 8px 0;margin-bottom:24px"><p style="margin:0;font-size:11px;color:#6b7280;font-weight:700;text-transform:uppercase;letter-spacing:0.5px">Evento registrado</p><p style="margin:6px 0 0;font-size:16px;color:#111827;font-weight:800">' + nombreEvento + '</p></div>' : '')
    + '<p style="margin:0 0 12px;color:#374151;font-size:14px;font-weight:700">¿Qué sigue?</p>'
    + '<ol style="margin:0 0 24px;padding-left:20px;color:#6b7280;font-size:14px;line-height:2.2">'
    + '<li>Nuestro equipo revisará tu propuesta (máx. 3 días hábiles).</li>'
    + '<li>Si cumple los criterios, te llega un correo con el enlace a la página de tu evento.</li>'
    + '<li>Desde ahí lo compartes y la gente ve cómo llegar.</li>'
    + '</ol>'
    + '<p style="margin:0 0 24px;color:#6b7280;font-size:14px">¿Preguntas? Escríbenos al <a href="https://wa.me/573122475789" style="color:#F4C430;font-weight:700">+57 312 247 5789</a> o a <a href="mailto:comboxplora@gmail.com" style="color:#F4C430;font-weight:700">comboxplora@gmail.com</a>.</p>'
    + pie();

  MailApp.sendEmail({ to: email, replyTo: ADMIN_EMAIL, subject: '✅ Tu evento fue registrado en ComboXplora', body: 'Recibimos tu evento.', htmlBody: html });
}

// ── UTILIDADES ──────────────────────────────────────────────────
function formatearFecha(iso) {
  const partes = String(iso).split('-');
  if (partes.length !== 3) return iso;
  const dias = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
  const meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
  const d = new Date(Number(partes[0]), Number(partes[1]) - 1, Number(partes[2]));
  return dias[d.getDay()] + ' ' + d.getDate() + ' de ' + meses[d.getMonth()];
}

function recortarHora(raw) {
  return String(raw).replace(/^(\d{1,2}:\d{2}):\d{2}/, '$1').trim();
}
