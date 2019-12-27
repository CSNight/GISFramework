import pathOption from './TPath';
import {optionFill, resetStyleHandler} from './VectorOptProxy';
import T from '../core/TMap';

let circleOption = {
  radius: 0.0,
  t: 'circle'
};
circleOption = Object.assign(pathOption, circleOption);
circleOption.fill = true;

export function circleProxy(layer) {
  return resetStyleHandler(layer);
}

export function circle(geo, options) {
  let opt = optionFill(options, circleOption);
  let Te = L.circle(geo, options);
  Te.$options = opt;
  Te = circleProxy(Te);
  T.map.addLayer(Te);
  return Te;
}
