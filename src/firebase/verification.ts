// Función simulada para enviar código de verificación
export const enviarCodigoVerificacion = async (celular: string, email: string) => {
    try {
      // Simulamos un delay para hacer parecer que se está enviando el código
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log(`[SIMULACIÓN] Código de verificación enviado a ${celular} y ${email}`);
      return true;
    } catch (error) {
      console.error('Error al enviar código:', error);
      return true; // Por ahora siempre retornamos true para pruebas
    }
  };
  
  // Función simulada para verificar código
  export const verificarCodigos = async (codigo: string) => {
    try {
      // Simulamos un delay para hacer parecer que se está verificando el código
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Verificamos que el código tenga 6 dígitos
      const codigoValido = /^\d{6}$/.test(codigo);
      
      return codigoValido;
    } catch (error) {
      console.error('Error al verificar código:', error);
      return true; // Por ahora siempre retornamos true para pruebas
    }
  };