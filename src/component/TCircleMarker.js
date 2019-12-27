import pathOption from './TPath';
import {optionFill, resetStyleHandler} from './VectorOptProxy';
import T from '../core/TMap';

let cMarkerOption = {
  radius: 10,
  t: 'circleMarker'
};
cMarkerOption = Object.assign(pathOption, cMarkerOption);
cMarkerOption.fill = true;

export function circleMarkerProxy(layer) {
  return resetStyleHandler(layer);
}

export function circleMarker(geo, options) {
  let opt = optionFill(options, cMarkerOption);
  let Te = L.circleMarker(geo, options);
  Te.$options = opt;
  Te = circleMarkerProxy(Te);
  T.map.addLayer(Te);
  return Te;
}
