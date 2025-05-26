"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.log = log;
exports.logException = logException;
exports.logCall = logCall;
exports.logExecutionTime = logExecutionTime;
const log_1 = require("./log");
function log(argNames, message = "", maxArrLen) {
    return (0, log_1.logAnything)({
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
function logException(message = "") {
    return (0, log_1.logAnything)({
        log_exception: true,
        message: message
    });
}
function logCall(argNames = [], message = "", maxArrLen) {
    return (0, log_1.logAnything)({
        log_input: {
            arg_names: argNames
        },
        message: message,
        max_arr_len: maxArrLen
    });
}
function logExecutionTime(message = "") {
    return (0, log_1.logAnything)({ log_time: true, message: message });
}
//# sourceMappingURL=log-decorator.js.map