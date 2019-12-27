import pathOption from './TPath';
import {optionFill, resetStyleHandler} from './VectorOptProxy';
import T from '../core/TMap';

let rectangleOption = {
  smoothFactor: 1.0,
  noClip: false,
  t: 'rectangle'
};
rectangleOption = Object.assign(pathOption, rectangleOption);
rectangleOption.fill = true;

export function rectangleProxy(layer) {
  return resetStyleHandler(layer);
}

export function rectangle(geo, options) {
  let opt = optionFill(options, rectangleOption);
  let Te = L.rectangle(geo, options);
  Te.$options = opt;
  Te = rectangleProxy(Te);
  T.map.addLayer(Te);
  return Te;
}


