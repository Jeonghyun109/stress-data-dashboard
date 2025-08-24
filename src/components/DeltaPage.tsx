import Barchart from "./Barchart";
import Treemap from "./Treemap";

const DeltaPage: React.FC<{ pid: string }> = ({ pid }) => {
  // const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  return (
    <>
      <div>
        <div className="font-semibold text-3xl">지난 한 달 동안, 당신은 왜 스트레스를 받았나요?</div>
        <div className="flex flex-col gap-8 items-start">
          {/* Barchart */}
          {pid && <Barchart pid={pid} />}
        </div>
      </div>
    </>
  );
};

export default DeltaPage;
