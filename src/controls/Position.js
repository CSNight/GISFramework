let pointerOpt = {
  show: true,
  activate: true,
  opt: {
    position: 'bottomright'
  }
};
let pointer = function () {
  let opt = Object.assign({}, pointerOpt.opt);
  let Tz = L.control(opt);
  Tz._leaflet_id = 'pointer_control';
  Tz.onAdd = function () {
    let me = this;
    me._container = L.DomUtil.create('div');
    me._container.style.width = '200px';
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
  Tz.__proto__.show = function () {
    this.$options.show = true;
  };
  Tz.__proto__.hide = function () {
    this.$options.show = false;
  };
  Tz.$options = new Proxy(Object.assign({}, pointerOpt), {
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

export {pointer};
