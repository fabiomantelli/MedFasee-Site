import { useState } from "react";
import PolarPlot from "./PolarPlot";

interface FullScreenComponentProps {
  data: PMUDataProps[];
  option: any;
  handleOption: any;
}

interface PMUDataProps {
  university: string;
  utcDate: string;
  ppaModule: number;
  ppaAngle: number;
  ppaStatusFlags: number;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  phasorModule: number;
  phasorAngle: number;
  statusFlags: number;
  base: number;
}

const FullScreenComponent = ({
  data,
  option,
  handleOption,
}: FullScreenComponentProps) => {
  console.log(`data int FullScreen: ${JSON.stringify(data)}`)
  console.log(`option: ${option}`)
  const [isOpen, setIsOpen] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const handleFullScreenClick = () => {
    setIsFullScreen(true);
    setIsOpen(true);
  };

  const handleModalClose = () => {
    setIsFullScreen(false);
    setIsOpen(false);
  };

  return (
    <div className="absolute top-10">
      <div onClick={handleFullScreenClick}>
        <PolarPlot data={data} option={option} width={400} height={400} />
      </div>
      {isOpen && (
        <div className="fixed inset-0 bg-cyan-400">
          <div className="absolute inset-0 bg-transparent backdrop-blur-15">
            <div className="flex justify-center">
              <div className="text-white">
                <center>
                  Gráfico Polar do SIN (Sistema Interligado Nacional)
                </center>
              </div>
            </div>
            <div className="flex justify-center">
              <PolarPlot data={data} option={option} width={600} height={600} />
            </div>
            <div className="flex justify-center">
              <select
                placeholder="Select"
                onChange={handleOption}
                value={option}
                className="px-4 py-2 bg-orange-500 text-white border-2 border-orange-600 rounded-md"
              >
                {data &&
                  data.map((university) => (
                    <option
                      value={university.university}
                      key={university.university}
                    >
                      {university.university}
                    </option>
                  ))}
              </select>
            </div>
            <div className="flex justify-center">
              <button
                onClick={handleModalClose}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FullScreenComponent;
