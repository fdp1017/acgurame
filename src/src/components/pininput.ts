'use client';
import React, { useState, useRef, KeyboardEvent, ClipboardEvent } from 'react';

interface PinInputProps {
  length?: number;
  onChange: (pin: string) => void;
}

const PinInput: React.FC<PinInputProps> = ({ length = 4, onChange }) => {
  const [values, setValues] = useState<string[]>(Array(length).fill(''));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Inicializar refs
  if (inputRefs.current.length !== length) {
    inputRefs.current = Array(length).fill(null);
  }

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return; // Solo permitir números

    const newValues = [...values];
    newValues[index] = value.slice(-1); // Tomar solo el último dígito
    setValues(newValues);
    
    // Llamar al callback con el nuevo PIN
    onChange(newValues.join(''));

    // Mover al siguiente input si hay un valor
    if (value && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !values[index] && index > 0) {
      // Si está vacío y presiona backspace, ir al anterior
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, length);
    if (!/^\d*$/.test(pastedData)) return; // Solo permitir números

    const newValues = [...values];
    pastedData.split('').forEach((char, index) => {
      if (index < length) {
        newValues[index] = char;
      }
    });
    setValues(newValues);
    onChange(newValues.join(''));

    // Mover el foco al último número pegado
    if (pastedData.length < length) {
      inputRefs.current[pastedData.length]?.focus();
    } else {
      inputRefs.current[length - 1]?.focus();
    }
  };

  return (
    <div className="flex gap-2 justify-center">
      {values.map((value, index) => (
        <input
          key={index}
          ref={el => inputRefs.current[index] = el}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value}
          onChange={e => handleChange(index, e.target.value)}
          onKeyDown={e => handleKeyDown(index, e)}
          onPaste={handlePaste}
          className="w-12 h-12 text-center border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none text-xl"
        />
      ))}
    </div>
  );
};

export default PinInput;