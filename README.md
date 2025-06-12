# log-decorator

A lightweight TypeScript library providing easy-to-use logging decorators for your classes and methods.  
Make your code more compact and gain extended logging abilities with minimal effort.

## Features

- **Method decorators** for logging input, output, execution time, and exceptions
- Works with the latest TypeScript (standard ECMAScript decorators)
- No runtime dependencies
- Simple API for quick integration

## Installation

```sh
npm install log-decorator
```

## Usage

> **Note:**  
> The `logAnything` decorator is a low-level utility.  
> **It is recommended to use the higher-level wrappers** (`log`, `logCall`, `logException`, `logExecutionTime`) from `log-decorator.ts` for most use cases.

---

### Argument Names Are Mandatory

**TypeScript does not provide function argument names at runtime.**  
For all decorators that log input arguments  
**you must explicitly provide the argument names** via the `arg_names` option/parameter.

---

### `@log(options)`

Logs method input and output with customizable options.

```typescript
import { log } from "log-decorator";

class Example {
  @log({
    log_input: { arg_names: ["param1", "param2"] }, // <-- argument names are required!
    log_exception: true,
    log_time: true,
  })
  myMethod(param1: string, param2: number) {
    // Your logic here
  }
}
```

---

### `@logCall(argNames, message?)`

Logs method call with argument names and an optional message.

```typescript
import { logCall } from "log-decorator";

class Example {
  @logCall(["userId", "payload"], "User update called") // <-- argument names are required!
  updateUser(userId: string, payload: object) {
    // ...
  }
}
```

---

### `@logException(message?)`

Logs exceptions thrown by the method with an optional custom message.

```typescript
import { logException } from "log-decorator";

class Example {
  @logException("Error in importantMethod")
  importantMethod() {
    throw new Error("Something went wrong!");
  }
}
```

---

### `@logExecutionTime()`

Logs the execution time of the method.

```typescript
import { logExecutionTime } from "log-decorator";

class Example {
  @logExecutionTime()
  slowOperation() {
    // Some slow code
  }
}
```

---

### `@logAnything(options)`

> **Advanced:**  
> `logAnything` is a low-level decorator factory.  
> It is recommended to use the wrappers (`log`, `logCall`, `logException`, `logExecutionTime`) instead for most cases.

#### Parameters for `logAnything(options: LogOptions)`

- **`message?: string`**  
  Custom log message. If not provided, uses `ClassName.methodName`.

- **`max_arr_len?: number`**  
  Maximum number of array elements to log (default: 10).

- **`log_input?: { arg_names: string[] }`**  
  Log input arguments.

  - `arg_names`: **Names for each argument to display in logs (mandatory if logging input).**

- **`log_output?: boolean`**  
  Log the output/result of the method.

- **`log_exception?: boolean`**  
  Log exceptions thrown by the method.

- **`log_time?: boolean`**  
  Log the execution time of the method.

#### Example

```typescript
import { logAnything } from "log-decorator";

class Example {
  @logAnything({
    message: "Custom log message",
    max_arr_len: 5,
    log_input: { arg_names: ["input1", "input2"] }, // <-- argument names are required!
    log_output: true,
    log_exception: true,
    log_time: true,
  })
  test(input1: number[], input2: string) {
    // ...
  }
}
```

> **Tip:** For most use cases, prefer the higher-level decorators (`log`, `logCall`, `logException`, `logExecutionTime`) for simpler and more readable code.

---

## License

ISC

---

**Contributions welcome!**
