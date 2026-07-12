import { Resend } from 'resend';

// Lazy initialization — evita error en build cuando RESEND_API_KEY no está configurado
function getResend() {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error('RESEND_API_KEY no configurado.');
  return new Resend(key);
}

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'comboxplora@gmail.com';
const FROM_EMAIL = process.env.FROM_EMAIL || 'onboarding@resend.dev';
const APP_NAME = 'ComboXplora';

// ──────────────────────────────────────────────
// HELPERS
// ──────────────────────────────────────────────

function emailWrapper(content: string): string {
  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${APP_NAME}</title>
</head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:Arial,sans-serif;">
  <div style="max-width:600px;margin:40px auto;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
    <!-- Header -->
    <div style="background:#111827;padding:28px 32px;text-align:center;">
      <span style="font-size:22px;font-weight:900;color:#ffffff;letter-spacing:-0.5px;">
        Combo<span style="color:#F4C430;">Xplora</span>
      </span>
      <p style="margin:4px 0 0;color:#6b7280;font-size:11px;letter-spacing:2px;text-transform:uppercase;">
        Notificación interna
      </p>
    </div>
    <!-- Content -->
    <div style="padding:32px;">
      ${content}
    </div>
    <!-- Footer -->
    <div style="background:#f9fafb;padding:20px 32px;border-top:1px solid #e5e7eb;text-align:center;">
      <p style="margin:0;color:#9ca3af;font-size:12px;">
        © ${new Date().getFullYear()} ComboXplora · Panel Administrativo
      </p>
    </div>
  </div>
</body>
</html>`;
}

function field(label: string, value: string | undefined | null): string {
  if (!value) return '';
  return `
    <tr>
      <td style="padding:8px 12px;background:#f9fafb;border-radius:6px;font-size:12px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:0.5px;width:140px;vertical-align:top;">${label}</td>
      <td style="padding:8px 12px;font-size:14px;color:#111827;vertical-align:top;">${value}</td>
    </tr>
    <tr><td colspan="2" style="height:4px;"></td></tr>
  `;
}

function dataTable(rows: string): string {
  return `<table style="width:100%;border-collapse:collapse;margin-top:16px;">${rows}</table>`;
}

// ──────────────────────────────────────────────
// CONTACTO
// ──────────────────────────────────────────────

export async function sendContactNotification(data: {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
}) {
  const content = `
    <h2 style="margin:0 0 8px;font-size:20px;color:#111827;">📬 Nuevo mensaje de contacto</h2>
    <p style="margin:0 0 24px;color:#6b7280;font-size:14px;">Se ha recibido un nuevo mensaje a través del sitio web.</p>
    ${dataTable(
      field('Nombre', data.name) +
      field('Email', `<a href="mailto:${data.email}" style="color:#F4C430;">${data.email}</a>`) +
      field('Teléfono', data.phone) +
      field('Asunto', data.subject) +
      field('Mensaje', `<span style="white-space:pre-wrap;">${data.message}</span>`)
    )}
    <div style="margin-top:24px;">
      <a href="mailto:${data.email}" style="display:inline-block;background:#F4C430;color:#111827;font-weight:700;font-size:13px;padding:12px 24px;border-radius:8px;text-decoration:none;">
        Responder a ${data.name}
      </a>
    </div>
  `;

  return getResend().emails.send({
    from: FROM_EMAIL,
    to: ADMIN_EMAIL,
    subject: `[${APP_NAME}] Contacto: ${data.subject || data.name}`,
    html: emailWrapper(content),
  });
}

// ──────────────────────────────────────────────
// POSTULACIÓN
// ──────────────────────────────────────────────

export async function sendPostulacionNotification(data: {
  name: string;
  email: string;
  phone?: string;
  neighborhood?: string;
  experience_type?: string;
  experience_title?: string;
  experience_description?: string;
  why_join?: string;
  social_links?: string;
}) {
  const content = `
    <h2 style="margin:0 0 8px;font-size:20px;color:#111827;">🎨 Nueva postulación de hacedor</h2>
    <p style="margin:0 0 24px;color:#6b7280;font-size:14px;">Un nuevo hacedor quiere unirse a la plataforma.</p>
    ${dataTable(
      field('Nombre', data.name) +
      field('Email', `<a href="mailto:${data.email}" style="color:#F4C430;">${data.email}</a>`) +
      field('Teléfono', data.phone) +
      field('Barrio', data.neighborhood) +
      field('Tipo de experiencia', data.experience_type) +
      field('Título propuesto', data.experience_title) +
      field('Descripción', data.experience_description) +
      field('¿Por qué unirse?', data.why_join) +
      field('Redes sociales', data.social_links)
    )}
    <div style="margin-top:24px;">
      <a href="mailto:${data.email}" style="display:inline-block;background:#F4C430;color:#111827;font-weight:700;font-size:13px;padding:12px 24px;border-radius:8px;text-decoration:none;">
        Contactar a ${data.name}
      </a>
    </div>
  `;

  return getResend().emails.send({
    from: FROM_EMAIL,
    to: ADMIN_EMAIL,
    subject: `[${APP_NAME}] Nueva postulación: ${data.name}`,
    html: emailWrapper(content),
  });
}

// ──────────────────────────────────────────────
// POSTULACIÓN — CONFIRMACIÓN AL USUARIO
// ──────────────────────────────────────────────

export async function sendPostulacionConfirmation(data: {
  name: string;
  email: string;
  experience_title?: string;
}) {
  const content = `
    <h2 style="margin:0 0 8px;font-size:20px;color:#111827;">¡Recibimos tu postulación! 🎉</h2>
    <p style="margin:0 0 20px;color:#6b7280;font-size:15px;line-height:1.6;">
      Hola <strong style="color:#111827;">${data.name}</strong>, gracias por querer ser parte de ComboXplora.
      Tu propuesta ha sido recibida y será revisada por nuestro equipo de curaduría.
    </p>
    ${data.experience_title ? `
    <div style="background:#f9fafb;border-left:4px solid #F4C430;padding:14px 18px;border-radius:0 8px 8px 0;margin-bottom:20px;">
      <p style="margin:0;font-size:13px;color:#6b7280;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;">Experiencia propuesta</p>
      <p style="margin:6px 0 0;font-size:16px;color:#111827;font-weight:800;">${data.experience_title}</p>
    </div>` : ''}
    <p style="margin:0 0 12px;color:#374151;font-size:14px;line-height:1.7;">
      <strong>¿Qué pasa ahora?</strong>
    </p>
    <ol style="margin:0 0 24px;padding-left:20px;color:#6b7280;font-size:14px;line-height:2;">
      <li>Nuestro equipo revisará tu propuesta (máx. 5 días hábiles).</li>
      <li>Nos pondremos en contacto contigo para co-crear la experiencia juntos.</li>
      <li>¡La publicamos y empezamos a recibir reservas!</li>
    </ol>
    <p style="margin:0 0 24px;color:#6b7280;font-size:14px;">
      Si tienes preguntas, responde este correo o escríbenos al WhatsApp
      <a href="https://wa.me/573122475789" style="color:#F4C430;font-weight:700;">+57 312 247 5789</a>.
    </p>
    <div style="margin-top:24px;">
      <a href="https://combo-xplora-web.vercel.app" style="display:inline-block;background:#F4C430;color:#111827;font-weight:700;font-size:13px;padding:12px 24px;border-radius:8px;text-decoration:none;">
        Ver ComboXplora
      </a>
    </div>
  `;

  return getResend().emails.send({
    from: FROM_EMAIL,
    to: data.email,
    subject: `Tu postulación en ComboXplora fue recibida ✅`,
    html: emailWrapper(content),
  });
}

// ──────────────────────────────────────────────
// EMPRESA INTERESADA
// ──────────────────────────────────────────────

export async function sendEmpresaNotification(data: {
  company_name: string;
  contact_name: string;
  email: string;
  phone?: string;
  website?: string;
  interest_type?: string;
  message?: string;
  num_people?: number;
  preferred_date?: string;
  budget_range?: string;
}) {
  const interestLabels: Record<string, string> = {
    sponsorship: 'Patrocinio',
    partnership: 'Alianza estratégica',
    booking_group: 'Reserva grupal',
    csr: 'Responsabilidad social',
    other: 'Otro',
  };

  const content = `
    <h2 style="margin:0 0 8px;font-size:20px;color:#111827;">🏢 Nueva empresa interesada</h2>
    <p style="margin:0 0 24px;color:#6b7280;font-size:14px;">Una empresa desea conectar con ComboXplora.</p>
    ${dataTable(
      field('Empresa', data.company_name) +
      field('Contacto', data.contact_name) +
      field('Email', `<a href="mailto:${data.email}" style="color:#F4C430;">${data.email}</a>`) +
      field('Teléfono', data.phone) +
      field('Sitio web', data.website ? `<a href="${data.website}" style="color:#F4C430;">${data.website}</a>` : undefined) +
      field('Tipo de interés', data.interest_type ? interestLabels[data.interest_type] || data.interest_type : undefined) +
      field('Personas', data.num_people?.toString()) +
      field('Fecha preferida', data.preferred_date) +
      field('Presupuesto', data.budget_range) +
      field('Mensaje', data.message)
    )}
    <div style="margin-top:24px;">
      <a href="mailto:${data.email}" style="display:inline-block;background:#F4C430;color:#111827;font-weight:700;font-size:13px;padding:12px 24px;border-radius:8px;text-decoration:none;">
        Responder a ${data.contact_name}
      </a>
    </div>
  `;

  return getResend().emails.send({
    from: FROM_EMAIL,
    to: ADMIN_EMAIL,
    subject: `[${APP_NAME}] Empresa interesada: ${data.company_name}`,
    html: emailWrapper(content),
  });
}
