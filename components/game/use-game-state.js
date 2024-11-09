import { useState } from "react";
import { GAME_SYMBOLS } from "../../game/constants";
import { computeWinner, getNextMove } from "../../game/model";

export function useGameState(playersCount){
  const [{ cells, currentMove, playersTimesOver }, setGameState] = useState(() => ({
    cells: new Array(19 * 19).fill(null),
    currentMove: GAME_SYMBOLS.CROSS,
    playersTimesOver: [],
  }));


  const winnerSequence = computeWinner(cells);
  const nextMove = getNextMove(currentMove, playersCount, playersTimesOver);

  const winnerSymbol = nextMove === currentMove ? currentMove : winnerSequence?.[0];

  const handleCellClick = (index) => {
  setGameState((lastGameState) => {
  if(lastGameState.cells[index]) {
    return lastGameState;
  }
  return{
    ...lastGameState,
    currentMove: getNextMove(lastGameState.currentMove, playersCount, playersTimesOver),
    cells: lastGameState.cells.map((cell, i) =>
      i === index ? lastGameState.currentMove : cell,
    ),
  }
  });
  }

  const handlePlayerTimeOver = (symbol) => {
    setGameState((lastGameState) => {
      return{
        ...lastGameState,
        playersTimesOver: [...lastGameState.playersTimesOver, symbol],
        currentMove: getNextMove(lastGameState.currentMove, playersCount, playersTimesOver),
      };
    });
  }

  return {
    cells, 
    currentMove, 
    nextMove, 
    handleCellClick,
    handlePlayerTimeOver,
    winnerSequence,
    winnerSymbol,
  }
}