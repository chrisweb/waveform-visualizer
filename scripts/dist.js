import typescript from 'rollup-plugin-typescript2'
import pkg from '../package.json' assert { type: "json" }
export default {
    input: 'src/index.ts',
    output: [
        {
            file: pkg.main,
            format: 'esm',
            name: pkg.name,
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