import { useCallback } from "react";

const useForwardRef = (ref, initialValue) => {
  const refCallback = useCallback(
    refValue => {
      if (typeof ref === "function") {
        ref(refValue);
      } else if (ref && typeof ref === "object") {
        ref.current = refValue;
      }

      refCallback.current = refValue;
    },
    [ref]
  );

  if (!refCallback.current) {
    refCallback.current = initialValue;
  }

  return refCallback;
};

export default useForwardRef;
