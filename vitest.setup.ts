import { beforeAll } from 'vitest';

globalThis.qTest = true;
globalThis.qRuntimeQrl = true;
globalThis.qDev = true;
globalThis.qInspector = false;

beforeAll(async () => {
  const { getPlatform } = await import('@builder.io/qwik');
  const { setPlatform } = await import('@builder.io/qwik');
  setPlatform(getPlatform() as any);
});