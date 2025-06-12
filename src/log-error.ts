// TODO: provide a way to log errors with additional context
// export class ArgsError<Args extends any[]> extends Error {
//     obj: object;

//     constructor(message: string, ...args: Args) {
//         super(message);
//         const obj = {};
//         for (const [index, item] of args.entries()) {
//             obj[index] = item;
//         }
//         this.obj = obj;
//     }
// }

// export class ObjError extends Error {
//     obj: object;

//     constructor(message: string, obj: object) {
//         super(message);
//         this.obj = obj;
//     }
// }
