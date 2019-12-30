let pointerOpt = {
  show: true,
  activate: true,
  opt: {
    position: 'bottomright'
  }
};
let pointer = function () {
  let options = new Proxy(Object.assign({}, pointerOpt), {});
  let Tz = L.control(pointerOpt.opt);
  Tz._leaflet_id = 'pointer_control';
  Tz.onAdd = function () {
    let me = this;
    me._container = L.DomUtil.create('div');
    me._container.style.width = '250px';
    me._container.style.height = '20px';
    me._container.style.position = 'absolute';
    me._container.style.right = '10px';
    me._container.style.bottom = '0px';
    me._container.style.zindex = 2;
    me._container.style.textAlign = 'center';
    let inner = L.DomUtil.create('div');
    inner.style.fontSize = '14px';
    inner.style.color = '#222';
    me._container.appendChild(inner);
    return me._container;
  };
  T.map.on('mousemove', (e) => {
    Tz._container.innerText = Number(e.latlng.lng).toFixed(6) + ',' + Number(e.latlng.lat).toFixed(6);
  });
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

export {pointer};
