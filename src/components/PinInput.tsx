'use client';
import { useState, useRef, useEffect } from 'react';

interface PinInputProps {
  onChange: (pin: string) => void;
  onComplete?: () => void;
  autoFocus?: boolean;
}

export default function PinInput({ onChange, onComplete, autoFocus = false }: PinInputProps) {
  const [pin, setPin] = useState(['', '', '', '']);
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    if (autoFocus && inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [autoFocus]);

  const handleChange = (index: number, value: string) => {
    // Solo permitir números
    if (!/^\d*$/.test(value)) return;

    const newPin = [...pin];
    newPin[index] = value;
    setPin(newPin);

    // Notificar el cambio al componente padre
    onChange(newPin.join(''));

    // Si se completó el PIN, notificar al componente padre
    if (newPin.every(digit => digit !== '') && onComplete) {
      onComplete();
    }

    // Mover el foco al siguiente input si hay un valor
    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Si se presiona backspace y el input está vacío, mover el foco al input anterior
    if (e.key === 'Backspace' && !pin[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text');
    const numbers = pastedData.replace(/\D/g, '').split('').slice(0, 4);

    if (numbers.length === 4) {
      setPin(numbers);
      onChange(numbers.join(''));
      if (onComplete) {
        onComplete();
      }
    }
  };

  return (
    <div className="flex justify-center space-x-2">
      {pin.map((digit, index) => (
        <input
          key={index}
          ref={(el: HTMLInputElement | null) => {
            inputRefs.current[index] = el;
          }}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={1}
          value={digit}
          onChange={e => handleChange(index, e.target.value)}
          onKeyDown={e => handleKeyDown(index, e)}
          onPaste={handlePaste}
          className="w-12 h-12 text-center text-2xl bg-white/10 border-2 border-white/20 rounded-lg text-white placeholder-gray-400 focus:border-white/40 focus:outline-none transition-colors"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
        />
      ))}
    </div>
  );
}