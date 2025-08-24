import Calendar from "@/components/Calendar";
import Timeline from "@/components/Timeline";
import Treemap from "@/components/Treemap";
import Barchart from "@/components/Barchart";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { CONTENT } from "@/data/stressType";
import { CONTENT as TIME_CONTENT } from "@/data/stressTime";

/*
  TODOs
  1. 아이콘 추가
*/
const StressType: React.FC = () => {
  return (
    <div className="mb-8">
      <div className="font-semibold text-3xl">{CONTENT.TITLE}</div>
      <div className="my-4 flex flex-row gap-24">
        <div className="w-1/2">
          <button className="font-semibold text-2xl">
            <span className="text-violet-500">{CONTENT.BODY_1.TITLE}</span>
          란?
          </button>
          <div className="mt-4">
            {CONTENT.BODY_1.DESCRIPTION.map((item, index) => (
              <span key={index} style={{ fontWeight: item.BOLD ? 'bold' : 'normal' }}>
                {item.TXT}
              </span>
            ))}
          </div>
        </div>
        <div className="w-1/2">
          <button className="font-semibold text-2xl">
            <span className="text-orange-500">{CONTENT.BODY_2.TITLE}</span>
            란?
          </button>
          <div className="mt-4">
            {CONTENT.BODY_2.DESCRIPTION.map((item, index) => (
              <span key={index} style={{ fontWeight: item.BOLD ? 'bold' : 'normal' }}>
                {item.TXT}
              </span>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

const Home: React.FC = () => {
  const router = useRouter();
  const [pid, setPid] = useState<string | undefined>(undefined);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  console.log("PID ",pid)

  useEffect(() => {
    setPid(router.query.pid as string | undefined);
  }, [router.query.pid]);

  return (
    <>
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-7xl mx-auto mt-6 flex flex-col gap-6">
        <StressType />
        {/* TODO - Add Mode Buttons */}
        <div>
          <div className="font-semibold text-3xl">{TIME_CONTENT.TITLE}</div>
          <div className="flex gap-8 items-start">
          {/* Calendar */}
          <div className="flex-shrink-0">
            <Calendar selectedDate={selectedDate} setSelectedDate={setSelectedDate} pid={pid}/>
          </div>
          
          {/* Timeline */}
          <div className="flex-1">
            {/* {selectedDate && <Timeline selectedDate={selectedDate} pid={pid}/>} */}
          </div>
        </div>
        </div>
        <div>
          <div className="font-semibold text-3xl">지난 한 달 동안, 당신은 왜 스트레스를 받았나요?</div>
          <div className="flex flex-col gap-8 items-start">
            {/* Treemap */}
            {pid && <Treemap pid={pid} />}
            {/* Barchart */}
            {pid && <Barchart pid={pid} />}
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
export default Home;