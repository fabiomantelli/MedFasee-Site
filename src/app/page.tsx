// "use client";
import Image from "next/image";
import MapComponent from "./components/MapComponent";

import { getPmus1, getPmus2 } from "./data/phasorData";
import FullScreenComponent from "./components/FullScreenComponent";

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

async function getData(phasorModuleAngleStatusFlags: any) {
  const baseUrl = "/api/historian/timeseriesdata/read/current";
  const endUrl = `${baseUrl}/${phasorModuleAngleStatusFlags.join(",")}/json`;
  const res = await fetch(endUrl);

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }
  return res.json();
}

export default async function Home() {
  const pmus1 = [...getPmus1()]
  let phasorModuleAngleStatusFlags: number[] = [];
  pmus1.forEach((university) => {
    phasorModuleAngleStatusFlags.push(
      university.ppaModule,
      university.ppaAngle,
      university.ppaStatusFlags
    );
  });

  const data = await getData(phasorModuleAngleStatusFlags)
  console.log(`data: ${JSON.stringify(data)}`)
  // const [data, setData] = useState<PMUDataProps[]>([]);
  // const [option, setOption] = useState("ufpa");

  return (
    <main>
      <div>
        <h1>Teste</h1>
        {/* <MapComponent />
        <div className="absolute top-20 pl-8">
          <h1>Sistema Interligado Nacional</h1>
          <h2>Fasores de Sequência Positiva</h2>
          {jsonRes.length > 0 ? (
            <FullScreenComponent
              data={jsonRes}
              // option={option}
              option='Teste'
              handleOption={handleOption}
            />
          ) : (
            <p>Carregando...</p>
          )}
          <select
            onChange={handleOption}
            // value={option}
            value="Teste"
            className="px-4 py-2 bg-orange-500 text-white border-2 border-orange-600 rounded-md"
          >
            <option disabled>Select</option>

            {data.map((university) => {
              return (
                <option
                  value={university.university}
                  key={university.university}
                >
                  {university.university}
                </option>
              );
            })}
          </select>
        </div>
        <div className="absolute bottom-10 flex">
          <Image
            src="/images/ufsc.png"
            alt="UFSC"
            width={100}
            height={100}
            priority
          />
          <Image
            src="/images/labplan.png"
            alt="LabPlan"
            width={100}
            height={100}
          />
          <Image
            src="/images/inesc_brasil.png"
            alt="Inesc Brasil"
            width={100}
            height={100}
          />
          <Image src="/images/feesc.png" alt="Feesc" width={100} height={100} />
          <Image src="/images/ons.jpeg" alt="ONS" width={100} height={100} />
        </div> */}
      </div>
    </main>
  )
  

  async function handleData(
    res: any,
    pmus1: any,
    pmus2: any,
    phasorModuleAngleStatusFlags2: any
  ) {
    const data = res.TimeSeriesDataPoints;
    const now = new Date();
    const tenSecondsAgo = new Date(now.getTime() - 10000); // 10000 ms = 10 seconds
    const utcTime = tenSecondsAgo.toISOString(); // format as ISO string

    let i = 0;
    pmus1.forEach((university: any) => {
      university.phasorModule = data[i].Value;
      university.phasorAngle = data[i + 1].Value;
      university.statusFlags = data[i + 2].Value;
      university.utcDate = data[i].Time;
      i += 3;
    });

    const voltage = pmus1.filter(
      (university: any) =>
        (university.statusFlags === 64 || university.statusFlags === 0) &&
        new Date(university.utcDate) >= new Date(utcTime)
    );

    const baseUrl = "/historian/timeseriesdata/read/current";
    const API_URL2 = `${baseUrl}/${phasorModuleAngleStatusFlags2.join(
      ","
    )}/json`;
    const res2 = await getData(phasorModuleAngleStatusFlags2);
    const jsonData2 = res2.TimeSeriesDataPoints;

    i = 0;
    pmus2.forEach((university: any) => {
      university.phasorModule = jsonData2[i].Value;
      university.phasorAngle = jsonData2[i + 1].Value;
      university.statusFlags = jsonData2[i + 2].Value;
      university.utcDate = jsonData2[i].Time;
      i += 3;
    });

    const voltage2 = pmus2.filter(
      (university: any) =>
        (university.statusFlags === 64 || university.statusFlags === 0) &&
        new Date(university.utcDate) > new Date(utcTime)
    );

    const allPmus = voltage.concat(voltage2);
    return allPmus;
  }

  function handlePmus() {
    let phasorModuleAngleStatusFlags: number[] = [];
    let phasorModuleAngleStatusFlags2: number[] = [];

    pmus1.forEach((university) => {
      phasorModuleAngleStatusFlags.push(
        university.ppaModule,
        university.ppaAngle,
        university.ppaStatusFlags
      );
    });

    pmus2.forEach((university) => {
      phasorModuleAngleStatusFlags2.push(
        university.ppaModule,
        university.ppaAngle,
        university.ppaStatusFlags
      );
    });
    return { phasorModuleAngleStatusFlags, phasorModuleAngleStatusFlags2 };
  }
}