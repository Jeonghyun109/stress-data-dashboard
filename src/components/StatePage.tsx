import { useState } from "react";
import Calendar from "./Calendar";
import Treemap from "./Treemap";
import { CONTENT } from "@/data/stressWhy";
import Timeline from "./Timeline";

const StressPage: React.FC<{ pid: string }> = ({ pid }) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  return (
    <>
      <div>
        <div className="font-semibold text-3xl">{CONTENT.TITLE}</div>
        <div className="flex gap-8 items-start">
          {/* Calendar */}
          <div className="flex-shrink-0">
            <Calendar selectedDate={selectedDate} setSelectedDate={setSelectedDate} pid={pid} />
          </div>

          {/* Timeline */}
          <div className="flex-1">
            {selectedDate && <Timeline selectedDate={selectedDate} pid={pid} />}
          </div>
        </div>
      </div>
      <div>
        <div className="font-semibold text-3xl">지난 한 달 동안, 당신은 왜 스트레스를 받았나요?</div>
        <div className="flex flex-col gap-8 items-start">
          {/* Treemap */}
          {pid && <Treemap pid={pid} />}
        </div>
      </div>
    </>
  );
};

export default StressPage;
