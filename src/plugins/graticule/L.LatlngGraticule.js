L.Control.BetterScale = L.Control.extend({
  options: {
    position: "bottomright",
    maxWidth: 150,
    metric: !1,
    imperial: !0,
    updateWhenIdle: !1
  },
  onAdd: function (t) {
    this._map = t;
    var e = "leaflet-control-better-scale",
      i = L.DomUtil.create("div", e),

      n = this.options,
      s = L.DomUtil.create("div", e + "-ruler", i);
    L.DomUtil.create("div", e + "-ruler-block " + e + "-upper-first-piece", s), L.DomUtil.create("div", e + "-ruler-block " + e + "-upper-second-piece", s), L.DomUtil.create("div", e + "-ruler-block " + e + "-lower-first-piece", s), L.DomUtil.create("div", e + "-ruler-block " + e + "-lower-second-piece", s);
    return this._addScales(n, e, i), this.ScaleContainer = i, t.on(n.updateWhenIdle ? "moveend" : "move", this._update, this), t.whenReady(this._update, this), i
  },
  onRemove: function (t) {
    t.off(this.options.updateWhenIdle ? "moveend" : "move", this._update, this)
  },
  _addScales: function (t, e, i) {
    this._iScale = L.DomUtil.create("div", e + "-label-div", i), this._iScaleLabel = L.DomUtil.create("div", e + "-label", this._iScale), this._iScaleFirstNumber = L.DomUtil.create("div", e + "-label " + e + "-first-number", this._iScale), this._iScaleSecondNumber = L.DomUtil.create("div", e + "-label " + e + "-second-number", this._iScale)
  },
  _update: function () {
    var t = this._map.getBounds(),
      e = t.getCenter().lat,
      i = 6378137 * Math.PI * Math.cos(e * Math.PI / 180),
      n = i * (t.getNorthEast().lng - t.getSouthWest().lng) / 180,
      o = this._map.getSize(),
      s = this.options,
      a = 0;
    o.x > 0 && (a = n * (s.maxWidth / o.x)), this._updateScales(s, a)
  },
  _updateScales: function (t, e) {
    t.metric && e && this._updateMetric(e), t.imperial && e && this._updateImperial(e)
  },
  _updateMetric_old: function (t) {
    var e = this._getRoundNum(t);
    this._iScale.style.width = this._getScaleWidth(e / t) + "px", this._iScaleLabel.innerHTML = 1e3 > e ? e + " m" : e / 1e3 + " km"
  },
  _updateMetric: function (t) {
    var e, i, n, o, s, a = t,
      r = this._iScaleFirstNumber,
      h = this._iScaleSecondNumber,
      l = this._iScale,
      u = this._iScaleLabel;
    u.innerHTML = "0", a > 500 ? (e = a / 1000, i = this._getRoundNum(e), o = this._getRoundNum(e / 2), l.style.width = this._getScaleWidth(i / e) + "px", r.innerHTML = o, h.innerHTML = i + "km") : (n = this._getRoundNum(a), s = this._getRoundNum(a / 2), l.style.width = this._getScaleWidth(n / a) + "px", r.innerHTML = s, h.innerHTML = n + "m")
  },
  _updateImperial: function (t) {
    var e, i, n, o, s, a = 3.2808399 * t,
      r = this._iScaleFirstNumber,
      h = this._iScaleSecondNumber,
      l = this._iScale,
      u = this._iScaleLabel;
    u.innerHTML = "0", a > 2640 ? (e = a / 5280, i = this._getRoundNum(e), o = this._getRoundNum(e / 2), l.style.width = this._getScaleWidth(i / e) + "px", r.innerHTML = o, h.innerHTML = i + "mi") : (n = this._getRoundNum(a), s = this._getRoundNum(a / 2), l.style.width = this._getScaleWidth(n / a) + "px", r.innerHTML = s, h.innerHTML = n + "ft")
  },
  _getScaleWidth: function (t) {
    return Math.round(this.options.maxWidth * t) - 10
  },
  _getRoundNum: function (t) {
    if (t >= 2) {
      var e = Math.pow(10, (Math.floor(t) + "").length - 1),
        i = t / e;
      return i = i >= 10 ? 10 : i >= 5 ? 5 : i >= 3 ? 3 : i >= 2 ? 2 : 1, e * i
    }
    return (Math.round(100 * t) / 100).toFixed(1)
  }
});

L.control.betterscale = function (options) {
  return new L.Control.BetterScale(options)
};
(function (window, document, undefined) {

  L.LatLngGraticule = L.Layer.extend({
    includes: L.Mixin.Events,

    options: {
      showLabel: true,
      opacity: 1,
      weight: 0.8,
      color: '#aaa',
      font: '12px Verdana',
      dashArray: [0, 0],
      lngLineCurved: 0,
      latLineCurved: 0,
      zoomInterval: [
        {start: 2, end: 2, interval: 40},
        {start: 3, end: 3, interval: 20},
        {start: 4, end: 4, interval: 10},
        {start: 5, end: 7, interval: 5},
        {start: 8, end: 20, interval: 1}
      ]
    },

    initialize: function (options) {
      L.setOptions(this, options);

      var defaultFontName = 'Verdana';
      var _ff = this.options.font.split(' ');
      if (_ff.length < 2) {
        this.options.font += ' ' + defaultFontName;
      }

      if (!this.options.fontColor) {
        this.options.fontColor = this.options.color;
      }

      if (this.options.zoomInterval) {
        if (this.options.zoomInterval.latitude) {
          this.options.latInterval = this.options.zoomInterval.latitude;
          if (!this.options.zoomInterval.longitude) {
            this.options.lngInterval = this.options.zoomInterval.latitude;
          }
        }
        if (this.options.zoomInterval.longitude) {
          this.options.lngInterval = this.options.zoomInterval.longitude;
          if (!this.options.zoomInterval.latitude) {
            this.options.latInterval = this.options.zoomInterval.longitude;
          }
        }
        if (!this.options.latInterval) {
          this.options.latInterval = this.options.zoomInterval;
        }
        if (!this.options.lngInterval) {
          this.options.lngInterval = this.options.zoomInterval;
        }
      }
    },

    onAdd: function (map) {
      this._map = map;

      if (!this._canvas) {
        this._initCanvas();
      }

      map._panes.overlayPane.appendChild(this._canvas);

      map.on('viewreset', this._reset, this);
      map.on('move', this._reset, this);
      map.on('moveend', this._reset, this);

      if (map.options.zoomAnimation && L.Browser.any3d) {
        map.on('zoomanim', this._animateZoom, this);
      }

      this._reset();
    },

    onRemove: function (map) {
      L.DomUtil.remove(this._canvas);

      map.off('viewreset', this._reset, this);
      map.off('move', this._reset, this);
      map.off('moveend', this._reset, this);

      if (map.options.zoomAnimation) {
        map.off('zoomanim', this._animateZoom, this);
      }
    },

    addTo: function (map) {
      map.addLayer(this);
      return this;
    },

    setOpacity: function (opacity) {
      this.options.opacity = opacity;
      this._updateOpacity();
      return this;
    },

    bringToFront: function () {
      if (this._canvas) {
        //this._map._panes.overlayPane.appendChild(this._canvas);
      }
      return this;
    },

    bringToBack: function () {
      var pane = this._map._panes.overlayPane;
      if (this._canvas) {
        //pane.insertBefore(this._canvas, pane.firstChild);
      }
      return this;
    },

    getAttribution: function () {
      return this.options.attribution;
    },

    _initCanvas: function () {

      this._canvas = L.DomUtil.create('canvas', '');

      if (this._map.options.zoomAnimation && L.Browser.any3d) {
        L.DomUtil.addClass(this._canvas, 'leaflet-zoom-animated');
      } else {
        L.DomUtil.addClass(this._canvas, 'leaflet-zoom-hide');
      }

      this._updateOpacity();


      L.extend(this._canvas, {
        onselectstart: L.Util.falseFn,
        onmousemove: L.Util.falseFn,
        onload: L.bind(this._onCanvasLoad, this)
      });
    },

    _animateZoom: function (e) {
      var map = this._map,
        canvas = this._canvas,
        scale = map.getZoomScale(e.zoom),
        nw = map.containerPointToLatLng([0, 0]),
        se = map.containerPointToLatLng([canvas.width, canvas.height]),
        topLeft = map._latLngToNewLayerPoint(nw, e.zoom, e.center),
        size = map._latLngToNewLayerPoint(se, e.zoom, e.center)._subtract(topLeft),
        origin = topLeft._add(size._multiplyBy((1 / 2) * (1 - 1 / scale)));

      L.DomUtil.setTransform(canvas, origin, scale);
    },

    _reset: function () {
      var canvas = this._canvas,
        size = this._map.getSize(),
        lt = this._map.containerPointToLayerPoint([0, 0]);

      L.DomUtil.setPosition(canvas, lt);

      canvas.width = size.x;
      canvas.height = size.y;
      canvas.style.width = size.x + 'px';
      canvas.style.height = size.y + 'px';

      this.__calcInterval();

      this.__draw(true);
    },

    _onCanvasLoad: function () {
      this.fire('load');
    },

    _updateOpacity: function () {
      L.DomUtil.setOpacity(this._canvas, this.options.opacity);
    },

    __format_lat: function (lat) {
      if (this.options.latFormatTickLabel) {
        return this.options.latFormatTickLabel(lat);
      }

      // todo: format type of float
      if (lat < 0) {
        return '' + Number(lat * -1).toFixed(2) + 'S';
      } else if (lat > 0) {
        return '' +  Number(lat).toFixed(2) + 'N';
      }
      return '' + Number(lat).toFixed(2);
    },

    __format_lng: function (lng) {
      if (this.options.lngFormatTickLabel) {
        return this.options.lngFormatTickLabel(lng);
      }

      // todo: format type of float
      if (lng > 180) {
        return '' + (360 - lng) + 'W';
      } else if (lng > 0 && lng < 180) {
        return '' + Number(lng).toFixed(2) + 'E';
      } else if (lng < 0 && lng > -180) {
        return '' + Number(lng * -1).toFixed(2) + 'W';
      } else if (lng == -180) {
        return '' + Number((lng * -1)).toFixed(2);
      } else if (lng < -180) {
        return '' + Number((360 + lng)).toFixed(2) + 'W';
      }
      return '' + lng;
    },

    __calcInterval: function () {
      var zoom = this._map.getZoom();
      if (this._currZoom != zoom) {
        this._currLngInterval = 0;
        this._currLatInterval = 0;
        this._currZoom = zoom;
      }

      var interv;

      if (!this._currLngInterval) {
        try {
          for (var idx in this.options.lngInterval) {
            var dict = this.options.lngInterval[idx];
            if (dict.start <= zoom) {
              if (dict.end && dict.end >= zoom) {
                this._currLngInterval = dict.interval;
                break;
              }
            }
          }
        } catch (e) {
          this._currLngInterval = 0;
        }
      }

      if (!this._currLatInterval) {
        try {
          for (var idx in this.options.latInterval) {
            var dict = this.options.latInterval[idx];
            if (dict.start <= zoom) {
              if (dict.end && dict.end >= zoom) {
                this._currLatInterval = dict.interval;
                break;
              }
            }
          }
        } catch (e) {
          this._currLatInterval = 0;
        }
      }
    },

    __draw: function (label) {
      function _parse_px_to_int(txt) {
        if (txt.length > 2) {
          if (txt.charAt(txt.length - 2) == 'p') {
            txt = txt.substr(0, txt.length - 2);
          }
        }
        try {
          return parseInt(txt, 10);
        } catch (e) {
        }
        return 0;
      };

      var self = this,
        canvas = this._canvas,
        map = this._map,
        curvedLon = this.options.lngLineCurved,
        curvedLat = this.options.latLineCurved;

      if (L.Browser.canvas && map) {
        if (!this._currLngInterval || !this._currLatInterval) {
          this.__calcInterval();
        }

        var latInterval = this._currLatInterval,
          lngInterval = this._currLngInterval;

        var ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.lineWidth = this.options.weight;
        ctx.strokeStyle = this.options.color;
        ctx.fillStyle = this.options.fontColor;
        ctx.setLineDash(this.options.dashArray);

        if (this.options.font) {
          ctx.font = this.options.font;
        }
        var txtWidth = ctx.measureText('0').width;
        var txtHeight = 12;
        try {
          var _font_size = ctx.font.trim().split(' ')[0];
          txtHeight = _parse_px_to_int(_font_size);
        } catch (e) {
        }

        var ww = canvas.width,
          hh = canvas.height;

        var lt = map.containerPointToLatLng(L.point(0, 0));
        var rt = map.containerPointToLatLng(L.point(ww, 0));
        var rb = map.containerPointToLatLng(L.point(ww, hh));

        var _lat_b = rb.lat,
          _lat_t = lt.lat;
        var _lon_l = lt.lng,
          _lon_r = rt.lng;

        var _point_per_lat = (_lat_t - _lat_b) / (hh * 0.2);
        if (isNaN(_point_per_lat)) {
          return;
        }

        if (_point_per_lat < 1) {
          _point_per_lat = 1;
        }
        if (_lat_b < -90) {
          _lat_b = -90;
        } else {
          _lat_b = parseInt(_lat_b - _point_per_lat, 10);
        }

        if (_lat_t > 90) {
          _lat_t = 90;
        } else {
          _lat_t = parseInt(_lat_t + _point_per_lat, 10);
        }

        var _point_per_lon = (_lon_r - _lon_l) / (ww * 0.2);
        if (_point_per_lon < 1) {
          _point_per_lon = 1;
        }
        if (_lon_l > 0 && _lon_r < 0) {
          _lon_r += 360;
        }
        _lon_r = parseInt(_lon_r + _point_per_lon, 10);
        _lon_l = parseInt(_lon_l - _point_per_lon, 10);

        var ll, latstr, lngstr, _lon_delta = 0.5;

        function __draw_lat_line(self, lat_tick) {
          ll = self._latLngToCanvasPoint(L.latLng(lat_tick, _lon_l));
          latstr = self.__format_lat(lat_tick);
          txtWidth = ctx.measureText(latstr).width;

          if (curvedLat) {
            if (typeof (curvedLat) == 'number') {
              _lon_delta = curvedLat;
            }

            var __lon_left = _lon_l, __lon_right = _lon_r;
            if (ll.x > 0) {
              var __lon_left = map.containerPointToLatLng(L.point(0, ll.y));
              __lon_left = __lon_left.lng - _point_per_lon;
              ll.x = 0;
            }
            var rr = self._latLngToCanvasPoint(L.latLng(lat_tick, __lon_right));
            if (rr.x < ww) {
              __lon_right = map.containerPointToLatLng(L.point(ww, rr.y));
              __lon_right = __lon_right.lng + _point_per_lon;
              if (__lon_left > 0 && __lon_right < 0) {
                __lon_right += 360;
              }
            }

            ctx.beginPath();
            ctx.moveTo(ll.x, ll.y);
            var _prev_p = null;
            for (var j = __lon_left; j <= __lon_right; j += _lon_delta) {
              rr = self._latLngToCanvasPoint(L.latLng(lat_tick, j));
              ctx.lineTo(rr.x, rr.y);

              if (self.options.showLabel && label && _prev_p != null) {
                if (_prev_p.x < 0 && rr.x >= 0) {
                  var _s = (rr.x - 0) / (rr.x - _prev_p.x);
                  var _y = rr.y - ((rr.y - _prev_p.y) * _s);
                  ctx.fillText(latstr, 0, _y + (txtHeight / 2));
                } else if (_prev_p.x <= (ww - txtWidth) && rr.x > (ww - txtWidth)) {
                  var _s = (rr.x - ww) / (rr.x - _prev_p.x);
                  var _y = rr.y - ((rr.y - _prev_p.y) * _s);
                  ctx.fillText(latstr, ww - txtWidth, _y + (txtHeight / 2) - 2);
                }
              }

              _prev_p = {x: rr.x, y: rr.y, lon: j, lat: i};
            }
            ctx.stroke();
          } else {
            var __lon_right = _lon_r;
            var rr = self._latLngToCanvasPoint(L.latLng(lat_tick, __lon_right));
            if (curvedLon) {
              __lon_right = map.containerPointToLatLng(L.point(0, rr.y));
              __lon_right = __lon_right.lng;
              rr = self._latLngToCanvasPoint(L.latLng(lat_tick, __lon_right));

              var __lon_left = map.containerPointToLatLng(L.point(ww, rr.y));
              __lon_left = __lon_left.lng;
              ll = self._latLngToCanvasPoint(L.latLng(lat_tick, __lon_left));
            }

            ctx.beginPath();
            ctx.moveTo(ll.x + 1, ll.y);
            ctx.lineTo(rr.x - 1, rr.y);
            ctx.stroke();
            if (self.options.showLabel && label) {
              var _yy = ll.y + (txtHeight / 2) - 2;
              ctx.fillText(latstr, 0, _yy);
              ctx.fillText(latstr, ww - txtWidth, _yy);
            }
          }
        };

        if (latInterval > 0) {
          for (var i = latInterval; i <= _lat_t; i += latInterval) {
            if (i >= _lat_b) {
              __draw_lat_line(this, i);
            }
          }
          for (var i = 0; i >= _lat_b; i -= latInterval) {
            if (i <= _lat_t) {
              __draw_lat_line(this, i);
            }
          }
        }

        function __draw_lon_line(self, lon_tick) {
          lngstr = self.__format_lng(lon_tick);
          txtWidth = ctx.measureText(lngstr).width;
          var bb = self._latLngToCanvasPoint(L.latLng(_lat_b, lon_tick));

          if (curvedLon) {
            if (typeof (curvedLon) == 'number') {
              _lat_delta = curvedLon;
            }

            ctx.beginPath();
            ctx.moveTo(bb.x, bb.y);
            var _prev_p = null;
            for (var j = _lat_b; j < _lat_t; j += _lat_delta) {
              var tt = self._latLngToCanvasPoint(L.latLng(j, lon_tick));
              ctx.lineTo(tt.x, tt.y);

              if (self.options.showLabel && label && _prev_p != null) {
                if (_prev_p.y > 8 && tt.y <= 8) {
                  ctx.fillText(lngstr, tt.x - (txtWidth / 2), txtHeight);
                } else if (_prev_p.y >= hh && tt.y < hh) {
                  ctx.fillText(lngstr, tt.x - (txtWidth / 2), hh - 2);
                }
              }

              _prev_p = {x: tt.x, y: tt.y, lon: lon_tick, lat: j};
            }
            ctx.stroke();
          } else {
            var __lat_top = _lat_t;
            var tt = self._latLngToCanvasPoint(L.latLng(__lat_top, lon_tick));
            if (curvedLat) {
              __lat_top = map.containerPointToLatLng(L.point(tt.x, 0));
              __lat_top = __lat_top.lat;
              if (__lat_top > 90) {
                __lat_top = 90;
              }
              tt = self._latLngToCanvasPoint(L.latLng(__lat_top, lon_tick));

              var __lat_bottom = map.containerPointToLatLng(L.point(bb.x, hh));
              __lat_bottom = __lat_bottom.lat;
              if (__lat_bottom < -90) {
                __lat_bottom = -90;
              }
              bb = self._latLngToCanvasPoint(L.latLng(__lat_bottom, lon_tick));
            }

            ctx.beginPath();
            ctx.moveTo(tt.x, tt.y + 1);
            ctx.lineTo(bb.x, bb.y - 1);
            ctx.stroke();

            if (self.options.showLabel && label) {
              ctx.fillText(lngstr, tt.x - (txtWidth / 2), txtHeight + 1);
              ctx.fillText(lngstr, bb.x - (txtWidth / 2), hh - 3);
            }
          }
        };

        if (lngInterval > 0) {
          for (var i = lngInterval; i <= _lon_r; i += lngInterval) {
            if (i >= _lon_l) {
              __draw_lon_line(this, i);
            }
          }
          for (var i = 0; i >= _lon_l; i -= lngInterval) {
            if (i <= _lon_r) {
              __draw_lon_line(this, i);
            }
          }
        }
      }
    },

    _latLngToCanvasPoint: function (latlng) {
      var map = this._map;
      var projectedPoint = map.project(L.latLng(latlng));
      projectedPoint._subtract(map.getPixelOrigin());
      return L.point(projectedPoint).add(map._getMapPanePos());
    }

  });

  L.latlngGraticule = function (options) {
    return new L.LatLngGraticule(options);
  };


}(this, document));


L.Path.mergeOptions({
  // @option dashSpeed: Number
  // The speed of the dash array, in pixels per second
  dashSpeed: 0
});


var _originalBeforeAdd = L.Path.prototype.beforeAdd;

L.Path.include({

  beforeAdd: function (map) {
    _originalBeforeAdd.bind(this)(map);

    if (this.options.dashSpeed) {
      this._lastDashFrame = performance.now();
      this._dashFrame = L.Util.requestAnimFrame(this._onDashFrame.bind(this));
    }
  },

  _onDashFrame: function(){
    if (!this._renderer) {
      return;
    }

    var now = performance.now();
    var dashOffsetDelta = (now - this._lastDashFrame) * this.options.dashSpeed / 1000;

    this.options.dashOffset = Number(this.options.dashOffset || 0) + dashOffsetDelta;
    this._renderer._updateStyle(this);

    this._lastDashFrame = performance.now();

    this._dashFrame = L.Util.requestAnimFrame(this._onDashFrame.bind(this));
  }

});
