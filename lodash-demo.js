; (function () {

  /** Detect free variable `global` from Node.js. */
  var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

  /** Detect free variable `self`. */
  // 浏览器 或 Web Worker 
  var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

  // 确定全局对象：node、浏览器/Web Worker 、
  /**
  * Function('return this')() ==> (function(){return this})()
  * 区别：
  * 1. 严格模式下 Function('return this')() 也会返回 window 而 (function(){return this})() 不会
  */
  var root = freeGlobal || freeSelf || Function('return this')();

  /** Detect free variable `exports`. */
  // 是否存在 exports 对象： exports是一个对象，不是 null，没有 nodeType（不是一个节点） ，返回 exports 对象
  var freeExports = typeof exports == 'object' && exports && !exports.nodeType && exports;

  /** Detect free variable `module`. */
  // 是否存在 module 对象： module是一个对象，不是 null，没有 nodeType（不是一个节点），返回 module 对象 
  var freeModule = freeExports && typeof module == 'object' && module && !module.nodeType && module;

  // 定义函数 lodash 
  /*----------------------------------------定义函数 lodash ----------------------------------*/

  var runInContext = (function runInContext(context) {
    context = context == null ? root : _.defaults(root.Object(), context, _.pick(root, contextProps));

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
      // if (isObjectLike(value) && !isArray(value) && !(value instanceof LazyWrapper)) {
      //   // 如果传入的 value 已经是 lodash 的实例了，那么直接返回
      //   if (value instanceof LodashWrapper) {
      //     return value;
      //   }
      //   // 传入的对象有 __wrapped__ 属性，将该对象进行处理
      //   // 可能如 { __wrapped__: [1,2,3] }
      //   if (hasOwnProperty.call(value, '__wrapped__')) {
      //     return wrapperClone(value);
      //   }
      // }
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

    return lodash;
  })


  /*--------------------------------如何导出 lodash------------------------------------------*/

  // Export lodash.
  // _ ===> lodash
  var _ = runInContext();

  // Some AMD build optimizers, like r.js, check for condition patterns like:
  if (typeof define == 'function' && typeof define.amd == 'object' && define.amd) {
    // Expose Lodash on the global object to prevent errors when Lodash is
    // loaded by a script tag in the presence of an AMD loader.
    // See http://requirejs.org/docs/errors.html#mismatch for more details.
    // Use `_.noConflict` to remove Lodash from the global object.
    /**
       * 1. 在全局对象上公开Lodash，以防止在存在AMD加载程序的情况下由脚本标记加载Lodash时出错
       * 2. 使用 `_.noConflict` 从全局对象中删除Lodash。// 提供 noConflict 方法，用户调用该方法进行重新命名，然后恢复原来的 _ 变量
       */
    root._ = _;

    // Define as an anonymous module so, through path mapping, it can be
    // referenced as the "underscore" module.
    define(function () {
      // amd 规范导出
      return _;
    });
  }
  // Check for `exports` after `define` in case a build optimizer adds it.
  // nodejs 中使用
  else if (freeModule) {
    // Export for Node.js.
    // module.exports 和 exports 两种方式导出
    (freeModule.exports = _)._ = _;
    // Export for CommonJS support.
    freeExports._ = _;
  }
  else {
    // Export to the global object.
    // 浏览器中
    root._ = _;
  }

}.call(this))