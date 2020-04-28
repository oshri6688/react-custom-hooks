import { useRef, useLayoutEffect, useState } from "react";

const iframeStyle = {
  display: "block",
  opacity: 0,
  position: "absolute",
  top: 0,
  left: 0,
  height: "100%",
  width: "100%",
  overflow: "hidden",
  pointerEvents: "none",
  zIndex: -1
};

const iframeAttributes = {
  src: "about:blank",
  "aria-hidden": true,
  tabIndex: -1,
  frameBorder: 0
};

const defaultPositionStyle = "static";

const createIframeElement = () => {
  const iframeElement = document.createElement("iframe");

  Object.assign(iframeElement, iframeAttributes);
  Object.assign(iframeElement.style, iframeStyle);

  return iframeElement;
};

const changePositionStyle = element => {
  const elementStyle = window.getComputedStyle(element);
  const elementPositionStyle = elementStyle.getPropertyValue("position");

  if (elementPositionStyle === defaultPositionStyle) {
    element.style.position = "relative";
  }
};

const useDimensions = () => {
  const ref = useRef();
  const [dimensions, setDimensions] = useState(null);

  useLayoutEffect(() => {
    const element = ref.current;
    const iframeElement = createIframeElement();
    let iframeWindow;

    const onResizeIframe = () => {
      const dimensions = iframeElement.getBoundingClientRect();

      setDimensions(dimensions.toJSON());
    };

    const onLoadIframe = () => {
      onResizeIframe();

      iframeWindow = iframeElement.contentDocument.defaultView;

      iframeWindow.addEventListener("resize", onResizeIframe);
    };

    iframeElement.addEventListener("load", onLoadIframe);

    changePositionStyle(element);

    element.insertBefore(iframeElement, element.firstChild);

    return () => {
      iframeElement.removeEventListener("load", onLoadIframe);
      iframeWindow &&
        iframeWindow.removeEventListener("resize", onResizeIframe);
    };
  }, []);

  return [ref, dimensions];
};

export default useDimensions;
