import React from 'react';
import ToggleSwitch from './ToggleSwitch';

type CalendarHeaderProps = {
  title?: string;
  showPsych: boolean;
  setShowPsych: (v: boolean) => void;
  showPhys: boolean;
  setShowPhys: (v: boolean) => void;
  psychLabel?: string;
  physLabel?: string;
  psychColor?: string;
  physColor?: string;
};

const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  title = "Daily stress trend calendar",
  showPsych,
  setShowPsych,
  showPhys,
  setShowPhys,
  psychLabel = "Perceived stress score",
  physLabel = "Physiological stress score",
  psychColor = "#A78BFA",
  physColor = "#F59E0B",
}) => (
  <div className="mb-6 flex flex-col justify-between">
    <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
    <div className="w-full flex flex-col items-end gap-2 mt-6">
      <div className="mr-[19px]">
        <ToggleSwitch
          active={showPsych}
          onToggle={() => setShowPsych(!showPsych)}
          color={psychColor}
          label={psychLabel}
        />
      </div>
      <ToggleSwitch
        active={showPhys}
        onToggle={() => setShowPhys(!showPhys)}
        color={physColor}
        label={physLabel}
      />
    </div>
  </div>
);

export default CalendarHeader;
