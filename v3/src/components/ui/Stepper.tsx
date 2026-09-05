import React from 'react';
import { Minus, Plus } from 'lucide-react';
import { triggerHaptic } from '../../utils/haptics';

interface StepperProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
}

export const Stepper: React.FC<StepperProps> = ({
  value,
  onChange,
  min = 1,
  max = 999,
  size = 'md'
}) => {
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    if (!isNaN(val)) {
      onChange(Math.max(min, Math.min(max, val)));
    }
  };

  const sizeClasses = {
    sm: {
      btn: 'w-6 h-6 text-xs',
      input: 'w-8 h-6 text-xs',
      container: 'p-0.5'
    },
    md: {
      btn: 'w-8 h-8 text-sm',
      input: 'w-10 h-8 text-sm font-semibold',
      container: 'p-1'
    },
    lg: {
      btn: 'w-10 h-10 text-base',
      input: 'w-14 h-10 text-base font-bold',
      container: 'p-1'
    }
  }[size];

  return (
    <div
      className={`inline-flex items-center bg-slate-100 dark:bg-slate-800/90 rounded-xl border border-slate-200 dark:border-slate-700/80 ${sizeClasses.container}`}
      onClick={(e) => e.stopPropagation()}
    >
      <button
        type="button"
        onClick={handleDecrement}
        disabled={value <= min}
        className={`${sizeClasses.btn} flex items-center justify-center rounded-lg bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 shadow-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors active:scale-95`}
        aria-label="Diminuir"
      >
        <Minus className="w-3.5 h-3.5" />
      </button>

      <input
        type="number"
        value={value}
        onChange={handleInputChange}
        min={min}
        max={max}
        className={`${sizeClasses.input} text-center bg-transparent border-none focus:outline-none text-slate-800 dark:text-slate-100 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
      />

      <button
        type="button"
        onClick={handleIncrement}
        disabled={value >= max}
        className={`${sizeClasses.btn} flex items-center justify-center rounded-lg bg-emerald-600 dark:bg-emerald-600 text-white shadow-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-emerald-500 transition-colors active:scale-95`}
        aria-label="Aumentar"
      >
        <Plus className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
