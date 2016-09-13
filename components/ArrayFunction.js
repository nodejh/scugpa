// 对数组的一些扩展操作
const reduceDimension = function(arr) {
  return Array.prototype.concat.apply([], arr);
};

const ArrayFunction = {
  reduceDimension: reduceDimension
};

export default ArrayFunction;
