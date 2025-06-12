import { log, logCall, logException, logExecutionTime } from "../src/log-decorator";
import { logAnything } from "../src/log";

jest.spyOn(console, "info");
jest.spyOn(console, "error");

export class WithLogging {
    @log(["str_param", "num_param", "strange naming but also ok", "ooops one more param"])
    public withLog(strParam: string, numParam: number, objectParam: SampleInterface): string {
        return WithLogging.concat(strParam, numParam, objectParam);
    }

    @log(["str_param", "num_param", "strange naming but also ok", "ooops one more param"])
    public async withLogAsync(strParam: string, numParam: number, objectParam: SampleInterface) {
        return WithLogging.concat(strParam, numParam, objectParam);
    }

    @logCall(["obj"], "logCall")
    @logException("logException")
    @logExecutionTime()
    public async logCallExceptionExecutionTime(
        objectParam: SampleInterface,
        func: () => void
    ): Promise<void> {
        func();
    }

    @logException("logException Error in console")
    public async exceptionFunctionAsync(throwError: "throw" | "pass"): Promise<number> {
        if (throwError === "throw") {
            throw Error("213123");
        }
        return 5;
    }

    @logException("logException Error in console")
    public exceptionFunction(throwError: "throw" | "pass"): number {
        if (throwError === "throw") {
            throw Error("213123");
        }
        return 5;
    }


    @logAnything({})
    public withLogAnything(test: string): number {
        return 5;
    }

    private static concat(strParam: string, numParam: number, objectParam: SampleInterface): string {
        return strParam + numParam + objectParam.firstVar;
    }
}

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

        test("Log anything also should work", async () => {
            // arrange
            const testClass = new WithLogging();
            // act
            const res1 = testClass.withLogAnything("Test");
            // assert
            expect(console.info).toHaveBeenCalledTimes(4);
            expect(console.info).toHaveBeenCalledWith("WithLogging.withLogAnything", expect.anything());
            expect(console.info).toHaveBeenCalledWith("WithLogging.withLog - Executed", expect.anything());
        });
    });

    describe("Log Exception", () => {
        it("Log exception async", async () => {
            // arrange
            const testClass = new WithLogging();
            // act
            try {
                await testClass.exceptionFunctionAsync("throw");
            } catch (error) {
                expect(error.message).toEqual("UNKNOWN_CODE_" + 213123);
            }
            // assert
            expect(console.error).toHaveBeenCalledWith(
                "logException Error in console",
                expect.objectContaining({
                    error_message: "213123 UNKNOWN_CODE_213123"
                })
            );
        });

        it("Log exception sync", () => {
            // arrange
            const testClass = new WithLogging();
            // act
            try {
                testClass.exceptionFunction("throw");
            } catch (error) {
                expect(error.message).toEqual("UNKNOWN_CODE_" + 213123);
            }
            // assert
            expect(console.error).toHaveBeenCalledWith(
                "logException Error in console",
                expect.objectContaining({
                    error_message: "213123 UNKNOWN_CODE_213123"
                })
            );
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
            } catch (error) {
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
            expect(console.info).toHaveBeenCalledWith(
                "WithLogging.logCallExceptionExecutionTime - Executed",
                expect.anything()
            );
        });
    });

    describe("logEverything", () => {
        it("Log everything", async () => {
            // arrange
            const func = async (num: number, array: number[]) => ({ num, array });
            const methodContext = { name: "testFunc" } as any;
            const decorator = logAnything({
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
            expect(console.info).toHaveBeenCalledWith(
                "undefined.testFunc",
                expect.objectContaining({
                    array: [1, 2],
                    array__length: 3,
                    my_num: 6
                })
            );
            expect(console.info).toHaveBeenCalledWith(
                "undefined.testFunc - Executed",
                expect.objectContaining({
                    execution_time_ms: expect.anything(),
                    result: { num: 6, array: [1, 2], array__length: 3 }
                })
            );
        });
    });
});

interface SampleInterface {
    firstVar: string;
    secondVar?: number;
}
