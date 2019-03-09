import init from './init.js';

window.onload = init;

if (module.hot) {
  module.hot.accept('./init.js', function() {
    console.log('reloading init...');
    init();
  });
}
