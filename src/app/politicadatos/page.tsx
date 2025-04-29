'use client';
import Link from 'next/link';

export default function PoliticaDatos() {
  return (
    <main className="min-h-screen relative">
      {/* Fondo de video */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        >
          <source src="/videos/background.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/70" />
      </div>

      {/* Contenido */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 py-12">
        {/* Botón de regreso */}
        <Link 
          href="/" 
          className="inline-flex items-center text-white mb-8 hover:scale-105 transition-transform"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 mr-2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Volver
        </Link>

        <div className="bg-black/30 backdrop-blur-sm p-8 rounded-2xl border border-white/10">
          <h1 className="text-3xl font-bold text-white mb-8">Política de Tratamiento de Datos</h1>
          
          <div className="space-y-6 text-gray-200">
            <section>
              <h2 className="text-xl font-semibold text-white mb-4">1. Introducción</h2>
              <p>
                ACGURA está comprometida con la protección de la privacidad y los datos personales de nuestros usuarios. Esta política describe cómo recolectamos, usamos y protegemos su información personal.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">2. Datos que Recolectamos</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Información de identificación personal (nombre, número de documento)</li>
                <li>Información de contacto (correo electrónico)</li>
                <li>Información de acceso (PIN)</li>
                <li>Información relacionada con seguros y pólizas</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">3. Uso de la Información</h2>
              <p>Utilizamos su información personal para:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Gestionar su cuenta y acceso a nuestros servicios</li>
                <li>Procesar y gestionar sus pólizas de seguro</li>
                <li>Comunicarnos con usted sobre nuestros servicios</li>
                <li>Cumplir con requisitos legales y regulatorios</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">4. Protección de Datos</h2>
              <p>
                Implementamos medidas de seguridad técnicas y organizativas para proteger sus datos personales contra acceso no autorizado, pérdida o alteración.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">5. Sus Derechos</h2>
              <p>Usted tiene derecho a:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Acceder a sus datos personales</li>
                <li>Solicitar la corrección de datos inexactos</li>
                <li>Solicitar la eliminación de sus datos</li>
                <li>Oponerse al procesamiento de sus datos</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">6. Contacto</h2>
              <p>
                Para ejercer sus derechos o realizar consultas sobre esta política, puede contactarnos a través de nuestros canales oficiales de atención.
              </p>
            </section>
          </div>

          <footer className="mt-12 pt-6 border-t border-white/10 text-center text-gray-400 text-sm">
          ACgura © - Una marca registrada de DataPaga® 2023 - Todos los derechos reservados
          </footer>
        </div>
      </div>
    </main>
  );
}