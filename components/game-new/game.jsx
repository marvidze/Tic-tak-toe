import { PLAYERS } from "./constants";
import { BackLink } from "./ui/back-link";
import { GameInfo } from "./ui/game-info";
import { GameLoayout } from "./ui/game-loayout";
import { GameMoveInfo } from "./ui/game-move-info";
import { GameTitle } from "./ui/game-title";
import { GameCell } from "./ui/game-cell";
import { PlayerInfo } from "./ui/player-info";
import { GameOverModal } from "./ui/game-overomodal";
import {
  GAME_STATE_ACTIONS,
  initGameState,
  gameStateReduser,
} from "./model/game-state-reducer";
import { getNextMove } from "./model/get-next-move";
import { computeWinner } from "./model/compute-winner";
import { useCallback, useMemo, useReducer } from "react";
import { computeWinnerSymbol } from "./model/compute-winner-symbol";
import { ComputePlayerTimer } from "./model/compute-player-timer";
import { useInterval } from "../lib/timers";

const PLAYERS_COUNT = 2;

export function Game() {
  const [gameState, dispatch] = useReducer(
    gameStateReduser,
    {
      playersCount: PLAYERS_COUNT,
      defaultTimer: 10000,
      currentMoveStart: Date.now(),
    },
    initGameState,
  );

  useInterval(
    100,
    !!gameState.currentMoveStart,
    useCallback(() => {
      dispatch({
        type: GAME_STATE_ACTIONS.TICK,
        now: Date.now(),
      });
    }, []),
  );

  const winnerSequence = useMemo(() => computeWinner(gameState), [gameState]);
  const nextMove = getNextMove(gameState, PLAYERS_COUNT, []);
  const winnerSymbol = computeWinnerSymbol(gameState, {
    winnerSequence,
    nextMove,
  });
  const winnerPlayer = PLAYERS.find((player) => player.symbol === winnerSymbol);

  const handleCellClick = useCallback((index) => {
    dispatch({
      type: GAME_STATE_ACTIONS.CELL_CLICK,
      index,
      now: Date.now(),
    });
  }, []);

  const { cells, currentMove } = gameState;

  return (
    <>
      <GameLoayout
        backLink={<BackLink />}
        title={<GameTitle />}
        gameInfo={
          <GameInfo isRatingGame playersCount={4} timeMode={"1 мин. на ход"} />
        }
        playersList={PLAYERS.slice(0, PLAYERS_COUNT).map((player, index) => {
          const { timer, timerStartAt } = ComputePlayerTimer(
            gameState,
            player.symbol,
          );
          return (
            <PlayerInfo
              key={player.id}
              avatar={player.avatar}
              name={player.name}
              rating={player.rating}
              symbol={player.symbol}
              timer={timer}
              timerStartAt={timerStartAt}
              isRight={index % 2 === 1}
            />
          );
        })}
        gameMoveInfo={
          <GameMoveInfo currentMove={currentMove} nextMove={nextMove} />
        }
        gameCells={cells.map((cell, index) => (
          <GameCell
            key={index}
            index={index}
            disabled={!!winnerSymbol}
            isWinner={winnerSequence?.includes(index)}
            onClick={handleCellClick}
            symbol={cell}
          />
        ))}
      />
      <GameOverModal
        winnerName={winnerPlayer?.name}
        players={PLAYERS.slice(0, PLAYERS_COUNT).map((player, index) => (
          <PlayerInfo
            key={player.id}
            avatar={player.avatar}
            name={player.name}
            rating={player.rating}
            seconds={60}
            symbol={player.symbol}
            isRight={index % 2 === 1}
          />
        ))}
      />
    </>
  );
}
