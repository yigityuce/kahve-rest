- [Description](#description)
- [Installation](#installation)
- [Usage](#usage)

# Description

Annotation based, Java Spring like, REST library


# Installation

kahve-rest runs on Node.js and is available as an NPM package. You can install kahve-rest
in your project's directory as usual:

```bash
$ npm install kahve-core kahve-rest
```

# Usage

See the example below and you can find a postman collection within **"*/example*"** directory to test the code below.

```ts
import { logger, LogLevel } from 'kahve-core';
import {
  RestController,
  RestGet,
  RestPost,
  RequestBody,
  RestPut,
  PathVariable,
  RestError,
  RestDelete,
  RestServer,
  RestServerConfig,
  RestServerController,
  RestServerPreStart,
  RestServerPostStart
} from 'kahve-rest';

// SET LOG LEVEL
logger.setLevel(LogLevel.DEBUG);

// CONTROLLER DEFINITION
@RestController('base/path')
class TestController {
  private list: string[] = [];

  @RestGet('get-list')
  public getAll(): string[] {
    return this.list;
  }

  @RestGet('get-list-with-timeout')
  public getAllTimeout(): Promise<string[]> {
    return new Promise((resolve, reject) => {
      setTimeout(() => resolve(this.list), 2000);
    });
  }

  @RestPost('add-item')
  public createItem(@RequestBody() item: string): string {
    this.list.push(item);
    logger.info('New item added:', item);
    return item;
  }

  @RestPut('update-item/:index')
  public updateItem(@RequestBody() item: string, @PathVariable('ind') ind: number): string {
    const i = Number.parseInt(`${ind}`);
    if (!this.isValidIndex(i)) throw new RestError('Out of bound.', 400);

    this.list[i] = item;
    logger.info('Item updated:', item);
    return this.list[i];
  }

  @RestDelete('delete-item/:index')
  public deleteUser(@PathVariable('index') index: number): boolean {
    const i = Number.parseInt(`${index}`);
    if (!this.isValidIndex(i)) throw new RestError('Out of bound.', 400);

    const deletedItem = this.list.splice(i, 1);
    logger.info('Item deleted:', deletedItem);
    return true;
  }

  private isValidIndex(index: number): boolean {
    return index < this.list.length;
  }
}

@RestServer()
class PublicServer {
  @RestServerConfig('PORT')
  private port: number = 9000;

  @RestServerController()
  private testController: TestController = new TestController();

  @RestServerPreStart()
  private preStart(): Promise<void> {
    logger.info('Do some preparing steps in here and also you can do async operations.');
    return new Promise(resolve => setTimeout(() => resolve(null), 1500));
  }

  @RestServerPostStart()
  private postStart(): void {
    logger.info(`App is started. Port: ${this.port} Log level: ${logger.getLevel()}`);
  }
}

const publicServer = new PublicServer();
```

