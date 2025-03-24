import pkg from './package.json' with { type: 'json' }
import typescript from '@rollup/plugin-typescript'
import { nodeResolve } from '@rollup/plugin-node-resolve'

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
        nodeResolve({
            extensions: ['.ts', '.js']
        }),
        typescript({
            compilerOptions: {
                declaration: true,
                declarationDir: './dist',
                sourceMap: true
            },
            include: ['src/**/*.ts'],
            exclude: ['node_modules', 'dist', 'examples']
        })
    ],
}