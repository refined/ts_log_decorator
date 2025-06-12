import { logAnything } from "../src/log";

jest.spyOn(console, "info");
jest.spyOn(console, "error");

export class WithLogging {
    @logAnything({ log_input: { arg_names: ["test"] }, log_output: true })
    public withLogAnything(test: string): number {
        return 5;
    }
}

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
                    "my num": 6
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
