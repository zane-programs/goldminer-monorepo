import { useMemo, memo, useContext } from "react";
import styled from "styled-components";
import { Line } from "react-chartjs-2";
import useWindowDimensions from "../hooks/useWindowDimensions";
import HashrateDatum from "../interfaces/HashrateDatum";

// theme
import theme from "../theme";
import AppContext from "../context/AppContext";
import MinerStateEnum from "../enums/MinerStateEnum";

interface MinerGraphProps {
  hashrateDataArray: HashrateDatum[];
  // max?: number | null;
  // width: number;
  // height: number;
}

// holds Line (graph) component
const GraphContainer = styled.div`
  position: absolute;
  bottom: 1px;
  z-index: 0;
`;

// displays hashrate in bottom left
const HashrateDisplay = styled.div`
  position: absolute;
  bottom: 15px;
  left: 48px;

  margin: 0px;
  padding: 8px 12px 8px 12px;
  border-radius: 4px;

  color: #fff;
  background-color: ${theme.mainColor};
  opacity: 0.82;

  font-family: "Roboto Mono", monospace;
  font-size: 18px;
  font-weight: 700;
  user-select: none;
`;

function MinerGraph({ hashrateDataArray }: MinerGraphProps) {
  const { width, height } = useWindowDimensions();
  const { status } = useContext(AppContext);

  const graphHeight = useMemo(() => 0.44 * height, [height]);

  const graphData = useMemo(
    () => generateGraphData(hashrateDataArray, graphHeight),
    [hashrateDataArray, graphHeight]
  );

  const graphOptions = useMemo(() => {
    return {
      responsive: true,
      maintainAspectRatio: false,
      elements: {
        point: {
          // radius: 5,
          radius: 0,
        },
      },
      legend: { display: false },
      tooltips: {
        enabled: false,
      },
      scales: {
        xAxes: [
          {
            display: false,
            ticks: {
              display: false, // hide label
              drawBorder: false,
            },
            gridLines: { color: "rgba(0, 0, 0, 0)" },
          },
        ],
        yAxes: [
          {
            display: false, // hide
            ticks: {
              suggestedMin: 0,
              suggestedMax:
                1.01 *
                (Math.max(
                  ...hashrateDataArray.map((datum) => datum.hashrate)
                ) || 0), // multiply by 1.01 to give a bit of extra space at the top
              display: false, // hide label
              drawBorder: false,
            },
            gridLines: { color: "rgba(0, 0, 0, 0)" },
          },
        ],
      },
    };
  }, [hashrateDataArray]);

  return (
    <>
      <GraphContainer style={{ width, height: graphHeight }}>
        <Line data={graphData} options={graphOptions} />
      </GraphContainer>
      <HashrateDisplay>
        {status?.minerState === MinerStateEnum.MinerStarted &&
        status?.minerStatistics?.hashrate.total[0] !== null
          ? `${status?.minerStatistics?.hashrate?.total[0].toFixed(2)} H/s ${
              status?.minerStatistics?.algo !== null
                ? `(${status?.minerStatistics?.algo || "Loading..."})`
                : ""
            }`
          : "Loading..."}
      </HashrateDisplay>
    </>
  );
}

export default memo(MinerGraph);

function generateGraphData(hashrateData: HashrateDatum[], height: number) {
  return function (canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext("2d");
    const gradient = ctx?.createLinearGradient(0, 0, 0, height);
    gradient?.addColorStop(0, theme.minerTheme.graphGradient[0]);
    gradient?.addColorStop(1, theme.minerTheme.graphGradient[1]);

    return {
      labels: hashrateData.map((datum) => datum.date.toISOString()),
      datasets: [
        {
          label: "Miner Hashrate", // Name the series
          data: hashrateData.map((datum) => datum.hashrate), // Specify the data values array
          fill: "start",
          backgroundColor: gradient,
          borderColor: theme.mainColor, // Add custom color border (Line)
          borderWidth: 3, // Specify bar border width
        },
      ],
    };
  };
}
