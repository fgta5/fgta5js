/*! fgta5js 1.0.0
* demo-crud
*
* Agung Nugroho DW
* https://github.com/agungdhewe
*
* build at 2025-06-17
*/
const a=new $fgta5.Application("myapp");class n{get Application(){return a}async main(a){await async function(){}()}}class t extends n{async main(a){await super.main(a),await async function(){var a=await fetch("demo-crud-include");a.ok;const n=await a.text();document.getElementById("dynamicload").innerHTML=n}()}}export{t as default};
