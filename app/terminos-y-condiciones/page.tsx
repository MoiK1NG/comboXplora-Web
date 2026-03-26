import React from 'react';

export default function TerminosPage() {
    return (
        <main className="min-h-screen bg-white py-20 px-6 lg:px-8">
            <div className="max-w-4xl mx-auto prose prose-lg prose-gray">
                <h1 className="text-4xl font-extrabold text-gray-900 mb-8 font-outfit tracking-tight">
                    Términos y Condiciones
                </h1>

                <p className="lead text-xl text-gray-600 mb-10">
                    Última actualización: Marzo 2026. Al acceder y utilizar ComboXplora, aceptas estar sujeto a los siguientes términos y condiciones.
                </p>

                <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">1. Introducción</h2>
                <p className="text-gray-700 mb-6">
                    Bienvenido a ComboXplora, una plataforma digital que conecta a usuarios con hacedores culturales de Barranquilla para la reserva de experiencias auténticas y locales. Estos Términos rigen el uso de nuestro sitio web y los servicios ofrecidos.
                </p>

                <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">2. Naturaleza del Servicio</h2>
                <p className="text-gray-700 mb-6">
                    ComboXplora actúa únicamente como un intermediario tecnológico y catálogo para facilitar la conexión entre los usuarios (exploradores) y los hacedores culturales (anfitriones). No somos los prestadores directos de las experiencias, por lo tanto, la responsabilidad de la ejecución, calidad y seguridad durante la experiencia recae en el anfitrión correspondiente.
                </p>

                <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">3. Reservas y Pagos</h2>
                <p className="text-gray-700 mb-4">
                    Al solicitar una reserva a través de ComboXplora (por ejemplo, vía WhatsApp u otros medios), el usuario se compromete a:
                </p>
                <ul className="list-disc pl-6 text-gray-700 mb-6 space-y-2">
                    <li>Proporcionar información veraz y completa.</li>
                    <li>Acordar los mecanismos de pago directamente con el hacedor cultural o a través de los canales oficiales establecidos por ComboXplora, según se indique en la confirmación.</li>
                    <li>Aceptar que los precios pueden estar sujetos a cambios según la temporada y la disponibilidad del anfitrión.</li>
                </ul>

                <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">4. Comportamiento del Usuario</h2>
                <p className="text-gray-700 mb-6">
                    Se espera que todos los usuarios de ComboXplora mantengan un comportamiento respetuoso hacia los anfitriones, las comunidades locales y el patrimonio cultural. Nos reservamos el derecho de negar el servicio a usuarios que incurran en discriminación, agresión, faltas de respeto o comportamientos ilegales.
                </p>

                <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">5. Propiedad Intelectual</h2>
                <p className="text-gray-700 mb-6">
                    Todo el contenido de la plataforma, incluyendo diseño, textos, logotipos y material audiovisual, es propiedad de ComboXplora o está licenciado a la plataforma. Queda prohibida su reproducción, distribución o modificación sin autorización previa y por escrito.
                </p>

                <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">6. Limitación de Responsabilidad</h2>
                <p className="text-gray-700 mb-6">
                    En la medida máxima permitida por la ley aplicable, ComboXplora no será responsable por daños indirectos, incidentales, o derivados del uso de la plataforma o de la participación en las experiencias reservadas. Recomendamos a los usuarios contar con seguro médico y seguir las normas de seguridad pertinentes.
                </p>

                <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">7. Modificaciones</h2>
                <p className="text-gray-700 mb-6">
                    Podemos actualizar estos Términos periódicamente para reflejar cambios en nuestras operaciones o por requerimientos legales. Su uso continuo de la plataforma después de la entrada en vigor de dichas modificaciones constituirá su aceptación de los nuevos términos.
                </p>

                <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">8. Contacto</h2>
                <p className="text-gray-700 mb-6">
                    Para dudas o sugerencias sobre estos términos, escríbanos a <strong>comboxplora@gmail.com</strong>.
                </p>
            </div>
        </main>
    );
}
