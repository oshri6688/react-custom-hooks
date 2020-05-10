import { useRef, useLayoutEffect, useState } from "react";

const divStyle = {
  position: "absolute",
  top: 0,
  left: 0,
  opacity: 0,
  height: "100%",
  width: "100%",
  overflow: "hidden",
  pointerEvents: "none",
  zIndex: -1
};

const iframeStyle = {
  display: "block",
  ...divStyle
};

const iframeAttributes = {
  src: "about:blank",
  "aria-hidden": true,
  tabIndex: -1,
  frameBorder: 0
};

const createDivElement = () => {
  const divElement = document.createElement("div");

  divElement.setAttribute("class", "element-size-reporter");

  Object.assign(divElement.style, divStyle);

  return divElement;
};

const createIframeElement = () => {
  const iframeElement = document.createElement("iframe");

  Object.assign(iframeElement, iframeAttributes);
  Object.assign(iframeElement.style, iframeStyle);

  return iframeElement;
};

const changeElementStyle = element => {
  const elementStyle = window.getComputedStyle(element);
  const positionStyle = elementStyle.getPropertyValue("position");
  const displayStyle = elementStyle.getPropertyValue("display");

  if (positionStyle === "static") {
    element.style.position = "relative";
  }

  if (displayStyle === "inline") {
    element.style.display = "inline-block";
  }
};

const useDimensions = () => {
  const ref = useRef();
  const [dimensions, setDimensions] = useState({});

  useLayoutEffect(() => {
    const element = ref.current;
    const divElement = createDivElement();
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

    changeElementStyle(element);

    divElement.append(iframeElement);

    element.insertBefore(divElement, element.firstChild);

    return () => {
      iframeElement.removeEventListener("load", onLoadIframe);
      iframeWindow &&
        iframeWindow.removeEventListener("resize", onResizeIframe);
    };
  }, []);

  return [ref, dimensions];
};

export default useDimensions;
