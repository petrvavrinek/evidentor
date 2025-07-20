export type SerializableLogType = string | number | object;
type LogMethod = (...args: SerializableLogType[]) => void;

export interface ILogger {
  info: LogMethod;
  warn: LogMethod;
  error: LogMethod;
  debug: LogMethod;
}