L.TileLayer.ChinaProvider = L.TileLayer.extend({
  initialize: function (type, options) { // (type, Object)
    let providers = L.TileLayer.ChinaProvider.providers;
    let parts = type.split('.');
    let providerName = parts[0];
    let mapName = parts[1];
    let mapType = parts[2];
    let url = providers[providerName][mapName][mapType];
    options.subdomains = providers[providerName].Subdomains;
    options.key = options.key || providers[providerName].key;
    L.TileLayer.prototype.initialize.call(this, url, options);
  }
});

L.TileLayer.ChinaProvider.providers = {
  "T-TianDiTu": {
    Normal: {
      Map: "http://t{s}.tianditu.com/DataServer?T=vec_w&X={x}&Y={y}&L={z}&tk={key}",
      Annotation: "http://t{s}.tianditu.com/DataServer?T=cva_w&X={x}&Y={y}&L={z}&tk={key}"
    },
    Satellite: {
      Map: "http://t{s}.tianditu.com/DataServer?T=img_w&X={x}&Y={y}&L={z}&tk={key}",
      Annotation: "http://t{s}.tianditu.com/DataServer?T=cia_w&X={x}&Y={y}&L={z}&tk={key}"
    },
    Terrain: {
      Map: "http://t{s}.tianditu.com/DataServer?T=ter_w&X={x}&Y={y}&L={z}&tk={key}",
      Annotation: "http://t{s}.tianditu.com/DataServer?T=cta_w&X={x}&Y={y}&L={z}&tk={key}"
    },
    Subdomains: ['0', '1', '2', '3', '4', '5', '6', '7'],
    key: "f5a5b965118d9f64418ff38c6bcf25f3"
  },

  "T-GaoDe": {
    Normal: {
      Map: 'http://webrd0{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}'
    },
    Satellite: {
      Map: 'http://webst0{s}.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}',
      Annotation: 'http://webst0{s}.is.autonavi.com/appmaptile?style=8&x={x}&y={y}&z={z}'
    },
    Subdomains: ["1", "2", "3", "4"]
  },

  "T-Google": {
    Normal: {
      Map: "http://www.google.cn/maps/vt?lyrs=m@189&gl=cn&x={x}&y={y}&z={z}"
    },
    Satellite: {
      Map: "http://www.google.cn/maps/vt?lyrs=s@189&gl=cn&x={x}&y={y}&z={z}"
    },
    Subdomains: []
  },

  "T-Geoq": {
    Normal: {
      Map: "http://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineCommunity/MapServer/tile/{z}/{y}/{x}",
      PurplishBlue: "http://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineStreetPurplishBlue/MapServer/tile/{z}/{y}/{x}",
      Gray: "http://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineStreetGray/MapServer/tile/{z}/{y}/{x}",
      Warm: "http://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineStreetWarm/MapServer/tile/{z}/{y}/{x}",
    },
    Theme: {
      Hydro: "http://thematic.geoq.cn/arcgis/rest/services/ThematicMaps/WorldHydroMap/MapServer/tile/{z}/{y}/{x}"
    },
    Subdomains: []
  },

  "T-OSM": {
    Normal: {
      Map: "http://{s}.tile.osm.org/{z}/{x}/{y}.png",
    },
    Subdomains: ['a', 'b', 'c']
  }

};
L.tileLayer.chinaProvider = function (type, options) {
  return new L.TileLayer.ChinaProvider(type, options);
};

function removejscssfile(filename, filetype) {
  let targetelement = (filetype === "js") ? "script" : (filetype === "css") ? "link" : "none";
  let targetattr = (filetype === "js") ? "src" : (filetype === "css") ? "href" : "none";
  let allsuspects = document.getElementsByTagName(targetelement);
  for (let i = allsuspects.length; i >= 0; i--) {
    if (allsuspects[i] && allsuspects[i].getAttribute(targetattr) != null && allsuspects[i].getAttribute(targetattr).indexOf(filename) !== -1)
      allsuspects[i].parentNode.removeChild(allsuspects[i])
  }
}

export function CusTileLayer(url, options, isCache) {
  if (!options || options === {}) {
    options = {
      maxZoom: T.map.getMaxZoom(),
      minZoom: T.map.getMinZoom()
    }
  }
  if (url.indexOf("iserver") !== -1) {
    options.cacheEnabled = isCache;
    return L.supermap.tiledMapLayer(url, options);
  } else if (url.indexOf("arcgis") !== -1) {
    options.url = url;
    if (isCache) {
      return L.esri.tiledMapLayer(options);
    } else {
      return L.esri.dynamicMapLayer(options);
    }
  } else if (url.indexOf("T-") !== -1) {
    return L.tileLayer.chinaProvider(url, options)
  } else {
    return L.tileLayer(url, options);
  }
}

