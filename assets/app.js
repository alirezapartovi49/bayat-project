class Game {
  constructor(level) {
    this.selectedItems = [];
    this.level = level;
    this.score = 0;
    this.retries = 0;
    this.boardSize = level + 3;
    this.matrix = [];
    this.maxZarb = 0;
    this.maxIndices = [];
    this.time = 10;
    this.timeInterval = null;
    this.board = document.getElementById("board");
    
    this.setupNotyf();
    this.createBoard();
  }

  setupNotyf() {
    this.notyf = new Notyf({
      position: {
        x: 'center',
        y: 'top',
      },
      types: [
        {
          type: 'warning',
          background: 'orange',
          icon: {
            className: 'material-icons',
            tagName: 'i',
            text: 'warning'
          }
        },
        {
          type: 'error',
          background: 'indianred',
          duration: 2000,
          dismissible: true
        }
      ]
    });
  }

  createBoard() {
    this.setupBoard();
    this.generateMatrix();
    this.findMaxZarb();
    this.showMatrix();
    this.timeHandler();
  }

  setupBoard() {
    this.board.innerHTML = "";
    this.board.style.display = "grid";
    this.board.style.gridTemplateColumns = `repeat(${this.boardSize}, 50px)`;
    this.board.style.gridTemplateRows = `repeat(${this.boardSize}, 50px)`;
  }

  generateMatrix() {
    this.matrix = Array.from({ length: this.boardSize }, () => Array.from({ length: this.boardSize }, () => Math.trunc(Math.random() * (this.boardSize * this.boardSize) + 1)));
  }

  findMaxZarb() {
    this.maxZarb = 0;
    this.maxIndices = [];
    const minusBoard = this.boardSize - 4;

    for (let i = 0; i < this.boardSize; i++) {
      for (let j = 0; j < this.boardSize; j++) {
        this.checkDirection(i, j, minusBoard);
      }
    }
  }

  checkDirection(i, j, minusBoard) {
    // Check horizontal
    if (j <= minusBoard)
      this.checkProduct(i, j, [
        [0, 0],
        [0, 1],
        [0, 2],
        [0, 3],
      ]);
    // Check vertical
    if (i <= minusBoard)
      this.checkProduct(i, j, [
        [0, 0],
        [1, 0],
        [2, 0],
        [3, 0],
      ]);
    // Check diagonal left to right
    if (i <= minusBoard && j <= minusBoard)
      this.checkProduct(i, j, [
        [0, 0],
        [1, 1],
        [2, 2],
        [3, 3],
      ]);
    // Check diagonal right to left
    if (i <= minusBoard && j >= 3)
      this.checkProduct(i, j, [
        [0, 0],
        [1, -1],
        [2, -2],
        [3, -3],
      ]);
  }

  checkProduct(i, j, offsets) {
    const product = offsets.reduce((acc, [di, dj]) => acc * this.matrix[i + di][j + dj], 1);
    if (product > this.maxZarb) {
      this.maxZarb = product;
      this.maxIndices = offsets.map(([di, dj]) => [i + di, j + dj]);
    }
  }

  checkAnswer() {
    const isCorrect = this.selectedItems.every((val) => this.maxIndices.some((index) => index[0] === val[0] && index[1] === val[1]));

    if (isCorrect) {
      this.goToNextLevel();
    } else {
      this.handleIncorrectAnswer();
    }
  }

  handleIncorrectAnswer(timeout = false) {
    this.retries++;
    this.score -= 2;
    document.getElementById("score").innerText = this.score.toString();

    if (this.retries > 3) {
      this.notyf.error("انقد اشتباه زدی باختی! کلا از اول");
      this.resetGame();
    } else {
      if (timeout) {
        this.notyf.error("زمانت تموم شد یبار دیگه تلاش کن")
        this.timeHandler();
      } else this.notyf.error("جوابت غلط بود یه بار دیگه تلاش کن");
      this.resetSelectedItems();
      document.getElementById("retries").innerText = this.retries.toString();
    }
  }

  resetSelectedItems() {
    this.selectedItems.forEach((val) => {
      const el = this.board.children[val[0] * this.boardSize + val[1]];
      if (el) {
        el.style.borderColor = "rgb(159, 159, 255)";
      }
    });
    this.selectedItems = [];
  }

  showMatrix() {
    this.matrix.forEach((row, i) => {
      row.forEach((value, j) => {
        const el = document.createElement("div");
        el.classList.add("board-item");
        el.innerText = value;
        el.onclick = () => this.handleItemClick(el, i, j);
        this.board.appendChild(el);
      });
    });
    document.getElementById("multiplied").innerText = this.maxZarb.toString();
  }

  handleItemClick(el, i, j) {
    if (el.style.borderColor === "rgb(228, 182, 0)") {
      this.selectedItems = this.selectedItems.filter((val) => val[0] !== i || val[1] !== j);
      el.style.borderColor = "rgb(159, 159, 255)";
    } else {
      if (this.selectedItems.length === 3) {
        // alert("نمیتوان بیشتر از این انتخاب کرد");
        this.checkAnswer();
      } else {
        this.selectedItems.push([i, j]);
        el.style.borderColor = "rgb(228, 182, 0)";
      }
    }
  }

  resetGame() {
    this.score = 0;
    this.retries = 0;
    this.level = 1;
    this.selectedItems = [];
    this.maxZarb = 0;
    this.maxIndices = [];
    document.getElementById("score").innerText = this.score.toString();
    document.getElementById("level").innerText = this.level.toString();
    document.getElementById("retries").innerText = this.retries.toString();
    this.createBoard();
  }

  upLevelScore() {
    this.score += this.level * 2 + 2;
    this.retries = 0;
    this.level++;
    document.getElementById("score").innerText = this.score.toString();
    document.getElementById("level").innerText = this.level.toString();
    document.getElementById("retries").innerText = this.retries.toString();
  }


  downLevelScore() {
    this.score -= this.level * 2 + 2;
    this.retries ++;
    this.level--;
    document.getElementById("score").innerText = this.score.toString();
    document.getElementById("level").innerText = this.level.toString();
    document.getElementById("retries").innerText = this.retries.toString();
  }

  goToNextLevel() {
    if (this.boardSize < 9) {
      this.boardSize++;
      this.selectedItems = [];
      this.time = 10;
      clearInterval(this.timeInterval);
      this.upLevelScore();
      this.createBoard();
    } else {
      this.notyf.error("مراحل تمام شده");
    }
  }

  goToPrevLevel() {
    if (this.boardSize > 4) {
      this.boardSize--;
      this.selectedItems = [];
      this.time = 10;
      clearInterval(this.timeInterval);
      this.downLevelScore();
      this.createBoard();
    } else {
      clearInterval(this.timeInterval);
      this.notyf.error("مراحل تمام شده است");
    }
  }

  timeHandler() {
    this.timeElem = document.querySelector("#time-label");
    this.topHead__timeElem = document.querySelector(".top-head__time-elem");

    if (this.time === 0) {
      this.time = 10;
      this.timeElem.innerHTML = this.time;
    }

    this.timeElem.innerHTML = this.time;
    this.timeIntervalAction = () => {
      if (this.time > 0) {
        this.time--;
        this.timeElem.innerHTML = this.time;

        if (this.time < 4) {
          this.topHead__timeElem.style.borderColor = "red";
        } else {
          this.topHead__timeElem.style.borderColor = "rgb(31, 180, 180)";
        }
      } else {
        if (this.score > 0) {
          // this.handleIncorrectAnswer();
          this.goToPrevLevel();
        } else {
          clearInterval(this.timeInterval);
          this.handleIncorrectAnswer(true);
        }
      }
    }
    this.timeInterval = setInterval(this.timeIntervalAction, 1000);
  }
}

const game = new Game(1);
