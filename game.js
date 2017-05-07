function randint(min, max) {
    return Math.floor(Math.random() * (max-min) + min);
}

function clamp(val, min, max) {
    if (val < min) return min;
    if (val > max) return max;
    return val;
}

function wrap(val, max) {
    if (val < 0) return val + max;
    if (val >= max) return val - max;
    return val;
}

function clone(obj) {
    var newobj;
    if (null == obj || "object" != typeof obj) return obj;
    if (obj instanceof Array) {
        newobj = [];
        for (var i=0;i<obj.length;i++)
            newobj[i] = clone(obj[i]);
        return newobj;
    }
    else if (obj instanceof Object) {
        newobj = {};
        for (var key in obj)
            newobj[key] = clone(obj[key]);
        return newobj;
    }
    throw new Error("cloning error.");
}

function getDistance(o1, o2) {
    var dx = o2.x - o1.x;
    var dy = o2.y - o1.y;
    return Math.sqrt(dx*dx+dy*dy);
}

function getAngle(o1, o2) {
    var dx = o2.x - o1.x;
    var dy = o2.y - o1.y;
    return Math.atan2(dy, dx);
}

function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
}

Array.prototype.random = function() {
    return this[Math.floor(Math.random() * this.length)];
};