'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var contracts = require('@ethersproject/contracts');
var bignumber = require('@ethersproject/bignumber');
var bytes = require('@ethersproject/bytes');
var ethSigUtil = require('eth-sig-util');
var ethereumjsUtil = require('ethereumjs-util');

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }

  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}

function _asyncToGenerator(fn) {
  return function () {
    var self = this,
        args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);

      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }

      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }

      _next(undefined);
    });
  };
}

function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var runtime_1 = createCommonjsModule(function (module) {
/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var runtime = (function (exports) {

  var Op = Object.prototype;
  var hasOwn = Op.hasOwnProperty;
  var undefined$1; // More compressible than void 0.
  var $Symbol = typeof Symbol === "function" ? Symbol : {};
  var iteratorSymbol = $Symbol.iterator || "@@iterator";
  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  function define(obj, key, value) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
    return obj[key];
  }
  try {
    // IE 8 has a broken Object.defineProperty that only works on DOM objects.
    define({}, "");
  } catch (err) {
    define = function(obj, key, value) {
      return obj[key] = value;
    };
  }

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
    var generator = Object.create(protoGenerator.prototype);
    var context = new Context(tryLocsList || []);

    // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.
    generator._invoke = makeInvokeMethod(innerFn, self, context);

    return generator;
  }
  exports.wrap = wrap;

  // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.
  function tryCatch(fn, obj, arg) {
    try {
      return { type: "normal", arg: fn.call(obj, arg) };
    } catch (err) {
      return { type: "throw", arg: err };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed";

  // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.
  var ContinueSentinel = {};

  // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}

  // This is a polyfill for %IteratorPrototype% for environments that
  // don't natively support it.
  var IteratorPrototype = {};
  define(IteratorPrototype, iteratorSymbol, function () {
    return this;
  });

  var getProto = Object.getPrototypeOf;
  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  if (NativeIteratorPrototype &&
      NativeIteratorPrototype !== Op &&
      hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
    // This environment has a native %IteratorPrototype%; use it instead
    // of the polyfill.
    IteratorPrototype = NativeIteratorPrototype;
  }

  var Gp = GeneratorFunctionPrototype.prototype =
    Generator.prototype = Object.create(IteratorPrototype);
  GeneratorFunction.prototype = GeneratorFunctionPrototype;
  define(Gp, "constructor", GeneratorFunctionPrototype);
  define(GeneratorFunctionPrototype, "constructor", GeneratorFunction);
  GeneratorFunction.displayName = define(
    GeneratorFunctionPrototype,
    toStringTagSymbol,
    "GeneratorFunction"
  );

  // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function(method) {
      define(prototype, method, function(arg) {
        return this._invoke(method, arg);
      });
    });
  }

  exports.isGeneratorFunction = function(genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor
      ? ctor === GeneratorFunction ||
        // For the native GeneratorFunction constructor, the best we can
        // do is to check its .name property.
        (ctor.displayName || ctor.name) === "GeneratorFunction"
      : false;
  };

  exports.mark = function(genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
      define(genFun, toStringTagSymbol, "GeneratorFunction");
    }
    genFun.prototype = Object.create(Gp);
    return genFun;
  };

  // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `hasOwn.call(value, "__await")` to determine if the yielded value is
  // meant to be awaited.
  exports.awrap = function(arg) {
    return { __await: arg };
  };

  function AsyncIterator(generator, PromiseImpl) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;
        if (value &&
            typeof value === "object" &&
            hasOwn.call(value, "__await")) {
          return PromiseImpl.resolve(value.__await).then(function(value) {
            invoke("next", value, resolve, reject);
          }, function(err) {
            invoke("throw", err, resolve, reject);
          });
        }

        return PromiseImpl.resolve(value).then(function(unwrapped) {
          // When a yielded Promise is resolved, its final value becomes
          // the .value of the Promise<{value,done}> result for the
          // current iteration.
          result.value = unwrapped;
          resolve(result);
        }, function(error) {
          // If a rejected Promise was yielded, throw the rejection back
          // into the async generator function so it can be handled there.
          return invoke("throw", error, resolve, reject);
        });
      }
    }

    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new PromiseImpl(function(resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise =
        // If enqueue has been called before, then we want to wait until
        // all previous Promises have been resolved before calling invoke,
        // so that results are always delivered in the correct order. If
        // enqueue has not been called before, then it is important to
        // call invoke immediately, without waiting on a callback to fire,
        // so that the async generator function has the opportunity to do
        // any necessary setup in a predictable way. This predictability
        // is why the Promise constructor synchronously invokes its
        // executor callback, and why async functions synchronously
        // execute code before the first await. Since we implement simple
        // async functions in terms of async generators, it is especially
        // important to get this right, even though it requires care.
        previousPromise ? previousPromise.then(
          callInvokeWithMethodAndArg,
          // Avoid propagating failures to Promises returned by later
          // invocations of the iterator.
          callInvokeWithMethodAndArg
        ) : callInvokeWithMethodAndArg();
    }

    // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).
    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);
  define(AsyncIterator.prototype, asyncIteratorSymbol, function () {
    return this;
  });
  exports.AsyncIterator = AsyncIterator;

  // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.
  exports.async = function(innerFn, outerFn, self, tryLocsList, PromiseImpl) {
    if (PromiseImpl === void 0) PromiseImpl = Promise;

    var iter = new AsyncIterator(
      wrap(innerFn, outerFn, self, tryLocsList),
      PromiseImpl
    );

    return exports.isGeneratorFunction(outerFn)
      ? iter // If outerFn is a generator, return the full iterator.
      : iter.next().then(function(result) {
          return result.done ? result.value : iter.next();
        });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;

    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        }

        // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
        return doneResult();
      }

      context.method = method;
      context.arg = arg;

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);
          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }

        if (context.method === "next") {
          // Setting context._sent for legacy support of Babel's
          // function.sent implementation.
          context.sent = context._sent = context.arg;

        } else if (context.method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw context.arg;
          }

          context.dispatchException(context.arg);

        } else if (context.method === "return") {
          context.abrupt("return", context.arg);
        }

        state = GenStateExecuting;

        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done
            ? GenStateCompleted
            : GenStateSuspendedYield;

          if (record.arg === ContinueSentinel) {
            continue;
          }

          return {
            value: record.arg,
            done: context.done
          };

        } else if (record.type === "throw") {
          state = GenStateCompleted;
          // Dispatch the exception by looping back around to the
          // context.dispatchException(context.arg) call above.
          context.method = "throw";
          context.arg = record.arg;
        }
      }
    };
  }

  // Call delegate.iterator[context.method](context.arg) and handle the
  // result, either by returning a { value, done } result from the
  // delegate iterator, or by modifying context.method and context.arg,
  // setting context.delegate to null, and returning the ContinueSentinel.
  function maybeInvokeDelegate(delegate, context) {
    var method = delegate.iterator[context.method];
    if (method === undefined$1) {
      // A .throw or .return when the delegate iterator has no .throw
      // method always terminates the yield* loop.
      context.delegate = null;

      if (context.method === "throw") {
        // Note: ["return"] must be used for ES3 parsing compatibility.
        if (delegate.iterator["return"]) {
          // If the delegate iterator has a return method, give it a
          // chance to clean up.
          context.method = "return";
          context.arg = undefined$1;
          maybeInvokeDelegate(delegate, context);

          if (context.method === "throw") {
            // If maybeInvokeDelegate(context) changed context.method from
            // "return" to "throw", let that override the TypeError below.
            return ContinueSentinel;
          }
        }

        context.method = "throw";
        context.arg = new TypeError(
          "The iterator does not provide a 'throw' method");
      }

      return ContinueSentinel;
    }

    var record = tryCatch(method, delegate.iterator, context.arg);

    if (record.type === "throw") {
      context.method = "throw";
      context.arg = record.arg;
      context.delegate = null;
      return ContinueSentinel;
    }

    var info = record.arg;

    if (! info) {
      context.method = "throw";
      context.arg = new TypeError("iterator result is not an object");
      context.delegate = null;
      return ContinueSentinel;
    }

    if (info.done) {
      // Assign the result of the finished delegate to the temporary
      // variable specified by delegate.resultName (see delegateYield).
      context[delegate.resultName] = info.value;

      // Resume execution at the desired location (see delegateYield).
      context.next = delegate.nextLoc;

      // If context.method was "throw" but the delegate handled the
      // exception, let the outer generator proceed normally. If
      // context.method was "next", forget context.arg since it has been
      // "consumed" by the delegate iterator. If context.method was
      // "return", allow the original .return call to continue in the
      // outer generator.
      if (context.method !== "return") {
        context.method = "next";
        context.arg = undefined$1;
      }

    } else {
      // Re-yield the result returned by the delegate method.
      return info;
    }

    // The delegate iterator is finished, so forget it and continue with
    // the outer generator.
    context.delegate = null;
    return ContinueSentinel;
  }

  // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.
  defineIteratorMethods(Gp);

  define(Gp, toStringTagSymbol, "Generator");

  // A Generator should always return itself as the iterator object when the
  // @@iterator function is called on it. Some browsers' implementations of the
  // iterator prototype chain incorrectly implement this, causing the Generator
  // object to not be returned from this call. This ensures that doesn't happen.
  // See https://github.com/facebook/regenerator/issues/274 for more details.
  define(Gp, iteratorSymbol, function() {
    return this;
  });

  define(Gp, "toString", function() {
    return "[object Generator]";
  });

  function pushTryEntry(locs) {
    var entry = { tryLoc: locs[0] };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{ tryLoc: "root" }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  exports.keys = function(object) {
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();

    // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }

      // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.
      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1, next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined$1;
          next.done = true;

          return next;
        };

        return next.next = next;
      }
    }

    // Return an iterator with no values.
    return { next: doneResult };
  }
  exports.values = values;

  function doneResult() {
    return { value: undefined$1, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      // Resetting context._sent for legacy support of Babel's
      // function.sent implementation.
      this.sent = this._sent = undefined$1;
      this.done = false;
      this.delegate = null;

      this.method = "next";
      this.arg = undefined$1;

      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" &&
              hasOwn.call(this, name) &&
              !isNaN(+name.slice(1))) {
            this[name] = undefined$1;
          }
        }
      }
    },

    stop: function() {
      this.done = true;

      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },

    dispatchException: function(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;

        if (caught) {
          // If the dispatched exception was caught by a catch block,
          // then let that catch block handle the exception normally.
          context.method = "next";
          context.arg = undefined$1;
        }

        return !! caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }

          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },

    abrupt: function(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev &&
            hasOwn.call(entry, "finallyLoc") &&
            this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry &&
          (type === "break" ||
           type === "continue") &&
          finallyEntry.tryLoc <= arg &&
          arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.method = "next";
        this.next = finallyEntry.finallyLoc;
        return ContinueSentinel;
      }

      return this.complete(record);
    },

    complete: function(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" ||
          record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = this.arg = record.arg;
        this.method = "return";
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }

      return ContinueSentinel;
    },

    finish: function(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },

    "catch": function(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }

      // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.
      throw new Error("illegal catch attempt");
    },

    delegateYield: function(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      if (this.method === "next") {
        // Deliberately forget the last sent value so that we don't
        // accidentally pass it on to the delegate.
        this.arg = undefined$1;
      }

      return ContinueSentinel;
    }
  };

  // Regardless of whether this script is executing as a CommonJS module
  // or not, return the runtime object so that we can declare the variable
  // regeneratorRuntime in the outer scope, which allows this module to be
  // injected easily by `bin/regenerator --include-runtime script.js`.
  return exports;

}(
  // If this script is executing as a CommonJS module, use module.exports
  // as the regeneratorRuntime namespace. Otherwise create a new empty
  // object. Either way, the resulting object will be used to initialize
  // the regeneratorRuntime variable at the top of this file.
   module.exports 
));

try {
  regeneratorRuntime = runtime;
} catch (accidentalStrictMode) {
  // This module should not be running in strict mode, so the above
  // assignment should always work unless something is misconfigured. Just
  // in case runtime.js accidentally runs in strict mode, in modern engines
  // we can explicitly access globalThis. In older engines we can escape
  // strict mode using a global Function call. This could conceivably fail
  // if a Content Security Policy forbids using Function, but in that case
  // the proper solution is to fix the accidental strict mode problem. If
  // you've misconfigured your bundler to force strict mode and applied a
  // CSP to forbid Function, and you're not willing to fix either of those
  // problems, please detail your unique predicament in a GitHub issue.
  if (typeof globalThis === "object") {
    globalThis.regeneratorRuntime = runtime;
  } else {
    Function("r", "regeneratorRuntime = r")(runtime);
  }
}
});

var WethAbi = [
	{
		inputs: [
			{
				internalType: "address",
				name: "spender",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "amount",
				type: "uint256"
			}
		],
		name: "approve",
		outputs: [
			{
				internalType: "bool",
				name: "",
				type: "bool"
			}
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "owner",
				type: "address"
			}
		],
		name: "balanceOf",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
		],
		name: "deposit",
		outputs: [
		],
		stateMutability: "payable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "to",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "value",
				type: "uint256"
			}
		],
		name: "transfer",
		outputs: [
			{
				internalType: "bool",
				name: "",
				type: "bool"
			}
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256"
			}
		],
		name: "withdraw",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	}
];

var ETH_ADDRESS = '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE';
var API_BASE_URL = 'https://swap-aggregator.api.p.rainbow.me';
var RAINBOW_ROUTER_CONTRACT_ADDRESS = '0xb57E870996B60F81636eFcC7659463ADFE9abEf3';
var VAULT_ADDRESS = '0x70997970C51812dc3A010C7d01b50e0d17dc79C8';
var RAINBOW_ROUTER_OWNER_ADDRESS = '0x7a3d05c70581bd345fe117c06e45f9669205384f';
var WETH = {
  '1': '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
  '3': '0xb603cea165119701b58d56d10d2060fbfb3efad8'
};
var DAI_ADDRESS = '0x6b175474e89094c44da98b954eedeac495271d0f';
var USDC_ADDRESS = '0x111111111117dc0aa78b770fa6a738034120c302';
var TORN_ADDRESS = '0x77777feddddffc19ff86db637967013e6c6a116c';
var WNXM_ADDRESS = '0x0d438f3b5175bebc262bf23753c1e53d03432bde';
var VSP_ADDRESS = '0x1b40183efb4dd766f11bda7a7c3ad8982e998421';
var ALLOWS_PERMIT = {
  // wNXM
  '0x0d438f3b5175bebc262bf23753c1e53d03432bde': true,
  // INCH
  '0x111111111117dc0aa78b770fa6a738034120c302': true,
  // VSP
  '0x1b40183efb4dd766f11bda7a7c3ad8982e998421': true,
  // UNI
  '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984': true,
  // RAD
  '0x31c8eacbffdd875c74b94b077895bd78cf1e64a3': true,
  // DAI
  '0x6b175474e89094c44da98b954eedeac495271d0f': true,
  // LQTY
  '0x6dea81c8171d0ba574754ef6f8b412f2ed88c54d': true,
  // TORN
  '0x77777feddddffc19ff86db637967013e6c6a116c': true,
  // AAVE
  '0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9': true,
  // DFX
  '0x888888435fde8e7d4c54cab67f206e4199454c60': true,
  // OPIUM
  '0x888888888889c00c67689029d7856aac1065ec11': true,
  // MIST
  '0x88acdd2a6425c3faae4bc9650fd7e27e0bebb7ab': true,
  // FEI
  '0x956f47f50a910163d8bf957cf5846d573e7f87ca': true,
  // USDC
  '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48': true,
  // BAL
  '0xba100000625a3754423978a60c9317c58a424e3d': true,
  // TRIBE
  '0xc7283b66eb1eb5fb86327f08e1b5816b0720212b': true
};

var wrapEth = /*#__PURE__*/function () {
  var _ref = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/runtime_1.mark(function _callee(amount, wallet) {
    var instance;
    return runtime_1.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            instance = new contracts.Contract(WETH['1'], JSON.stringify(WethAbi), wallet);
            return _context.abrupt("return", instance.deposit({
              value: amount
            }));

          case 2:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function wrapEth(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();
var unwrapWeth = /*#__PURE__*/function () {
  var _ref2 = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/runtime_1.mark(function _callee2(amount, wallet) {
    var instance;
    return runtime_1.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            instance = new contracts.Contract(WETH['1'], JSON.stringify(WethAbi), wallet);
            return _context2.abrupt("return", instance.withdraw(amount));

          case 2:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function unwrapWeth(_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}();
var geWethMethod = function geWethMethod(name, provider) {
  var instance = new contracts.Contract(WETH['1'], JSON.stringify(WethAbi), provider);
  return instance.estimateGas[name];
};

var RainbowRouterABI = [
	{
		inputs: [
			{
				internalType: "address",
				name: "buyTokenAddress",
				type: "address"
			},
			{
				internalType: "address payable",
				name: "swapTarget",
				type: "address"
			},
			{
				internalType: "bytes",
				name: "swapCallData",
				type: "bytes"
			},
			{
				internalType: "uint256",
				name: "feeAmount",
				type: "uint256"
			}
		],
		name: "fillQuoteEthToToken",
		outputs: [
		],
		stateMutability: "payable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "sellTokenAddress",
				type: "address"
			},
			{
				internalType: "address",
				name: "spender",
				type: "address"
			},
			{
				internalType: "address payable",
				name: "swapTarget",
				type: "address"
			},
			{
				internalType: "bytes",
				name: "swapCallData",
				type: "bytes"
			},
			{
				internalType: "uint256",
				name: "sellAmount",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "feePercentageBasisPoints",
				type: "uint256"
			}
		],
		name: "fillQuoteTokenToEth",
		outputs: [
		],
		stateMutability: "payable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "sellTokenAddress",
				type: "address"
			},
			{
				internalType: "address",
				name: "spender",
				type: "address"
			},
			{
				internalType: "address payable",
				name: "swapTarget",
				type: "address"
			},
			{
				internalType: "bytes",
				name: "swapCallData",
				type: "bytes"
			},
			{
				internalType: "uint256",
				name: "sellAmount",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "feePercentageBasisPoints",
				type: "uint256"
			},
			{
				internalType: "uint256[]",
				name: "nonceAndDeadline",
				type: "uint256[]"
			},
			{
				internalType: "uint8",
				name: "v",
				type: "uint8"
			},
			{
				internalType: "bytes32[]",
				name: "rAndS",
				type: "bytes32[]"
			}
		],
		name: "fillQuoteTokenToEthWithPermit",
		outputs: [
		],
		stateMutability: "payable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "sellTokenAddress",
				type: "address"
			},
			{
				internalType: "address",
				name: "buyTokenAddress",
				type: "address"
			},
			{
				internalType: "address",
				name: "spender",
				type: "address"
			},
			{
				internalType: "address payable",
				name: "swapTarget",
				type: "address"
			},
			{
				internalType: "bytes",
				name: "swapCallData",
				type: "bytes"
			},
			{
				internalType: "uint256",
				name: "sellAmount",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "feeAmount",
				type: "uint256"
			}
		],
		name: "fillQuoteTokenToToken",
		outputs: [
		],
		stateMutability: "payable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "sellTokenAddress",
				type: "address"
			},
			{
				internalType: "address",
				name: "buyTokenAddress",
				type: "address"
			},
			{
				internalType: "address",
				name: "spender",
				type: "address"
			},
			{
				internalType: "address payable",
				name: "swapTarget",
				type: "address"
			},
			{
				internalType: "bytes",
				name: "swapCallData",
				type: "bytes"
			},
			{
				internalType: "uint256",
				name: "sellAmount",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "feeAmount",
				type: "uint256"
			},
			{
				internalType: "uint256[]",
				name: "nonceAndDeadline",
				type: "uint256[]"
			},
			{
				internalType: "uint8",
				name: "v",
				type: "uint8"
			},
			{
				internalType: "bytes32[]",
				name: "rAndS",
				type: "bytes32[]"
			}
		],
		name: "fillQuoteTokenToTokenWithPermit",
		outputs: [
		],
		stateMutability: "payable",
		type: "function"
	},
	{
		inputs: [
		],
		name: "forwardFees",
		outputs: [
			{
				internalType: "uint8",
				name: "",
				type: "uint8"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "_vault",
				type: "address"
			},
			{
				internalType: "uint8",
				name: "_forwardFees",
				type: "uint8"
			}
		],
		name: "initialize",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
		],
		name: "owner",
		outputs: [
			{
				internalType: "address",
				name: "",
				type: "address"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "uint8",
				name: "_forwardFees",
				type: "uint8"
			}
		],
		name: "updateFeeForwarding",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "_vault",
				type: "address"
			}
		],
		name: "updateVaultAddress",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
		],
		name: "vault",
		outputs: [
			{
				internalType: "address",
				name: "",
				type: "address"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		stateMutability: "payable",
		type: "receive"
	}
];

(function (Sources) {
  Sources["Aggregator0x"] = "0x";
  Sources["Aggregotor1inch"] = "1inch";
})(exports.Sources || (exports.Sources = {}));

var getQuote = /*#__PURE__*/function () {
  var _ref2 = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/runtime_1.mark(function _callee(_ref) {
    var source, _ref$chainId, chainId, fromAddress, sellTokenAddress, buyTokenAddress, sellAmount, buyAmount, slippage, url, response, quote;

    return runtime_1.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            source = _ref.source, _ref$chainId = _ref.chainId, chainId = _ref$chainId === void 0 ? 1 : _ref$chainId, fromAddress = _ref.fromAddress, sellTokenAddress = _ref.sellTokenAddress, buyTokenAddress = _ref.buyTokenAddress, sellAmount = _ref.sellAmount, buyAmount = _ref.buyAmount, slippage = _ref.slippage;

            if (!(sellTokenAddress === ETH_ADDRESS && buyTokenAddress === WETH['1'] || sellTokenAddress === WETH['1'] && buyTokenAddress === ETH_ADDRESS)) {
              _context.next = 3;
              break;
            }

            return _context.abrupt("return", {
              buyAmount: sellAmount || buyAmount,
              buyTokenAddress: buyTokenAddress,
              fee: 0,
              feePercentageBasisPoints: 0,
              from: fromAddress,
              inputTokenDecimals: 18,
              outputTokenDecimals: 18,
              sellAmount: sellAmount || buyAmount,
              sellAmountMinusFees: sellAmount || buyAmount,
              sellTokenAddress: sellTokenAddress
            });

          case 3:
            url = API_BASE_URL + "/quote?chainId=" + chainId + "&fromAddress=" + fromAddress + "&buyToken=" + buyTokenAddress + "&sellToken=" + sellTokenAddress + "&slippage=" + slippage;

            if (source) {
              url += "&source=" + source;
            }

            if (sellAmount) {
              url += "&sellAmount=" + sellAmount;
            } else if (buyAmount) {
              url += "&buyAmount=" + buyAmount;
            }

            if (!(isNaN(Number(sellAmount)) && isNaN(Number(buyAmount)))) {
              _context.next = 8;
              break;
            }

            return _context.abrupt("return", null);

          case 8:
            _context.next = 10;
            return fetch(url);

          case 10:
            response = _context.sent;
            _context.next = 13;
            return response.json();

          case 13:
            quote = _context.sent;
            return _context.abrupt("return", quote);

          case 15:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function getQuote(_x) {
    return _ref2.apply(this, arguments);
  };
}();
var fillQuote = /*#__PURE__*/function () {
  var _ref3 = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/runtime_1.mark(function _callee2(quote, transactionOptions, wallet, permit, chainId) {
    var instance, swapTx, sellTokenAddress, buyTokenAddress, to, data, fee, value, sellAmount, feePercentageBasisPoints, allowanceTarget, _yield$wallet$provide, timestamp, deadline, permitSignature, _yield$wallet$provide2, _timestamp, _deadline, _permitSignature;

    return runtime_1.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            instance = new contracts.Contract(RAINBOW_ROUTER_CONTRACT_ADDRESS, RainbowRouterABI, wallet);
            sellTokenAddress = quote.sellTokenAddress, buyTokenAddress = quote.buyTokenAddress, to = quote.to, data = quote.data, fee = quote.fee, value = quote.value, sellAmount = quote.sellAmount, feePercentageBasisPoints = quote.feePercentageBasisPoints, allowanceTarget = quote.allowanceTarget;

            if (!((sellTokenAddress == null ? void 0 : sellTokenAddress.toLowerCase()) === ETH_ADDRESS.toLowerCase())) {
              _context2.next = 8;
              break;
            }

            _context2.next = 5;
            return instance.fillQuoteEthToToken(buyTokenAddress, to, data, fee, _extends({}, transactionOptions, {
              value: value
            }));

          case 5:
            swapTx = _context2.sent;
            _context2.next = 45;
            break;

          case 8:
            if (!((buyTokenAddress == null ? void 0 : buyTokenAddress.toLowerCase()) === ETH_ADDRESS.toLowerCase())) {
              _context2.next = 28;
              break;
            }

            if (!permit) {
              _context2.next = 23;
              break;
            }

            _context2.next = 12;
            return wallet.provider.getBlock('latest');

          case 12:
            _yield$wallet$provide = _context2.sent;
            timestamp = _yield$wallet$provide.timestamp;
            deadline = timestamp + 3600;
            _context2.next = 17;
            return signPermit(wallet, sellTokenAddress, quote.from, instance.address, quote.sellAmount.toString(), deadline, chainId);

          case 17:
            permitSignature = _context2.sent;
            _context2.next = 20;
            return instance.fillQuoteTokenToEthWithPermit(sellTokenAddress, allowanceTarget, to, data, sellAmount, feePercentageBasisPoints, [permitSignature.nonce, deadline], permitSignature.v, [permitSignature.r, permitSignature.s], _extends({}, transactionOptions, {
              value: value
            }));

          case 20:
            swapTx = _context2.sent;
            _context2.next = 26;
            break;

          case 23:
            _context2.next = 25;
            return instance.fillQuoteTokenToEth(sellTokenAddress, allowanceTarget, to, data, sellAmount, feePercentageBasisPoints, _extends({}, transactionOptions, {
              value: value
            }));

          case 25:
            swapTx = _context2.sent;

          case 26:
            _context2.next = 45;
            break;

          case 28:
            if (!permit) {
              _context2.next = 42;
              break;
            }

            _context2.next = 31;
            return wallet.provider.getBlock('latest');

          case 31:
            _yield$wallet$provide2 = _context2.sent;
            _timestamp = _yield$wallet$provide2.timestamp;
            _deadline = _timestamp + 3600;
            _context2.next = 36;
            return signPermit(wallet, sellTokenAddress, quote.from, instance.address, quote.sellAmount.toString(), _deadline, chainId);

          case 36:
            _permitSignature = _context2.sent;
            _context2.next = 39;
            return instance.fillQuoteTokenToToken(sellTokenAddress, buyTokenAddress, allowanceTarget, to, data, sellAmount, fee, [_permitSignature.nonce, _deadline], _permitSignature.v, [_permitSignature.r, _permitSignature.s], _extends({}, transactionOptions, {
              value: value
            }));

          case 39:
            swapTx = _context2.sent;
            _context2.next = 45;
            break;

          case 42:
            _context2.next = 44;
            return instance.fillQuoteTokenToToken(sellTokenAddress, buyTokenAddress, allowanceTarget, to, data, sellAmount, fee, _extends({}, transactionOptions, {
              value: value
            }));

          case 44:
            swapTx = _context2.sent;

          case 45:
            return _context2.abrupt("return", swapTx);

          case 46:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function fillQuote(_x2, _x3, _x4, _x5, _x6) {
    return _ref3.apply(this, arguments);
  };
}();
var getQuoteExecutionDetails = function getQuoteExecutionDetails(quote, transactionOptions, provider) {
  var instance = new contracts.Contract(RAINBOW_ROUTER_CONTRACT_ADDRESS, RainbowRouterABI, provider);
  var sellTokenAddress = quote.sellTokenAddress,
      buyTokenAddress = quote.buyTokenAddress,
      to = quote.to,
      data = quote.data,
      fee = quote.fee,
      value = quote.value,
      sellAmount = quote.sellAmount,
      feePercentageBasisPoints = quote.feePercentageBasisPoints,
      allowanceTarget = quote.allowanceTarget;

  if ((sellTokenAddress == null ? void 0 : sellTokenAddress.toLowerCase()) === ETH_ADDRESS.toLowerCase()) {
    return {
      method: instance.estimateGas['fillQuoteEthToToken'],
      // @ts-ignore
      methodArgs: [buyTokenAddress, to, data, fee],
      params: _extends({}, transactionOptions, {
        value: value
      })
    };
  } else if ((buyTokenAddress == null ? void 0 : buyTokenAddress.toLowerCase()) === ETH_ADDRESS.toLowerCase()) {
    return {
      method: instance.estimateGas['fillQuoteTokenToEth'],
      methodArgs: [sellTokenAddress, allowanceTarget, to, data, sellAmount, feePercentageBasisPoints],
      params: _extends({}, transactionOptions, {
        value: value
      })
    };
  } else {
    return {
      method: instance.estimateGas['fillQuoteTokenToToken'],
      methodArgs: [sellTokenAddress, buyTokenAddress, allowanceTarget, to, data, sellAmount, fee],
      params: _extends({}, transactionOptions, {
        value: value
      })
    };
  }
};

var DAIAbi = [
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "address",
				name: "owner",
				type: "address"
			},
			{
				indexed: true,
				internalType: "address",
				name: "spender",
				type: "address"
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "value",
				type: "uint256"
			}
		],
		name: "Approval",
		type: "event"
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "address",
				name: "from",
				type: "address"
			},
			{
				indexed: true,
				internalType: "address",
				name: "to",
				type: "address"
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "value",
				type: "uint256"
			}
		],
		name: "Transfer",
		type: "event"
	},
	{
		inputs: [
		],
		name: "DOMAIN_SEPARATOR",
		outputs: [
			{
				internalType: "bytes32",
				name: "",
				type: "bytes32"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
		],
		name: "PERMIT_TYPEHASH",
		outputs: [
			{
				internalType: "bytes32",
				name: "",
				type: "bytes32"
			}
		],
		stateMutability: "pure",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "owner",
				type: "address"
			},
			{
				internalType: "address",
				name: "spender",
				type: "address"
			}
		],
		name: "allowance",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "spender",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "value",
				type: "uint256"
			}
		],
		name: "approve",
		outputs: [
			{
				internalType: "bool",
				name: "",
				type: "bool"
			}
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "owner",
				type: "address"
			}
		],
		name: "balanceOf",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
		],
		name: "decimals",
		outputs: [
			{
				internalType: "uint8",
				name: "",
				type: "uint8"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
		],
		name: "name",
		outputs: [
			{
				internalType: "string",
				name: "",
				type: "string"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "owner",
				type: "address"
			}
		],
		name: "nonces",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "holder",
				type: "address"
			},
			{
				internalType: "address",
				name: "spender",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "nonce",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "expiry",
				type: "uint256"
			},
			{
				internalType: "bool",
				name: "allowed",
				type: "bool"
			},
			{
				internalType: "uint8",
				name: "v",
				type: "uint8"
			},
			{
				internalType: "bytes32",
				name: "r",
				type: "bytes32"
			},
			{
				internalType: "bytes32",
				name: "s",
				type: "bytes32"
			}
		],
		name: "permit",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
		],
		name: "symbol",
		outputs: [
			{
				internalType: "string",
				name: "",
				type: "string"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
		],
		name: "totalSupply",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "to",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "value",
				type: "uint256"
			}
		],
		name: "transfer",
		outputs: [
			{
				internalType: "bool",
				name: "",
				type: "bool"
			}
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "from",
				type: "address"
			},
			{
				internalType: "address",
				name: "to",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "value",
				type: "uint256"
			}
		],
		name: "transferFrom",
		outputs: [
			{
				internalType: "bool",
				name: "",
				type: "bool"
			}
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
		],
		name: "version",
		outputs: [
			{
				internalType: "string",
				name: "",
				type: "string"
			}
		],
		stateMutability: "view",
		type: "function"
	}
];

var IERC2612Abi = [
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "address",
				name: "owner",
				type: "address"
			},
			{
				indexed: true,
				internalType: "address",
				name: "spender",
				type: "address"
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "value",
				type: "uint256"
			}
		],
		name: "Approval",
		type: "event"
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "address",
				name: "from",
				type: "address"
			},
			{
				indexed: true,
				internalType: "address",
				name: "to",
				type: "address"
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "value",
				type: "uint256"
			}
		],
		name: "Transfer",
		type: "event"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "owner",
				type: "address"
			},
			{
				internalType: "address",
				name: "spender",
				type: "address"
			}
		],
		name: "allowance",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "spender",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "value",
				type: "uint256"
			}
		],
		name: "approve",
		outputs: [
			{
				internalType: "bool",
				name: "",
				type: "bool"
			}
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "owner",
				type: "address"
			}
		],
		name: "balanceOf",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
		],
		name: "decimals",
		outputs: [
			{
				internalType: "uint8",
				name: "",
				type: "uint8"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
		],
		name: "name",
		outputs: [
			{
				internalType: "string",
				name: "",
				type: "string"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "owner",
				type: "address"
			}
		],
		name: "nonces",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "owner",
				type: "address"
			},
			{
				internalType: "address",
				name: "spender",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "amount",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "deadline",
				type: "uint256"
			},
			{
				internalType: "uint8",
				name: "v",
				type: "uint8"
			},
			{
				internalType: "bytes32",
				name: "r",
				type: "bytes32"
			},
			{
				internalType: "bytes32",
				name: "s",
				type: "bytes32"
			}
		],
		name: "permit",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
		],
		name: "symbol",
		outputs: [
			{
				internalType: "string",
				name: "",
				type: "string"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
		],
		name: "totalSupply",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "to",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "value",
				type: "uint256"
			}
		],
		name: "transfer",
		outputs: [
			{
				internalType: "bool",
				name: "",
				type: "bool"
			}
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "from",
				type: "address"
			},
			{
				internalType: "address",
				name: "to",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "value",
				type: "uint256"
			}
		],
		name: "transferFrom",
		outputs: [
			{
				internalType: "bool",
				name: "",
				type: "bool"
			}
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
		],
		name: "version",
		outputs: [
			{
				internalType: "string",
				name: "",
				type: "string"
			}
		],
		stateMutability: "view",
		type: "function"
	}
];

var EIP712_DOMAIN_TYPE = [{
  name: 'name',
  type: 'string'
}, {
  name: 'version',
  type: 'string'
}, {
  name: 'chainId',
  type: 'uint256'
}, {
  name: 'verifyingContract',
  type: 'address'
}];

var getDomainSeparator = /*#__PURE__*/function () {
  var _ref = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/runtime_1.mark(function _callee(name, version, chainId, verifyingContract) {
    return runtime_1.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            return _context.abrupt("return", '0x' + ethSigUtil.TypedDataUtils.hashStruct('EIP712Domain', {
              chainId: chainId,
              name: name,
              verifyingContract: verifyingContract,
              version: version
            }, {
              EIP712Domain: EIP712_DOMAIN_TYPE
            }).toString('hex'));

          case 1:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function getDomainSeparator(_x, _x2, _x3, _x4) {
    return _ref.apply(this, arguments);
  };
}();

var getPermitVersion = /*#__PURE__*/function () {
  var _ref2 = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/runtime_1.mark(function _callee2(token, name, chainId, verifyingContract) {
    var version, _version, domainSeparator, domainSeparatorValidation;

    return runtime_1.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            _context2.next = 3;
            return token.version();

          case 3:
            version = _context2.sent;
            return _context2.abrupt("return", version);

          case 7:
            _context2.prev = 7;
            _context2.t0 = _context2["catch"](0);
            _version = '1';
            _context2.prev = 10;
            _context2.next = 13;
            return token.DOMAIN_SEPARATOR();

          case 13:
            domainSeparator = _context2.sent;
            _context2.next = 16;
            return getDomainSeparator(name, _version, chainId, verifyingContract);

          case 16:
            domainSeparatorValidation = _context2.sent;

            if (!(domainSeparator === domainSeparatorValidation)) {
              _context2.next = 19;
              break;
            }

            return _context2.abrupt("return", _version);

          case 19:
            _context2.next = 26;
            break;

          case 21:
            _context2.prev = 21;
            _context2.t1 = _context2["catch"](10);

            if (!([TORN_ADDRESS, WNXM_ADDRESS, VSP_ADDRESS].map(function (t) {
              return t.toLowerCase();
            }).indexOf(token.address.toLowerCase()) !== -1)) {
              _context2.next = 25;
              break;
            }

            return _context2.abrupt("return", '1');

          case 25:
            return _context2.abrupt("return", null);

          case 26:
            return _context2.abrupt("return", null);

          case 27:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[0, 7], [10, 21]]);
  }));

  return function getPermitVersion(_x5, _x6, _x7, _x8) {
    return _ref2.apply(this, arguments);
  };
}();

var getNonces = /*#__PURE__*/function () {
  var _ref3 = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/runtime_1.mark(function _callee3(token, owner) {
    var nonce, _nonce;

    return runtime_1.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.prev = 0;
            _context3.next = 3;
            return token.nonces(owner);

          case 3:
            nonce = _context3.sent;
            return _context3.abrupt("return", nonce);

          case 7:
            _context3.prev = 7;
            _context3.t0 = _context3["catch"](0);
            _context3.prev = 9;
            _context3.next = 12;
            return token._nonces(owner);

          case 12:
            _nonce = _context3.sent;
            return _context3.abrupt("return", _nonce);

          case 16:
            _context3.prev = 16;
            _context3.t1 = _context3["catch"](9);
            return _context3.abrupt("return", 0);

          case 19:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[0, 7], [9, 16]]);
  }));

  return function getNonces(_x9, _x10) {
    return _ref3.apply(this, arguments);
  };
}();

var EIP712_DOMAIN_TYPE_NO_VERSION = [{
  name: 'name',
  type: 'string'
}, {
  name: 'chainId',
  type: 'uint256'
}, {
  name: 'verifyingContract',
  type: 'address'
}];
var EIP2612_TYPE = [{
  name: 'owner',
  type: 'address'
}, {
  name: 'spender',
  type: 'address'
}, {
  name: 'value',
  type: 'uint256'
}, {
  name: 'nonce',
  type: 'uint256'
}, {
  name: 'deadline',
  type: 'uint256'
}];
var PERMIT_ALLOWED_TYPE = [{
  name: 'holder',
  type: 'address'
}, {
  name: 'spender',
  type: 'address'
}, {
  name: 'nonce',
  type: 'uint256'
}, {
  name: 'expiry',
  type: 'uint256'
}, {
  name: 'allowed',
  type: 'bool'
}];
function signPermit(_x11, _x12, _x13, _x14, _x15, _x16, _x17) {
  return _signPermit.apply(this, arguments);
}

function _signPermit() {
  _signPermit = _asyncToGenerator( /*#__PURE__*/runtime_1.mark(function _callee4(wallet, tokenAddress, holder, spender, amount, deadline, chainId) {
    var token, isPermitAllowedType, name, _yield$Promise$all, nonce, version, message, domain, types, data, privateKeyBuffer, signature, _splitSignature, v, r, s;

    return runtime_1.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            token = new contracts.Contract(tokenAddress, tokenAddress.toLowerCase() === DAI_ADDRESS ? DAIAbi : IERC2612Abi, wallet);
            isPermitAllowedType = token.address.toLowerCase() === DAI_ADDRESS.toLowerCase();
            _context4.next = 4;
            return token.name();

          case 4:
            name = _context4.sent;
            _context4.next = 7;
            return Promise.all([getNonces(token, holder), getPermitVersion(token, name, chainId, token.address)]);

          case 7:
            _yield$Promise$all = _context4.sent;
            nonce = _yield$Promise$all[0];
            version = _yield$Promise$all[1];
            message = {
              nonce: Number(nonce.toString()),
              spender: spender
            };

            if (isPermitAllowedType) {
              message.holder = holder;
              message.allowed = true;
              message.expiry = deadline;
            } else {
              message.value = bignumber.BigNumber.from(amount).toHexString();
              message.deadline = deadline;
              message.owner = holder;
            }

            domain = {
              chainId: chainId,
              name: name,
              verifyingContract: token.address
            };

            if (version !== null) {
              domain.version = version;
            }

            types = {
              EIP712Domain: version !== null ? EIP712_DOMAIN_TYPE : EIP712_DOMAIN_TYPE_NO_VERSION,
              Permit: isPermitAllowedType ? PERMIT_ALLOWED_TYPE : EIP2612_TYPE
            };
            data = {
              domain: domain,
              message: message,
              primaryType: 'Permit',
              types: types
            };
            privateKeyBuffer = ethereumjsUtil.toBuffer(ethereumjsUtil.addHexPrefix(wallet.privateKey));
            signature = ethSigUtil.signTypedData_v4(privateKeyBuffer, {
              data: data
            });
            _splitSignature = bytes.splitSignature(signature), v = _splitSignature.v, r = _splitSignature.r, s = _splitSignature.s;
            return _context4.abrupt("return", {
              deadline: deadline,
              nonce: nonce,
              r: r,
              s: s,
              v: v
            });

          case 20:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));
  return _signPermit.apply(this, arguments);
}

exports.ALLOWS_PERMIT = ALLOWS_PERMIT;
exports.API_BASE_URL = API_BASE_URL;
exports.DAI_ADDRESS = DAI_ADDRESS;
exports.ETH_ADDRESS = ETH_ADDRESS;
exports.RAINBOW_ROUTER_CONTRACT_ADDRESS = RAINBOW_ROUTER_CONTRACT_ADDRESS;
exports.RAINBOW_ROUTER_OWNER_ADDRESS = RAINBOW_ROUTER_OWNER_ADDRESS;
exports.TORN_ADDRESS = TORN_ADDRESS;
exports.USDC_ADDRESS = USDC_ADDRESS;
exports.VAULT_ADDRESS = VAULT_ADDRESS;
exports.VSP_ADDRESS = VSP_ADDRESS;
exports.WETH = WETH;
exports.WNXM_ADDRESS = WNXM_ADDRESS;
exports.fillQuote = fillQuote;
exports.geWethMethod = geWethMethod;
exports.getQuote = getQuote;
exports.getQuoteExecutionDetails = getQuoteExecutionDetails;
exports.signPermit = signPermit;
exports.unwrapWeth = unwrapWeth;
exports.wrapEth = wrapEth;
//# sourceMappingURL=rainbow-swaps.cjs.development.js.map