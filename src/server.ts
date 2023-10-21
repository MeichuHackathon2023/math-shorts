// import swaggerUi from "swagger-ui-express";
// import YAML from "yamljs";

import app from "@/app";
import config from "@/utils/config";
import logger from "@/utils/logger";

const { port, env } = config;

app.listen(port, () => {
    logger.info(`Listening to port ${port} in ${env} environment`);
});
