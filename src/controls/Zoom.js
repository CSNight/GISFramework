let zoomOpt = {
  show: true,
  activate: true,
  opt: {
    position: 'topleft',
    zoomInText: '+',
    zoomInTitle: 'Zoom in',
    zoomOutText: '&#x2212	',
    zoomOutTitle: 'Zoom out'
  }
};
let zoomControl = function () {
  let opt = Object.assign({}, zoomOpt.opt);
  let Tz = L.control.zoom(opt);
  Tz.__proto__.show = function () {
    this.$options.show = true;
  };
  Tz.__proto__.hide = function () {
    this.$options.show = false;
  };
  Tz.$options = new Proxy(Object.assign({}, zoomOpt), {
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

export {zoomControl};

