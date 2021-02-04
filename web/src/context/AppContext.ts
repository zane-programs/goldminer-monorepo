import { createContext } from "react";
import HashrateDatum from "../interfaces/HashrateDatum";
import MinerStatus from "../interfaces/MinerStatus";
import WindowStatus from "../interfaces/WindowStatus";
import { MessageInfo } from "../util/ipc";

interface AppContextInterface {
  status: MinerStatus;
  isUpdatingStatus: boolean;
  toggleMining: () => void;
  sendMessage: (
    info: MessageInfo,
    willTriggerStatusUpdate?: boolean | undefined
  ) => void;
  hashrateData: HashrateDatum[];
  windowStatus: WindowStatus;
  pageTitle: string | null;
  setPageTitle: React.Dispatch<React.SetStateAction<string | null>>;
}

const AppContext = createContext({} as AppContextInterface);

export default AppContext;
