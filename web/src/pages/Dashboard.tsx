import { useContext, useEffect } from "react";
import useSWR from "swr";
import AppContext from "../context/AppContext";
import usePageTitle from "../hooks/usePageTitle";
import PoolApiMinerStats from "../interfaces/PoolApiMinerStats";
import { apiRequest } from "../util/apiRequest";

export default function Dashboard() {
  const { status } = useContext(AppContext);
  const { data, error } = useSWR<PoolApiMinerStats>(
    `/miner/${status.walletAddress}/stats`,
    minerStatsApiRequest
  );

  // set page title
  const setPageTitle = usePageTitle();
  useEffect(() => {
    setPageTitle("Dashboard");
  }, [setPageTitle]);

  return (
    <>
      <h1>Dashboard</h1>
      <p>
        {error
          ? "failed to load"
          : data
          ? `Balance: ${data.amtDue / 1e7} Golde`
          : "loading..."}
      </p>
    </>
  );
}

// adapt api request to PoolApiMinerStats interface
const minerStatsApiRequest = async (requestPath: string) =>
  (await apiRequest(requestPath)) as PoolApiMinerStats;
