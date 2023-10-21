// "express-async-errors" package throws errors automatically to the next function in async
// request handlers, so that we don't need to try and catch in every handler
// It should be imported before importing any routes
import cors from "cors";
import express from "express";
import helmet from "helmet";
import "express-async-errors";

import { errorMiddleware } from "@/middlewares/errorMiddleware";
import { loggingMiddleware } from "@/middlewares/loggingMiddleware";
import { requestIdMiddleware } from "@/middlewares/requestIdMiddleware";
import { serviceMiddleware } from "@/middlewares/serviceMiddleware";
import apiRouter from "@/routers/index";
import passport from "@/utils/passport";

const app = express();

// Middlewares
app.use(cors({exposedHeaders: ['Content-Disposition']}));
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(requestIdMiddleware);
app.use(serviceMiddleware);
app.use(passport.initialize());
app.use(loggingMiddleware);
app.use("/api", apiRouter);
app.use(errorMiddleware);

export default app;
