import '../plugins/measure/leaflet-measure.cn';
import '../plugins/measure/leaflet-measure.css';

let measureOpt = {
  show: true,
  activate: true,
  opt: {
    units: {},
    position: 'topright',
    primaryLengthUnit: 'meters',
    secondaryLengthUnit: 'kilometers',
    primaryAreaUnit: 'sqkilometers',
    secondaryAreaUnit: 'sqmeters',
    activeColor: '#ABE67E', // base color for map features while actively measuring
    completedColor: '#C8F2BE', // base color for permenant features generated from completed measure
    captureZIndex: 10000, // z-index of the marker used to capture measure events
    popupOptions: {
      // standard leaflet popup options http://leafletjs.com/reference-1.3.0.html#popup-option
      className: 'leaflet-measure-resultpopup',
      autoPanPadding: [10, 10]
    }
  }
};
let measure = function () {
  let opt = Object.assign({}, measureOpt.opt);
  let Tz = L.control.measure(opt);
  Tz.__proto__.show = function () {
    this.$options.show = true;
  };
  Tz.__proto__.hide = function () {
    this.$options.show = false;
  };
  Tz.$options = new Proxy(Object.assign({}, measureOpt), {
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
export {measure};
