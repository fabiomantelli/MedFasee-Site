import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

import { Flex, Box } from "@chakra-ui/react";

interface PolarPlotProps {
  data: any;
  option: string;
  width: number;
  height: number;
  isOpen?: boolean;
}

interface PhasorData {
  phasorAngle: number;
  university: string;
}

const PolarPlot = ({ data, option, width, height, isOpen }: PolarPlotProps) => {
  const chartRef = useRef<SVGSVGElement>(null);

  function getTextWidth(text: string, font: string): number {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
  
    if (!context) {
      throw new Error("Could not get 2D context for canvas");
    }
  
    context.font = font;
    const metrics = context.measureText(text);
    return metrics.width;
  }
  
  

  useEffect(() => {
    if (chartRef.current) {
      const svg = d3.select(chartRef.current);
      const width = svg.attr("width") as unknown as number;
      const height = svg.attr("height") as unknown as number;
      const radius = Math.min(width, height) / 2 - 50;

      // create scales for phasorModule and phasorAngle
      const rScale = d3
        .scaleLinear()
        // .domain([0, d3.max(data, d => d.phasorModule)])
        .domain([0, 1])
        .range([0, radius]);

      const angleScale = d3
        .scaleLinear()
        .domain([0, 360])
        .range([0, 2 * Math.PI]);

      // clear the previous plot
      svg.selectAll("*").remove();

      // draw concentric circles
      svg
        .selectAll("circle")
        .data([0.33, 0.66, 1])
        .enter()
        .append("circle")
        .attr("cx", width / 2)
        .attr("cy", height / 2)
        .attr("r", (d) => d * radius)
        .style("fill", "none")
        .style("stroke", "white");

      // draw degrees legend
      const legendGroup = svg
        .append("g")
        .attr("transform", `translate(${width / 2}, ${height / 2})`)
        .style("fill", "black")
        .style("font-size", isOpen ? "12px" : "10px");

      const legendData = [
        { degree: 180, x: -radius - 20, y: 5 },
        {
          degree: 150,
          x: (radius + 25) * Math.cos(angleScale(150)),
          y: -(radius + 25) * Math.sin(angleScale(150)),
        },
        {
          degree: 120,
          x: (radius + 15) * Math.cos(angleScale(120)),
          y: -(radius + 15) * Math.sin(angleScale(120)),
        },
        { degree: 90, x: -10, y: -radius - 10 },
        {
          degree: 60,
          x: (radius + 15) * Math.cos(angleScale(60)),
          y: -(radius + 15) * Math.sin(angleScale(60)),
        },
        {
          degree: 30,
          x: (radius + 10) * Math.cos(angleScale(30)),
          y: -(radius + 10) * Math.sin(angleScale(30)),
        },
        { degree: 0, x: radius + 20, y: -5 },
        {
          degree: 330,
          x: (radius + 25) * Math.cos(angleScale(330)),
          y: -(radius + 25) * Math.sin(angleScale(330)),
        },
        {
          degree: 300,
          x: (radius + 20) * Math.cos(angleScale(300)),
          y: -(radius + 20) * Math.sin(angleScale(300)),
        },
        { degree: 270, x: 10, y: radius + 15 },
        {
          degree: 240,
          x: (radius + 15) * Math.cos(angleScale(240)),
          y: -(radius + 15) * Math.sin(angleScale(240)),
        },
        {
          degree: 210,
          x: (radius + 10) * Math.cos(angleScale(210)),
          y: -(radius + 10) * Math.sin(angleScale(210)),
        },
      ];

      legendGroup
        .selectAll(".legend-text")
        .data(legendData)
        .enter()
        .append("text")
        .attr("class", "legend-text")
        .attr("x", (d) => d.x)
        .attr("y", (d) => d.y)
        .attr("text-anchor", (d) => {
          if (d.degree === 0 || d.degree === 180) {
            return "middle";
          } else if (d.degree < 180) {
            return "start";
          } else {
            return "end";
          }
        })
        .attr("dominant-baseline", (d) => {
          if (d.degree === 90 || d.degree === 270) {
            return "middle";
          } else if (d.degree < 90 || d.degree > 270) {
            return "hanging";
          } else {
            return "alphabetic";
          }
        })
        .text((d) => `${d.degree}°`);

      // draw the phasors
      const phasorGroup = svg
        .append("g")
        .attr("transform", `translate(${width / 2}, ${height / 2})`);

      // let firstPhasor = data[0];
      let firstPhasor = data.filter(
        (d: typeof data[0]) => d.university === option
      )[0];
      const phasorData = data.map((d: typeof data[0]) => ({
        phasorModule: rScale(
          (d.phasorModule * Math.sqrt(3)) / parseInt(d.base)
        ),
        phasorAngle: angleScale(d.phasorAngle - firstPhasor.phasorAngle),
        university: d.university,
      }));

      // create a color scale based on the number of phasors
      const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

      phasorGroup
        .selectAll(".phasor")
        .data<PhasorData>(phasorData)
        .enter()
        .append("g")
        .attr("class", "phasor")
        .call((g) =>
          g
            .append("line")
            .attr("x1", (d) => 0)
            .attr("y1", (d) => 0)
            .attr("x2", isOpen ? (d) => 300 * Math.cos(d.phasorAngle) : 0)
            .attr("y2", isOpen ? (d) => 300 * Math.sin(d.phasorAngle) : 0)
            .style("stroke", "#C2C2C2")
            .style("stroke-width", 0.5)
        )
        .call((g) =>
          g
            .selectAll(".phasor")
            .data(phasorData)
            .enter()
            .append("line")
            .attr("class", "phasor")
            .attr("x1", 0)
            .attr("y1", 0)
            .attr(
              "x2",
              (d: typeof data[0]) => d.phasorModule * Math.cos(d.phasorAngle)
            )
            .attr(
              "y2",
              (d: typeof data[0]) => d.phasorModule * Math.sin(d.phasorAngle)
            )
            .style("stroke", (d, i) => colorScale(i.toString()))
            .style("stroke-width", isOpen ? 4 : 2)
            .attr("marker-end", "url(#arrow)")
        )

        .call((g) =>
          g
            .selectAll(".phasor-text")
            .data<PhasorData>(phasorData)
            .enter()
            .append("text")
            .attr("class", "phasor-text")
            .attr("x", (d) => {
              const offset = 50;
              const angle = d.phasorAngle;
              let x = 300 * Math.cos(angle);
              if (angle >= Math.PI / 2 || angle <= -Math.PI / 2) {
                x -= getTextWidth(d.university, "12px");
              }
              return x;
            })
            .attr("y", (d) => {
              const angle = d.phasorAngle;
              return (
                300 * Math.sin(angle) // ajusta a posição vertical do texto
              );
            })
            .attr("alignment-baseline", "central")
            .style("fill", "white")
            .style("font", "14px sans-serif")
            .text((d) => (isOpen ? d.university : ""))
            .attr("transform", (d) => {
              const angle = (d.phasorAngle * 180) / Math.PI;
              const flip = angle >= 90 || angle <= -90 ? 180 : 0;
              return `rotate(${angle + flip} ${300 * Math.cos(d.phasorAngle)} ${
                300 * Math.sin(d.phasorAngle)
              })`;
            })
        );

      // add arrow markers
      svg
        .append("defs")
        .append("marker")
        .attr("id", "arrow")
        .attr("viewBox", "0 -5 10 10")
        .attr("refX", 8)
        .attr("markerWidth", 4)
        .attr("markerHeight", 4)
        .attr("orient", "auto")
        .append("path")
        .attr("d", "M0,-5L10,0L0,5")
        .style("fill", "black");

      // add horizontal line
      phasorGroup
        .insert("line", ":first-child") // insert as first child
        .attr("x1", -radius)
        .attr("y1", 1)
        .attr("x2", radius)
        .attr("y2", 0)
        .style("stroke", "white")
        .style("stroke-width", 1);

      // add vertical line
      phasorGroup
        .insert("line", ":first-child") // insert as first child
        .attr("x1", 0)
        .attr("y1", -radius)
        .attr("x1", 0)
        .attr("y2", radius)
        .style("stroke", "white")
        .style("stroke-width", 1);
    }
  }, [data, isOpen, option]);

  return (
    <svg
      ref={chartRef}
      viewBox={`0 -70 ${width * 1.2} ${height * 1.3}`}
      width={width * 1.1}
      height={height}
      style={isOpen ? { width: "800px", height: "700px" } : {}}
    ></svg>
  );
};

export default PolarPlot;
