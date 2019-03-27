/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the GPL v2.0+ license found in the
 * LICENSE file in the root directory of this source tree.
 */
import {
  APP_DELETEINTENTACTION,
  APP_SELECTINTENT,
  APP_SELECTIO,
  APP_UNSELECTIO,
  APP_SELECTENTITY,
  APP_SELECTFUNCTION,
  APP_SETINTENTACTION,
  APP_UPDATEINTENT,
  APP_UPDATEPUBLISHER,
  APP_SETNEWACTIONS,
  APP_DELETENEWACTIONS,
} from "./constants";

export function appSelectIntent(selectedBotId, selectedIntentIndex) {
  return { type: APP_SELECTINTENT, selectedBotId, selectedIntentIndex };
}

export function appSelectIO(selectedIntentIndex, selectedIOIndex, isOutput) {
  return { type: APP_SELECTIO, selectedIntentIndex, selectedIOIndex, isOutput };
}

export function appUnSelectIO() {
  return { type: APP_UNSELECTIO };
}

export function appUpdatePublisher(selectedBotId, publisher) {
  return { type: APP_UPDATEPUBLISHER, selectedBotId, publisher };
}

export function appUpdateIntent(selectedBotId, intent) {
  return { type: APP_UPDATEINTENT, selectedBotId, intent };
}

export function appSetIntentAction(
  actionContainer,
  actionType,
  actionValue,
  selectedAction,
) {
  return {
    type: APP_SETINTENTACTION,
    actionContainer,
    actionType,
    actionValue,
    selectedAction,
  };
}

export function appDeleteIntentAction(actionContainer, selectedAction) {
  return { type: APP_DELETEINTENTACTION, actionContainer, selectedAction };
}

export function appSetNewActions(actionContainer, actionValue) {
  return {
    type: APP_SETNEWACTIONS,
    actionContainer,
    actionValue,
  };
}

export function appDeleteNewActions() {
  return {
    type: APP_DELETENEWACTIONS,
  };
}

export function appSelectEntity(selectedBotId, selectedEntityIndex) {
  return { type: APP_SELECTENTITY, selectedBotId, selectedEntityIndex };
}

export function appSelectFunction(selectedBotId, selectedFunctionIndex) {
  return { type: APP_SELECTFUNCTION, selectedBotId, selectedFunctionIndex };
}
