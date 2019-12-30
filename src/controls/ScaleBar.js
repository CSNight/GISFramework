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
  let options = new Proxy(Object.assign({}, scaleBarOpt), {});
  let Tz = L.control.betterscale(scaleBarOpt.opt);
  Tz._leaflet_id = 'scalebar_control';
  Tz.$options = options;
  Tz.__proto__.show = function () {
    this.$options.show = true;
    this.$options.activate = true;
    this._container.style.display = 'block';
  };
  Tz.__proto__.hide = function () {
    this.$options.show = false;
    this.$options.activate = false;
    this._container.style.display = 'none';
  };
  return Tz;
};

export {scaleBar};
