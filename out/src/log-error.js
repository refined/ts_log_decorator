class ArgsError extends Error {
    obj;
    constructor(message, ...args) {
        super(message);
        const obj = {};
        for (const [index, item] of args.entries()) {
            obj[index] = item;
        }
        this.obj = obj;
    }
}
class ObjError extends Error {
    obj;
    constructor(message, obj) {
        super(message);
        this.obj = obj;
    }
}
//# sourceMappingURL=log-error.js.map