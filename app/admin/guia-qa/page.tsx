export const metadata = {
    title: "Guía QA — ComboXplora Admin",
    description: "Paso a paso para el equipo de revisión de contenido",
};

export default function GuiaQAPage() {
    return (
        <>
            <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #fafaf8; }
        .qa-wrap {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          background: #fafaf8;
          color: #1a1a1a;
          line-height: 1.65;
          font-size: 16px;
          max-width: 680px;
          margin: 0 auto;
          padding: 2.5rem 1.5rem 5rem;
        }
        .qa-header { border-bottom: 2.5px solid #F4C430; padding-bottom: 1.5rem; margin-bottom: 2rem; }
        .qa-eyebrow { font-size: 0.7rem; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: #7a7a7a; margin-bottom: 0.6rem; }
        .qa-header h1 { font-size: 1.75rem; font-weight: 800; line-height: 1.15; color: #1a1a1a; }
        .qa-header h1 span { color: #c79a10; }
        .qa-sub { margin-top: 0.6rem; font-size: 0.95rem; color: #4a4a4a; }
        .qa-intro { background: #FDF6DC; border-left: 4px solid #F4C430; border-radius: 0 8px 8px 0; padding: 1rem 1.2rem; font-size: 0.95rem; color: #4a4a4a; margin-bottom: 2.5rem; }
        .qa-intro strong { color: #1a1a1a; }
        .qa-section { margin-bottom: 2.5rem; }
        .qa-section-title { font-size: 0.65rem; font-weight: 800; letter-spacing: 0.14em; text-transform: uppercase; color: #7a7a7a; margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem; }
        .qa-section-title::after { content: ""; flex: 1; height: 1px; background: #ece8df; }
        .qa-steps { display: flex; flex-direction: column; gap: 1rem; }
        .qa-step { display: flex; gap: 1rem; align-items: flex-start; }
        .qa-step-num { flex-shrink: 0; width: 2rem; height: 2rem; border-radius: 50%; background: #F4C430; color: #1a1a1a; font-weight: 800; font-size: 0.85rem; display: flex; align-items: center; justify-content: center; margin-top: 0.1rem; }
        .qa-step-body { flex: 1; }
        .qa-step-body strong { display: block; font-weight: 700; color: #1a1a1a; margin-bottom: 0.2rem; }
        .qa-step-body p { font-size: 0.94rem; color: #4a4a4a; }
        .qa-tabs { display: flex; flex-direction: column; gap: 0.6rem; margin: 1rem 0; }
        .qa-tab { background: #f9f7f2; border: 1px solid #ece8df; border-radius: 8px; padding: 0.75rem 1rem; display: flex; align-items: flex-start; gap: 0.75rem; }
        .qa-tab-icon { font-size: 1.1rem; line-height: 1; margin-top: 0.1rem; }
        .qa-tab-content strong { display: block; font-weight: 700; font-size: 0.9rem; color: #1a1a1a; }
        .qa-tab-content span { font-size: 0.86rem; color: #7a7a7a; }
        .qa-publish { background: #FDF6DC; border: 2px solid #F4C430; border-radius: 10px; padding: 1.1rem 1.2rem; display: flex; gap: 0.8rem; align-items: flex-start; margin: 1rem 0; }
        .qa-publish-icon { font-size: 1.5rem; flex-shrink: 0; margin-top: 0.1rem; }
        .qa-publish strong { display: block; font-weight: 800; font-size: 0.95rem; color: #1a1a1a; margin-bottom: 0.25rem; }
        .qa-publish p { font-size: 0.9rem; color: #4a4a4a; }
        .qa-note { background: #fff1f0; border-left: 4px solid #d9341a; border-radius: 0 8px 8px 0; padding: 0.9rem 1.1rem; font-size: 0.9rem; color: #4a4a4a; margin: 0.8rem 0; }
        .qa-note strong { color: #d9341a; }
        .qa-ok { background: #f0fdf4; border-left: 4px solid #16a34a; border-radius: 0 8px 8px 0; padding: 0.9rem 1.1rem; font-size: 0.9rem; color: #4a4a4a; margin: 0.8rem 0; }
        .qa-ok strong { color: #16a34a; }
        .qa-bug { background: #f9f7f2; border: 1px dashed #ece8df; border-radius: 10px; padding: 1.2rem; font-size: 0.88rem; }
        .qa-bug-line { display: flex; gap: 0.5rem; padding: 0.45rem 0; border-bottom: 1px solid #ece8df; align-items: flex-start; }
        .qa-bug-line:last-child { border-bottom: none; }
        .qa-bug-label { font-weight: 700; color: #1a1a1a; min-width: 110px; flex-shrink: 0; font-size: 0.82rem; }
        .qa-bug-val { color: #7a7a7a; font-style: italic; }
        .qa-url { display: inline-block; background: #f9f7f2; border: 1px solid #ece8df; border-radius: 6px; padding: 0.2rem 0.6rem; font-size: 0.82rem; font-family: "Menlo", "Courier New", monospace; color: #c79a10; word-break: break-all; }
        .qa-url-group { display: flex; flex-direction: column; gap: 0.4rem; margin-top: 0.6rem; }
        .qa-url-label { font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #7a7a7a; }
        hr.qa-hr { border: none; border-top: 1px solid #ece8df; margin: 2rem 0; }
        .qa-footer { font-size: 0.8rem; color: #7a7a7a; text-align: center; margin-top: 3rem; padding-top: 1.5rem; border-top: 1px solid #ece8df; }
        ul.qa-list { padding-left: 1.2rem; }
        ul.qa-list li { font-size: 0.94rem; color: #4a4a4a; margin-bottom: 0.3rem; }
        @media print {
          .qa-wrap { padding: 1rem; }
        }
      `}</style>

            <div className="qa-wrap">

                <div className="qa-header">
                    <div className="qa-eyebrow">ComboXplora · Revisión de Calidad</div>
                    <h1>Guía para el equipo de <span>QA</span></h1>
                    <div className="qa-sub">Cómo revisar y modificar el contenido del panel de administración</div>
                </div>

                <div className="qa-intro">
                    <strong>¿Qué van a hacer?</strong> Revisar que todo lo que se modifica en el panel de administración se vea bien en la página pública. No necesitan saber programar — si algo no se ve bien, simplemente lo describen y Moises se lo pasa al equipo técnico.
                </div>

                {/* ACCESO */}
                <div className="qa-section">
                    <div className="qa-section-title">Acceso</div>
                    <div className="qa-steps">
                        <div className="qa-step">
                            <div className="qa-step-num">1</div>
                            <div className="qa-step-body">
                                <strong>Abran los dos enlaces en pestañas separadas</strong>
                                <p>Así pueden comparar el panel con la página pública sin cerrar nada.</p>
                                <div className="qa-url-group">
                                    <div>
                                        <div className="qa-url-label">Panel admin →</div>
                                        <span className="qa-url">https://combo-xplora-web.vercel.app/admin</span>
                                    </div>
                                    <div>
                                        <div className="qa-url-label">Página pública →</div>
                                        <span className="qa-url">https://combo-xplora-web.vercel.app</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="qa-step">
                            <div className="qa-step-num">2</div>
                            <div className="qa-step-body">
                                <strong>Inicien sesión con las credenciales que les pasó Moises</strong>
                                <p>Si no las tienen, pídale el correo y la contraseña del administrador.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* QUÉ TIENE EL PANEL */}
                <div className="qa-section">
                    <div className="qa-section-title">Qué tiene el panel</div>
                    <p style={{ fontSize: "0.94rem", color: "#4a4a4a", marginBottom: "0.8rem" }}>En el menú lateral van a encontrar tres secciones principales:</p>
                    <div className="qa-tabs">
                        <div className="qa-tab">
                            <div className="qa-tab-icon">🎭</div>
                            <div className="qa-tab-content">
                                <strong>Experiencias</strong>
                                <span>Los talleres y actividades culturales (taller de máscaras, turbantes, etc.)</span>
                            </div>
                        </div>
                        <div className="qa-tab">
                            <div className="qa-tab-icon">👤</div>
                            <div className="qa-tab-content">
                                <strong>Hacedores</strong>
                                <span>Las personas que guían las experiencias (artesanas, cocineras, músicos…)</span>
                            </div>
                        </div>
                        <div className="qa-tab">
                            <div className="qa-tab-icon">🗺️</div>
                            <div className="qa-tab-content">
                                <strong>Mapa Cultural</strong>
                                <span>Los puntos de interés que aparecen en el mapa interactivo del sitio</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* CÓMO MODIFICAR */}
                <div className="qa-section">
                    <div className="qa-section-title">Cómo modificar algo</div>
                    <div className="qa-steps">
                        <div className="qa-step">
                            <div className="qa-step-num">1</div>
                            <div className="qa-step-body">
                                <strong>Entren a la sección que quieren revisar</strong>
                                <p>Por ejemplo, "Hacedores". Verán una lista de todas las personas registradas.</p>
                            </div>
                        </div>
                        <div className="qa-step">
                            <div className="qa-step-num">2</div>
                            <div className="qa-step-body">
                                <strong>Para editar, hagan clic en el ícono del lápiz ✏️</strong>
                                <p>Se abre un panel lateral con todos los campos: nombre, descripción, foto, barrio, etc. Modifiquen lo que necesiten y hagan clic en <strong>"Guardar"</strong>.</p>
                            </div>
                        </div>
                        <div className="qa-step">
                            <div className="qa-step-num">3</div>
                            <div className="qa-step-body">
                                <strong>Para agregar uno nuevo, botón "Nuevo +" arriba a la derecha</strong>
                                <p>El ID se genera solo — no tienen que escribirlo. El slug (la dirección web) también se llena automático desde el nombre.</p>
                            </div>
                        </div>
                        <div className="qa-step">
                            <div className="qa-step-num">4</div>
                            <div className="qa-step-body">
                                <strong>Para ocultar sin borrar, usen el ojo 👁️</strong>
                                <p>Si hacen clic en el ojo, el elemento queda oculto en la página pública pero no se borra. Pueden volver a activarlo cuando quieran.</p>
                            </div>
                        </div>
                    </div>
                    <div className="qa-note" style={{ marginTop: "1rem" }}>
                        <strong>Importante:</strong> Ocultar ≠ Borrar. El ícono de papelera 🗑️ borra para siempre. El ojo solo esconde. Usen siempre el ojo para pruebas.
                    </div>
                </div>

                {/* PUBLICAR */}
                <div className="qa-section">
                    <div className="qa-section-title">El paso más importante — Publicar</div>
                    <p style={{ fontSize: "0.94rem", color: "#4a4a4a", marginBottom: "0.8rem" }}>Cuando guarden un cambio, <strong style={{ color: "#1a1a1a" }}>no se ve en la página pública todavía</strong>. Primero tienen que publicar.</p>
                    <div className="qa-publish">
                        <div className="qa-publish-icon">🚀</div>
                        <div>
                            <strong>Cómo publicar: barra dorada en la parte de abajo</strong>
                            <p>Después de hacer uno o varios cambios, aparece una barra dorada en la parte inferior del panel. Ahí van a ver un resumen de todo lo que modificaron. Cuando estén listas, hagan clic en <strong>"Publicar en el sitio →"</strong>. En unos segundos los cambios aparecen en la página.</p>
                        </div>
                    </div>
                    <div className="qa-ok">
                        <strong>✓ ¿Cómo saber si funcionó?</strong> Vayan a la pestaña de la página pública y recarguen (F5 o Cmd+R). El cambio debería verse. Si no aparece de inmediato, esperen 30 segundos y vuelvan a recargar.
                    </div>
                </div>

                {/* QUÉ REVISAR */}
                <div className="qa-section">
                    <div className="qa-section-title">Qué deben revisar</div>
                    <p style={{ fontSize: "0.94rem", color: "#4a4a4a", marginBottom: "0.8rem" }}>Para cada cambio que hagan, verifiquen:</p>
                    <ul className="qa-list">
                        <li>¿La foto se ve bien y no está cortada rara?</li>
                        <li>¿El nombre y la descripción aparecen correctos en la página?</li>
                        <li>¿Los botones de WhatsApp e Instagram funcionan (llevan al lugar correcto)?</li>
                        <li>¿Si ocultaron algo, ya no se ve en la página pública?</li>
                        <li>¿Si pusieron nuevas coordenadas en el mapa, el pin aparece en el lugar correcto?</li>
                        <li>¿La página del hacedor (el portafolio) carga sin errores?</li>
                        <li>¿Se ve bien tanto en computador como en el celular?</li>
                    </ul>
                </div>

                <hr className="qa-hr" />

                {/* REPORTAR */}
                <div className="qa-section">
                    <div className="qa-section-title">Cuando algo no funciona — cómo reportarlo</div>
                    <p style={{ fontSize: "0.94rem", color: "#4a4a4a", marginBottom: "1rem" }}>Si encuentran algo que no se ve bien o no funciona, <strong style={{ color: "#1a1a1a" }}>no lo intenten arreglar</strong>. Descríbanlo con este formato y se lo pasan a Moises:</p>
                    <div className="qa-bug">
                        <div className="qa-bug-line">
                            <span className="qa-bug-label">¿Qué hice?</span>
                            <span className="qa-bug-val">Edité el nombre del hacedor "X" y guardé.</span>
                        </div>
                        <div className="qa-bug-line">
                            <span className="qa-bug-label">¿Qué esperaba?</span>
                            <span className="qa-bug-val">Que el nuevo nombre apareciera en su página de portafolio.</span>
                        </div>
                        <div className="qa-bug-line">
                            <span className="qa-bug-label">¿Qué pasó en cambio?</span>
                            <span className="qa-bug-val">El nombre sigue siendo el viejo / apareció en blanco / salió un error en pantalla.</span>
                        </div>
                        <div className="qa-bug-line">
                            <span className="qa-bug-label">¿En qué sección?</span>
                            <span className="qa-bug-val">Hacedores → perfil de [nombre]</span>
                        </div>
                        <div className="qa-bug-line">
                            <span className="qa-bug-label">¿Pantalla o captura?</span>
                            <span className="qa-bug-val">Si pueden, adjunten una foto o captura de pantalla del problema.</span>
                        </div>
                    </div>
                    <div className="qa-intro" style={{ marginTop: "1rem", marginBottom: 0 }}>
                        <strong>¿Cómo lo usan?</strong> Moises le pasará esa descripción al equipo técnico. Mientras más detalle den, más rápido se resuelve. No necesitan saber por qué pasó — solo describir exactamente qué hicieron y qué vieron.
                    </div>
                </div>

                <div className="qa-footer">
                    ComboXplora · Guía interna QA · Cualquier duda, escriban a Moises directamente.
                </div>

            </div>
        </>
    );
}
