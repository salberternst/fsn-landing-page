import { useState, useEffect } from "react";

/**
 * Renders an iframe that displays the Thingsboard application.
 * The URL of the iframe is dynamically generated based on the current window location.
 */
export default function Thingsboard() {
  const [url, setUrl] = useState();

  useEffect(() => {
    setUrl(new URL(window.location.href));
  }, [setUrl]);

  if (url === undefined) {
    return null;
  }

  return (
    <iframe
      src={`${url.protocol}//thingsboard.${url.host}/`}
      style={{ width: "100%", height: "100%" }}
    />
  );
}
