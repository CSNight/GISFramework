import pathOption from './TPath';
import {optionFill, resetStyleHandler} from './VectorOptProxy';
import T from '../core/TMap';

let polygonOption = {
  smoothFactor: 1.0,
  noClip: false,
  t: 'polygon'
};
polygonOption = Object.assign(pathOption, polygonOption);
polygonOption.fill = true;

export function polygonProxy(layer) {
  return resetStyleHandler(layer);
}

export function polygon(geo, options) {
  let opt = optionFill(options, polygonOption);
  let Te = L.polygon(geo, options);
  Te.$options = opt;
  Te = polygonProxy(Te);
  T.map.addLayer(Te);
  return Te;
}
