import { useEffect } from "react";
import usePageTitle from "../hooks/usePageTitle";

export default function Settings() {
  // set page title
  const setPageTitle = usePageTitle();
  useEffect(() => {
    setPageTitle("Settings");
  }, [setPageTitle]);

  return <h1>Settings</h1>;
}
