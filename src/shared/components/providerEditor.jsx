import DialogManager from "../utils/dialogManager";

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
    actions.push(action);
    actions.push("Cancel");
  }

  const actionsDef = [];
  if (actionDef) {
    actionsDef.push(actionDef);
    actionsDef.push("Cancel");
  }
  DialogManager.open({
    title, content, actions, actionsDef, onAction: onEditAction, className,
  });
};

export default displayProviderEditor;
