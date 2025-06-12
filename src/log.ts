export interface LogOptions {
    message?: string;
    max_arr_len?: number;
    log_input?: {
        arg_names: string[];
    };
    log_output?: boolean;
    log_exception?: boolean;
    log_time?: boolean;
}

const ARRAY_MAX_LENGTH = 10;
const LENGTH_SUFFIX = "__length";

export function logAnything(options: LogOptions) {
    return function <This, Args extends any[], R>(
        targetMethod: (this: This, ...args: Args) => R,
        context: ClassMethodDecoratorContext<This>
    ): (this: This, ...args: Args) => R {
        const methodName = String(context.name);
        return function (this: This, ...args: Args): R {
            const constructorName = String((this as any)?.constructor?.name);
            const message = options.message;
            const arrSize = options.max_arr_len ?? ARRAY_MAX_LENGTH;
            const logMessage = createMessage(constructorName, methodName, message);
            const startTime = Date.now();

            logInput();
            try {
                const result = targetMethod.apply(this, [...args]);
                return logOutput(result);
            } catch (error) {
                logException(error);
            }

            function logInput() {
                if (!options.log_input) {
                    return;
                }
                const argNames = options.log_input.arg_names;
                const meta = createMetaObject(argNames, args, arrSize);
                console.info(logMessage, meta);
            }

            function logOutput(result: R | Promise<R>): R {
                if (result instanceof Promise) {
                    return result
                        .then((res) => {
                            logResultWithTime(res);
                            return res;
                        })
                        .catch(logException) as R;
                }
                logResultWithTime(result);
                return result;
            }

            function logResultWithTime(res: any | undefined) {
                if (!options.log_output && !options.log_time) {
                    return;
                }
                let meta = {};
                if (options.log_output) {
                    meta = {
                        ...meta,
                        ...(res ? { result: wrapObjArray(res, arrSize) } : {})
                    };
                }
                if (options.log_time) {
                    const endTime = Date.now();
                    const executionTime = endTime - startTime;
                    meta = { execution_time_ms: executionTime, ...meta };
                }
                console.info(`${logMessage} - Executed`, meta);
            }

            function logException(error: Error): never {
                if (options.log_exception) {
                    const endTime = Date.now();
                    const executionTime = endTime - startTime;

                    console.error(
                        message || `Exception invoked in ${getFunctionName(constructorName, methodName)}`,
                        {
                            execution_time: executionTime,
                            class: constructorName,
                            method: methodName,
                            message: error.message,
                            stack: error.stack,
                        }
                    );
                }
                throw error;
            }
        };
    };
}

function createMetaObject<Args extends any[]>(argNames: string[], args: Args, arrSize: number): object {
    if (!argNames.length) {
        return args;
    }
    return Object.fromEntries(argNames.flatMap((name, i) => mapArg(args[i], name ?? i.toString(), arrSize)));
}

function mapArg(arg: any, name: string, arrSize: number): Array<[string, any]> {
    const trimmedName = name.trim();
    if (isArray(arg)) {
        return [
            [trimmedName + LENGTH_SUFFIX, arg.length],
            [trimmedName, arg.slice(0, arrSize)]
        ];
    }
    return [[trimmedName, arg]];
}

export function wrapObjArray<T extends object>(obj: T, arrSize: number) {
    return createMetaObject(Object.keys(obj), Object.values(obj), arrSize);
}

const isArray = <T>(value: unknown): value is T[] => Array.isArray(value);
const getFunctionName = (constructorName: string, propertyKey: string) => `${constructorName}.${propertyKey}`;
const createMessage = (constructorName: string, propertyKey: string, message: string = ""): string =>
    message || getFunctionName(constructorName, propertyKey);
