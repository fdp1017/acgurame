'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { IoArrowBack } from 'react-icons/io5';

export default function PoliticaDatos() {
  return (
    <main className="min-h-screen flex flex-col items-center relative overflow-hidden">
      {/* Video Background */}
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

      {/* Content */}
      <div className="relative z-10 w-full max-w-4xl px-4 py-8">
        {/* Header */}
        <div className="w-full flex items-center justify-between mb-12">
          <Link href="/login" className="text-white hover:scale-110 transition-transform flex items-center gap-2">
            <IoArrowBack size={24} />
            <span>Volver</span>
          </Link>
          
          <div className="w-48 h-48 relative group">
            <div className="absolute inset-0 bg-white/10 rounded-full blur-xl group-hover:bg-white/20 transition-all duration-500"></div>
            <Image
              src="/images/logo/ac-gura-high-resolution-logo-transparent.png"
              alt="ACgura Logo"
              fill
              className="object-contain brightness-125 drop-shadow-[0_0_15px_rgba(255,255,255,0.5)] group-hover:scale-105 transition-transform duration-500"
              priority
            />
          </div>
          <div className="w-8" />
        </div>

        {/* Content */}
        <div className="w-full backdrop-blur-sm bg-black/30 p-8 rounded-2xl border border-white/10 shadow-[0_0_15px_rgba(255,255,255,0.1)]">
          <h1 className="text-3xl text-white font-bold text-center mb-8">
            Política de Tratamiento de Datos Personales
          </h1>

          <div className="prose prose-invert max-w-none">
            <section className="mb-8">
              <h2 className="text-xl text-white font-semibold mb-4">1. Introducción</h2>
              <p className="text-gray-300 mb-4">
                En cumplimiento de la Ley 1581 de 2012 y el Decreto 1377 de 2013, ACgura establece la siguiente política de tratamiento de datos personales, con el fin de garantizar el derecho constitucional que tienen todas las personas a conocer, actualizar y rectificar las informaciones que se hayan recogido sobre ellas en bases de datos o archivos.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl text-white font-semibold mb-4">2. Objetivo</h2>
              <p className="text-gray-300 mb-4">
                Establecer los lineamientos generales para el tratamiento de datos personales en ACgura, asegurando el cumplimiento de la normativa vigente y la protección de los derechos de los titulares de la información.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl text-white font-semibold mb-4">3. Alcance</h2>
              <p className="text-gray-300 mb-4">
                Esta política aplica a todos los datos personales registrados en cualquier base de datos que haga el tratamiento de los mismos en ACgura.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl text-white font-semibold mb-4">4. Responsable del Tratamiento</h2>
              <p className="text-gray-300 mb-4">
                ACgura es el responsable del tratamiento de los datos personales. Para cualquier consulta relacionada con el tratamiento de sus datos personales, puede contactarnos a través de:
              </p>
              <ul className="list-disc list-inside text-gray-300 ml-4">
                <li>Correo electrónico: [correo@acgura.com]</li>
                <li>Teléfono: [número de teléfono]</li>
                <li>Dirección: [dirección física]</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl text-white font-semibold mb-4">5. Derechos del Titular</h2>
              <p className="text-gray-300 mb-4">
                Como titular de los datos personales, usted tiene derecho a:
              </p>
              <ul className="list-disc list-inside text-gray-300 ml-4">
                <li>Conocer, actualizar y rectificar sus datos personales</li>
                <li>Solicitar prueba de la autorización otorgada</li>
                <li>Ser informado sobre el uso de sus datos personales</li>
                <li>Solicitar copia de sus datos personales</li>
                <li>Revocar la autorización y/o solicitar la supresión de los datos</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl text-white font-semibold mb-4">6. Finalidad del Tratamiento</h2>
              <p className="text-gray-300 mb-4">
                Los datos personales serán tratados para las siguientes finalidades:
              </p>
              <ul className="list-disc list-inside text-gray-300 ml-4">
                <li>Gestión de seguros y servicios relacionados</li>
                <li>Procesamiento de pagos y transacciones</li>
                <li>Comunicación sobre servicios y productos</li>
                <li>Mejora continua de nuestros servicios</li>
                <li>Cumplimiento de obligaciones legales</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl text-white font-semibold mb-4">7. Seguridad</h2>
              <p className="text-gray-300 mb-4">
                ACgura implementa medidas técnicas, humanas y administrativas necesarias para garantizar la seguridad de los datos personales, evitando su adulteración, pérdida, consulta, uso o acceso no autorizado.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl text-white font-semibold mb-4">8. Vigencia</h2>
              <p className="text-gray-300 mb-4">
                La presente política de tratamiento de datos personales rige a partir de su publicación y deroga cualquier disposición que le sea contraria.
              </p>
            </section>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center text-gray-400 text-sm mt-8">
        ACgura © - Una marca registrada de DataPaga® 2023 - Todos los derechos reservados
        </footer>
      </div>
    </main>
  );
}