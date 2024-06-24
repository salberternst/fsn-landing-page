import { useEffect } from "react";
import Yasgui from "@triply/yasgui";
import "@triply/yasgui/build/yasgui.min.css";

const DefaultQuery = `SELECT * WHERE {
  GRAPH ?g {
    ?sub ?pred ?obj .
  }
}
`;

/**
 * Renders a component for executing SPARQL queries using Yasgui.
 */
export default function SparqlQuery() {
  useEffect(() => {
    const yasgui = new Yasgui(document.getElementById("yasgui"), {
      requestConfig: {
        endpoint: "/api/registry/sparql",
        method: "POST",
      },
      populateFromUrl: false,
      endpointCatalogueOptions: {
        getData: () => {
          return [
            {
              endpoint: "/api/registry/sparql",
              title: "SPARQL Endpoint",
            },
            {
              endpoint: "/api/registry/public/sparql",
              title: "Public SPARQL Endpoint",
            },
          ];
        },
        keys: [],
        renderItem: (data, source) => {
          const contentDiv = document.createElement("div");
          contentDiv.innerText = data.value.title;
          source.appendChild(contentDiv);
        },
      },
    });
    const tab = yasgui.getTab();
    if (!tab) {
      return;
    }
    tab.setQuery(DefaultQuery);
  }, []);

  return <div id="yasgui" />;
}
