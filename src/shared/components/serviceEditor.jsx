import React from "react";
import { Textfield } from "react-mdl";
import { DialogManager } from "zoapp-ui";

const displayWebServiceEditor = (
  title,
  action,
  actionDef,
  parameters,
  setInput,
  onEditAction,
  className,
) => {
  const name = parameters.name ? parameters.name : "";
  const url = parameters.url ? parameters.url : "";
  const classes = parameters.classes ? parameters.classes : "";
  const secret = parameters.secret ? parameters.secret : "";
  const content = (
    <div>
      <Textfield
        defaultValue={name}
        pattern=".+"
        label="Name"
        error="Wrong value"
        style={{ width: "100%" }}
        ref={input => setInput(input, "name")}
      />
      <Textfield
        defaultValue={url}
        pattern=".+"
        label="Url"
        error="Wrong value"
        style={{ width: "100%" }}
        ref={input => setInput(input, "url")}
      />
      <Textfield
        defaultValue={secret}
        pattern=".+"
        label="Secret"
        error="Wrong value"
        style={{ width: "100%" }}
        ref={input => setInput(input, "secret")}
      />
      <Textfield
        defaultValue={classes}
        pattern=".+"
        label="Classes"
        error="Wrong value"
        style={{ width: "100%" }}
        ref={input => setInput(input, "classes")}
      />
    </div>);

  DialogManager.open({
    title, content, actions: [action, "Cancel"], actionsDef: [actionDef, "Cancel"], onAction: onEditAction, className,
  });
};

export default displayWebServiceEditor;
