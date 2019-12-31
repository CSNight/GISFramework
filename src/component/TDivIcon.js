import {iconOpt} from './TIcon';

let divIconOpt = {
  html: '',
  bgPos: ''
};
divIconOpt = Object.assign(divIconOpt, iconOpt);
let divIcon = function (opt) {
  let options = {};
  if (typeof opt === 'object') {
    options = Object.assign(iconOpt, opt);
  }
  return L.divIcon(options);
};
export {divIcon};
