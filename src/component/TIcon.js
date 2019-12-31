let iconOpt = {
  iconUrl: '',
  iconRetinaUrl: '',
  iconSize: null,
  iconAnchor: null,
  popupAnchor: [0, 0],
  tooltipAnchor: [0, 0],
  shadowUrl: null,
  shadowRetinaUrl: null,
  shadowSize: null,
  shadowAnchor: null,
  className: ''
};
let icon = function (opt) {
  let options = {};
  if (typeof opt === 'object') {
    options = Object.assign(iconOpt, opt);
  } else if (typeof opt === 'string') {
    options = Object.assign({}, iconOpt);
    options.iconUrl = opt;
  }
  return L.icon(options);
};
export {icon, iconOpt};
