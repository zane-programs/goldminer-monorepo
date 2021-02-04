interface WindowStatusInterface {
  isMaximized: boolean;
  isFocused: boolean;
}

type WindowStatus = WindowStatusInterface | null;

export default WindowStatus;
