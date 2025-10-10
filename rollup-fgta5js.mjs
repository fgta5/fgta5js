// import { readFile } from 'fs/promises';
// const pkg = JSON.parse(await readFile('./package.json', 'utf-8'));
import { resolve } from 'path';
import { fileURLToPath } from 'url';
import postcss from 'rollup-plugin-postcss';
import terser from '@rollup/plugin-terser';
import commonjs from '@rollup/plugin-commonjs';
import nodeResolve from '@rollup/plugin-node-resolve';
import json from '@rollup/plugin-json';

const __filename = fileURLToPath(import.meta.url);
const __dirname = resolve(__filename, '..');



const currentdate = (new Date()).toISOString().split('T')[0]
const name = 'fgta5js'
const version = '1.8.3'
const banner = `fgta5js ${version}
* https://github.com/fgta5/fgta5js
* A simple component for FGTA5 framework
*
* Agung Nugroho DW
* https://github.com/agungdhewe
*
* build at ${currentdate}
`

export default {
  input: "build.mjs", // File utama yang menjadi entry point
  output: {
    file: `dist/${name}-v${version}.min.js`, // Lokasi output file hasil bundle
    format: "esm", // Format modul ECMAScript
	sourcemap: true,
	banner: `/*! ${banner}*/`
  },
  
  plugins: [
	
    // terser({
	// 	compress: {
	// 		drop_console: true, // Hapus console.log
	// 	}	
	// }),

	// postcss({
	// 	extract: `${name}-v${version}.min.css`, // Nama file CSS yang diekstrak
	// 	minimize: true, // Minifikasi CSS
	// 	plugins: [
	// 		require("cssnano"), // Gunakan cssnano untuk minifikasi
	// 	]
	// }),

    nodeResolve(),
    commonjs(),
    json(),
    postcss({
     extract: `${name}-v${version}.min.css`, // Nama file CSS yang diekstrak
      minimize: true,
    }),
    terser()

	
  ],
};