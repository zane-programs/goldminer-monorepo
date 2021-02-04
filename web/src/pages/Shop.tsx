import { useEffect } from "react";
import usePageTitle from "../hooks/usePageTitle";

export default function Shop() {
  // set page title
  const setPageTitle = usePageTitle();
  useEffect(() => {
    setPageTitle("Mine");
  }, [setPageTitle]);

  return <h1>Shop</h1>;
}
