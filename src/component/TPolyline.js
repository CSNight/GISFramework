import pathOption from './TPath';
import {optionFill, resetStyleHandler} from './VectorOptProxy';
import T from '../core/TMap';

let polylineOption = {
  smoothFactor: 1.0,
  noClip: false,
  t: 'polyline'
};
polylineOption = Object.assign(pathOption, polylineOption);

export function polylineProxy(layer) {
  return resetStyleHandler(layer);
}

export function polyline(geo, options) {
  let opt = optionFill(options, polylineOption);
  let Te = L.polyline(geo, options);
  Te.$options = opt;
  Te = polylineProxy(Te);
  T.map.addLayer(Te);
  return Te;
}
