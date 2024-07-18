import winston from "winston";

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({
      filename: "/logs/debug.log",
      level: "debug",
    }),
    new winston.transports.File({
      filename: "/logs/error.log",
      level: "error",
    }),
    new winston.transports.File({ filename: "/logs/info.log", level: "info" }),
    new winston.transports.File({ filename: "/logs/combined.log" }),
  ],
});

enum LogLevel {
  Error = "error",
  Warning = "warn",
  Info = "info",
  Verbose = "verbose",
  Debug = "debug",
}

type LogInput = {
  subService: string;
  message: string;
  details: object;
};

export enum RedactionLevel {
  sensitiveValues = "sensitiveValues",
  none = "none",
}

const formatMessage = ({ subService, message, details }: LogInput) => {
  return `
  subservice: ${subService}
  message: ${message}
  details: ${JSON.stringify(details)}`;
};

export const logError = async (
  logInput: LogInput,
  options?: {
    redactionLevel: RedactionLevel;
  }
): Promise<void> => {
  await logger.log(LogLevel.Error, formatMessage(logInput), options);
};

export const logWarning = async (
  logInput: LogInput,
  options?: {
    redactionLevel: RedactionLevel;
  }
): Promise<void> => {
  await logger.log(LogLevel.Warning, formatMessage(logInput), options);
};
export const logInfo = async (
  logInput: LogInput,
  options?: {
    redactionLevel: RedactionLevel;
  }
): Promise<void> => {
  await logger.log(LogLevel.Error, formatMessage(logInput), options);
};
export const logVerbose = async (
  logInput: LogInput,
  options?: {
    redactionLevel: RedactionLevel;
  }
): Promise<void> => {
  await logger.log(LogLevel.Verbose, formatMessage(logInput), options);
};
export const logDebug = async (
  logInput: LogInput,
  options?: {
    redactionLevel: RedactionLevel;
  }
): Promise<void> => {
  await logger.log(LogLevel.Debug, formatMessage(logInput), options);
};
