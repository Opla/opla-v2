import {
  APP_SETTITLE, APP_SELECTINTENT, APP_UPDATEPUBLISHER,
  APP_UPDATEINTENT, APP_SETINTENTACTION, APP_DELETEINTENTACTION,
} from "./constants";

export function appSelectIntent(selectedBotId, selectedIntentIndex) {
  return { type: APP_SELECTINTENT, selectedBotId, selectedIntentIndex };
}

export function appSetTitle(titleName) {
  return { type: APP_SETTITLE, titleName };
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
