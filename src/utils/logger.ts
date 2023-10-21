import winston from "winston";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore

import config from "@/utils/config";

const logger = winston.createLogger({
    level: "info",
    format: winston.format.json(),
});

if (true){//config.env === "local") {
    logger.add(
        new winston.transports.Console({
            // e.g. info: 2023-01-18T07:53:19.033Z "Listening to port 8080 in local environment"
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.colorize({}),
                winston.format.printf(({ level, message, timestamp }) => {
                    return `${level}: ${timestamp} ${JSON.stringify(message, null, 2)}`;
                }),
            ),
        }),
    );
} else {
    // 在非 local 環境中傳送 log 到 logstash 服務
    throw Error("Not Implemented")
}

export default logger;
