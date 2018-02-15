import { appSetTitle } from "zoapp-front/actions/app";

import {
  APP_DELETEINTENTACTION,
  APP_SELECTINTENT,
  APP_SETINTENTACTION,
  APP_UPDATEINTENT,
  APP_UPDATEPUBLISHER,
} from "./constants";


export function appSelectIntent(selectedBotId, selectedIntentIndex) {
  return { type: APP_SELECTINTENT, selectedBotId, selectedIntentIndex };
}

export function appUpdatePublisher(selectedBotId, publisher) {
  return { type: APP_UPDATEPUBLISHER, selectedBotId, publisher };
}

export function appUpdateIntent(selectedBotId, intent) {
  return { type: APP_UPDATEINTENT, selectedBotId, intent };
}

export function appSetIntentAction(actionContainer, actionType, actionValue, selectedAction) {
  return {
    type: APP_SETINTENTACTION, actionContainer, actionType, actionValue, selectedAction,
  };
}

export function appDeleteIntentAction(actionContainer, selectedAction) {
  return { type: APP_DELETEINTENTACTION, actionContainer, selectedAction };
}

export { appSetTitle };
