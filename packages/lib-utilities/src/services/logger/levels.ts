export const pinoLevels: string[] = [
  // These are all values of the union LevelWithSilent of pino.
  // TODO: LevelWithSilent union type to string[]?
  "silent",
  "fatal",
  "error",
  "warn",
  "info",
  "debug",
  "trace",
] as const;
