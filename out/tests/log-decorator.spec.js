"use strict";
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
Object.defineProperty(exports, "__esModule", { value: true });
const log_decorator_1 = require("../src/log-decorator");
jest.spyOn(console, "info");
jest.spyOn(console, "error");
let WithLogging = (() => {
    let _instanceExtraInitializers = [];
    let _withLog_decorators;
    let _withLogAsync_decorators;
    let _logCallExceptionExecutionTime_decorators;
    let _exceptionFunctionAsync_decorators;
    let _exceptionFunction_decorators;
    return class WithLogging {
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _withLog_decorators = [(0, log_decorator_1.log)(["str_param", "num_param", "strange naming but also ok", "ooops one more param"])];
            _withLogAsync_decorators = [(0, log_decorator_1.log)(["str_param", "num_param", "strange naming but also ok", "ooops one more param"])];
            _logCallExceptionExecutionTime_decorators = [(0, log_decorator_1.logCall)(["obj"], "logCall"), (0, log_decorator_1.logException)("logException"), (0, log_decorator_1.logExecutionTime)()];
            _exceptionFunctionAsync_decorators = [(0, log_decorator_1.logException)("logException Error in console")];
            _exceptionFunction_decorators = [(0, log_decorator_1.logException)("logException Error in console")];
            __esDecorate(this, null, _withLog_decorators, { kind: "method", name: "withLog", static: false, private: false, access: { has: obj => "withLog" in obj, get: obj => obj.withLog }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _withLogAsync_decorators, { kind: "method", name: "withLogAsync", static: false, private: false, access: { has: obj => "withLogAsync" in obj, get: obj => obj.withLogAsync }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _logCallExceptionExecutionTime_decorators, { kind: "method", name: "logCallExceptionExecutionTime", static: false, private: false, access: { has: obj => "logCallExceptionExecutionTime" in obj, get: obj => obj.logCallExceptionExecutionTime }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _exceptionFunctionAsync_decorators, { kind: "method", name: "exceptionFunctionAsync", static: false, private: false, access: { has: obj => "exceptionFunctionAsync" in obj, get: obj => obj.exceptionFunctionAsync }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _exceptionFunction_decorators, { kind: "method", name: "exceptionFunction", static: false, private: false, access: { has: obj => "exceptionFunction" in obj, get: obj => obj.exceptionFunction }, metadata: _metadata }, null, _instanceExtraInitializers);
            if (_metadata) Object.defineProperty(this, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        }
        withLog(strParam, numParam, objectParam) {
            return WithLogging.concat(strParam, numParam, objectParam);
        }
        async withLogAsync(strParam, numParam, objectParam) {
            return WithLogging.concat(strParam, numParam, objectParam);
        }
        async logCallExceptionExecutionTime(objectParam, func) {
            func();
        }
        async exceptionFunctionAsync(throwError) {
            if (throwError === "throw") {
                throw Error("213123");
            }
            return 5;
        }
        exceptionFunction(throwError) {
            if (throwError === "throw") {
                throw Error("213123");
            }
            return 5;
        }
        static concat(strParam, numParam, objectParam) {
            return strParam + numParam + objectParam.firstVar;
        }
        constructor() {
            __runInitializers(this, _instanceExtraInitializers);
        }
    };
})();
describe("LogDecorator tests", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });
    describe("Happy path", () => {
        test("Test that logger works", async () => {
            const testClass = new WithLogging();
            const res1 = testClass.withLog("sdfdsf", 123, { firstVar: "yo" });
            const res2 = await testClass.withLogAsync("sdfdsf", 123, { firstVar: "yo" });
            expect(res1).toEqual(res2);
            expect(console.info).toHaveBeenCalledTimes(4);
            expect(console.info).toHaveBeenCalledWith("WithLogging.withLog", expect.anything());
            expect(console.info).toHaveBeenCalledWith("WithLogging.withLog - Executed", expect.anything());
            expect(console.info).toHaveBeenCalledWith("WithLogging.withLogAsync", expect.anything());
            expect(console.info).toHaveBeenCalledWith("WithLogging.withLogAsync - Executed", expect.anything());
        });
    });
    describe("Log Exception", () => {
        it("Log exception async", async () => {
            const testClass = new WithLogging();
            try {
                await testClass.exceptionFunctionAsync("throw");
            }
            catch (error) {
                expect(error.message).toEqual("213123");
            }
            expect(console.error).toHaveBeenCalledWith("logException Error in console", expect.objectContaining({
                message: "213123"
            }));
        });
        it("Log exception sync", () => {
            const testClass = new WithLogging();
            try {
                testClass.exceptionFunction("throw");
            }
            catch (error) {
                expect(error.message).toEqual("213123");
            }
            expect(console.error).toHaveBeenCalledWith("logException Error in console", expect.objectContaining({
                message: "213123"
            }));
        });
        it("Log exception - no exception", async () => {
            const testClass = new WithLogging();
            testClass.exceptionFunction("pass");
            await testClass.exceptionFunctionAsync("pass");
            expect(console.error).toHaveBeenCalledTimes(0);
            expect(console.info).toHaveBeenCalledTimes(0);
        });
    });
    describe("Complex cases with several log decorators", () => {
        it("Log all but result - Exception", async () => {
            const testClass = new WithLogging();
            const code = "1234";
            const func = () => {
                throw new Error(code);
            };
            try {
                await testClass.logCallExceptionExecutionTime({ firstVar: "yo" }, func);
            }
            catch (error) {
                expect(error.message).toEqual(code);
            }
            expect(console.info).toHaveBeenCalledWith("logCall", expect.anything());
            expect(console.error).toHaveBeenCalledWith("logException", expect.anything());
        });
        it("Log all but result", async () => {
            const testClass = new WithLogging();
            const func = () => { };
            await testClass.logCallExceptionExecutionTime({ firstVar: "yo" }, func);
            expect(console.info).toHaveBeenCalledWith("logCall", expect.anything());
            expect(console.info).toHaveBeenCalledWith("WithLogging.logCallExceptionExecutionTime - Executed", expect.anything());
        });
    });
});
//# sourceMappingURL=log-decorator.spec.js.map