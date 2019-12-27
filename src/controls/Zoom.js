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
  let options = new Proxy(Object.assign({}, zoomOpt), {});
  let Tz = L.control.zoom(options.opt);
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

export {zoomControl};

