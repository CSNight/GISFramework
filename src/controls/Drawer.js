import '../plugins/draw/leaflet.draw-src';
import '../plugins/draw/leaflet.draw.css';
import {resetStyleHandler} from '../component/VectorOptProxy';
import T from "../core/TMap";

let drawer = {
  show: true,
  activate: false,
  drawer: {
    polyline: true,
    polygon: true,
    circle: true,
    rectangle: true,
    marker: true,
    circlemarker: true
  },
  editor: {
    poly: {},
    edit: {},
    remove: {}
  },
  local: {
    draw: {
      toolbar: {
        // #TODO: this should be reorganized where actions are nested in actions
        // ex: actions.undo  or actions.cancel
        actions: {
          title: 'Cancel drawing',
          text: 'Cancel'
        },
        finish: {
          title: 'Finish drawing',
          text: 'Finish'
        },
        undo: {
          title: 'Delete last point drawn',
          text: 'Delete last point'
        },
        buttons: {
          polyline: '画polyline',
          polygon: '画polygon',
          rectangle: '画rectangle',
          circle: '画circle',
          marker: '画marker',
          circlemarker: '画circlemarker'
        }
      },
      handlers: {
        circle: {
          tooltip: {
            start: 'Click and drag to draw circle.'
          },
          radius: 'Radius'
        },
        circlemarker: {
          tooltip: {
            start: 'Click map to place circle marker.'
          }
        },
        marker: {
          tooltip: {
            start: '点击开始画点'
          }
        },
        polygon: {
          tooltip: {
            start: '点击开始采集坐标',
            cont: '点击继续采集坐标',
            end: '点击第一节点结束采集坐标'
          }
        },
        polyline: {
          error: '<strong>错误:</strong> 图形节点不能相交',
          tooltip: {
            start: '点击开始画线',
            cont: '点击继续画线',
            end: '点击最后节点结束绘制'
          }
        },
        rectangle: {
          tooltip: {
            start: 'Click and drag to draw rectangle.'
          }
        },
        simpleshape: {
          tooltip: {
            end: 'Release mouse to finish drawing.'
          }
        }
      }
    },
    edit: {
      toolbar: {
        actions: {
          save: {
            title: '保存修改',
            text: '保存'
          },
          cancel: {
            title: '取消编辑，放弃所有更改',
            text: '取消'
          },
          clearAll: {
            title: '清除所有要素',
            text: '清除所有要素'
          }
        },
        buttons: {
          edit: '编辑要素',
          editDisabled: '没有可编辑的要素',
          remove: '删除要素',
          removeDisabled: '没有可删除的要素'
        }
      },
      handlers: {
        edit: {
          tooltip: {
            text: '拖动控制点或要素点进行修改',
            subtext: '点击取消按钮放弃修改'
          }
        },
        remove: {
          tooltip: {
            text: '选中要素删除'
          }
        }
      }
    }
  },
  opt: {
    position: 'topright', //控件位置
    draw: {
      polyline: { //线style
        shapeOptions: {
          color: '#f357a1',
          weight: 10
        }
      },
      polygon: { //面style
        allowIntersection: false,
        drawError: {
          color: '#e1e100',
          message: '错误'
        },
        shapeOptions: {
          color: '#bada55'
        }
      },
      circle: true,
      circlemarker: true,
      rectangle: {
        shapeOptions: {
          clickable: true
        }
      },
      marker: true
    },
    edit: {
      featureGroup: null,
      poly: {},
      edit: {},
      remove: {},
      allowIntersection: false
    }
  },
  targetLayer: null
};
L.drawLocal = drawer.local;

let drawerPlugin = function (targetLayer, options) {
  let opt = {
    position: 'topright'
  };
  if (options.hasOwnProperty('draw')) {
    if (typeof (options.draw) === 'boolean') {
      if (options.draw) {
        opt.draw = JSON.parse(JSON.stringify(drawer.opt.draw));
      }
    } else if (typeof (options.draw) === 'object') {
      opt.draw = {};
      for (let key in drawer.drawer) {
        if (options.draw.hasOwnProperty(key) && options.draw[key]) {
          opt.draw[key] = JSON.parse(JSON.stringify(drawer.opt.draw[key]));
        } else {
          opt.draw[key] = false;
        }
      }
    }
  }
  if (options.hasOwnProperty('edit')) {
    if (typeof (options.edit) === 'boolean') {
      if (options.edit) {
        opt.edit = JSON.parse(JSON.stringify(drawer.opt.edit));
        opt.edit.featureGroup = targetLayer;
      }
    } else if (typeof (options.edit) === 'object') {
      opt.edit = {};
      for (let key in drawer.editor) {
        if (options.edit.hasOwnProperty(key) && options.edit[key]) {
          opt.edit[key] = JSON.parse(JSON.stringify(drawer.opt.edit[key]));
        } else {
          opt.edit[key] = false;
        }
      }
      opt.edit.featureGroup = targetLayer;
    }
  }
  let Tz = new L.Control.Draw(opt);
  Tz._leaflet_id = 'drawer_control';
  Tz.__proto__.show = function () {
    this.$options.show = true;
  };
  Tz.__proto__.hide = function () {
    this.$options.show = false;
  };
  Tz.__proto__.disableAll = function () {
    if (Tz._toolbars.hasOwnProperty('edit')) {
      Tz._toolbars.edit.disable();
    }
    if (Tz._toolbars.hasOwnProperty('draw')) {
      Tz._toolbars.draw.disable();
    }
  };
  Tz.__proto__.enableAll = function () {
    if (Tz._toolbars.hasOwnProperty('edit')) {
      Tz._toolbars.edit.enable();
    }
    if (Tz._toolbars.hasOwnProperty('draw')) {
      Tz._toolbars.draw.enable();
    }
  };
  Tz.__proto__.enable = function (item) {
    if (Tz._toolbars.hasOwnProperty(item)) {
      Tz._toolbars.edit.enable();
    }
  };
  Tz.__proto__.disable = function (item) {
    if (Tz._toolbars.hasOwnProperty(item)) {
      Tz._toolbars.edit.disable();
    }
  };
  Tz.__proto__.featToJson = function () {
    if (!Tz.$groups) {
      return null;
    }
    let featArr = [];
    for (let k in Tz.$groups._layers) {
      let feat = Tz.$groups._layers[k];
      if (feat instanceof L.Circle) {
        let geoC = feat.toGeoJSON();
        if (feat.options.hasOwnProperty('icon')) {
          delete feat.options.icon;
        }
        geoC.properties.style = feat.options;
        geoC.properties.type = 'circle';
        geoC.properties.style.radius = feat._mRadius;
        featArr.push(geoC);
      } else if (feat instanceof L.CircleMarker) {
        let geoCm = feat.toGeoJSON();
        if (feat.options.hasOwnProperty('icon')) {
          delete feat.options.icon;
        }
        geoCm.properties.style = feat.options;
        geoCm.properties.type = 'circlemarker';
        featArr.push(geoCm);
      }
      if (feat instanceof L.Marker) {
        let geoM = feat.toGeoJSON();
        if (feat.options.icon.options.hasOwnProperty('iconUrl')) {
          geoM.properties.style = icon.options;
        } else {
          geoM.properties.style = {
            icon: 'default'
          };
        }
        geoM.properties.type = 'marker';
        featArr.push(geoM);
      }
      if (feat instanceof L.Polygon) {
        let geoPolygon = feat.toGeoJSON();
        geoPolygon.properties.style = feat.options;
        geoPolygon.properties.type = 'polygon';
        featArr.push(geoPolygon);
      } else if (feat instanceof L.Polyline) {
        let geoLine = feat.toGeoJSON();
        geoLine.properties.style = feat.options;
        geoLine.properties.type = 'polyline';
        featArr.push(geoLine);
      }
    }
    return featArr;
  };
  let drawOpt = JSON.parse(JSON.stringify(drawer));
  drawOpt.opt = opt;
  T.map.on(L.Draw.Event.CREATED, function (event) {
    let layer = event.layer;
    layer = resetStyleHandler(layer);
    targetLayer.addLayer(layer);
    T.layert.refresh();
  });
  Tz.$groups = targetLayer;
  Tz.$options = new Proxy(Object.assign({}, drawOpt), {
    set: function (target, p, value, receiver) {
      Reflect.set(target, p, value, receiver);
      if (p === 'show') {
        if (value) {
          Tz.$options.activate = true;
          Tz._container.style.display = 'block';
          Tz.enableAll();
        } else {
          Tz.$options.activate = false;
          Tz._container.style.display = 'none';
          Tz.disableAll();
        }
      }
      return true;
    }
  });
  return Tz;
};
export {drawerPlugin};
