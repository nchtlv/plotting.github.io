function buildLine2dDerivative() {
  try {
 	//Область определения функции и длина оси OX
 	const ax = Number(val_ax.value), bx = Number(val_bx.value), xmax = Math.abs(bx-ax);
 	//Строка в которой записана функция от x
	const func = val_func.value;
	//Функция от (x) возвращающая значение F(x) где F наша функция
	const F = (x) => {
		return eval(func);
	};
	//Приближенное значение производной функции
	const hX = 0.001;
	const Der = (x) => {
		return (F(x)-F(x+hX))/hX;
	};

	//Константа отвечающая за число разбиения оси OX. Необходимо для других функций.
	const D = 100;
	//Вспомогательный массив для функций возвращающих два значения. Это же вам не GO.
	let helpMas;
	//Функция проверки области определения
	const SearchY = () => {
		let x = ax, y = F(x);
		while (!isFinite(y) && x <= bx) {
			x += xmax/D;
Expand Down
Expand Up	@@ -146,10 +147,10 @@
 	//Блок прорисовки осей координат
 	context.beginPath();
 	context.lineWidth = 2;
  context.moveTo(lx, space.height-dy);
 	context.lineTo(lx, uy);
  context.moveTo(lx, space.height-dy);
 	context.lineTo(space.width-rx, space.height-dy);
 	context.strokeStyle = '#000';
 	context.stroke();

	context.beginPath();
	context.lineWidth = 0.5;
	context.setLineDash([3]);
	context.fillStyle = "#000";
 	const Q = 9;
 	let xc, yc;
 	for (let i = 0; i <= Q; i++) {
    xc = GraphX(ax+i*xmax/Q);
    yc = GraphY(ay+i*ymax/Q);
    context.textAlign = 'right';
    context.moveTo(GraphX(ax), yc);
    context.lineTo(GraphX(bx), yc);

    context.textAlign = 'center'
    context.fillText((ax+i*xmax/Q).toFixed(1), xc, GraphY(ay)+13);
    context.moveTo(xc, GraphY(ay));
    context.lineTo(xc, GraphY(by));
  };
  context.font = "20px Arial";
  context.textAlign = 'center';
  context.fillText('Y', GraphX(ax)-15, GraphY(ay+ymax/2));
  context.fillText('X', GraphX(ax+xmax/2), GraphY(ay)+20);

  context.strokeStyle = '#5f5f5f';
  context.stroke();
  function buildLine2dDerivative() {
 	//Вспомогательная функция для функции PaintLine(x).
 	const Step = (x0, R) => {
 		const k = Der(x0);
    const D = Math.sqrt(k**2+1);
return x0+R*L/D;
};
//Алгоритм строящий одну линию графика.
const PaintLine = (x) => {

   	//Функция строящая все линии на области определения.
   	let x = ax, y = F(x);
   	while (true) {
      while (!isFinite(y) && x < bx) {
  x += xmax/D;
  y = F(x);
};
if (x >= bx) {
  break;
};
x = PaintLine(x) + xmax/D;
};

}
catch (err) {
alert("Ошибка ввода!");
}
