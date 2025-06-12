"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logAnything = logAnything;
exports.wrapObjArray = wrapObjArray;
const ARRAY_MAX_LENGTH = 10;
const LENGTH_SUFFIX = "__length";
function logAnything(options) {
    return function (targetMethod, context) {
        const methodName = String(context.name);
        return function (...args) {
            const constructorName = String(this?.constructor?.name);
            const message = options.message;
            const arrSize = options.max_arr_len ?? ARRAY_MAX_LENGTH;
            const logMessage = createMessage(constructorName, methodName, message);
            const startTime = Date.now();
            logInput();
            try {
                const result = targetMethod.apply(this, [...args]);
                return logOutput(result);
            }
            catch (error) {
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
            function logOutput(result) {
                if (result instanceof Promise) {
                    return result
                        .then((res) => {
                        logResultWithTime(res);
                        return res;
                    })
                        .catch(logException);
                }
                logResultWithTime(result);
                return result;
            }
            function logResultWithTime(res) {
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
            function logException(error) {
                if (options.log_exception) {
                    const endTime = Date.now();
                    const executionTime = endTime - startTime;
                    const meta = error; // TODO better error meta
                    console.error(message || `Exception invoked in ${getFunctionName(constructorName, methodName)}`, {
                        execution_time: executionTime,
                        class: constructorName,
                        method: methodName,
                        ...meta
                    });
                }
                throw error;
            }
        };
    };
}
function createMetaObject(argNames, args, arrSize) {
    if (!argNames.length) {
        return args;
    }
    return Object.fromEntries(argNames.flatMap((name, i) => mapArg(args[i], name ?? i.toString(), arrSize)));
}
function mapArg(arg, name, arrSize) {
    if (isArray(arg)) {
        return [
            [name + LENGTH_SUFFIX, arg.length],
            [name, arg.slice(0, arrSize)]
        ];
    }
    return [[name, arg]];
}
function wrapObjArray(obj, arrSize) {
    return createMetaObject(Object.keys(obj), Object.values(obj), arrSize);
}
const isArray = (value) => Array.isArray(value);
const getFunctionName = (constructorName, propertyKey) => `${constructorName}.${propertyKey}`;
const createMessage = (constructorName, propertyKey, message = "") => message || getFunctionName(constructorName, propertyKey);
//# sourceMappingURL=log.js.map