/* eslint-disable no-unused-vars */
import React from "react";
import { render } from "react-dom";
import DevTools from "../shared/containers/devTools";
/* eslint-enable no-unused-vars */

/* global window setTimeout */
export default function showDevTools(store) {
  const popup = window.open(null, "Redux DevTools", "menubar=no,location=no,resizable=yes,scrollbars=no,status=no");
  // Reload in case it already exists
  popup.location.reload();

  setTimeout(() => {
    popup.document.write("<div id=\"react-devtools-root\"></div>");
    render(<DevTools store={store} />, popup.document.getElementById("react-devtools-root"));
  }, 10);
}
