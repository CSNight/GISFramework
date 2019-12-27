import T from './TMap';
import {zoomControl} from '../controls/Zoom';

let controls = {
  zoom: zoomControl,
  drawer: '',
  scaleBar: '',
  graticule: '',
  printer: '',
  cts: {},
  init: function () {
    T.map.addControl = new Proxy(T.map.addControl, {
      apply(target, _this, argArray) {
        let result = Reflect.apply(...arguments);
        if (argArray.length > 0 && argArray[0].hasOwnProperty('_leaflet_id')) {
          let ct = argArray[0];
          T.controls.cts[ct._leaflet_id] = ct;
        }
        return result;
      }
    });
    T.map.removeControl = new Proxy(T.map.removeControl, {
      apply(target, _this, argArray) {
        let result = Reflect.apply(...arguments);
        if (argArray.length > 0 && argArray[0].hasOwnProperty('_leaflet_id')) {
          let ct = argArray[0];
          if (T.controls.cts[ct._leaflet_id]) {
            delete T.controls.cts[ct._leaflet_id];
          }
        }
        return result;
      }
    });
  },
  addControl: function (control, type) {
    let ct = T.map.addControl(control);
    this.cts[type] = ct;
    return ct;
  },
  removeControl: function (ct) {
    if (typeof ct === 'object') {
      T.map.removeControl(ct);
      for (let k in this.cts) {
        let tmpCt = this.cts[k];
        if (tmpCt._leaflet_id === ct._leaflet_id) {
          delete this.cts[k];
          break;
        }
      }
    } else {
      let tmpCt = this.cts[ct];
      if (tmpCt !== undefined) {
        T.map.removeControl(tmpCt);
        delete this.cts[ct];
      }
    }
  },
  hide: function (ct) {
    ct.hide();
  },
  show: function (ct) {
    ct.show();
  },
  hideAll: function () {
    for (let k in this.cts) {
      this.cts[k].hide();
    }
  },
  showAll: function () {
    for (let k in this.cts) {
      this.cts[k].show();
    }
  }
};

export default controls;
