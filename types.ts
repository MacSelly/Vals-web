
export interface HeartData {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
}

export enum AppState {
  PROPOSING = 'PROPOSING',
  ACCEPTED = 'ACCEPTED'
}
