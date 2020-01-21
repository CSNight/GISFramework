export function optionFill(source, template) {
  if (!source || source === {}) {
    return new Proxy(template, {});
  }
  let temp = JSON.parse(JSON.stringify(template));
  for (let key in temp) {
    if (source.hasOwnProperty(key)) {
      temp[key] = source[key];
    }
  }
  for (let key in source) {
    if (!temp.hasOwnProperty(key)) {
      temp[key] = source[key];
    }
  }
  return new Proxy(temp, {});
}

export function resetStyleHandler(layer) {
  let handler = {
    //setStyle 后 同步options 内容至$options
    apply: function (target, _this, args) {
      let result = Reflect.apply(...arguments);
      layer.$options = Object.assign(layer.$options, ...args);
      layer.redraw();
      return result;
    }
  };
  //直接修改options 更新属性 设置样式，重绘
  let handlerLayer = {
    set: function (target, p, value, receiver) {
      Reflect.set(target, p, value, receiver);
      if (p === 'options') {
        target.option = optionFill(target[p], target.$options);
        target.setStyle(target.option);
        target.redraw();
      }
      return true;
    }
  };
  if (layer.setStyle) {
    if (!layer.$options) {
      layer.$options = {};
    }
    layer.setStyle = new Proxy(layer.setStyle, handler);
    layer = new Proxy(layer, handlerLayer);
  }
  return layer;
}
