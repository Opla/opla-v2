/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the GPL v2.0+ license found in the
 * LICENSE file in the root directory of this source tree.
 */
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
