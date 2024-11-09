import { CrossIcon } from "./icons/cross-icon";
import { TringleIcon } from "./icons/tringle-icon";
import { ZeroIcon } from "./icons/zero-icon";
import { SquareIcon } from "./icons/square-icon";
import { GAME_SYMBOLS } from "./constants";

export function GameSymbol({ symbol, className }) {
  const Icon =
    {
      [GAME_SYMBOLS.CROSS]: CrossIcon,
      [GAME_SYMBOLS.ZERO]: ZeroIcon,
      [GAME_SYMBOLS.TRINGLE]: TringleIcon,
      [GAME_SYMBOLS.SQUARE]: SquareIcon,
    }[symbol] ?? CrossIcon;

  return <Icon className={className} />;
}
