import '../plugins/pulse_icon/L.Icon.Pulse.min.css'

L.Path.mergeOptions({
  // @option dashSpeed: Number
  // The speed of the dash array, in pixels per second
  dashSpeed: 0
});


let _originalBeforeAdd = L.Path.prototype.beforeAdd;

L.Path.include({

  beforeAdd: function (map) {
    _originalBeforeAdd.bind(this)(map);

    if (this.options.dashSpeed) {
      this._lastDashFrame = performance.now();
      this._dashFrame = L.Util.requestAnimFrame(this._onDashFrame.bind(this));
    }
  },

  _onDashFrame: function () {
    if (!this._renderer) {
      return;
    }

    let now = performance.now();
    let dashOffsetDelta = (now - this._lastDashFrame) * this.options.dashSpeed / 1000;

    this.options.dashOffset = Number(this.options.dashOffset || 0) + dashOffsetDelta;
    this._renderer._updateStyle(this);

    this._lastDashFrame = performance.now();

    this._dashFrame = L.Util.requestAnimFrame(this._onDashFrame.bind(this));
  }

});

L.Icon.Pulse = L.DivIcon.extend({
  options: {className: "", iconSize: [12, 12], color: "red"}, initialize: function (e) {
    L.setOptions(this, e);
    let t = "lpi-" + (new Date).getTime() + "-" + Math.round(1e5 * Math.random());
    this.options.className = this.options.className + " leaflet-pulsing-icon " + t;
    let o = "." + t + "{background-color:" + this.options.color + ";}";
    o += "." + t + ":after{box-shadow: 0 0 6px 2px " + this.options.color + ";}";
    let n = document.createElement("style");
    n.styleSheet ? n.styleSheet.cssText = o : n.appendChild(document.createTextNode(o)), document.getElementsByTagName("head")[0].appendChild(n), L.DivIcon.prototype.initialize.call(this, e)
  }
});
L.icon.pulse = function (e) {
  return new L.Icon.Pulse(e)
};
L.interpolatePosition = function (p1, p2, duration, t) {
  let k = t / duration;
  k = (k > 0) ? k : 0;
  k = (k > 1) ? 1 : k;
  return L.latLng(p1.lat + k * (p2.lat - p1.lat),
    p1.lng + k * (p2.lng - p1.lng));
};
L.Marker.MovingMarker = L.Marker.extend({
  //state constants
  statics: {
    notStartedState: 0,
    endedState: 1,
    pausedState: 2,
    runState: 3
  },
  options: {
    autostart: false,
    loop: false,
  },
  initialize: function (latlngs, durations, options) {
    L.Marker.prototype.initialize.call(this, latlngs[0], options);

    this._latlngs = latlngs.map(function (e, index) {
      return L.latLng(e);
    });

    if (durations instanceof Array) {
      this._durations = durations;
    } else {
      this._durations = this._createDurations(this._latlngs, durations);
    }

    this._currentDuration = 0;
    this._currentIndex = 0;

    this._state = L.Marker.MovingMarker.notStartedState;
    this._startTime = 0;
    this._startTimeStamp = 0;  // timestamp given by requestAnimFrame
    this._pauseStartTime = 0;
    this._animId = 0;
    this._animRequested = false;
    this._currentLine = [];
    this._stations = {};
  },

  isRunning: function () {
    return this._state === L.Marker.MovingMarker.runState;
  },

  isEnded: function () {
    return this._state === L.Marker.MovingMarker.endedState;
  },

  isStarted: function () {
    return this._state !== L.Marker.MovingMarker.notStartedState;
  },

  isPaused: function () {
    return this._state === L.Marker.MovingMarker.pausedState;
  },

  start: function () {
    if (this.isRunning()) {
      return;
    }

    if (this.isPaused()) {
      this.resume();
    } else {
      this._loadLine(0);
      this._startAnimation();
      this.fire('start');
    }
  },

  resume: function () {
    if (!this.isPaused()) {
      return;
    }
    // update the current line
    this._currentLine[0] = this.getLatLng();
    this._currentDuration -= (this._pauseStartTime - this._startTime);
    this._startAnimation();
  },

  pause: function () {
    if (!this.isRunning()) {
      return;
    }

    this._pauseStartTime = Date.now();
    this._state = L.Marker.MovingMarker.pausedState;
    this._stopAnimation();
    this._updatePosition();
  },

  stop: function (elapsedTime) {
    if (this.isEnded()) {
      return;
    }

    this._stopAnimation();

    if (typeof (elapsedTime) === 'undefined') {
      // user call
      elapsedTime = 0;
      this._updatePosition();
    }

    this._state = L.Marker.MovingMarker.endedState;
    this.fire('end', {elapsedTime: elapsedTime});
  },

  addLatLng: function (latlng, duration) {
    this._latlngs.push(L.latLng(latlng));
    this._durations.push(duration);
  },

  moveTo: function (latlng, duration) {
    this._stopAnimation();
    this._latlngs = [this.getLatLng(), L.latLng(latlng)];
    this._durations = [duration];
    this._state = L.Marker.MovingMarker.notStartedState;
    this.start();
    this.options.loop = false;
  },
  stopAtStation: function (pointIndex, duration) {
    if (pointIndex > this._latlngs.length - 2 || pointIndex < 1) {
      return;
    }
    this._stations[pointIndex] = duration;
  },
  onAdd: function (map) {
    L.Marker.prototype.onAdd.call(this, map);

    if (this.options.autostart && (!this.isStarted())) {
      this.start();
      return;
    }
    if (this.isRunning()) {
      this._resumeAnimation();
    }
  },

  onRemove: function (map) {
    L.Marker.prototype.onRemove.call(this, map);
    this._stopAnimation();
  },
  _createDurations: function (latlngs, duration) {
    let lastIndex = latlngs.length - 1;
    let distances = [];
    let totalDistance = 0;
    let distance = 0;
    // compute array of distances between points
    for (let i = 0; i < lastIndex; i++) {
      distance = latlngs[i + 1].distanceTo(latlngs[i]);
      distances.push(distance);
      totalDistance += distance;
    }
    let ratioDuration = duration / totalDistance;
    let durations = [];
    for (i = 0; i < distances.length; i++) {
      durations.push(distances[i] * ratioDuration);
    }
    return durations;
  },

  _startAnimation: function () {
    this._state = L.Marker.MovingMarker.runState;
    this._animId = L.Util.requestAnimFrame(function (timestamp) {
      this._startTime = Date.now();
      this._startTimeStamp = timestamp;
      this._animate(timestamp);
    }, this, true);
    this._animRequested = true;
  },

  _resumeAnimation: function () {
    if (!this._animRequested) {
      this._animRequested = true;
      this._animId = L.Util.requestAnimFrame(function (timestamp) {
        this._animate(timestamp);
      }, this, true);
    }
  },

  _stopAnimation: function () {
    if (this._animRequested) {
      L.Util.cancelAnimFrame(this._animId);
      this._animRequested = false;
    }
  },

  _updatePosition: function () {
    let elapsedTime = Date.now() - this._startTime;
    this._animate(this._startTimeStamp + elapsedTime, true);
  },

  _loadLine: function (index) {
    this._currentIndex = index;
    this._currentDuration = this._durations[index];
    this._currentLine = this._latlngs.slice(index, index + 2);
  },

  /**
   * Load the line where the marker is
   * @param  {Number} timestamp
   * @return {Number} elapsed time on the current line or null if
   * we reached the end or marker is at a station
   */
  _updateLine: function (timestamp) {
    // time elapsed since the last latlng
    let elapsedTime = timestamp - this._startTimeStamp;
    // not enough time to update the line
    if (elapsedTime <= this._currentDuration) {
      return elapsedTime;
    }
    let lineIndex = this._currentIndex;
    let lineDuration = this._currentDuration;
    let stationDuration;
    while (elapsedTime > lineDuration) {
      // substract time of the current line
      elapsedTime -= lineDuration;
      stationDuration = this._stations[lineIndex + 1];
      // test if there is a station at the end of the line
      if (stationDuration !== undefined) {
        if (elapsedTime < stationDuration) {
          this.setLatLng(this._latlngs[lineIndex + 1]);
          return null;
        }
        elapsedTime -= stationDuration;
      }
      lineIndex++;
      // test if we have reached the end of the polyline
      if (lineIndex >= this._latlngs.length - 1) {

        if (this.options.loop) {
          lineIndex = 0;
          this.fire('loop', {elapsedTime: elapsedTime});
        } else {
          // place the marker at the end, else it would be at
          // the last position
          this.setLatLng(this._latlngs[this._latlngs.length - 1]);
          this.stop(elapsedTime);
          return null;
        }
      }
      lineDuration = this._durations[lineIndex];
    }

    this._loadLine(lineIndex);
    this._startTimeStamp = timestamp - elapsedTime;
    this._startTime = Date.now() - elapsedTime;
    return elapsedTime;
  },

  _animate: function (timestamp, noRequestAnim) {
    this._animRequested = false;
    // find the next line and compute the new elapsedTime
    let elapsedTime = this._updateLine(timestamp);
    if (this.isEnded()) {
      // no need to animate
      return;
    }
    if (elapsedTime != null) {
      // compute the position
      let p = L.interpolatePosition(this._currentLine[0],
        this._currentLine[1],
        this._currentDuration,
        elapsedTime);
      this.setLatLng(p);
    }
    if (!noRequestAnim) {
      this._animId = L.Util.requestAnimFrame(this._animate, this, false);
      this._animRequested = true;
    }
  }
});

let movingMarker = function (latlngs, duration, options) {
  return new L.Marker.MovingMarker(latlngs, duration, options);
};
export default {
  defaultMovingOpt: {
    autostart: false,
    loop: false
  },
  defaultIconOpt: {
    iconSize: [12, 12],
    color: '#2fb'
  },
  defaultDashOpt: {dashArray: "15 15", dashSpeed: 30},
  markerMoveLayer: function (features, speed, opt) {
    let _options = this.defaultMovingOpt;
    if (opt) {
      _options = Object.assign(this.defaultMovingOpt, opt);
    }
    let latlngs = [];
    let duration = [];
    let len = features.length;
    for (let i = 0; i < len; i++) {
      let feat = features[i];
      if (feat.geometry.type !== 'Point') {
        return;
      }
      if ((i + 1) !== len) {
        let featNext = features[i + 1];
        let dy = featNext.geometry.coordinates[1] - feat.geometry.coordinates[1];
        let dx = featNext.geometry.coordinates[0] - feat.geometry.coordinates[0];
        let length = Math.sqrt(Math.pow(dy, 2) + Math.pow(dx, 2));
        let dur = Math.floor(length / speed) * 1000;
        duration.push(dur);
      }
      latlngs.push([feat.geometry.coordinates[1], feat.geometry.coordinates[0]])
    }
    return movingMarker(latlngs, duration, _options);
  },
  markerPulseLayer: function (features, opt) {
    let _options = this.defaultIconOpt;
    if (opt) {
      _options = Object.assign(this.defaultIconOpt, opt);
    }
    let layerGroup = L.layerGroup();
    let len = features.length;
    for (let i = 0; i < len; i++) {
      let feat = features[i];
      if (feat.geometry.type !== 'Point') {
        return;
      }
      let marker = L.marker([feat.geometry.coordinates[1], feat.geometry.coordinates[0]], {
        icon: L.icon.pulse(_options)
      });
      layerGroup.addLayer(marker);
    }
    return layerGroup;
  },
  movingShape: function (features, opt) {
    let _options = this.defaultIconOpt;
    if (opt) {
      _options = Object.assign(this.defaultIconOpt, opt);
    }
    let layerGroup = L.layerGroup();
    let len = features.length;
    for (let i = 0; i < len; i++) {
      let feat = features[i];
      if (feat.geometry.type === 'Point') {
        return;
      } else if (feat.geometry.type === "Polyline") {
        if (this.recursiveMax(feat.geometry.coordinates) === 2) {
          let path = [];
          for (let j = 0; j < feat.geometry.coordinates.length; j++) {
            let parts = feat.geometry.coordinates[j];
            path.push(parts.reverse());
          }
          layerGroup.addLayer(L.polyline(path, _options));
        } else {
          let path = [];
          for (let j = 0; j < feat.geometry.coordinates.length; j++) {
            let parts = feat.geometry.coordinates[j];
            let part = []
            for (let k = 0; k < parts.leading; k++) {
              part.push(parts[k].reverse());
            }
            path.push(part);
          }
          layerGroup.addLayer(L.polyline(path, _options));
        }
      } else if (feat.geometry.type === "Polygon") {
        if (this.recursiveMax(feat.geometry.coordinates) === 2) {
          let path = [];
          for (let j = 0; j < feat.geometry.coordinates.length; j++) {
            let parts = feat.geometry.coordinates[j];
            path.push(parts.reverse());
          }
          layerGroup.addLayer(L.polygon(path, _options));
        } else {
          let path = [];
          for (let j = 0; j < feat.geometry.coordinates.length; j++) {
            let parts = feat.geometry.coordinates[j];
            let part = []
            for (let k = 0; k < parts.leading; k++) {
              part.push(parts[k].reverse());
            }
            path.push(part);
          }
          layerGroup.addLayer(L.polygon(path, _options));
        }
      }
    }
    return layerGroup;
  },
  recursiveMax: function (input) {
    let flag = false;
    let num = [];
    for (let i = 0; i < input.length; i++) {
      let obj = input[i];
      if (obj instanceof Array) {
        flag = true;
        num.push(this.recursiveMax(obj));
      }
    }
    if (flag) {
      return Math.max.apply(null, num) + 1;
    } else {
      return 1
    }
  }

}
