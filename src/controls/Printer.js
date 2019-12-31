import '../plugins/print/leaflet.browser.print.min';

let printerOpt = {
  show: true,
  activate: true,
  opt: {
    position: 'topright'
  }
};
let printer = function () {
  let opt = Object.assign({}, printerOpt.opt);
  let Tz = L.control.browserPrint(opt);
  Tz.__proto__.show = function () {
    this.$options.show = true;
  };
  Tz.__proto__.hide = function () {
    this.$options.show = false;
  };
  Tz.$options = new Proxy(Object.assign({}, printerOpt), {
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
  Tz.$options.title = document.title;
  T.map.on('browser-print', (e => {
    let tit = prompt('输入地图名称：', Tz.$options.title);
    if (tit) {
      e.printMap._container.ownerDocument.title = tit;
    } else {
      e.printMap._container.ownerDocument.title = Tz.$options.title;
    }
    let canvas = e.printMap.getPane('overlayPane').querySelector('canvas');
    if (canvas) {
      canvas.style.border = '2px solid #666666';
      canvas.style.width = parseInt(canvas.style.width.replace('px', '')) - 3 + 'px';
      canvas.style.height = parseInt(canvas.style.height.replace('px', '')) - 3 + 'px';
    }
  }));
  T.map.on('browser-print-end', (e) => {
    document.title = Tz.$options.title;
    location.reload();
  });
  let afterPrint = function () {
    Tz._clearPrint();
    document.body.className = document.body.className.replace(' leaflet--printing', '');
    Tz._map.invalidateSize({
      reset: !0,
      animate: !1,
      pan: !1
    });
  };

  if (window.matchMedia) {
    let mediaQueryList = window.matchMedia('print');
    mediaQueryList.addListener(function (mql) {
      if (mql.matches) {
      } else {
        afterPrint();
      }
    });
  }
  window.onafterprint = afterPrint;
  return Tz;
};

export {printer};
