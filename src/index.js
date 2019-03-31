import {init, addCube, removeCube, printCubes} from './init.js';
import style from './css/base.css';

window.onload = init;
window.addCube = addCube;
window.removeCube = removeCube;
window.printCubes = printCubes;

if (module.hot) {
  module.hot.accept('./init.js', function() {
    console.log('reloading init...');
    init();
  });
}
