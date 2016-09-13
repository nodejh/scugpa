// 对数组的一些扩展操作

var reduceDimension = function(arr) {
  return Array.prototype.concat.apply([], arr);
};

module.exports = {
  reduceDimension
};
