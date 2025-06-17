import { terser } from "rollup-plugin-terser";
import postcss from "rollup-plugin-postcss";


const currentdate = (new Date()).toISOString().split('T')[0]
const name = 'fgta5js'
const version = '1.0.0'
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
    file: `dist/${name}-v${version}-min.js`, // Lokasi output file hasil bundle
    format: "esm", // Format modul ECMAScript
	banner: `/*! ${banner}*/`
  },
  
  plugins: [
	
    terser({
		compress: {
			drop_console: true, // Hapus console.log
		}	
	}),

	postcss({
		extract: `${name}-v${version}-min.css`, // Nama file CSS yang diekstrak
		minimize: true, // Minifikasi CSS
		plugins: [
			require("cssnano"), // Gunakan cssnano untuk minifikasi
		]
	}),
	
  ],
};