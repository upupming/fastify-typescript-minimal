import { defineConfig } from 'tsup'

export default defineConfig(() => {
  return {
    format: ['cjs'],
    clean: true,
    bundle: true,
    dts: false,
    entry: ['./src/index.ts'],
    outDir: 'dist',
    target: 'es5'
}})
