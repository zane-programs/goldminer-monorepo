export default interface PoolApiMinerStats {
  hash: number;
  hash2: number;
  identifier: string;
  lastHash: number;
  totalHashes: number;
  validShares: number;
  invalidShares: number;
  amtPaid: number;
  amtDue: number;
  txnCount: number;
}
