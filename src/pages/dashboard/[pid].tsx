import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { CONTENT } from "@/data/stressType";
import StressPage from "@/components/StatePage";
import DeltaPage from "@/components/DeltaPage";
/*
  TODOs
  1. 아이콘 추가
*/
const StressType: React.FC = () => {
  return (
    <div className="mb-8">
      <div className="font-semibold text-3xl">{CONTENT.TITLE}</div>
      <div className="my-4 flex flex-row gap-24">
        <div className="w-1/2 pr-8">
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
        <div className="w-1/2 pr-8">
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
  const [isDeltaMode, setDeltaMode] = useState<boolean>(false);

  useEffect(() => {
    setPid(router.query.pid as string | undefined);
  }, [router.query.pid]);

  return (
    <>
      <div className="min-h-screen bg-white p-8">
        <div className="max-w-7xl mx-auto mt-6 flex flex-col gap-6">
          <StressType />
          <div className="flex flex-row gap-4">
            <button className={`font-semibold text-xl cursor-pointer px-4 py-2 border-1 rounded-md border-gray-200 ${!isDeltaMode ? 'bg-blue-100' : ''}`} onClick={() => setDeltaMode(false)}>
              <span className="">상태 모드</span>
            </button>
            <button className={`font-semibold text-xl cursor-pointer px-4 py-2 border-1 rounded-md border-gray-200 ${isDeltaMode ? 'bg-blue-100' : ''}`} onClick={() => setDeltaMode(true)}>
              <span>변화 모드</span>
            </button>
          </div>
          {pid && isDeltaMode && <DeltaPage pid={pid} />}
          {pid && !isDeltaMode && <StressPage pid={pid} />}
        </div>
      </div>
    </>
  );
}
export default Home;