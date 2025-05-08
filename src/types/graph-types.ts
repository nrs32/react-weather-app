export type Point = { x: number; y: number };

export type LabeledYPoint = { yLabel: string } & Point;

export type LabeledXPoint = { xLabel: string, xSubLabel?: string } & Point;

export interface GraphProps {
  graphWidth: number,
  graphHeight: number,
  chartTop: number,
  chartLeft: number,
}

export const SPACE_BELOW_DATA = 20; // Used to help charts look pretty by giving them some room below their lowest point