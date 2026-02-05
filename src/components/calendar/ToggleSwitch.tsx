import React from 'react';

type ToggleSwitchProps = {
  active: boolean;
  onToggle: () => void;
  color?: string;
  label: string;
};

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ active, onToggle, color = '#2563EB', label }) => {
  const bgActive = color;
  const bgInactive = '#E5E7EB';
  return (
    <button
      onClick={onToggle}
      aria-pressed={active}
      className="flex items-center gap-3 cursor-pointer focus:outline-none"
    >
      <span
        className="w-9 h-5 rounded-full relative transition-colors duration-150"
        style={{ backgroundColor: active ? bgActive : bgInactive }}
      >
        <span
          className="block w-3 h-3 bg-white rounded-full absolute top-1 transition-transform duration-150"
          style={{ transform: active ? 'translateX(20px)' : 'translateX(3px)' }}
        />
      </span>
      <span className={`text-sm ${active ? 'text-gray-800' : 'text-gray-500'}`}>{label}</span>
    </button>
  );
};

export default ToggleSwitch;
