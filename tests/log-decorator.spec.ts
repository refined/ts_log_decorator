import { log, logCall, logException, logExecutionTime } from "../src/log-decorator";

jest.spyOn(console, "info");
jest.spyOn(console, "error");

class WithLogging {
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
            } catch (error) {
                expect(error.message).toEqual("213123");
            }
            expect(console.error).toHaveBeenCalledWith(
                "logException Error in console",
                expect.objectContaining({
                    message: "213123"
                })
            );
        });

        it("Log exception sync", () => {
            const testClass = new WithLogging();
            try {
                testClass.exceptionFunction("throw");
            } catch (error) {
                expect(error.message).toEqual("213123");
            }
            expect(console.error).toHaveBeenCalledWith(
                "logException Error in console",
                expect.objectContaining({
                    message: "213123"
                })
            );
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
            } catch (error) {
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
            expect(console.info).toHaveBeenCalledWith(
                "WithLogging.logCallExceptionExecutionTime - Executed",
                expect.anything()
            );
        });
    });
});

interface SampleInterface {
    firstVar: string;
    secondVar?: number;
}