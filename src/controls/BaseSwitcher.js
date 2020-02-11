import '../plugins/switcher/L.Control.Basemaps.css';
import '../plugins/switcher/L.Control.Basemaps';

let switcher = {
  show: true,
  activate: false,
  opt: {}
};

let switchControl = function (opt) {
  let options = Object.assign({}, opt);
  let Tz = L.control.basemaps(options);
  Tz.__proto__.show = function () {
    this.$options.show = true;
  };
  Tz.__proto__.hide = function () {
    this.$options.show = false;
  };
  Tz.$options = new Proxy(Object.assign({}, switcher), {
    set: function (target, p, value, receiver) {
      Reflect.set(target, p, value, receiver);
      if (p === 'show') {
        if (value) {
          Tz.$options.activate = true;
          Tz._container.style.display = 'block';
        } else {
          Tz.$options.activate = false;
          Tz._container.style.display = 'none';
        }
      }
      return true;
    }
  });
  return Tz;
};

export {switchControl};
