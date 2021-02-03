import MinerStateEnum from "../enums/MinerStateEnum";

type HashrateValue = number | null;

export default interface MinerStatus {
  minerProcessRunning: boolean;
  minerState: MinerStateEnum;
  minerStatistics: MinerStatistics;
  walletAddress: string;
}

// TODO: FINISH interface for miner stats
interface MinerStatistics {
  algo: string | null;
  hashrate: MinerStatsHashrate;
}

interface MinerStatsHashrate {
  highest: HashrateValue;
  total: [HashrateValue, HashrateValue, HashrateValue];
}
