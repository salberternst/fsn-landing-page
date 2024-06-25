import { useEffect, useRef } from "react";
import Yasgui from "@triply/yasgui";
import "@triply/yasgui/build/yasgui.min.css";

/**
 * Renders a component for executing SPARQL queries using Yasgui.
 */
export default function SparqlQuery() {
  const refContainer = useRef(null);

  useEffect(() => {
    if (refContainer.current) {
      new Yasgui(refContainer.current, {
        requestConfig: {
          endpoint: "/api/registry/sparql",
          method: "POST",
        },
        populateFromUrl: false,
        copyEndpointOnNewTab: true,
      });
    }
  });

  return <div id="yasgui" ref={refContainer} />;
}
