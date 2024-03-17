export const roundCoord = (coord: number): number => Math.floor(coord);

export const returnTouchCoord = (e: any): { endPageX: number; endPageY: number } => {
  const [{ pageX, pageY }] = e.changedTouches;
  return {
    endPageX: roundCoord(pageX),
    endPageY: roundCoord(pageY),
  };
};
