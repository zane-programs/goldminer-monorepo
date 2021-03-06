// import { CgClose } from "react-icons/cg";
// import { FaRegWindowMinimize } from "react-icons/fa";
import {
  VscChromeMinimize,
  VscChromeClose,
  VscChromeMaximize,
  VscChromeRestore,
} from "react-icons/vsc";
import styled from "styled-components";
import theme from "../theme";
import { sendIpcMessage } from "../util/ipc";
import { IconType } from "react-icons/lib";
import { memo, useContext } from "react";
import AppContext from "../context/AppContext";

const Container = styled.div`
  width: 100%;
  height: ${theme.topBar.height};
  z-index: 2;

  background-color: ${theme.mainColor};

  filter: brightness(108%) saturate(80%);

  position: fixed;

  user-select: none;
  cursor: default;

  display: flex;

  &.windowBlurred {
    filter: brightness(102%) saturate(70%);
  }

  &.windowBlurred .titleText {
    opacity: 0.85;
  }
`;

// region that can be dragged to move window around
const DragRegion = styled.div`
  -webkit-app-region: drag;
  flex-grow: 1;
`;

const ControlButtonInner = styled.button`
  position: relative;

  width: auto;
  height: 100%;
  margin: 0;
  padding: 3px 15px 3px 15px;

  border: none;
  outline: none;

  background-color: rgba(0, 0, 0, 0);

  &:hover {
    background-color: rgba(0, 0, 0, 0.15);
  }

  &:active {
    background-color: rgba(0, 0, 0, 0.25);
  }

  .icon {
    color: #fff;
    font-size: 22px;
  }
`;

const TitleText = styled.div`
  text-align: center;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  color: #fff;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica,
    Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
  font-weight: 700;
  font-size: 14px;

  pointer-events: none;
`;

interface WindowControlButtonProps {
  action: string;
  Icon: IconType;
  label: string;
}
const WindowControlButton = memo(function WindowControlButton({
  action,
  Icon,
  label,
}: WindowControlButtonProps) {
  return (
    <ControlButtonInner
      onClick={() => doWindowControlAction(action)}
      onMouseDown={(e) => e.preventDefault()}
      aria-label={label}
      tabIndex={-1}
    >
      <Icon className="icon" />
    </ControlButtonInner>
  );
});

export default function TopBar() {
  const { windowStatus, pageTitle } = useContext(AppContext);

  return (
    <Container className={windowStatus?.isFocused ? "" : "windowBlurred"}>
      <div>
        <WindowControlButton
          action="close"
          Icon={VscChromeClose}
          label="Close"
        />
        <WindowControlButton
          action="minimize"
          Icon={VscChromeMinimize}
          label="Minimize"
        />
        <WindowControlButton
          action="toggleMaximize"
          Icon={
            windowStatus !== null && windowStatus?.isMaximized
              ? VscChromeRestore
              : VscChromeMaximize
          }
          label="Maximize"
        />
      </div>
      <DragRegion
        onDoubleClick={() => doWindowControlAction("toggleMaximize")}
      ></DragRegion>
      <TitleText className="titleText">{pageTitle || theme.appName}</TitleText>
    </Container>
  );
}

// current supported events: "close" and "minimize"
const doWindowControlAction = (action: string) =>
  sendIpcMessage({ channel: "windowControl", arg: { action } });
