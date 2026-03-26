import React from 'react';

export default function TratamientoDatosPage() {
    return (
        <main className="min-h-screen bg-white py-20 px-6 lg:px-8">
            <div className="max-w-4xl mx-auto prose prose-lg prose-gray">
                <h1 className="text-4xl font-extrabold text-gray-900 mb-8 font-outfit tracking-tight">
                    Política de Tratamiento de Datos Personales
                </h1>

                <p className="lead text-xl text-gray-600 mb-10">
                    En cumplimiento de la Ley 1581 de 2012, el Decreto Reglamentario 1377 de 2013 y el Decreto 1074 de 2015 de la República de Colombia, ComboXplora establece la siguiente política aplicable al tratamiento de los datos personales.
                </p>

                <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">1. Responsable del Tratamiento</h2>
                <p className="text-gray-700 mb-6">
                    <strong>Razón social:</strong> ComboXplora [Tipo de sociedad pendiente, p.ej. S.A.S.]<br />
                    <strong>Correo electrónico:</strong> comboxplora@gmail.com<br />
                    <strong>Domicilio:</strong> Barranquilla, Colombia
                </p>

                <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">2. Finalidad del Tratamiento</h2>
                <p className="text-gray-700 mb-4">
                    Los datos personales recopilados por ComboXplora serán utilizados para las siguientes finalidades:
                </p>
                <ul className="list-disc pl-6 text-gray-700 mb-6 space-y-2">
                    <li>Procesar, confirmar y gestionar las reservas de experiencias culturales.</li>
                    <li>Notificar a los hacedores culturales sobre las reservas y detalles de los usuarios.</li>
                    <li>Enviar información promocional, novedades y actualizaciones de la plataforma (sujeto a consentimiento).</li>
                    <li>Evaluar la calidad de nuestros servicios y realizar encuestas de satisfacción.</li>
                    <li>Cumplir con obligaciones legales o contractuales.</li>
                </ul>

                <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">3. Derechos del Titular</h2>
                <p className="text-gray-700 mb-4">
                    Como titular de los datos personales, le asisten los siguientes derechos:
                </p>
                <ul className="list-disc pl-6 text-gray-700 mb-6 space-y-2">
                    <li>Conocer, actualizar y rectificar sus datos personales frente a ComboXplora.</li>
                    <li>Solicitar prueba de la autorización otorgada al responsable.</li>
                    <li>Ser informado, previa solicitud, respecto del uso que le hemos dado a sus datos.</li>
                    <li>Presentar quejas ante la Superintendencia de Industria y Comercio por infracciones a la ley.</li>
                    <li>Revocar la autorización y/o solicitar la supresión del dato cuando no se respeten los principios, derechos y garantías legales.</li>
                    <li>Acceder en forma gratuita a sus datos personales objeto de tratamiento.</li>
                </ul>

                <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">4. Autorización</h2>
                <p className="text-gray-700 mb-6">
                    Al utilizar la plataforma ComboXplora y proveer información personal, el usuario autoriza de manera previa, expresa e informada el tratamiento de sus datos personales conforme a las finalidades aquí descritas.
                </p>

                <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">5. Consultas y Reclamos</h2>
                <p className="text-gray-700 mb-6">
                    Los titulares o sus causahabientes que deseen realizar consultas o reclamos respecto de su información personal, pueden comunicarse a través de nuestro correo electrónico <strong>comboxplora@gmail.com</strong>. Toda solicitud será atendida en los plazos estipulados por la Ley 1581 de 2012.
                </p>

                <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">6. Seguridad de la Información</h2>
                <p className="text-gray-700 mb-6">
                    ComboXplora adopta las medidas técnicas, humanas y administrativas necesarias para otorgar seguridad a los registros evitando su adulteración, pérdida, consulta, uso o acceso no autorizado o fraudulento.
                </p>

                <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">7. Vigencia</h2>
                <p className="text-gray-700 mb-6">
                    La presente política rige a partir de su publicación. Las bases de datos en las que se registrarán los datos personales tendrán una vigencia igual al tiempo en que se mantengan y utilicen para las finalidades descritas, conservándolas durante el tiempo razonable y necesario de acuerdo con las finalidades que justificaron el tratamiento.
                </p>
            </div>
        </main>
    );
}
