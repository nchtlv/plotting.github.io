"use strict";
function buildLine2dDerivative() {
  try {
    //Область определения функции и длина оси OX
    const ax = Number(val_ax.value),
      bx = Number(val_bx.value),
      xmax = Math.abs(bx - ax);
    //Строка в которой записана функция от x
    const func = val_func.value;
    //Функция от (x) возвращающая значение F(x) где F наша функция
    const F = (x) => {
      return eval(func);
    };
    //Приближенное значение производной функции
    const hX = 0.001;
    const Der = (x) => {
      return (F(x) - F(x + hX)) / hX;
    };

    //Константа отвечающая за число разбиения оси OX. Необходимо для других функций.
    const D = 100;
    //Вспомогательный массив для функций возвращающих два значения. Это же вам не GO.
    let helpMas;
    //Функция проверки области определения
    const SearchY = () => {
      let x = ax,
        y = F(x);
      while (!isFinite(y) && x <= bx) {
        x += xmax / D;
        y = F(x);
      }
      if (x > bx) {
        alert("Ошибка бласти определения");
        throw new Error();
      }
      return y;
    };
    //INF - число, которое отвечает за определение стремления к бесконечности функции.
    //Если k = tan(a) > INF, то стоит следить за дальнейшим поведением функции.
    //nstep - число отвечающее за число шагов по графику при tan(a) > INF.
    const INF = 250,
      nstep = 3;
    //Переменная счетчик
    let step = nstep;
    //Алгоритм делающий шаг длины L по направлению R вдоль касательной.
    //Вспомогательная функция для функции RunByLine(x, y, L).
    const StepRBL = (x0, R, L) => {
      const k = Der(x0);
      if (Math.abs(k) > INF) {
        step--;
      } else {
        step = nstep;
      }
      const D = Math.sqrt(k ** 2 + 1);
      return x0 + (R * L) / D;
    };
    //Функция поиска более точных значений max и min OY на одной линии.
    const RunByLine = (x, y, L) => {
      let R = 1,
        x1,
        y1,
        max = y,
        min = y,
        mx;
      const P = x;
      while (true) {
        x1 = StepRBL(x, R, L);
        y1 = F(x1);
        if (!isFinite(y1) || step <= 0 || x1 < ax || x1 > bx) {
          step = nstep;
          if (R == -1) {
            break;
          } else {
            mx = x;
            x = P;
            R = -1;
            continue;
          }
        }
        x = x1;
        if (y1 > max) {
          max = y1;
        }
        if (y1 < min) {
          min = y1;
        }
      }
      return [max, min, mx];
    };
    //Функция поиска max и min OY на всей области определения.
    const SearchAyBy = (L, ay, by) => {
      let x = ax,
        y = F(x);
      while (true) {
        while (!isFinite(y) && x < bx) {
          x += xmax / D;
          y = F(x);
        }
        if (x >= bx) {
          break;
        }
        helpMas = RunByLine(x, y, L);

        if (helpMas[0] > by) {
          by = helpMas[0];
        }
        if (helpMas[1] < ay) {
          ay = helpMas[1];
        }
        x = helpMas[2] + xmax / D;
      }
      return [ay, by];
    };
    //Функция возвращающая окончательные значения ay и by
    //Пользователь может ввести данные самостоятельно, а может довериться программе
    const ReturnAyBy = () => {
      let ay, by;
      if (auto_f.checked) {
        ay = by = SearchY();
        const L = xmax / 40000;
        helpMas = SearchAyBy(L, ay, by);
        ay = helpMas[0];
        by = helpMas[1];
      } else {
        ay = Number(val_ay.value);
        by = Number(val_by.value);
      }
      return [ay, by];
    };
    helpMas = ReturnAyBy();
    //Константы ay, by, ymax, L. Пояснения требует только L (хоть она и встречалась раньше).
    //L - длина шага вдоль касательной. Она вычесляется как среднее геометрическое между xmax и ymax.
    //Почему среднее геометрическое, а не арифметическое? Я и сам не знаю, для меня график это все-таки геометрия, поэтому среднее геометрическое.
    const ay = helpMas[0],
      by = helpMas[1],
      ymax = Math.abs(by - ay),
      L = Math.sqrt(xmax ** 2 + ymax ** 2) / 40000;

    //Обновление canvas и создание context
    space.width = space.width;
    const context = space.getContext("2d");
    //Заливка в белый.
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, space.width, space.height);

    //Отступ сверху, снизу, слева и справа соответственно.
    const uy = 10,
      dy = 30,
      lx = 30,
      rx = 10;
    const maxX = space.width - lx - rx,
      maxY = space.height - uy - dy;
    const kx = maxX / xmax,
      ky = maxY / ymax;
    //Функции преобразующие координаты графика в координаты canavas
    const GraphX = (x) => {
      return lx + (x - ax) * kx;
    };
    const GraphY = (y) => {
      return uy + maxY - (y - ay) * ky;
    };

	//Блок прорисовки осей координат
    context.beginPath();
    context.lineWidth = 2;
    context.moveTo(lx, space.height - dy);
    context.lineTo(lx, uy);
    context.moveTo(lx, space.height - dy);
    context.lineTo(space.width - rx, space.height - dy);
    context.strokeStyle = "#000";
    context.stroke();

    context.beginPath();
    context.lineWidth = 0.5;
    context.setLineDash([3]);
    context.fillStyle = "#000";
    const Q = 9;
    let xc, yc;
    for (let i = 0; i <= Q; i++) {
      xc = GraphX(ax + (i * xmax) / Q);
      yc = GraphY(ay + (i * ymax) / Q);
      context.textAlign = "right";
      context.fillText(
        (ay + (i * ymax) / Q).toFixed(1),
        GraphX(ax) - 3,
        yc + 2.5,
        lx - 5
      );
      context.moveTo(GraphX(ax), yc);
      context.lineTo(GraphX(bx), yc);

      context.textAlign = "center";
      context.fillText((ax + (i * xmax) / Q).toFixed(1), xc, GraphY(ay) + 13);
      context.moveTo(xc, GraphY(ay));
      context.lineTo(xc, GraphY(by));
    }
    context.font = "24px Roboto";
    context.textAlign = "center";
    context.fillText("Y", GraphX(ax) - 15, GraphY(ay + ymax / 2));
    context.fillText("X", GraphX(ax + xmax / 2), GraphY(ay) + 20);

    context.strokeStyle = "blue";
    context.stroke();

    context.beginPath();
    context.setLineDash([0]);
    context.lineWidth = 0.5;

    if (ax <= 0) {
      context.moveTo(GraphX(0), GraphY(ay));
      context.lineTo(GraphX(0), GraphY(by));
    }
    if (ay <= 0) {
      context.moveTo(GraphX(ax), GraphY(0));
      context.lineTo(GraphX(bx), GraphY(0));
    }
    context.strokeStyle = "green";
    context.stroke();

    //Алгоритм делающий шаг длины L по направлению R вдоль касательной.
    //Вспомогательная функция для функции PaintLine(x).
    const Step = (x0, R) => {
      const k = Der(x0);
      const D = Math.sqrt(k ** 2 + 1);
      return x0 + (R * L) / D;
    };
    //Алгоритм строящий одну линию графика.
    const PaintLine = (x) => {
      context.beginPath();
      let x0, P, Q, R, y, mx;
      P = x;

      x0 = P;
      context.moveTo(GraphX(x0), GraphY(F(x0)));
      R = 1;
      while (true) {
        x = Step(x0, R);
        y = F(x);
        context.lineTo(GraphX(x), GraphY(y));
        if (!isFinite(y) || x > bx || x < ax || y > by || y < ay) {
          if (R == -1) {
            break;
          } else {
            mx = x0;
            R = -1;
            x0 = P;
            context.moveTo(GraphX(x0), GraphY(F(x0)));
            continue;
          }
        }
        x0 = x;
      }

      context.strokeStyle = "red";
      context.stroke();
      return mx;
    };
    //Функция строящая все линии на области определения.
    let x = ax,
      y = F(x);
    while (true) {
      while (!isFinite(y) && x < bx) {
        x += xmax / D;
        y = F(x);
      }
      if (x >= bx) {
        break;
      }
      x = PaintLine(x) + xmax / D;
    }
  } catch (err) {
    alert("Ошибка ввода!");
  }
}
