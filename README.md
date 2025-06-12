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

```typescript
import { logAnything, logException, logExecutionTime } from "log-decorator";

class Example {
  @logAnything({ log_input: { arg_names: ["param1", "param2"] } })
  myMethod(param1: string, param2: number) {
    // Your logic here
  }

  @logException("Error occurred")
  mightThrow() {
    throw new Error("Oops!");
  }

  @logExecutionTime()
  slowMethod() {
    // Some slow code
  }
}
```

## API

### `@logAnything(options)`

Logs method input and output.

- `options.log_input.arg_names`: Array of argument names to log.

### `@logException(message?)`

Logs exceptions thrown by the method.

- `message`: Optional custom message.

### `@logExecutionTime()`

Logs the execution time of the method.

## License

ISC

---

**Contributions welcome!**
