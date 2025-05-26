"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const log_decorator_1 = require("../src/log-decorator");
const log_1 = require("../src/log");
jest.spyOn(console, "info");
jest.spyOn(console, "error");
class WithLogging {
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
}
__decorate([
    (0, log_decorator_1.log)(["str_param", "num_param", "strange naming but also ok", "ooops one more param"]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Object]),
    __metadata("design:returntype", String)
], WithLogging.prototype, "withLog", null);
__decorate([
    (0, log_decorator_1.log)(["str_param", "num_param", "strange naming but also ok", "ooops one more param"]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Object]),
    __metadata("design:returntype", Promise)
], WithLogging.prototype, "withLogAsync", null);
__decorate([
    (0, log_decorator_1.logCall)(["obj"], "logCall"),
    (0, log_decorator_1.logException)("logException"),
    (0, log_decorator_1.logExecutionTime)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Function]),
    __metadata("design:returntype", Promise)
], WithLogging.prototype, "logCallExceptionExecutionTime", null);
__decorate([
    (0, log_decorator_1.logException)("logException Error in console"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], WithLogging.prototype, "exceptionFunctionAsync", null);
__decorate([
    (0, log_decorator_1.logException)("logException Error in console"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Number)
], WithLogging.prototype, "exceptionFunction", null);
describe("LogDecorator tests", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });
    describe("Happy path", () => {
        test("Test that logger works", async () => {
            // arrange
            const testClass = new WithLogging();
            // act
            const res1 = testClass.withLog("sdfdsf", 123, { firstVar: "yo" });
            const res2 = await testClass.withLogAsync("sdfdsf", 123, { firstVar: "yo" });
            // assert
            expect(res1).toEqual(res2);
            expect(console.info).toHaveBeenCalledTimes(4);
            expect(console.info).toHaveBeenCalledWith("WithLogging.withLog", expect.anything());
            expect(console.info).toHaveBeenCalledWith("WithLogging.withLog - Executed", expect.anything());
            expect(console.info).toHaveBeenCalledWith("WithLogging.withLogAsync - Executed", expect.anything());
            expect(console.info).toHaveBeenCalledWith("WithLogging.withLogAsync - Executed", expect.anything());
        });
    });
    describe("Log Exception", () => {
        it("Log exception async", async () => {
            // arrange
            const testClass = new WithLogging();
            // act
            try {
                await testClass.exceptionFunctionAsync("throw");
            }
            catch (error) {
                expect(error.message).toEqual("UNKNOWN_CODE_" + 213123);
            }
            // assert
            expect(console.error).toHaveBeenCalledWith("logException Error in console", expect.objectContaining({
                error_message: "213123 UNKNOWN_CODE_213123"
            }));
        });
        it("Log exception sync", () => {
            // arrange
            const testClass = new WithLogging();
            // act
            try {
                testClass.exceptionFunction("throw");
            }
            catch (error) {
                expect(error.message).toEqual("UNKNOWN_CODE_" + 213123);
            }
            // assert
            expect(console.error).toHaveBeenCalledWith("logException Error in console", expect.objectContaining({
                error_message: "213123 UNKNOWN_CODE_213123"
            }));
        });
        it("Log exception - no exception", async () => {
            // arrange
            const testClass = new WithLogging();
            // act
            testClass.exceptionFunction("pass");
            await testClass.exceptionFunctionAsync("pass");
            // assert
            expect(console.error).toHaveBeenCalledTimes(0);
            expect(console.info).toHaveBeenCalledTimes(0);
        });
    });
    describe("Complex cases with several log decorators", () => {
        it("Log all but result - Exception", async () => {
            // arrange
            const testClass = new WithLogging();
            const code = 1234;
            const func = () => {
                throw new ArgsError("wrong", code, "123");
            };
            // act
            try {
                await testClass.logCallExceptionExecutionTime({ firstVar: "yo" }, func);
            }
            catch (error) {
                expect(error.message).toEqual("UNKNOWN_CODE_" + code);
            }
            // assert
            expect(console.info).toHaveBeenCalledWith("logCall", expect.anything());
            expect(console.error).toHaveBeenCalledWith("logException", expect.anything());
        });
        it("Log all but result", async () => {
            // arrange
            const testClass = new WithLogging();
            const func = () => { };
            // act
            await testClass.logCallExceptionExecutionTime({ firstVar: "yo" }, func);
            // assert
            expect(console.info).toHaveBeenCalledWith("logCall", expect.anything());
            expect(console.info).toHaveBeenCalledWith("WithLogging.logCallExceptionExecutionTime - Executed", expect.anything());
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
                my_num: 6
            }));
            expect(console.info).toHaveBeenCalledWith("undefined.testFunc - Executed", expect.objectContaining({
                execution_time_ms: expect.anything(),
                result: { num: 6, array: [1, 2], array__length: 3 }
            }));
        });
    });
});
//# sourceMappingURL=log.spec.js.map