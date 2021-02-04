import usePageTitle from "../hooks/usePageTitle";

export default function Settings() {
  // set page title
  const setPageTitle = usePageTitle();
  setPageTitle("Settings");

  return <h1>Settings</h1>;
}
