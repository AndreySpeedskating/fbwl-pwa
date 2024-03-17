const TILE_STEP = 3;
const LAST_ROW_INDEX = 2;

export const ICON_FORMAT = {
  SMALL: 16,
  BIG: 24,
};

export function tileScheme(index: number): { [key: number]: number } {
  return {
    0: 2,
    [index % TILE_STEP === 0 ? index : 0]:
      index % (TILE_STEP * LAST_ROW_INDEX) === 0 ? LAST_ROW_INDEX : 0,
  };
}
