// Inspiration : https://gist.github.com/mudge/5830382
export default class EventEmitter {
  constructor() {
    this.events = {};
  }

  on(event, listener) {
    if ((!this.events[event]) || (!Array.isArray(this.events[event]))) {
      this.events[event] = [];
    }
    this.events[event].push(listener);
  }

  removeListener(event, listener) {
    const events = this.events[event];
    if (events && Array.isArray(events)) {
      const idx = events.indexOf(listener);
      if (idx > -1) {
        events.splice(idx, 1);
      }
    }
  }

  emit(event, ...args) {
    const events = this.events[event];
    if (events && Array.isArray(events)) {
      this.listeners = this.events[event].slice();
      this.listeners.forEach((l) => {
        l.apply(this, args);
      });
    }
  }

  once(event, listener, ...args) {
    const that = this;
    this.on(event, () => {
      that.removeListener(event, this);
      listener.apply(that, args);
    });
  }
}
