import T from './core/TMap';

window.T = T;
T.createMap('map');
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png?{foo}', {foo: 'bar'}).addTo(T.map);
var bounds = [[54.559322, 20.767822], [56.1210604, 33.021240]];
// create an orange rectangle
let s = T.rectangle(bounds, {color: '#ff7800', weight: 1}).addTo(T.map);
window.s = s;
// zoom the map to the rectangle bounds
T.map.fitBounds(bounds);
T.map.addControl(T.controls.zoom());
T.map.addControl(T.controls.scaleBar());
T.map.addControl(T.controls.graticule());
T.map.addControl(T.controls.pointer());
T.map.addControl(T.controls.printer());
console.log(s);
console.log(T);
