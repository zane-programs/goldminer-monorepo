import {
  // CSSProperties,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
// @ts-ignore
// import WebView from "react-electron-web-view";
import useWindowEventValue from "./hooks/useWindowEventValue";
import MinerStatus from "./interfaces/MinerStatus";
import WindowStatus from "./interfaces/WindowStatus";
import HashrateDatum from "./interfaces/HashrateDatum";
import { refreshStatus, sendIpcMessage, MessageInfo } from "./util/ipc";
import MinerStateEnum from "./enums/MinerStateEnum";
import NavBar from "./components/NavBar";
import TopBar from "./components/TopBar";
import styled from "styled-components";
import useWindowDimensions from "./hooks/useWindowDimensions";
import { Outlet, Route, Routes } from "react-router-dom";
import AppContext from "./context/AppContext";
import theme from "./theme";
// import { getNumFromPx } from "./util/misc";

// pages
import Mine from "./pages/Mine";
import Dashboard from "./pages/Dashboard";
import Settings from "./pages/Settings";
import Shop from "./pages/Shop";

const OuterContainer = styled.div`
  position: relative;
`;

const AppContainer = styled.main`
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
`;

const ViewContainer = styled.div`
  margin-top: calc(${theme.navBar.height} + ${theme.topBar.height});
  flex-grow: 1;
  overflow-x: auto;
`;

export default function App() {
  const [isUpdatingStatus, setUpdatingStatus] = useState(true);
  const [pageTitle, setPageTitle] = useState(null as string | null);
  const status: MinerStatus = useWindowEventValue("minerStatusUpdate");
  const windowStatus: WindowStatus = useWindowEventValue(
    "windowControlStatusUpdate"
  );
  const { width, height } = useWindowDimensions();

  const sendMessage = useCallback(
    (info: MessageInfo, willTriggerStatusUpdate?: boolean) => {
      // set updating status to active so that it can be set
      // back to inactive once status is updated
      if (willTriggerStatusUpdate) setUpdatingStatus(true);
      sendIpcMessage(info);
    },
    [setUpdatingStatus]
  );

  useEffect(() => {
    // update document title on pageTitle change
    document.title = pageTitle
      ? `${pageTitle} | ${theme.appName}`
      : theme.appName;
  }, [pageTitle]);

  useEffect(() => {
    // status will no longer be in updating state
    setUpdatingStatus(!status || status === null);
  }, [status]);

  useEffect(() => {
    // refresh status on component mount
    refreshStatus();
  }, []);

  const toggleMining = useCallback(
    () =>
      sendMessage(
        {
          channel: "miner",
          arg: { action: status?.minerProcessRunning ? "stop" : "start" },
        },
        true // will result in a status update
      ),
    [status, sendMessage]
  );

  const [hashrateData, setHashrateData] = useState<HashrateDatum[]>([]);
  const addHashrateDatum = useCallback((datum: HashrateDatum) => {
    // refactored adding code, maintaining a maximum capacity of 50 data
    setHashrateData((previousData) => {
      const list = previousData.slice(previousData.length >= 50 ? 1 : 0);
      return [...list, datum];
    });
  }, []);
  useEffect(() => {
    if (
      status?.minerStatistics &&
      status?.minerStatistics?.hashrate?.total[0] !== null
    ) {
      addHashrateDatum({
        hashrate: status.minerStatistics.hashrate.total[0],
        date: new Date(),
      });
    }
    // return hashrateData.arrayValue;
  }, [status, addHashrateDatum]);

  // clear hashrate data on miner stop
  useEffect(() => {
    if (status?.minerState === MinerStateEnum.Inactive) setHashrateData([]);
  }, [status]);

  return (
    <AppContext.Provider
      value={{
        status,
        isUpdatingStatus,
        sendMessage,
        toggleMining,
        hashrateData,
        windowStatus,
        pageTitle,
        setPageTitle,
      }}
    >
      <TopBar />
      <OuterContainer style={{ width, height }}>
        <Routes>
          <Route path="/" element={<AuthenticatedLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="mine" element={<Mine />} />
            <Route path="shop" element={<Shop />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
      </OuterContainer>
    </AppContext.Provider>
  );
}

function AuthenticatedLayout() {
  const { status } = useContext(AppContext);

  return (
    <AppContainer>
      <NavBar />
      <ViewContainer>
        {status && status !== null ? <Outlet /> : <div>Loading...</div>}
      </ViewContainer>
    </AppContainer>
  );
}
