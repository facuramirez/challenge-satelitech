const dummyData = [
  { key: "Technology", value: 38.1, color: "#F5A5DB" },
  { key: "Financials", value: 25.3, color: "#B89DFB" },
  { key: "Energy", value: 23.1, color: "#758bcf" },
  { key: "Cyclical", value: 19.5, color: "#33C2EA" },
  { key: "Defensive", value: 14.7, color: "#FFC182" },
  { key: "Utilities", value: 8.8, color: "#87db72" },
  { key: "Something", value: 3.8, color: "#87db72" },
];

export const SkeletonBarChart = () => {
  {
    /* Same code as above, but with pulsing bars and neutral colors. */
  }
  {
    dummyData.map((d, index) => {
      const barWidth = xScale(d.value);
      const barHeight = yScale.bandwidth();

      return (
        <div
          style={{
            position: "absolute",
            left: "0",
            top: `${yScale(d.key)}%`,
            width: `${barWidth}%`,
            height: `${barHeight}%`,
            borderRadius: "0 6px 6px 0", // Rounded right corners
          }}
          className="animate-pulse bg-gray-300 dark:bg-gray-700"
        />
      );
    });
  }
};
