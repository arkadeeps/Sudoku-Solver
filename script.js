class State {
  constructor() {
      this.board = [];
      for (let i = 0; i < 9; i++) {
          let row = [];
          for (let j = 0; j < 9; j++) {
              row.push(0);
          }
          this.board.push(row);
      }
  }

  setValue(row, col, value) {
      this.board[row][col] = value;
  }

  isValid(row, col) {
      for (let i = 0; i < 9; i++) {
          if (i !== col && this.board[row][i] === this.board[row][col]) {
              return false;
          }
          if (i !== row && this.board[i][col] === this.board[row][col]) {
              return false;
          }
      }

      let rowRange = Math.floor(row / 3) * 3;
      let colRange = Math.floor(col / 3) * 3;

      for (let i = rowRange; i < rowRange + 3; i++) {
          for (let j = colRange; j < colRange + 3; j++) {
              if (i !== row && j !== col && this.board[i][j] === this.board[row][col]) {
                  return false;
              }
          }
      }
      return true;
  }

  nextEmptyCell() {
      for (let i = 0; i < 9; i++) {
          for (let j = 0; j < 9; j++) {
              if (this.board[i][j] === 0) {
                  return { row: i, col: j };
              }
          }
      }
      return -1;
  }

  getDomain(row, col) {
      let domain = Array.from({ length: 9 }, (_, i) => i + 1);

      for (let i = 0; i < 9; i++) {
          let indexRow = domain.indexOf(this.board[row][i]);
          if (indexRow > -1) domain.splice(indexRow, 1);
          let indexCol = domain.indexOf(this.board[i][col]);
          if (indexCol > -1) domain.splice(indexCol, 1);
      }

      let rowRange = Math.floor(row / 3) * 3;
      let colRange = Math.floor(col / 3) * 3;

      for (let i = rowRange; i < rowRange + 3; i++) {
          for (let j = colRange; j < colRange + 3; j++) {
              let index = domain.indexOf(this.board[i][j]);
              if (index > -1) domain.splice(index, 1);
          }
      }
      return domain;
  }
}

function solveSudoku(state) {
  let next = state.nextEmptyCell();
  if (next === -1) return true;

  let { row, col } = next;
  let domain = state.getDomain(row, col);

  for (let value of domain) {
      state.setValue(row, col, value);
      if (state.isValid(row, col)) {
          if (solveSudoku(state)) return true;
      }
  }
  state.setValue(row, col, 0);
  return false;
}

function solve() {
  let valid = true;
  let game = new State();
  for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
          let cell = document.getElementById(`${i}${j}`);
          let value = cell.innerText;
          if (value) {
              game.setValue(i, j, parseInt(value));
              if (!game.isValid(i, j)) valid = false;
          }
      }
  }

  if (valid) {
      let solved = solveSudoku(game);
      if (solved) {
          for (let i = 0; i < 9; i++) {
              for (let j = 0; j < 9; j++) {
                  let cell = document.getElementById(`${i}${j}`);
                  if (cell.innerText === '') {  // If the cell was empty, it was generated
                      cell.innerText = game.board[i][j];
                      cell.classList.add('generated-cell');
                      cell.classList.remove('input-cell');
                  }
              }
          }
          document.getElementById("status").innerText = "Success!";
      } else {
          document.getElementById("status").innerText = "Cannot be solved";
      }
  } else {
      document.getElementById("status").innerText = "Invalid input";
  }
}

function reset() {
  for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
          let cell = document.getElementById(`${i}${j}`);
          cell.innerText = "";
          cell.classList.remove('generated-cell');
          cell.classList.add('input-cell');
      }
  }
  document.getElementById("status").innerText = "Sudoku Solver";
}

document.addEventListener('DOMContentLoaded', () => {
  let boardHTML = "";
  for (let i = 0; i < 9; i++) {
      let rowHTML = "";
      for (let j = 0; j < 9; j++) {
          rowHTML += `<td contenteditable id="${i}${j}" class="table-data input-cell" onkeypress="return event.charCode >= 49 && event.charCode <= 57 && this.innerText.length == 0"></td>`;
      }
      boardHTML += `<tr>${rowHTML}</tr>`;
  }
  document.getElementById("board").innerHTML = boardHTML;
});
