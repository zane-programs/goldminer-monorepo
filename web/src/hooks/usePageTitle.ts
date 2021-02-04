import { useContext, useEffect } from "react";
import AppContext from "../context/AppContext";

// a hook that gets the setPageTitle method from
// context and clears the title on component unmount
export default function usePageTitle() {
  const { setPageTitle } = useContext(AppContext);
  useEffect(() => {
    // cleanup function
    return () => {
      setPageTitle(null);
    };
  }, [setPageTitle]);
  return setPageTitle;
}
