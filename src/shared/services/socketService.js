import EventEmitter from "../utils/eventEmitter";

export default class SocketService extends EventEmitter {
  constructor(url) {
    super();
    this.url = url;
    this.socket = null;
    this.running = false;
  }

  start() {
    if (this.running || this.socket) {
      return;
    }
    this.running = true;
    /* eslint-disable no-undef */
    this.socket = new WebSocket(this.url);
    /* eslint-enable no-undef */
    this.socket.addEventListener("open", () => {
      this.emit("open");
    });
    this.socket.addEventListener("message", (e) => {
      let data = null;
      const d = e.data.trim();
      let event = null;
      if (d.charAt(0) === "{" || d.charAt(0) === "[") {
        const o = JSON.parse(d);
        ({ event } = o);
        data = o.result;
      } else {
        event = d;
      }
      if (this.socket && event === "ping") {
        this.socket.send("pong");
      } else if (event) {
        this.emit(event, data);
      }
    });

    this.socket.addEventListener("error", (error) => {
      this.emit("error", error);
    });

    this.socket.addEventListener("close", () => {
      if (this.running) {
        this.emit("close");
      }
      this.socket = null;
      this.running = false;
    });
    const that = this;
    this.interval = setInterval(() => {
      if ((!that.socket) && (!that.running)) {
        that.start();
      }
    }, 1000);
  }

  send(data) {
    if (this.socket) {
      this.socket.send(data);
    }
  }

  close() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }
}
