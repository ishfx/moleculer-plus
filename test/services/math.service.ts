import { Context, Service } from 'moleculer';
import { IsNumber, MoleculerAction, MoleculerService } from '../../src';

class MathRequest {
  @IsNumber()
  a: number;

  @IsNumber()
  b: number;
}

@MoleculerService({ name: 'math' })
export class MathService extends Service {
  @MoleculerAction({ params: MathRequest })
  public add(ctx: Context<MathRequest>) {
    return ctx.params.a + ctx.params.b;
  }

  @MoleculerAction({ params: MathRequest })
  public sub(ctx: Context<MathRequest>) {
    return ctx.params.a - ctx.params.b;
  }

  @MoleculerAction({ params: MathRequest })
  public mult(ctx: Context<MathRequest>) {
    return ctx.params.a * ctx.params.b;
  }

  @MoleculerAction({ params: MathRequest })
  public div(ctx: Context<MathRequest>) {
    const c = Number(ctx.params.a);
    const d = Number(ctx.params.b);
    if (d !== 0) {
      return c / d;
    } else {
      throw new Error('Divide by zero!');
    }
  }
}

export default MathService;
