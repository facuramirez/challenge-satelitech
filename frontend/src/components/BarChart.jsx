import React from "react";
import { pie, arc } from "d3";

export const ServerBarChart = ({ data }) => {
  const radius = Math.PI * 100;
  const gap = 0.02;

  const pieLayout = pie()
    .sort(null)
    .value((d) => d.value)
    .padAngle(gap);

  const arcGenerator = arc()
    .innerRadius(20)
    .outerRadius(radius)
    .cornerRadius(8);

  const labelRadius = radius * 0.8;
  const arcLabel = arc().innerRadius(labelRadius).outerRadius(labelRadius);

  const arcs = pieLayout(data);

  const computeAngle = (d) => {
    return ((d.endAngle - d.startAngle) * 180) / Math.PI;
  };

  const MIN_ANGLE = 20;

  return (
    <div className="p-4">
      <div className="relative max-w-[16rem] mx-auto">
        <svg
          viewBox={`-${radius} -${radius} ${radius * 2} ${radius * 2}`}
          className="overflow-visible"
        >
          {arcs.map((d, i) => {
            const midAngle = (d.startAngle + d.endAngle) / 2;
            return (
              <g key={i}>
                <path fill={`url(#pieColors-${i})`} d={arcGenerator(d)} />
                <defs>
                  <linearGradient
                    id={`pieColors-${i}`}
                    x1="0"
                    y1="0"
                    x2="1"
                    y2="0"
                    gradientTransform={`rotate(${
                      (midAngle * 180) / Math.PI - 90
                    }, 0.5, 0.5)`}
                  >
                    <stop
                      offset="0%"
                      stopColor="currentColor"
                      className={d.data.colorFrom}
                    />
                    <stop
                      offset="100%"
                      stopColor="currentColor"
                      className={d.data.colorTo}
                    />
                  </linearGradient>
                </defs>
              </g>
            );
          })}
        </svg>

        <div className="absolute inset-0 pointer-events-none">
          {arcs.map((d, i) => {
            const angle = computeAngle(d);
            if (angle <= MIN_ANGLE) return null;

            const [x, y] = arcLabel.centroid(d);
            const CENTER_PCT = 50;

            const nameLeft = `${CENTER_PCT + (x / radius) * 40}%`;
            const nameTop = `${CENTER_PCT + (y / radius) * 40}%`;
            const valueLeft = `${CENTER_PCT + (x / radius) * 72}%`;
            const valueTop = `${CENTER_PCT + (y / radius) * 70}%`;

            return (
              <div key={i}>
                <div
                  className="absolute transform -translate-x-1/2 -translate-y-1/2"
                  style={{ left: valueLeft, top: valueTop }}
                >
                  {d.data.value}
                </div>
                <div
                  className="absolute max-w-[80px] text-white truncate text-center text-sm font-medium"
                  style={{
                    left: nameLeft,
                    top: nameTop,
                    transform: "translate(-50%, -50%)",
                    marginLeft: x > 0 ? "2px" : "-2px",
                    marginTop: y > 0 ? "2px" : "-2px",
                  }}
                >
                  {d.data.name}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
