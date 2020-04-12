import typescript from 'rollup-plugin-typescript2'
import pkg from '../package.json'
export default {
  input: 'src/index.ts',
  output: [
    {
      file: pkg.main,
      format: 'umd',
      name: pkg.name,
      sourcemap: true
    },
    {
      file: pkg.module,
      format: 'esm',
      sourcemap: true
    },
  ],
plugins: [
    typescript({
        tsconfig: "tsconfig.json",
        useTsconfigDeclarationDir: true
    }),
  ],
}