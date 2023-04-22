import { Errors, ServiceBroker } from 'moleculer';
import GreeterService from '../services/greeter.service';

describe('Test load services', () => {
  let broker: ServiceBroker;

  beforeAll(async () => {
    broker = new ServiceBroker({ cacher: 'Memory', logger: false });
    broker.createService(GreeterService);

    await broker.start();
  });

  afterAll(async () => {
    await broker.stop();
  });

  it('should create service from class', async () => {
    expect(broker.getLocalService({ name: 'greeter', version: 2 })).toBeDefined();
    expect(broker.registry.actions.isAvailable('v2.greeter.hello')).toBe(true);
    const res = await broker.call('v2.greeter.hello');
    expect(res).toEqual('Hello Moleculer');
  });

  it('should give error when param is invalid', async () => {
    const err = broker.call('v2.greeter.welcome', { name: 1 });
    await expect(err).rejects.toBeInstanceOf(Errors.ValidationError);
  });

  it('should give error when param is invalid using object parameter definitions', async () => {
    const err = broker.call('v2.greeter.goodday', { name: 1 });
    await expect(err).rejects.toBeInstanceOf(Errors.ValidationError);
  });

  it('should give result when param is valid', async () => {
    const err = broker.call('v2.greeter.welcome', { name: 'Tests' });
    await expect(err).resolves.toEqual('Welcome, TESTS');
  });

  it('should give result when param is valid', async () => {
    const err = broker.call('v2.greeter.goodbye', { name: 'Tests' });
    await expect(err).resolves.toEqual('Goodbye, TESTS');
  });

  it('should check enum param', async () => {
    let err = broker.call('v2.greeter.enum', { type: 'Tests' });
    await expect(err).rejects.toThrowError();

    err = broker.call('v2.greeter.enum', { type: 'value' });
    await expect(err).resolves.toEqual('value');
  });
});
