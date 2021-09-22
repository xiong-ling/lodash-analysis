; (function () {

  // 定义函数 lodash 
  /**
   * @name _
   * @constructor
   * @category Seq
   * @param {*} value The value to wrap in a `lodash` instance.
   * @returns {Object} Returns the new `lodash` wrapper instance.
   * @example 
   */
  function lodash(value) {
    /**
     * isObjectLike 检查 value 是否是 类对象。 如果一个值是类对象，那么它不应该是 null，而且 typeof 后的结果是 "object"。
     * 是类数组、不是数组、并且不是 LazyWrapper 的实例（惰性求值）
     * _.isObjectLike({});  ==> true
     */
    if (isObjectLike(value) && !isArray(value) && !(value instanceof LazyWrapper)) {
      // 如果传入的 value 已经是 lodash 的实例了，那么直接返回
      if (value instanceof LodashWrapper) {
        return value;
      }
      // 传入的对象有 __wrapped__ 属性，将该对象进行处理
      // 可能如 { __wrapped__: [1,2,3] }
      if (hasOwnProperty.call(value, '__wrapped__')) {
        return wrapperClone(value);
      }
    }
    // 返回 LodashWrapper 实例
    return new LodashWrapper(value);
  }

  /**
  * The base constructor for creating `lodash` wrapper objects.
  *
  * @private
  * @param {*} value The value to wrap.
  * @param {boolean} [chainAll] Enable explicit method chain sequences.
  */
  function LodashWrapper(value, chainAll) {
    // 存的值
    this.__wrapped__ = value;
    // 存放待执行的函数体func， 函数参数 args，函数执行的this 指向 thisArg。
    this.__actions__ = [];
    // 启用链式调用
    this.__chain__ = !!chainAll;
    // 索引值 默认 0
    this.__index__ = 0;
    // 主要clone时使用
    this.__values__ = undefined;
  }

  objectCreate = Object.create

  /**
   * The base implementation of `_.create` without support for assigning
   * properties to the created object.
   *
   * @private
   * @param {Object} proto The object to inherit from.
   * @returns {Object} Returns the new object.
  */
  /**
   * 立即执行函数
   * 
   */
  var baseCreate = (function () {
    // 定义了一个函数
    function object() { }
    // 返回一个函数，该函数接受一个 原型对象 proto
    return function (proto) {
      // 传入的原型对象proto 不是对象object也不是function 是null，则返回 {}
      if (!isObject(proto)) {
        return {};
      }
      // Object.create 方法进行 原型对象 创建
      // Object.create()方法创建一个新对象，使用现有的对象来提供新创建的对象的__proto__
      if (objectCreate) {
        return objectCreate(proto);
      }
      // proto 是一个对象并且不支持原生方法 Object.create
      // 原型继承
      object.prototype = proto;
      var result = new object;
      // 还原 prototype
      object.prototype = undefined;
      return result;
    };
  }());

  /**
   * The function whose prototype chain sequence wrappers inherit from.
   *
   * @private
   */
  function baseLodash() {
    // No operation performed.
  }

  // Ensure wrappers are instances of `baseLodash`.
  // 继承,把 constructor 指回自己
  lodash.prototype = baseLodash.prototype;
  lodash.prototype.constructor = lodash;

  // 与上类似
  LodashWrapper.prototype = baseCreate(baseLodash.prototype);
  LodashWrapper.prototype.constructor = LodashWrapper;

  /**
  * Creates a clone of `wrapper`.
  *
  * @private
  * @param {Object} wrapper The wrapper to clone.
  * @returns {Object} Returns the cloned wrapper.
  */
  function wrapperClone(wrapper) {
    // 传入的 wrapper 是 LazyWrapper 的实例，那么调用 clone 方法
    if (wrapper instanceof LazyWrapper) {
      return wrapper.clone();
    }
    /**
     * 对应一：
     *  lodash函数 中调用的 wrapperClone(value); { __wrapped__: [1,2,3], __chain__: false }
     *  __wrapped__: 值 
     *  __chain__: 是否链式调用
     * 返回实例 result，然后 依次取其他值，复制为初始值
     */
    var result = new LodashWrapper(wrapper.__wrapped__, wrapper.__chain__);
    result.__actions__ = copyArray(wrapper.__actions__);
    result.__index__ = wrapper.__index__;
    result.__values__ = wrapper.__values__;
    return result;
  }

  // 对象或函数
  function isObject(value) {
    var type = typeof value;
    return value != null && (type == 'object' || type == 'function');
  }

  // 对象、函数、还有数组等其他复杂类型数据
  function isObjectLike(value) {
    return value != null && typeof value == 'object';
  }

}.call(this))