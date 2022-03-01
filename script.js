let langton = (() => {
  let context;
  let blockSize = 2;
  let grid;
  let width;
  let height;
  let steps;
  let stepCallback;
  let rule = undefined;

  let ant = {
    xPosition: undefined,
    yPosition: undefined,
    direction: undefined,
    run: function (xPosition, yPosition) {
      this.direction = 2;
      this.xPosition = xPosition;
      this.yPosition = yPosition;
    },
    move: function () {
      if (!(this.direction % 2)) {
        this.yPosition -= this.direction - 1;
      } else {
        this.xPosition += this.direction - 2;
      }
    },
    turnLeft: function () {
      this.direction = (this.direction + 3) % 4;
    },
    turnRight: function () {
      this.direction = (this.direction + 5) % 4;
    },
  };
  let initGrid = function () {
    for (let i = 0; i < grid.length; i++) {
      grid[i] = 0;
    }
  };
  let callSteps = function () {
    if (stepCallback !== undefined) {
      stepCallback(steps);
    }
  };
  return {
    steps: 1,
    run: function (canvas) {
      context = canvas.getContext("2d");
      let ctxWidth = canvas.width,
        ctxHeight = canvas.height;

      width = ctxWidth / blockSize;
      height = ctxHeight / blockSize;

      grid = new Int8Array(height + width * height);
      this.reset();
    },
    update: () => {
      let posInGrid = ant.yPosition + ant.xPosition * height;
      if (posInGrid > grid.length || posInGrid < 0) {
        return true;
      }

      let cell = (grid[posInGrid] = (grid[posInGrid] + 1) % rule.color.length);

      context.fillStyle = rule.color[cell];
      context.fillRect(
        ant.xPosition * blockSize,
        ant.yPosition * blockSize,
        blockSize,
        blockSize
      );

      if (rule.direction[cell] === "left") {
        ant.turnLeft();
      } else {
        ant.turnRight();
      }
      ant.move();

      steps++;
      callSteps();
    },
    reset: () => {
      steps = 0;
      callSteps();
      initGrid();
      context.canvas.width = context.canvas.width;
      ant.run(Math.floor(width / 2), Math.floor(height / 2));
    },
    start: function (newRule) {
      if (newRule !== undefined) rule = newRule;
      setInterval(
        function () {
          for (let i = 0; i < this.steps; i++) {
            if (this.update() === true) break;
          }
        }.bind(this),
        0
      );
    },
  };
})();

langton.start({ direction: ["left", "right"], color: ["white", "gray"] });
langton.run(document.getElementById("canvas"));
document.getElementById("canvas").height = window.innerHeight / 2;
document.getElementById("canvas").width = window.innerWidth / 2;
