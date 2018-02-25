import Zrmc from "zrmc";

const displayProviderEditor = (
  title,
  action,
  actionDef,
  parameters,
  setInput,
  onEditAction,
  content,
  className,
) => {
  const actions = [];
  if (action) {
    actions.push({ title: action, name: actionDef });
    actions.push({ name: "Cancel" });
  }

  Zrmc.showDialog({
    header: title, body: content, actions, onAction: onEditAction, className,
  });
};

export default displayProviderEditor;
