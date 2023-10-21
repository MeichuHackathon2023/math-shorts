type Env = "local" | "prod";

export default {
    port:  process.env.PORT || 8080,
    env: process.env.ENV as Env
}