import { terser } from "rollup-plugin-terser";


const currentdate = (new Date()).toISOString().split('T')[0]
const name = 'fgta5js'
const version = '1.0.0'
const banner = `fgta5js ${version}
* demo-crud
*
* Agung Nugroho DW
* https://github.com/agungdhewe
*
* build at ${currentdate}
`

export default {
  input: "src/demo-crud.mjs", // File utama yang menjadi entry point
  output: {
	file: `dist/demo-crud-v${version}-min.js`, // Lokasi output file hasil bundle
	format: "esm", // Format modul ECMAScript
	banner: `/*! ${banner}*/`
  },
  
  plugins: [
	terser({
		compress: {
			drop_console: true, // Hapus console.log
		}	
	})
  ],
};