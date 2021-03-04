import typescript from 'rollup-plugin-typescript2'

export default {
  input: './src/index.ts',
  output: {
    file: './dist/index.js',
    format: 'es',
  },
  plugins: [
    typescript({
      typescript: require('typescript'),
    }),
  ],
  treeshake: true,
}
