class Game {
  selected_items = [];
  level = 0;
  score = 0;
  retries = 0;

  constructor(level) {
    this.level = level;
    this.board_size = level + 3;
  }

  createBoard() {
    this.createBoardObject();
    this.generateMatrix();
    this.findMaxMazrab();
    this.showMatrix();
  }

  createBoardObject() {
    this.board = document.getElementById("board");
    this.board.innerHTML = "";
    this.board.style.display = "grid";
    this.board.style.gridTemplateColumns = `repeat(${this.board_size}, 50px)`;
    this.board.style.gridTemplateRows = `repeat(${this.board_size}, 50px)`;
  }

  generateMatrix() {
    this.matrix = [];
    for (let i = 0; i < this.board_size; i++) {
      this.matrix[i] = []; // ایجاد زیرآرایه برای هر ردیف
      for (let j = 0; j < this.board_size; j++) {
        let raned_number = Math.random() * (this.board_size * this.board_size) + 1;
        this.matrix[i][j] = Math.trunc(raned_number);
      }
    }
  }

  findMaxMazrab() {
    this.max_zarb = 0;
    this.max_indices = [];
    let minus_board = this.board_size - 4;

    for (let i = 0; i < this.board_size; i++) {
      for (let j = 0; j < this.board_size; j++) {
        if (j <= minus_board) {
          // بررسی افقی
          let zarb =
            this.matrix[i][j] *
            this.matrix[i][j + 1] *
            this.matrix[i][j + 2] *
            this.matrix[i][j + 3];
          if (zarb > this.max_zarb) {
            this.max_zarb = zarb;
            this.max_indices = [(i, j), (i, j + 1), (i, j + 2), (i, j + 3)];
          }
        }
        if (i <= minus_board) {
          // بررسی عمودی
          let zarb =
            this.matrix[i][j] *
            this.matrix[i + 1][j] *
            this.matrix[i + 2][j] *
            this.matrix[i + 3][j];
          if (zarb > this.max_zarb) {
            this.max_zarb = zarb;
            this.max_indices = [(i, j), (i + 1, j), (i + 2, j), (i + 3, j)];
          }
        }
        if (i <= minus_board && j <= minus_board) {
          // بررسی مورب چپ به راست
          let zarb =
            this.matrix[i][j] *
            this.matrix[i + 1][j + 1] *
            this.matrix[i + 2][j + 2] *
            this.matrix[i + 3][j + 3];
          if (zarb > this.max_zarb) {
            this.max_zarb = zarb;
            this.max_indices = [
              (i, j),
              (i + 1, j + 1),
              (i + 2, j + 2),
              (i + 3, j + 3),
            ];
          }
        }
        if (i <= minus_board && j >= 3) {
          // بررسی مورب راست به چپ
          let zarb =
            this.matrix[i][j] *
            this.matrix[i + 1][j - 1] *
            this.matrix[i + 2][j - 2] *
            this.matrix[i + 3][j - 3];
          if (zarb > this.max_zarb) {
            this.max_zarb = zarb;
            this.max_indices = [
              (i, j),
              (i + 1, j - 1),
              (i + 2, j - 2),
              (i + 3, j - 3),
            ];
          }
        }
      }
    }
  }

  checkAnswer() {
    let result = true;
    this.selected_items.forEach((val) => {
      if (result) if (this.max_indices[val[0]] != val[1]) result = false;
    });

    if (result) {
      this.goToNextLevel();
    } else {
      this.retries ++;
      this.score -= 2;

      document.getElementById("score").innerText = this.score.toString();
      if (this.retries > 3) {
        alert("انقد اشتباه زدی باختی! کلا از اول")
        this.resetGame();
      } else {
        alert("جوابت غلط بود یه بار دیگه تلاش کن")
        this.selected_items = [];
        document.getElementById("retries").innerText = this.retries.toString();
        document.getElementsByClassName("board-item").forEach((el) => {
          el.style.borderColor = "rrgb(31, 180, 180)";
        })
      }
    }
  }

  showMatrix() {
    for (let i = 0; i < this.board_size; i++) {
      for (let j = 0; j < this.board_size; j++) {
        let el = document.createElement("div");
        el.classList.add("board-item");
        el.innerText = this.matrix[i][j];
        el.onclick = () => {
          if (el.style.borderColor == "rgb(228, 182, 0)") {
            this.selected_items = this.selected_items.filter(
              (val) => {
                return val[0] !== i || val[1] !== j;
              }
            );
            el.style.borderColor = "rgb(31, 180, 180)";
          } else {
            if (this.selected_items.length >= 4) {
              alert("نمیتوان بیشتر از این انتخاب کرد");
              this.checkAnswer();
            } else {
              this.selected_items.push([i, j]);
              el.style.borderColor = "rgb(228, 182, 0)";
            }
          }
        };
        
        this.board.appendChild(el);
        document.getElementById("multiplied").innerText = this.max_zarb.toString();
      }
    }
  }

  resetGame() {
    this.score = 0;
    this.retries = 0;
    this.level = 0;
    this.selected_items = [];

    document.getElementById("score").innerText = this.score.toString();
    document.getElementById("level").innerText = this.level.toString();
    document.getElementById("retries").innerText = this.retries.toString();

    this.createBoard();
  }

  upLevelScore() {
    this.score += this.level * 2 + 2;
    this.retries = 0;
    this.level ++;

    document.getElementById("score").innerText = this.score.toString();
    document.getElementById("level").innerText = this.level.toString();
    document.getElementById("retries").innerText = this.retries.toString();
  }

  goToNextLevel() {
    if (this.board_size < 9) {
      this.board_size++;
      this.selected_items = [];
      this.upLevelScore();
      this.createBoard();
    } else {
      alert("مراحل تمام شده است");
    }
  }
}

const game = new Game(1);
game.createBoard();
