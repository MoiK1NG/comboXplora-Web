import React from 'react';

export default function PoliticasCancelacionPage() {
    return (
        <main className="min-h-screen bg-white py-20 px-6 lg:px-8">
            <div className="max-w-4xl mx-auto prose prose-lg prose-gray">
                <h1 className="text-4xl font-extrabold text-gray-900 mb-8 font-outfit tracking-tight">
                    Políticas de Cancelación
                </h1>

                <p className="lead text-xl text-gray-600 mb-10">
                    Comprendemos que los planes pueden cambiar. Por ello, hemos diseñado políticas de cancelación equilibradas que protegen tanto a nuestros exploradores como al tiempo y los recursos de los hacedores culturales (anfitriones).
                </p>

                <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">1. Cancelaciones por parte del Usuario</h2>
                <p className="text-gray-700 mb-4">
                    Si necesitas cancelar o modificar tu reserva de una experiencia cultural, las condiciones aplicables dependerán del tiempo de anticipación con el que nos lo comuniques (o lo comuniques directamente al anfitrión, de ser el caso):
                </p>
                <ul className="list-disc pl-6 text-gray-700 mb-6 space-y-2">
                    <li><strong>Aviso de 48 horas o más:</strong> Reprogramación gratuita u opción de cancelación total sin cargos adicionales, permitiendo al anfitrión recuperar el espacio reservado para los materiales.</li>
                    <li><strong>Aviso de 24 a 48 horas:</strong> Es posible que se retenga una porción del pago anticipado (si hubo) para cubrir el costo de preparación e insumos perecederos solicitados para la experiencia (p. ej., ingredientes de las matronas).</li>
                    <li><strong>Aviso de menos de 24 horas:</strong> No se realizarán reembolsos en caso de que el monto ya haya sido adelantado, ya que el anfitrión habrá asegurado su tiempo, talento y materiales para ti.</li>
                </ul>

                <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">2. Reembolsos y Anticipos</h2>
                <p className="text-gray-700 mb-6">
                    Dado que ComboXplora conecta a los usuarios mediante canales de comunicación directos como WhatsApp en nuestra primera fase o MVP, las políticas de retención de pagos preacordados dependerán de los términos que fije el hacedor cultural correspondiente en el contacto de reserva. Al confirmar mediante el canal, el anfitrión podrá informarle sobre el requerimiento de depósitos anticipados no reembolsables.
                </p>

                <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">3. Cancelaciones por parte del Anfitrión</h2>
                <p className="text-gray-700 mb-6">
                    En el caso poco común de que un hacedor cultural deba cancelar la experiencia programada (debido a causas de fuerza mayor, clima extremo si la experiencia es al exterior, o emergencias imprevistas), el usuario será notificado lo más pronto posible. En estos casos, se ofrecerá la posibilidad de reprogramar para una nueva fecha conveniente, o un reembolso íntegro si ya se efectuó algún tipo de depósito.
                </p>

                <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">4. Retrasos "No Shows"</h2>
                <p className="text-gray-700 mb-6">
                    Si un usuario no se presenta al punto de encuentro ni notifica ningún contratiempo a su anfitrión transcurridos 30 minutos de la hora citada, la experiencia se considerará como prestada (no-show), y aplicará un cargo del 100%. Respetar la puntualidad es clave para el respeto al tiempo de la comunidad que nos abre sus puertas.
                </p>

                <div className="bg-gray-50 border-l-4 border-primary p-6 mt-12">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Solicitudes</h3>
                    <p className="text-gray-700">
                        Para tramitar una cancelación o cambio de planes repentino con urgencia, comunícate directamente con el anfitrión mediante el WhatsApp provisto, o remite tu caso a <strong>comboxplora@gmail.com</strong> para recibir asistencia de intermediación.
                    </p>
                </div>
            </div>
        </main>
    );
}
