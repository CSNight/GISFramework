let EventBus = {
  async: function (args, handler) {
    setTimeout(() => {
      handler.method.apply(handler.method, [args])
    }, 10)
  }, on: function (eventName, listener, id) {
    let delay = 0;
    let identifier = "";
    if (arguments.length === 3 && isNum(arguments[2])) {
      delay = parseInt(arguments[2]);
      identifier = "";
    } else if (arguments.length === 3 && !isNum(arguments[2])) {
      identifier = id;
    } else if (arguments.length === 4) {
      delay = parseInt(arguments[3]);
      identifier = id;
    }
    this.eventMethods.push({
      identifier: identifier,
      eventName: eventName,
      method: listener,
      delay: delay
    });
    return identifier;
  }, emit: function (eventName, data, evtId) {
    for (let index = 0; index < this.eventMethods.length; index++) {
      let handler = this.eventMethods[index];
      if (handler.eventName === eventName && evtId && handler.identifier === evtId) {
        this.async(data, handler);
        break;
      } else if (!evtId && handler.eventName === eventName) {
        this.async(data, handler);
      }
    }
  }, broadcast: function (eventName, data) {
    if (!this.eventMethods) this.eventMethods = [];
    for (let index = 0; index < this.eventMethods.length; index++) {
      let handler = this.eventMethods[index];
      if (handler.eventName === eventName) {
        this.async(data, handler);
      }
    }
  }, un: function (eventName, id) {
    for (let index = 0; index < this.eventMethods.length; index++) {
      let handler = this.eventMethods[index];
      if (id) {
        if (handler.eventName === eventName && handler.identifier === id) {
          this.eventMethods.splice(index, 1);
          index--;
        }
      } else {
        if (handler.eventName === eventName) {
          this.eventMethods.splice(index, 1);
          index--;
        }
      }
    }
  }, clear: function () {
    this.eventMethods = [];
  }, destroy: function () {
    this.eventMethods = [];
  }
};
export default EventBus;
