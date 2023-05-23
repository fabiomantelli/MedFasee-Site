"use client";
import Image from "next/image";
import { useState, useEffect, useMemo } from "react";
import axios from "axios";
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
  const baseUrl = "/historian/timeseriesdata/read/current";
  const endUrl = `${baseUrl}/${phasorModuleAngleStatusFlags.join(",")}/json`;
  const res = await fetch(`http://${process.env.API_URL}:6152${endUrl}`);
}

export default async function Home() {
  // const [data, setData] = useState<PMUDataProps[]>([]);
  // const [option, setOption] = useState("ufpa");

  // const handleOption = (e: React.ChangeEvent<HTMLSelectElement>) => {
  //   setOption(e.target.value);
  // };

  const pmus1 = useMemo(() => [...getPmus1()], []);
  const pmus2 = useMemo(() => [...getPmus2()], []);

  const baseUrl = "/api/historian/timeseriesdata/read/current";

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

  const API_URL = `${baseUrl}/${phasorModuleAngleStatusFlags.join(",")}/json`;
  const API_URL2 = `${baseUrl}/${phasorModuleAngleStatusFlags2.join(",")}/json`;

  const res = await getData(phasorModuleAngleStatusFlags)
  console.log(res)

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const res = await axios.get(API_URL);
  //       const jsonData = res.data.TimeSeriesDataPoints;

  //       const now = new Date();
  //       const tenSecondsAgo = new Date(now.getTime() - 10000); // 10000 ms = 10 seconds
  //       const utcTime = tenSecondsAgo.toISOString(); // format as ISO string

  //       let i = 0;
  //       pmus1.forEach((university) => {
  //         university.phasorModule = jsonData[i].Value;
  //         university.phasorAngle = jsonData[i + 1].Value;
  //         university.statusFlags = jsonData[i + 2].Value;
  //         university.utcDate = jsonData[i].Time;
  //         i += 3;
  //       });

  //       const voltage = pmus1.filter(
  //         (university) =>
  //           (university.statusFlags === 64 || university.statusFlags === 0) &&
  //           new Date(university.utcDate) >= new Date(utcTime)
  //       );

  //       const res2 = await axios.get(API_URL2);
  //       const jsonData2 = res2.data.TimeSeriesDataPoints;

  //       i = 0;
  //       pmus2.forEach((university) => {
  //         university.phasorModule = jsonData2[i].Value;
  //         university.phasorAngle = jsonData2[i + 1].Value;
  //         university.statusFlags = jsonData2[i + 2].Value;
  //         university.utcDate = jsonData2[i].Time;
  //         i += 3;
  //       });

  //       const voltage2 = pmus2.filter(
  //         (university) =>
  //           (university.statusFlags === 64 || university.statusFlags === 0) &&
  //           new Date(university.utcDate) > new Date(utcTime)
  //       );

  //       const allPmus = voltage.concat(voltage2);
  //       setData(allPmus);
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   };

  //   const interval = setInterval(fetchData, 1000);

  //   return () => clearInterval(interval);
  // }, [API_URL, API_URL2, pmus1, pmus2]);

  return (
    <main>
      <div>
        <MapComponent />
        <div className="absolute top-20 pl-8">
          <h1>Sistema Interligado Nacional</h1>
          <h2>Fasores de Sequência Positiva</h2>
          {/* {data.length > 0 ? (
            <FullScreenComponent
              data={data}
              option={option}
              handleOption={handleOption}
            />
          ) : (
            <p>Carregando...</p>
          )} */}
          {/* <select
            onChange={handleOption}
            value={option}
            className="px-4 py-2 bg-orange-500 text-white border-2 border-orange-600 rounded-md"
          >
            <option disabled>Select</option> */}

            {/* {data.map((university) => {
              return (
                <option
                  value={university.university}
                  key={university.university}
                >
                  {university.university}
                </option>
              );
            })}
          </select> */}
        </div>
        <div className="absolute bottom-10 flex">
          <Image src="/images/ufsc.png" alt="UFSC" width={100} height={100} />
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
        </div>
      </div>
    </main>
  );
}
