import './css/common.css';
import './css/test.less';
import Layer from './components/layer/layer.js';

const App = function(){
	const NUM = 1;
	alert(NUM);
	console.log(Layer);
	var layer = new Layer();
	document.getElementById('app').innerHTML = layer.tpl;
};

new App();
