export function LayerTree(options) {
  let layerTree = {
    options: {
      exclude: ['SVG', 'Canvas']
    },
    tree: [],
    treeIds: [],
    init: function () {
      this.treeIds = [];
      this.tree = [];
      this.options = Object.assign(this.options, options);
      this.tree = this.buildTree(T.map._layers);
      console.log(this.tree);
    },
    buildTree(layerCols) {
      let nodes = [];
      for (let k in layerCols) {
        let feat = T.map._layers[k];
        let lt = this.getLayerType(feat);
        if (this.options.exclude.indexOf(lt) !== -1) {
          continue;
        }
        let node = {
          id: feat._leaflet_id,
          layer: feat,
          type: lt,
          children: []
        };
        if (lt === 'LayerGroup' || lt === 'FeatureGroup') {
          node.children = this.buildTree(feat._layers);
        }
        if (this.treeIds.indexOf(node.id) === -1) {
          nodes.push(node);
          this.treeIds.push(node.id);
        }
      }
      return nodes;
    },
    refresh() {
      this.treeIds = [];
      this.tree = [];
      this.tree = this.buildTree(T.map._layers);
    },
    getLayerType(layer) {
      if (layer instanceof L.Circle) {
        return 'Circle';
      } else if (layer instanceof L.CircleMarker) {
        return 'CircleMarker';
      }
      if (layer instanceof L.Marker) {
        return 'Marker';
      }
      if (layer instanceof L.Polygon) {
        return 'Polygon';
      } else if (layer instanceof L.Polyline) {
        return 'Polyline';
      }
      if (layer instanceof L.TileLayer) {
        return 'TileLayer';
      }
      if (layer instanceof L.FeatureGroup) {
        return 'FeatureGroup';
      }
      if (layer instanceof L.LayerGroup) {
        return 'LayerGroup';
      }
      if (layer instanceof L.SVG) {
        return 'SVG';
      }
      if (layer instanceof L.LatLngGraticule) {
        return 'Canvas';
      }
    }, hideLayer(ids) {
      let idk = [];
      if (ids instanceof Number) {
        idk = [ids];
      } else {
        idk = ids;
      }
      for (let i = 0; i < idk.length; i++) {
        let layer = this.getLayerById(idk[i]);
        if (layer) {
          let lt = this.getLayerType(layer);
          if (lt === 'LayerGroup' || lt === 'FeatureGroup') {
            let idc = [];
            for (let j in layer._layers) {
              if (idk.indexOf(layer._leaflet_id) !== -1) {
                continue;
              }
              idc.push(layer._layers[j]._leaflet_id);
            }
            this.hideLayer(idc);
          } else {
            this._toggle(lt, layer, false);
          }
        }
      }

    }, showLayer(ids) {
      let idk = [];
      if (ids instanceof Number) {
        idk = [ids];
      } else {
        idk = ids;
      }
      for (let i = 0; i < idk.length; i++) {
        let layer = this.getLayerById(idk[i]);
        if (layer) {
          let lt = this.getLayerType(layer);
          if (lt === 'LayerGroup' || lt === 'FeatureGroup') {
            let idc = [];
            for (let j in layer._layers) {
              if (idk.indexOf(layer._leaflet_id) !== -1) {
                continue;
              }
              idc.push(layer._layers[j]._leaflet_id);
            }
            this.showLayer(idc);
          } else {
            this._toggle(lt, layer, true);
          }
        }
      }
    }, _toggle(type, layer, visibility) {
      console.log(layer._leaflet_id);
      switch (type) {
        case 'TileLayer':
          layer.setOpacity((visibility ? 1 : 0));
          break;
        case'Circle':
        case'CircleMarker':
        case'Polygon':
          if (visibility) {
            layer.setStyle({
              opacity: layer['_tempVis'].opacity,
              fillOpacity: layer['_tempVis'].fillOpacity
            });
            delete layer['_tempVis'];
          } else {
            layer['_tempVis'] = {
              opacity: layer.options.opacity ? layer.options.opacity : 1,
              fillOpacity: layer.options.fillOpacity ? layer.options.fillOpacity : 1
            };
            layer.setStyle({
              opacity: 0,
              fillOpacity: 0
            });
          }
          break;
        case'Polyline':
          if (visibility) {
            layer.setStyle({
              opacity: layer._tempVis.opacity
            });
            delete layer._tempVis;
          } else {
            layer._tempVis = {
              opacity: layer.options.opacity ? layer.options.opacity : 1
            };
            layer.setStyle({
              opacity: 0
            });
          }
          break;
        case'Marker':
          layer.setOpacity((visibility ? 1 : 0));
          break;
      }
    }, getLayerById(ids) {
      return T.map._layers[ids];
    }, setLocation(ids, zoom) {
      let layer = this.getLayerById(ids);
      if (layer) {
        let lt = this.getLayerType(layer);
        if (lt === 'FeatureGroup' || lt === 'LayerGroup') {
          let latlngs = [];
          let layers = this._findChild(layer);
          for (let j = 0; j < layers.length; j++) {
            let type = this.getLayerType(layers[j]);
            switch (type) {
              case'CircleMarker':
              case'Marker':
                latlngs.push(layers[j].getLatLng());
                break;
              case'Circle':
                let min = layers[j].getBounds().getSouthWest();
                let max = layers[j].getBounds().getNorthEast();
                latlngs.push(min);
                latlngs.push(max);
                break;
              case'Polygon':
              case'Polyline':
                latlngs.push(layers[j].getLatLngs());
                break;
            }
          }
          let bounds = L.latLngBounds(latlngs);
          if (!zoom) {
            T.map.fitBounds(bounds);
          }
          T.map.setView(bounds.getCenter(), zoom);
        } else {
          this._setLocation(lt, layer, zoom);
        }
      }
    }, _findChild(layerG) {
      let layers = [];
      for (let i in layerG._layers) {
        let lt = this.getLayerType(layerG._layers[i]);
        if (lt === 'FeatureGroup' || lt === 'LayerGroup') {
          layers = layers.concat(this._findChild(layerG._layers[i]));
        } else {
          layers.push(layerG._layers[i]);
        }
      }
      return layers;
    }, _setLocation(type, layer, zoom) {
      switch (type) {
        case'CircleMarker':
        case'Marker':
          if (!zoom) {
            zoom = 10;
          }
          T.map.setView(layer.getLatLng(), zoom);
          break;
        case'Circle':
        case'Polygon':
        case'Polyline':
          if (!zoom) {
            T.map.fitBounds(layer.getBounds());
          } else {
            T.map.setView(layer.getBounds().getCenter(), zoom);
          }
          break;
      }
    }

  };
  return layerTree;
}
