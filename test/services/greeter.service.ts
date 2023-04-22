import { Context, Service } from 'moleculer';
import {
  IsEnum,
  IsString,
  MoleculerAction,
  MoleculerEvent,
  MoleculerService,
  MoleculerServiceCreated,
  MoleculerServiceStarted,
  MoleculerServiceStopped,
} from '../../src';

class WelcomeRequest {
  @IsString()
  name: string;
}

class GoodDayRequest {
  @IsString({ optional: true })
  name: string;

  @IsEnum({ values: ['test', 'value'] })
  type: string;
}

@MoleculerService({
  metadata: {
    scalable: true,
  },

  name: 'greeter',
  settings: {
    upperCase: true,
  },
  version: 2,
})
class GreeterService extends Service {
  // Action handler
  @MoleculerAction()
  public hello() {
    return 'Hello Moleculer';
  }

  // Action handler
  @MoleculerAction({
    cache: {
      keys: ['name'],
    },
    params: WelcomeRequest,
  })
  public welcome(ctx: Context<WelcomeRequest>) {
    return this.sayWelcome(ctx.params.name);
  }

  // Action handler
  @MoleculerAction({
    cache: {
      keys: ['name'],
    },
    params: GoodDayRequest,
  })
  public goodday(ctx: Context<GoodDayRequest>) {
    return this.sayWelcome(ctx.params.name);
  }

  @MoleculerAction({ params: WelcomeRequest })
  public goodbye(ctx: Context<WelcomeRequest>) {
    return `Goodbye, ${this.settings.upperCase ? ctx.params.name.toUpperCase() : ctx.params.name}`;
  }

  @MoleculerAction({ params: GoodDayRequest })
  public enum(ctx: Context<GoodDayRequest>) {
    return ctx.params.type;
  }

  // Event handler
  @MoleculerEvent({ name: 'user.created' })
  public userCreated(user: object) {
    this.broker.call('mail.send', { user });
  }

  @MoleculerServiceCreated()
  public serviceCreated() {
    this.logger.info('ES6 Service created.');
  }

  @MoleculerServiceStarted()
  public serviceStarted() {
    this.logger.info('ES6 Service started.');
  }

  @MoleculerServiceStopped()
  public serviceStopped() {
    this.logger.info('ES6 Service stopped.');
  }

  // Private method
  private sayWelcome(name: string) {
    this.logger.info('Say hello to', name);
    return `Welcome, ${this.settings.upperCase ? name.toUpperCase() : name}`;
  }
}

export default GreeterService;
