export function promisify<
  Fn extends (...args: [...any[], (...args: any[]) => unknown]) => any,
  P extends ParametersOfCallback<Fn>,
>(fn: Fn, ...args: DropLastIfFunction<Parameters<Fn>>): Promise<P> {
  return new Promise(resolve => {
    fn(...args, (...cbArgs: P) => {
      resolve(cbArgs);
    });
  });
}

type ParametersOfCallback<Fn extends (...args: any[]) => unknown> = Fn extends (
  ...args: [...any, (...args: infer P) => unknown]
) => any
  ? P
  : never;

type DropLastIfFunction<T extends any[]> = T extends [...infer Rest, infer Last]
  ? Last extends (...args: any[]) => any
    ? Rest
    : T
  : T;

export async function execWithRetry<
  Fn extends (...args: any[]) => unknown,
  RT extends ReturnType<Fn>,
>(fn: Fn, args: Parameters<Fn>, retries = 3, delay = 1000): Promise<Awaited<RT>> {
  for (let i = 0; i < retries; i++) {
    try {
      console.log({ tried: i });
      return (await fn(...args)) as Awaited<RT>;
    } catch (error) {
      if (i === retries - 1) throw error;
      if (delay > 0) {
        await sleep(delay);
      }
    }
  }

  throw new Error('Max retries exceeded');
}

export function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
