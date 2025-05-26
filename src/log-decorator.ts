import { logAnything } from "./log";

export function log(argNames: string[], message: string = "", maxArrLen?: number) {
    return logAnything({
        log_input: {
            arg_names: argNames
        },
        log_output: true,
        log_exception: false,
        log_time: true,
        max_arr_len: maxArrLen,
        message: message
    });
}

export function logException(message: string = "") {
    return logAnything({
        log_exception: true,
        message: message
    });
}

export function logCall(argNames: string[] = [], message: string = "", maxArrLen?: number) {
    return logAnything({
        log_input: {
            arg_names: argNames
        },
        message: message,
        max_arr_len: maxArrLen
    });
}

export function logExecutionTime(message: string = "") {
    return logAnything({ log_time: true, message: message });
}
