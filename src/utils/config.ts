type Env = "local" | "prod";

export const port = process.env.PORT || 8080;
export const env = process.env.ENV as Env;
export const kkEndpoint = process.env.KK_API_ENDPOINT;
export const kkShowroomEndpoint = process.env.KK_SHOWROOM_ENDPOINT