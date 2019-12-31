import '../plugins/graticule/L.LatlngGraticule';

let graticuleOpt = {
  show: true,
  activate: true,
  opt: {
    showLabel: true,
    color: '#333333',
    dashArray: [5, 5],
    zoomInterval: [{start: 1, end: 3, interval: 10},
      {start: 4, end: 4, interval: 5},
      {start: 5, end: 7, interval: 2},
      {start: 8, end: 10, interval: 1},
      {start: 10, end: 12, interval: 0.5},
      {start: 13, end: 15, interval: 0.1}]
  }
};

let latLngGraticule = function () {
  let opt = Object.assign({}, graticuleOpt.opt);
  let Tz = L.latlngGraticule(opt);
  Tz.__proto__.show = function () {
    T.map.removeLayer(this);
    this.$options.show = true;
  };
  Tz.__proto__.hide = function () {
    this.$options.show = false;
  };
  Tz.$options = new Proxy(Object.assign({}, graticuleOpt), {
    set: function (target, p, value, receiver) {
      Reflect.set(target, p, value, receiver);
      if (p === 'show') {
        if (value) {
          Tz.$options.activate = true;
          T.map.addLayer(Tz);
        } else {
          Tz.$options.activate = false;
          T.map.removeLayer(Tz);
        }
      }
      return true;
    }
  });
  return Tz;
};
export {latLngGraticule};
