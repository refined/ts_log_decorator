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
exports.WithLogging = void 0;
const log_1 = require("../src/log");
jest.spyOn(console, "info");
jest.spyOn(console, "error");
let WithLogging = (() => {
    let _instanceExtraInitializers = [];
    let _withLogAnything_decorators;
    return class WithLogging {
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _withLogAnything_decorators = [(0, log_1.logAnything)({ log_input: { arg_names: ["test"] }, log_output: true })];
            __esDecorate(this, null, _withLogAnything_decorators, { kind: "method", name: "withLogAnything", static: false, private: false, access: { has: obj => "withLogAnything" in obj, get: obj => obj.withLogAnything }, metadata: _metadata }, null, _instanceExtraInitializers);
            if (_metadata) Object.defineProperty(this, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        }
        withLogAnything(test) {
            return 5;
        }
        constructor() {
            __runInitializers(this, _instanceExtraInitializers);
        }
    };
})();
exports.WithLogging = WithLogging;
describe("LogDecorator tests", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });
    describe("Happy path", () => {
        test("Log anything also should work", async () => {
            // arrange
            const testClass = new WithLogging();
            // act
            const res1 = testClass.withLogAnything("Test");
            // assert
            expect(console.info).toHaveBeenCalledTimes(2);
            expect(console.info).toHaveBeenCalledWith("WithLogging.withLogAnything", expect.anything());
            expect(console.info).toHaveBeenCalledWith("WithLogging.withLogAnything - Executed", expect.anything());
        });
    });
    describe("logEverything", () => {
        it("Log everything", async () => {
            // arrange
            const func = async (num, array) => ({ num, array });
            const methodContext = { name: "testFunc" };
            const decorator = (0, log_1.logAnything)({
                max_arr_len: 2,
                log_input: {
                    arg_names: ["my num", "array "] // spaces intentional
                },
                log_output: true,
                log_exception: true,
                log_time: true
            });
            const funcWrap = decorator(func, methodContext);
            // act
            const res = await funcWrap(6, [1, 2, 3]);
            // assert
            expect(res).toEqual({ num: 6, array: [1, 2, 3] });
            expect(console.info).toHaveBeenCalledWith("undefined.testFunc", expect.objectContaining({
                array: [1, 2],
                array__length: 3,
                "my num": 6
            }));
            expect(console.info).toHaveBeenCalledWith("undefined.testFunc - Executed", expect.objectContaining({
                execution_time_ms: expect.anything(),
                result: { num: 6, array: [1, 2], array__length: 3 }
            }));
        });
    });
});
//# sourceMappingURL=log.spec.js.map