import React, { useRef, useState, useEffect } from 'react';
import { Minus, Plus, Check, AlertCircle } from 'lucide-react';
import { triggerHaptic } from '../../utils/haptics';

interface StepperProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
}

export const Stepper: React.FC<StepperProps> = ({
  value,
  onChange,
  min = 1,
  max = 999,
  size = 'md',
  disabled = false
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceTimerRef = useRef<number | null>(null);
  const [localValue, setLocalValue] = useState(String(value));
  const [isValid, setIsValid] = useState(true);
  const [showFeedback, setShowFeedback] = useState(false);

  // Sync local value when external value changes
  useEffect(() => {
    setLocalValue(String(value));
    setIsValid(true);
    setShowFeedback(false);
  }, [value]);

  const validateValue = (val: string): boolean => {
    if (val === '') return false;
    const num = parseInt(val, 10);
    return !isNaN(num) && num >= min && num <= max;
  };

  const handleDecrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    triggerHaptic(10);
    if (value > min) {
      onChange(value - 1);
    }
  };

  const handleIncrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    triggerHaptic(10);
    if (value < max) {
      onChange(value + 1);
    }
  };

  const handleFocus = () => {
    triggerHaptic(8);
    setShowFeedback(false);
    setTimeout(() => {
      inputRef.current?.select();
    }, 0);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    
    // Allow only digits
    if (!/^\d*$/.test(val)) return;
    
    setLocalValue(val);
    const valid = validateValue(val);
    setIsValid(valid);
    setShowFeedback(val !== '');

    // Clear previous timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Debounce onChange
    if (val !== '' && valid) {
      debounceTimerRef.current = window.setTimeout(() => {
        const num = parseInt(val, 10);
        onChange(num);
        triggerHaptic(5);
      }, 400);
    }
  };

  const handleBlur = () => {
    setShowFeedback(false);
    
    // Clear pending debounce
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    const val = parseInt(localValue, 10);
    if (isNaN(val) || val < min || val > max) {
      // Invalid: restore current value
      setLocalValue(String(value));
      setIsValid(true);
    } else if (val !== value) {
      // Valid but different: apply immediately
      onChange(val);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      const val = parseInt(localValue, 10);
      if (!isNaN(val) && val >= min && val <= max) {
        onChange(val);
      }
      e.currentTarget.blur();
    }
  };

  const sizeClasses = {
    sm: {
      btn: 'w-6 h-6 text-xs',
      input: 'w-8 h-6 text-xs',
      container: 'p-0.5',
      icon: 'w-2.5 h-2.5'
    },
    md: {
      btn: 'w-8 h-8 text-sm',
      input: 'w-10 h-8 text-sm font-semibold',
      container: 'p-1',
      icon: 'w-3 h-3'
    },
    lg: {
      btn: 'w-10 h-10 text-base',
      input: 'w-14 h-10 text-base font-bold',
      container: 'p-1',
      icon: 'w-3.5 h-3.5'
    }
  }[size];

  const getBorderColor = () => {
    if (!showFeedback) return 'border-slate-200 dark:border-slate-700/80';
    return isValid 
      ? 'border-emerald-500 dark:border-emerald-600' 
      : 'border-rose-500 dark:border-rose-600';
  };

  return (
    <div
      className={`inline-flex items-center bg-slate-100 dark:bg-slate-800/90 rounded-xl border transition-colors ${getBorderColor()} ${sizeClasses.container} ${
        disabled ? 'opacity-50 pointer-events-none' : ''
      }`}
      onClick={(e) => e.stopPropagation()}
    >
      <button
        type="button"
        onClick={handleDecrement}
        disabled={value <= min || disabled}
        className={`${sizeClasses.btn} flex items-center justify-center rounded-lg bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 shadow-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-600 transition-all active:scale-95`}
        aria-label="Diminuir"
      >
        <Minus className="w-3.5 h-3.5" />
      </button>

      <div className="relative flex items-center">
        <input
          ref={inputRef}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          value={localValue}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          className={`${sizeClasses.input} text-center bg-transparent border-none focus:outline-none text-slate-800 dark:text-slate-100 disabled:cursor-not-allowed`}
        />
        
        {showFeedback && (
          <div className="absolute -right-4 top-1/2 -translate-y-1/2">
            {isValid ? (
              <Check className={`${sizeClasses.icon} text-emerald-600 dark:text-emerald-500`} />
            ) : (
              <AlertCircle className={`${sizeClasses.icon} text-rose-600 dark:text-rose-500`} />
            )}
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={handleIncrement}
        disabled={value >= max || disabled}
        className={`${sizeClasses.btn} flex items-center justify-center rounded-lg bg-emerald-600 dark:bg-emerald-600 text-white shadow-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-emerald-500 transition-all active:scale-95`}
        aria-label="Aumentar"
      >
        <Plus className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
