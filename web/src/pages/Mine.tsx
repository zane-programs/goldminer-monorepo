import { useContext } from "react";
import MinerGraph from "../components/MinerGraph";
import AppContext from "../context/AppContext";

const stateMessages = [
  "Miner is not running. Click the button to start.",
  "Running benchmark, please wait...",
  "Mining has now started.",
];

export default function StatusPage() {
  const { status, toggleMining, isUpdatingStatus, hashrateData } = useContext(AppContext);

  return (
    <div>
      <p>
        {status?.minerState > 0
          ? stateMessages[status.minerState - 1]
          : "Loading..."}
      </p>
      <button onClick={toggleMining} disabled={isUpdatingStatus}>
        {status?.minerProcessRunning ? "Stop" : "Start"} Mining
      </button>
      {status?.minerState === 3 ? (
        <MinerGraph
          hashrateDataArray={hashrateData}
          // max={status?.minerStatistics?.hashrate?.highest}
        />
      ) : null}
    </div>
  );
}
