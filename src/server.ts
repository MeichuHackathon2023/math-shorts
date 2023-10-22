// import swaggerUi from "swagger-ui-express";
// import YAML from "yamljs";

import app from "@/app";
import { port, env } from "@/utils/config";
import logger from "@/utils/logger";
import { updateStatus } from "./utils/vodWatchDog";

import cron from 'node-cron'

cron.schedule('* * * * *', updateStatus);

app.listen(port, () => {
    logger.info(`Listening to port ${port} in ${env} environment`);
});
