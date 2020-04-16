let Utils = {
  deg2rad: function (deg) {
    return deg / 180 * Math.PI;
  },
  rad2deg: function (ang) {
    return ang / (Math.PI / 180.0);
  },
  floorMod: function (a, n) {
    return a - n * Math.floor(a / n);
  },
  isValue: function (x) {
    return x !== null && x !== undefined;
  },
  mercY: function (lat) {
    return Math.log(Math.tan(lat / 2 + Math.PI / 4));
  },
  isMobile: function () {
    return (/android|blackberry|iemobile|ipad|iphone|ipod|opera mini|webos/i).test(navigator.userAgent);
  }
};
let FlowField = function () {
  const halfPI = 2 * Math.PI;
  const H = Math.pow(10, -5.2);
  let animationLoop = null;
  let columns = []; //插值网格
  let buckets = [];
  let gridBuilder;
  let particles = [];

  let _options = {
    BASE: 'leaflet',
    PARTICLE_LINE_WIDTH: 1.5,              // line width of a drawn particle
    PARTICLE_MULTIPLIER: 1 / 500,         // particle count scalar (completely arbitrary--this values looks nice)
    PARTICLE_REDUCTION: 0.75,            // reduce particle count to this much of normal for mobile devices
    MAX_PARTICLE_AGE: 100,               // max number of frames a particle is drawn before regeneration
    //没有风的情况
    NULL_WIND_VECTOR: [NaN, NaN, null],
    min_color: 0, // 风速为0使用的颜色
    max_color: 12, // 风速最大使用的颜色
    FRAME_RATE: 35, //定义每秒执行的次数
    FRAME_TIME: 0, // desired frames per second
    globalAlpha: 0.92, //定义透明度，透明度越大，尾巴越长
    //存放颜色的数组
    // colorScale: [
    //   "rgb(0,255,255)", "rgb(100,240,255)", "rgb(135,225,255)",
    //   "rgb(160,208,255)", "rgb(181,192,255)", "rgb(198,173,255)",
    //   "rgb(212,155,255)", "rgb(225,133,255)", "rgb(236,109,255)",
    //   "rgb(255,30,219)", "rgb(245,82,162)", "rgb(245,84,82)",
    //   "rgb(237,45,28)", "rgb(220,24,32)", "rgb(180,0,35)"
    // ],
    colorScale: [
      "rgb(36,104, 180)", "rgb(60,157, 194)", "rgb(128,205,193 )",
      "rgb(151,218,168 )", "rgb(198,231,181)", "rgb(238,247,217)",
      "rgb(255,238,159)", "rgb(252,217,125)", "rgb(255,182,100)",
      "rgb(252,150,75)", "rgb(250,112,52)", "rgb(245,64,32)",
      "rgb(237,45,28)", "rgb(220,24,32)", "rgb(180,0,35)"
    ],
    //粒子动画的速度，为参数乘以屏幕的像素密度开三次方
    //如果不支持像素密度，就乘以1,
    VELOCITY_SCALE: 0.01,
    data: [],
    map: null
  };

  //start function debounce
  function debounce(fn, wait) {
    let timeout = null;
    return function () {
      let context = this
      if (timeout !== null)
        clearTimeout(timeout);
      timeout = setTimeout(() => {
        fn.apply(context, arguments)
      }, wait);
    }
  }

  //投影
  function project(lat, lon, windy) {
    // both in radians, use deg2rad if neccessary
    let ymin = Utils.mercY(windy.south);
    let ymax = Utils.mercY(windy.north);
    let xFactor = windy.width / (windy.east - windy.west);
    let yFactor = windy.height / (ymax - ymin);

    let y = Utils.mercY(Utils.deg2rad(lat));
    let x = (Utils.deg2rad(lon) - windy.west) * xFactor;
    y = (ymax - y) * yFactor; // y points south
    return [x, y];
  }

  //扭曲
  function distort(projection, λ, φ, x, y, scale, wind, windy) {
    //projection是一个空的对象
    // λ, φ格点的经纬度
    //x, y格点所在的像素点
    //格点的风向风速
    //windy
    //scale 一个参数，每次粒子运动的距离
    let u = wind[0] * scale;
    let v = wind[1] * scale;
    let d = distortion(projection, λ, φ, x, y, windy);

    // Scale distortion vectors by u and v, then add.
    wind[0] = d[0] * u + d[2] * v;
    wind[1] = d[1] * u + d[3] * v;
    return wind;
  }

  function distortion(projection, λ, φ, x, y, windy) {
    let hλ = λ < 0 ? H : -H;
    let hφ = φ < 0 ? H : -H;
    let pλ = project(φ, λ + hλ, windy);
    let pφ = project(φ + hφ, λ, windy);

    // Meridian scale factor (see Snyder, equation 4-3), where R = 1. This handles issue where length of 1º λ
    // changes depending on φ. Without this, there is a pinching effect at the poles.
    let k = Math.cos(φ / 360 * halfPI);
    return [
      (pλ[0] - x) / hλ / k,
      (pλ[1] - y) / hλ / k,
      (pφ[0] - x) / hφ,
      (pφ[1] - y) / hφ
    ];
  }

  //grid双线性差值
  function biLinearInterpolateVector(x, y, g00, g10, g01, g11) {
    let rx = (1 - x);
    let ry = (1 - y);
    let a = rx * ry, b = x * ry, c = rx * y, d = x * y;
    let u = g00[0] * a + g10[0] * b + g01[0] * c + g11[0] * d; //wind u vector weight
    let v = g00[1] * a + g10[1] * b + g01[1] * c + g11[1] * d; //wind v vector weight
    return [u, v, Math.sqrt(u * u + v * v)]; //[u,v,magnitude] magnitude is wind strength
  }

  //create wind data builder provide data getter and interpolate function
  function createFlowBuilder(uComp, vComp) {
    let uData = uComp.data, vData = vComp.data;
    return {
      header: uComp.header,
      //recipe: recipeFor("wind-" + uComp.header.surface1Value),
      data: function (i) {
        return [uData[i], vData[i]];
      },
      interpolate: biLinearInterpolateVector
    }
  }

  //filter the GFS data for wind with category and parameter number like 1,2;2,2;(u vector)2,3;1,3(v vector)
  function createBuilder(data) {
    let uComp = null, vComp = null, scalar = null;
    data.forEach(function (record) {
      switch (record.header.parameterCategory + "," + record.header.parameterNumber) {
        case "2,2":
          uComp = record;
          break;
        case "2,3":
          vComp = record;
          break;
        default:
          scalar = record;
      }
    });
    return createFlowBuilder(uComp, vComp);
  }

  // map the grid coordinates to real lat lng
  function invert(x, y, extents) {
    let mapLonDelta = extents.east - extents.west;
    let worldMapRadius = extents.width / Utils.rad2deg(mapLonDelta) * 360 / (2 * Math.PI);
    let mapOffsetY = (worldMapRadius / 2 * Math.log((1 + Math.sin(extents.south)) / (1 - Math.sin(extents.south))));
    let equatorY = extents.height + mapOffsetY;
    let a = (equatorY - y) / worldMapRadius;

    let lat = 180 / Math.PI * (2 * Math.atan(Math.exp(a)) - Math.PI / 2);
    let lon = Utils.rad2deg(extents.west) + x / extents.width * Utils.rad2deg(mapLonDelta);
    return [lon, lat];
  }

  //initialize the data to 3d grid
  let buildGrid = function () {
    let builder = createBuilder(_options.data);

    let header = builder.header;
    let X0 = header.lo1;
    let Y0 = header.la1;  // the grid's origin (e.g., 0.0E, 90.0N)
    let deltaX = header.dx;
    let deltaY = header.dy;    // distance between grid points (e.g., 1.0 deg lon, 1.0 deg lat)
    let ni = header.nx;    // number of grid points W-E (e.g., 360)
    let nj = header.ny;    // number of grid points N-S (e.g., 181)
    let date = new Date(header.refTime);
    date.setHours(date.getHours() + header.forecastTime);

    let grid = [], p = 0;
    let isContinuous = Math.floor(ni * deltaX) >= 360;
    for (let j = 0; j < nj; j++) {
      let row = [];
      for (let i = 0; i < ni; i++, p++) {
        row[i] = builder.data(p);
      }
      if (isContinuous) {
        // For wrapped grids, duplicate first column as last column to simplify interpolation logic
        row.push(row[0]);
      }
      grid[j] = row;
    }

    function interpolate(λ, φ) {
      let i = Utils.floorMod(λ - X0, 360) / deltaX;  // calculate longitude index in wrapped range [0, 360)
      let j = (Y0 - φ) / deltaY;                            // calculate latitude index in direction +90 to -90

      let fi = Math.floor(i);
      let fj = Math.floor(j);
      let ci = fi + 1;
      let cj = fj + 1;
      let row;
      if ((row = grid[fj])) {
        let g00 = row[fi];
        let g10 = row[ci];
        if (Utils.isValue(g00) && Utils.isValue(g10) && (row = grid[cj])) {
          let g01 = row[fi];
          let g11 = row[ci];
          if (Utils.isValue(g01) && Utils.isValue(g11)) {
            // All four points found, so interpolate the value.
            return builder.interpolate(i - fi, j - fj, g00, g10, g01, g11);
          }
        }
      }
      return null;
    }

    return {
      date: date,
      interpolate: interpolate
    };
  };

  //create the wind field random data
  function createField(bounds, callback) {
    /**
     * @returns {Array} wind vector [u, v, magnitude] at the point (x, y), or [NaN, NaN, null] if wind
     *          is undefined at that point.
     */
    function field(x, y) {
      let column = columns[Math.round(x)];
      return column && column[Math.round(y)] || _options.NULL_WIND_VECTOR;
    }

    field.randomize = function (o) {  // UNDONE: this method is terrible
      let x, y;
      let safetyNet = 0;
      do {
        //random wind particle x y
        x = Math.round(Math.floor(Math.random() * bounds.width) + bounds.x);
        y = Math.round(Math.floor(Math.random() * bounds.height) + bounds.y)
      } while (field(x, y)[2] === null && safetyNet++ < 30);
      o.x = x;
      o.y = y;
      return o;
    };
    callback(bounds, field);
  }

  //fill the interpolate grid with wind field
  let interpolateField = function (bounds, extent, callback) {
    let projection = {};
    let mapArea = ((extent.south - extent.north) * (extent.west - extent.east));
    let velocityScale = _options.VELOCITY_SCALE * Math.pow(Math.abs(mapArea), 0.3);
    columns = [];
    let x = bounds.x;

    function interpolateColumn(x) {
      let column = [];
      //画布上的每两个像素是一个格点
      for (let y = bounds.y; y <= bounds.yMax; y += 2) {
        let coords = invert(x, y, extent);
        //求出每一个格点所对应的经纬度
        if (coords) {
          let λ = coords[0]; //经度
          let φ = coords[1]; //纬度
          //监测经度是不是数字
          if (isFinite(λ)) {
            let wind = gridBuilder.interpolate(λ, φ);
            //每一个格点的uv和风速大小
            if (wind) {
              wind = distort(projection, λ, φ, x, y, velocityScale, wind, extent);
              column[y + 1] = column[y] = wind;
            }
          }
        }
      }
      columns[x + 1] = columns[x] = column;
    }

    (function batchInterpolate() {
      let start = Date.now();
      while (x < bounds.width) {
        interpolateColumn(x);
        x += 2;
        if ((Date.now() - start) > 1000) { //MAX_TASK_TIME) {
          setTimeout(batchInterpolate, 25);
          return;
        }
      }
      createField(bounds, callback);
    })();
  };

  function buildBounds(bounds, width, height) {
    let upperLeft = bounds[0];
    let lowerRight = bounds[1];
    let x = Math.round(upperLeft[0]); //Math.max(Math.floor(upperLeft[0], 0), 0);
    let y = Math.max(Math.floor(upperLeft[1], 0), 0);
    let xMax = Math.min(Math.ceil(lowerRight[0], width), width - 1);
    let yMax = Math.min(Math.ceil(lowerRight[1], height), height - 1);
    return {x: x, y: y, xMax: width, yMax: yMax, width: width, height: height};
  }

  //build the canvas layer for leaflet
  function leafletBuilder() {
    if (!_options.canvas) {
      _options.canvas = L.DomUtil.create("canvas", "can");
      _options.canvas.height = _options.map.getSize().y;
      _options.canvas.width = _options.map.getSize().x;
      let animated = _options.map.options.zoomAnimation && L.Browser.any3d;
      //添加下面的class之后，图层可以随着地图缩放变化
      L.DomUtil.addClass(_options.canvas, 'leaflet-zoom-' + (animated ? 'animated' : 'hide'));
      //把画布添加到overlayPane图层中
      _options.map._panes.overlayPane.appendChild(_options.canvas);
      let fadeFillStyle = "rgba(0, 0, 0, 0.97)";
      _options.context = _options.canvas.getContext("2d");
      _options.context.lineWidth = _options.PARTICLE_LINE_WIDTH;
      _options.context.fillStyle = fadeFillStyle;
      _options.context.globalAlpha = _options.globalAlpha;
      _options.map.on("zoomanim", function (e) {
        let scale = _options.map.getZoomScale(e.zoom);
        // -- different calc of offset in leaflet 1.0.0 and 0.0.7 thanks for 1.0.0-rc2 calc @jduggan1
        let offset = _options.map._latLngToNewLayerPoint(_options.map.getBounds().getNorthWest(), e.zoom, e.center);

        L.DomUtil.setTransform(_options.canvas, offset, scale);
      });
      _options.map.on("moveend", function () {
        window.cancelAnimationFrame(animationLoop);
        _options.context.clearRect(0, 0, _options.map.getSize().x, _options.map.getSize().y);
        _options.canvas.height = _options.map.getSize().y;
        _options.canvas.width = _options.map.getSize().x;
        _options.context.lineWidth = _options.PARTICLE_LINE_WIDTH;
        _options.context.fillStyle = fadeFillStyle;
        _options.context.globalAlpha = _options.globalAlpha;
        let bound = _options.map.getBounds();
        let yun_lat1 = bound._northEast.lat;
        let yun_lon2 = bound._southWest.lng;
        let new_position = _options.map.latLngToLayerPoint([yun_lat1, yun_lon2]);
        L.DomUtil.setPosition(_options.canvas, new_position);
        stop();
        start(_options.map.getBounds());
      })
    }
  }

  //build the canvas layer for AMap
  function aMapCanvasBuilder() {
    if (!_options.canvas) {
      _options.canvas = document.createElement('canvas');
      _options.canvas.height = _options.map.getSize().getHeight();
      _options.canvas.width = _options.map.getSize().getWidth();
      let CanvasLayer = new AMap.CanvasLayer({
        canvas: _options.canvas,
        bounds: _options.map.getBounds(),
        zooms: _options.map.getZooms()
      });

      let fadeFillStyle = "rgba(0, 0, 0, 0.97)";
      _options.context = _options.canvas.getContext("2d");
      _options.context.lineWidth = _options.PARTICLE_LINE_WIDTH;
      _options.context.fillStyle = fadeFillStyle;
      _options.context.globalAlpha = _options.globalAlpha;
      CanvasLayer.setMap(_options.map);
      _options.map.on("zoomend", function (e) {
        const retina = AMap.Browser.retina;
        const [width, height] = [_options.map.getSize().width, _options.map.getSize().height];
        //多浏览器支持
        _options.canvas.width = width * retina;
        _options.canvas.height = height * retina;
        const bounds = _options.map.getBounds();
        if (CanvasLayer) {
          CanvasLayer.setBounds(bounds);
        }
      });

      _options.map.on("moveend", function () {
        window.cancelAnimationFrame(animationLoop);
        _options.context.clearRect(0, 0, _options.map.getSize().getWidth(), _options.map.getSize().getHeight());
        _options.canvas.height = _options.map.getSize().getHeight();
        _options.canvas.width = _options.map.getSize().getWidth();
        _options.context.lineWidth = _options.PARTICLE_LINE_WIDTH;
        _options.context.fillStyle = fadeFillStyle;
        _options.context.globalAlpha = _options.globalAlpha;
        const bounds = _options.map.getBounds();
        if (CanvasLayer) {
          CanvasLayer.setBounds(bounds);
        }
        stop();
        start(_options.map.getBounds());
      })
    }
  }

  //choose the canvas builder by options BASE field
  let canvasLayerBuilder = function () {
    switch (_options.BASE) {
      default:
      case"leaflet":
        return leafletBuilder;
      case"amap":
        return aMapCanvasBuilder;
    }
  };

  function extentBuilder(bound) {
    switch (_options.BASE) {
      default:
      case"leaflet":
        return {
          south: Utils.deg2rad(bound.getSouthEast().lat),
          north: Utils.deg2rad(bound.getNorthWest().lat),
          east: Utils.deg2rad(bound.getSouthEast().lng),
          west: Utils.deg2rad(bound.getNorthWest().lng),
          width: _options.map.getSize().x,
          height: _options.map.getSize().y
        };
      case"amap":
        return {
          south: Utils.deg2rad(bound.getSouthEast().lat),
          north: Utils.deg2rad(bound.getNorthWest().lat),
          east: Utils.deg2rad(bound.getSouthEast().lng),
          west: Utils.deg2rad(bound.getNorthWest().lng),
          width: _options.map.getSize().getWidth(),
          height: _options.map.getSize().getHeight()
        };
    }
  }

  let start = function (bound) {
    let extent = extentBuilder(bound);
    let bounds = [[0, 0], [extent.width, extent.height]]
    interpolateField(buildBounds(bounds, extent.width, extent.height), extent, (bounds, field) => {
      buckets = _options.colorScale.map(function () {
        return [];
      });
      let particleCount = Math.round(bounds.width * bounds.height * _options.PARTICLE_MULTIPLIER);
      if (Utils.isMobile()) {
        particleCount *= _options.PARTICLE_REDUCTION;
      }
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push(field.randomize({age: Math.floor(Math.random() * _options.MAX_PARTICLE_AGE)}));
      }
      flowF.field = field;
      setTimeout(() => {
        let then = Date.now();
        (function frame() {
          animationLoop = requestAnimationFrame(frame);
          let now = Date.now();
          let delta = now - then;
          if (delta > _options.FRAME_TIME) {
            then = now - delta % _options.FRAME_TIME;
            evolve(field);
            draw();
          }
        })();
      }, 200)
    });
  };
  let stop = function () {
    if (animationLoop) cancelAnimationFrame(animationLoop);
  };

  let startDeb = debounce(start, 500);

  function evolve(field) {
    buckets.forEach(function (bucket) {
      bucket.length = 0;
    });
    for (let i = 0; i < particles.length; i++) {
      let particle = particles[i];
      if (particle.age > _options.MAX_PARTICLE_AGE) {
        field.randomize(particle).age = 0;
      }
      let x = particle.x;
      let y = particle.y;
      let v = field(x, y);  // vector at current position
      let m = v[2];
      if (m === null) {
        particle.age = _options.MAX_PARTICLE_AGE;  // particle has escaped the grid, never to return...
      } else {
        let xt = x + v[0];
        let yt = y + v[1];
        if (field(xt, yt)[2] !== null) {
          // Path from (x,y) to (xt,yt) is visible, so add this particle to the appropriate draw bucket.
          particle.xt = xt;
          particle.yt = yt;
          buckets[_options.colorScale.indexFor(m)].push(particle);
        } else {
          // Particle isn't visible, but it still moves through the field.
          particle.x = xt;
          particle.y = yt;
        }
      }
      particle.age += 1;
    }
  }

  function draw() {
    // Fade existing particle trails.
    let prev = "lighter";
    _options.context.globalCompositeOperation = "destination-in";
    _options.context.fillRect(0, 0, _options.canvas.width, _options.canvas.height);
    _options.context.globalCompositeOperation = prev;
    _options.context.globalAlpha = _options.globalAlpha;

    // Draw new particle trails.
    //buckets是把风点按照不同颜色分级，分成的数组
    //数组的每一项是一个对象，
    buckets.forEach(function (bucket, i) {
      if (bucket.length > 0) {
        _options.context.beginPath();
        _options.context.strokeStyle = _options.colorScale[i];
        bucket.forEach(function (particle) {
          _options.context.moveTo(particle.x, particle.y);
          _options.context.lineTo(particle.xt, particle.yt);
          particle.x = particle.xt;
          particle.y = particle.yt;
        });
        _options.context.stroke();
      }
    });
  }

  let setOptions = function (options) {
    _options = Object.assign(_options, options);
    if (!_options.data || _options.data.length === 0 || !map) {
      throw Error('Data option can not be null or empty');
    }
    if (!map) {
      throw Error('map option can not be null or empty');
    }
    _options.FRAME_TIME = 1000 / _options.FRAME_RATE;
    _options.colorScale.indexFor = (m) => {
      // map velocity speed to a style
      return Math.max(
        0,
        Math.min(_options.colorScale.length - 1,
          Math.round((m - _options.max_color) / (_options.max_color - _options.min_color) * (_options.colorScale.length - 1))));
    };
    columns = []; //插值网格
    buckets = _options.colorScale.map(function () {
      return [];
    });
    let canvasBuilder = canvasLayerBuilder();
    canvasBuilder();
    gridBuilder = buildGrid();
  };
  let setSpeed = function (speed) {
    if (speed > 0 && speed <= 100) {
      _options.FRAME_RATE = speed;
      _options.FRAME_TIME = 1000 / _options.FRAME_RATE;
    }
  };
  let setDensity = function (density) {
    if (density > 100 && density <= 500) {
      _options.PARTICLE_MULTIPLIER = 1 / density;
    }
  };
  let setWindTail = function (tailLength) {
    if (tailLength > 0 && tailLength <= 1) {
      _options.globalAlpha = tailLength;
      _options.context.globalAlpha = _options.globalAlpha
    }
  };
  let setWidth = function (width) {
    if (width > 0 && width <= 10) {
      _options.PARTICLE_LINE_WIDTH = width;
      _options.context.lineWidth = _options.PARTICLE_LINE_WIDTH;
    }
  };
  let getSpeed = function () {
    return _options.FRAME_RATE;
  };
  let getDensity = function () {
    return _options.PARTICLE_MULTIPLIER;
  };
  let getWindTail = function () {
    return _options.globalAlpha;
  };
  let getWidth = function () {
    return _options.PARTICLE_LINE_WIDTH;
  };
  let flowF = {
    start: startDeb,
    stop: stop,
    setOptions: setOptions,
    setDensity: setDensity,
    setSpeed: setSpeed,
    setWindTail: setWindTail,
    setWidth: setWidth,
    getDensity: getDensity,
    getSpeed: getSpeed,
    getWindTail: getWindTail,
    getWidth: getWidth
  };
  return flowF;
};
export {FlowField}
