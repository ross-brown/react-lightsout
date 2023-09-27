import React, { useState } from "react";
import Cell from "./Cell";
import "./Board.css";

/** Game board of Lights out.
 *
 * Properties:
 *
 * - nrows: number of rows of board
 * - ncols: number of cols of board
 * - chanceLightStartsOn: float, chance any cell is lit at start of game
 *
 * State:
 *
 * - board: array-of-arrays of true/false
 *
 *    For this board:
 *       .  .  .
 *       O  O  .     (where . is off, and O is on)
 *       .  .  .
 *
 *    This would be: [[f, f, f], [t, t, f], [f, f, f]]
 *
 *  This should render an HTML table of individual <Cell /> components.
 *
 *  This doesn't handle any clicks --- clicks are on individual cells
 *
 **/

function Board({ nrows = 5, ncols = 5, chanceLightStartsOn = 0.25 }) {
  const [board, setBoard] = useState(createBoard());

  /** create a board nrows high/ncols wide, each cell randomly lit or unlit */
  function createBoard() {
    let initialBoard = [];

    for (let i = 0; i < nrows; i++) {
      const row = [];
      for (let j = 0; j < ncols; j++) {
        row.push(Math.random() < chanceLightStartsOn);
      }
      initialBoard.push(row);
    }

    return initialBoard;
  }

  /** check the board in state to determine whether the player has won. */
  function hasWon() {
    return board.every(row => row.every(light => !light));
  }

  /** takes in y-x coordinates for a cell and sets the state of the board
   *  with that cell and the cells around it flipped
   */
  function flipCellsAround(coord) {
    setBoard(oldBoard => {
      const [y, x] = coord.split("-").map(Number);

      const flipCell = (y, x, boardCopy) => {
        // if this coord is actually on board, flip it

        if (x >= 0 && x < ncols && y >= 0 && y < nrows) {
          boardCopy[y][x] = !boardCopy[y][x];
        }
      };

      //Make a (deep) copy of the oldBoard
      const boardCopy = [...oldBoard];

      //in the copy, flip this cell and the cells around it
      flipCell(y, x, boardCopy);
      flipCell(y + 1, x, boardCopy);
      flipCell(y - 1, x, boardCopy);
      flipCell(y, x + 1, boardCopy);
      flipCell(y, x - 1, boardCopy);

      //return the copy
      return boardCopy;
    });
  }


  return (
    <div className="Board">
      <h1 className="Board-title">LIGHTS OUT</h1>
      {/* if the game is won, just show a winning msg & render nothing else */}
      {hasWon() ? <h1>You won!</h1> :
        <table>
          <tbody>
            {board.map((row, rIdx) => {
              return (
                <tr key={rIdx}>
                  {row.map((light, cIdx) =>
                    <Cell
                      key={`${rIdx}-${cIdx}`}
                      flipCellsAroundMe={flipCellsAround}
                      isLit={light}
                      coord={`${rIdx}-${cIdx}`}
                    />
                  )}
                </tr>
              );
            })
            }
          </tbody>
        </table>
      }
    </div>
  );
}

export default Board;
