export function ComputePlayerTimer(gameState, playerSymbol) {
  return {
    timer: gameState.timers[playerSymbol],
    timerStartAt:
      playerSymbol === gameState.currentMove
        ? gameState.currentMoveStart
        : undefined,
  };
}
