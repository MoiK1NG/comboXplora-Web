import React from 'react';

export default function PrivacidadPage() {
    return (
        <main className="min-h-screen bg-white py-20 px-6 lg:px-8">
            <div className="max-w-4xl mx-auto prose prose-lg prose-gray">
                <h1 className="text-4xl font-extrabold text-gray-900 mb-8 font-outfit tracking-tight">
                    Política de Privacidad
                </h1>

                <p className="lead text-xl text-gray-600 mb-10">
                    En ComboXplora valoramos tu privacidad y nos comprometemos a proteger la información personal que compartes con nosotros. Esta política detalla cómo recopilamos, usamos y salvaguardamos tus datos al interactuar con nuestra plataforma.
                </p>

                <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">1. Información que Recopilamos</h2>
                <p className="text-gray-700 mb-4">
                    Al utilizar nuestros servicios, podemos recopilar la siguiente información:
                </p>
                <ul className="list-disc pl-6 text-gray-700 mb-6 space-y-2">
                    <li>Información personal (nombre completo, correo electrónico, número de teléfono).</li>
                    <li>Información de reserva, que puede incluir preferencias dietéticas u otras necesidades especiales para la realización de la experiencia.</li>
                    <li>Datos técnicos sobre tu navegación en nuestra plataforma (cookies, dirección IP, tipo de navegador) para mejorar nuestra interfaz y servicios.</li>
                </ul>

                <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">2. Uso de la Información</h2>
                <p className="text-gray-700 mb-4">
                    La información recopilada es empleada exclusivamente con los propósitos de:
                </p>
                <ul className="list-disc pl-6 text-gray-700 mb-6 space-y-2">
                    <li>Facilitar la comunicación directa entre los exploradores (usuarios) y los hacedores culturales (anfitriones).</li>
                    <li>Enviar información importante sobre el estado de las reservas.</li>
                    <li>Proporcionar soporte al cliente y responder a inquietudes.</li>
                    <li>Mejorar nuestros productos, mediante análisis estadísticos anónimos sobre el uso del sitio.</li>
                </ul>

                <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">3. Protección y Almacenamiento</h2>
                <p className="text-gray-700 mb-6">
                    Mantenemos tu información en servidores seguros y aplicamos protocolos técnicos y administrativos para protegerla contra el acceso no autorizado, la alteración o divulgación. No obstante, ninguna transmisión por internet es 100% invulnerable, y por ello aconsejamos mantener la discreción en las comunicaciones abiertas o por redes de terceros (como WhatsApp).
                </p>

                <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">4. Compartición de Información</h2>
                <p className="text-gray-700 mb-6">
                    Solo compartiremos tu información personal básica con el anfitrión de la experiencia reservada, en la medida necesaria para asegurar que la actividad pueda ser realizada de manera exitosa y segura. Nunca venderemos, alquilaremos ni comercializaremos tu información personal con terceros para fines publicitarios externos sin tu consentimiento expreso.
                </p>

                <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">5. Cookies</h2>
                <p className="text-gray-700 mb-6">
                    Nuestra página utiliza "cookies" para medir y mejorar la experiencia de navegación del usuario. Usted puede configurar en cualquier momento su navegador para rechazar todas las cookies, aunque esto puede afectar el rendimiento de ciertas partes de la plataforma.
                </p>

                <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">6. Derechos del Usuario</h2>
                <p className="text-gray-700 mb-6">
                    Alineado con nuestra "Política de Tratamiento de Datos", tienes el derecho pleno de acceder, corregir o solicitar la eliminación total de tus registros personales almacenados por ComboXplora solicitándolo al correo de soporte.
                </p>

                <div className="bg-gray-50 border-l-4 border-primary p-6 mt-12">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Contacto</h3>
                    <p className="text-gray-700">
                        Si tienes preguntas o inquietudes adicionales acerca de nuestras prácticas de privacidad, envíanos un correo a: <strong>comboxplora@gmail.com</strong>
                    </p>
                </div>
            </div>
        </main>
    );
}
