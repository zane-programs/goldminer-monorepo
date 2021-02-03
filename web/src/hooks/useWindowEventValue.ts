import { useEffect, useState } from "react";

// TODO: add more types where possible
export default function useWindowEventValue(eventName: string) {
  const [value, setValue] = useState(null as any);

  useEffect(() => {
    function handleEventListener(event: any) {
      setValue(event.detail);
    }

    window.addEventListener(eventName, handleEventListener);
    return () => {
      window.removeEventListener(eventName, handleEventListener);
    };
  }, [eventName]);

  return value;
}
