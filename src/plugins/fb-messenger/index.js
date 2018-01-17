
class FBMessenger {
  constructor() {
    this.tunnel = null;
    this.listener = null;
    this.name = "fb-messenger";
    this.type = "MessengerConnector";
  }

  getName() {
    return this.name;
  }

  getType() {
    return this.type;
  }

  setEventListener(listener) {
    this.listener = listener;
  }

  fireEvent(eventName) {
    logger.info("FBMessenger fireEvent", eventName);
    if (this.listener) {
      this.listener.fireEvent(eventName, this);
    }
  }

  async register(middleware) {
    // TODO
    this.middleware = middleware;
    return middleware;
  }

  async unregister(middleware) {
    // TODO
    this.middleware = null;
    return middleware;
  }
}

let instance = null;

const FBMessengerPlugin = () => {
  if (!instance) {
    instance = new FBMessenger();
  }
  return instance;
};

export default FBMessengerPlugin;
