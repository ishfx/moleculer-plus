![Moleculer logo](https://raw.githubusercontent.com/ice-services/moleculer/HEAD/docs/assets/logo.png)

# moleculer-plus

[![Powered by moleculer](https://img.shields.io/badge/Powered%20by-Moleculer-green.svg?colorB=0e83cd)](http://moleculer.services/) [![CI](https://github.com/ishfx/moleculer-plus/actions/workflows/ci.yml/badge.svg)](https://github.com/ishfx/moleculer-plus/actions/workflows/ci.yml) [![NPM](https://img.shields.io/npm/v/moleculer-plus.svg?maxAge=3600)](https://www.npmjs.com/package/moleculer-plus)

This library incorporate modern TypeScript features and syntax into MoleculerJS, a powerful microservices framework for Node.js, without the need to modify its core code, generate any files or perform any other setup steps. The library provides TypeScript decorators that can be directly applied to your code, making it a hassle-free experience.

MoleculerJS is a robust framework that has been around for a while, but its codebase is written in pre-ES6 JavaScript. This can make it unattractive to developers who prefer to use modern JavaScript syntax and features. This library aims to solve that problem by providing a seamless way to bring TypeScript to MoleculerJS.

With this library, you can easily leverage the power of MoleculerJS with the added benefits of TypeScript. The installation and usage of the decorators are simple and straightforward, making it easy to start using modern TypeScript features in your MoleculerJS microservices projects.

The library includes three types of decorators: `Service`, `Validator`, and `Api`.

- `Validator` decorators handle parameter validation for actions and events.
- `Service` decorators handle service declaration, actions, events, and lifecycle events.
- `Api` decorators handle API controllers, routes, and other related functionality.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
  - [Validator Decorators](#validator-decorators)
  - [Service Decorators](#service-decorators)
  - [API Decorators](#api-decorators)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)
- [License](#license)
- [Acknowledgments](#acknowledgments)

## Installation

To use this library in your MoleculerJS project, you can install it via NPM or Yarn:

### NPM

```sh
npm install moleculer-plus
```

### Yarn

```sh
yarn add moleculer-plus
```

Once installed, you can import and use the decorators in your TypeScript code.

```ts
import { MoleculerService, MoleculerAction, MoleculerEvent } from "moleculer-plus";
```

That's it! With just a few simple steps, you can start using TypeScript decorators in your MoleculerJS project.

## Usage

### Validator Decorators

You can easily add parameter validation to your MoleculerJS actions and events using TypeScript decorators. To use a validator decorator, simply add it to the property of a class that defines the expected parameters for the action or event.

The class is automatically converted to a `fastest-validator` schema, so you can use any validator rule supported by `fastest-validator`. Some examples of validator decorators include `@IsString()`, `@IsNumber()`, etc. You can also provide options to the validators using the decorator's options object.

```ts
class User {
  @IsUUID({ version: 4 })
  id: string;

  @IsString({ max: 32 })
  name: string;

  @IsNumber({ positive: true })
  age: number;

  @IsBoolean({ optional: true })
  isVerified?: boolean;
}
```

If you need to validate nested properties, you can use the `IsObject` decorator.

```ts
class Address {
  @IsString()
  street: string;

  @IsString()
  city: string;

  @IsNumber()
  zip: number;
}

class User {
  @IsString()
  name: string;

  @IsObject()
  address: Address;
}
```

If you need to create a custom validator, you can use the `createRuleDecorator` function provided by this library. This function takes a validator function and returns a decorator that you can use to add the validator to your class.

Additionally, you can use the `MoleculerParams` decorator to specify options for parameter validation. The `MoleculerParams` decorator can be applied to a class that defines the expected parameters for the action or event. The decorator accepts an options object that allows you to specify whether parameters should be validated asynchronously and how strict the validation should be.

```ts
@MoleculerParams({ strict: true })
class MyActionParams {
  @IsString()
  param1: string;

  @IsString()
  param2: string;
}
```

### Service Decorators

This library provides several TypeScript decorators that allow you to easily declare services, actions, events, methods, and lifecycle events in your MoleculerJS application.

To declare a service, you can use the `MoleculerService` decorator applied to a service class. The `MoleculerService` decorator takes an options object as an argument to configure the service. Here's an example:

```ts
@MoleculerService()
class Child extends Service {}

@MoleculerService({
  name: "hello",
  mixins: [Child],
  settings: {
    abc: "def",
  },
})
class Parent extends Service {}
```

You can also use decorators like `MoleculerAction` and `MoleculerEvent` to declare actions and event handlers, respectively. These decorators are applied to class functions and take an options object as an argument to configure the action or event handler. Here's an example:

```ts
class User {
  @IsEmail()
  email: string;
}

@MoleculerService({
  name: "my-service",
})
class MyService extends Service {
  @MoleculerAction({ name: "my-action", params: User })
  public myAction(ctx: Context<User>) {
    const { email } = ctx.params;
    // action logic goes here
  }

  @MoleculerEvent({ name: "my-event", params: User })
  public myEventHandler(ctx: Context<User>) {
    const { email } = ctx.params;
    // event handling logic goes here
  }

  @MoleculerMethod()
  public myMethod() {}

  @MoleculerServiceStarted()
  public started() {}
}
```

You can also use decorators like `MoleculerServiceCreated`, `MoleculerServiceStarted`, and `MoleculerServiceStopped` to define lifecycle events for your services. These decorators are applied to class functions that correspond to the appropriate event.

You can simply pass your validator classes, which are decorated with validator decorators, directly to the `params` property in your actions and events. The library will automatically convert them to a `fastest-validator` schema under the hood like shown in the example above.

### Api decorators

This library API decorators translate to `moleculer-web` configuration under the hood. This means that you can achieve the same result using the moleculer-web configuration directly. However, using decorators can make your code more concise and easier to read. Additionally, the library provides some additional features, like automatically generating route names based on method names and parameter types.

You can use `MoleculerApi` to declare the global API and its controllers. You can define the base path, as well as any middleware or global options for the API.
`MoleculerController` is used to declare a single controller. You can define the base path for the controller, as well as any middleware or controller-specific options. You can also define the routes for the controller using `MoleculerRoute` decorators. You can also nest other controllers to a single controller.
`MoleculerRoute` is used to declare a single route for a controller. You can define the HTTP method, the path, and the action to handle the route. `MoleculerRouteGet`, `MoleculerRoutePost`, `MoleculerRoutePut`, `MoleculerRouteDelete`, and `MoleculerRoutePatch` can also be used.

There also decorators to handle middlewares (used in `api` and `controllers`) `MoleculerControllerMiddleware` and hook decorators to handle `onBeforeCall`, `onAfterCall`, and `onError` `MoleculerApiHook`.

With these decorators, you can easily create a RESTful API using Moleculer and TypeScript, without needing to write boilerplate code for handling HTTP requests and responses.

```ts
@MoleculerController({ path: "/health" })
class HealthController extends Service {
  @MoleculerRouteGet({ path: "/check" })
  public check() {
    return "ok";
  }
}

@MoleculerController({ path: "/roles" })
class RolesController extends Service {
  @MoleculerRouteGet({ path: "/:id" })
  public get(ctx: Context<{ id: string }>) {
    // get a role
  }
}

@MoleculerController({
  path: "/user",
  controllers: [RolesController],
})
class UserController extends Service {
  @MoleculerRoutePost({ path: "/", params: User })
  public create(ctx: Context<User>) {
    // user creation
  }

  @MoleculerRoutePut({ path: "/:id", params: User })
  public update(ctx: Context<User>) {
    // user update
  }

  @MoleculerControllerMiddleware()
  public sessionMiddleware(req: any, res: any, next: (...args: any) => void) {
    // middleware logic (express like)
  }

  @MoleculerApiHook()
  public async onAfterCall(
    ctx: Context,
    route: any,
    req: IncomingRequest,
    res: ServerResponse,
    data: any
  ) {}
}

@MoleculerApi({
  name: "api",

  controllers: [HealthController, UserController],

  settings: {
    port: 8080,

    path: "/api",

    logRequest: "debug",
    logResponse: "debug",
  },
})
class ApiService extends Service {
  @MoleculerApiHook()
  public async onError(
    req: IncomingMessage,
    res: ServerResponse,
    error: Error & { code: number; type: string; ctx: Context }
  ) {
    // generate error
    res.writeHead(status, { "Content-type": "application/json; charset=utf-8" }).end(body);
  }
}
```

## API Documentation

TODO

## Contributing

We welcome contributions from the community! If you find a bug, or have an idea for a new feature, feel free to open an issue on our GitHub repository. If you'd like to contribute code, please fork the repository, make your changes, and open a pull request. When submitting code, please make sure to follow our coding style and write tests for your changes. Thank you for your contributions!

## License

This library is licensed under the `MIT` License. You can find the full text of the license in the `LICENSE` file in the root directory of the repository. The MIT License is a permissive open source license that allows you to use, copy, modify, and distribute this library for any purpose, as long as you include the original copyright and license notice in all copies or substantial portions of the software. If you have any questions about the license or how you can use this library, please contact us.

# Acknowledgments

I would like to acknowledge the work of the authors of two other libraries that served as the inspiration and basis for this library: `moleculer-service-decorators` by `rmccallum81` and `fastest-validator-decorators` by `AmauryD`. I built on their ideas and code to create a library that brings TypeScript support to MoleculerJS. We are grateful to them for their contributions to the community and for making this work possible.
