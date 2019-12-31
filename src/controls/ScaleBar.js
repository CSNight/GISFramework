import '../plugins/scalebar/L.Control.BetterScale.css';
import '../plugins/scalebar/L.Control.BetterScale';

let scaleBarOpt = {
  show: true,
  activate: true,
  opt: {
    position: 'bottomright',
    metric: true,
    imperial: false
  }
};
let scaleBar = function () {
  let opt = Object.assign({}, scaleBarOpt.opt);
  let Tz = L.control.betterscale(opt);
  Tz._leaflet_id = 'scalebar_control';
  Tz.__proto__.show = function () {
    this.$options.show = true;
  };
  Tz.__proto__.hide = function () {
    this.$options.show = false;
  };
  Tz.$options = new Proxy(Object.assign({}, scaleBarOpt), {
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

export {scaleBar};
