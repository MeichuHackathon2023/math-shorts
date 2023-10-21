import { RequestHandler } from "express";

import passport from "@/utils/passport";
import { UnauthorizedError } from "@/models/errors";
import { AuthenticateCallback } from "passport";

export const isAuthenticated: RequestHandler = (req, res, next) => {
    passport.authenticate("token", { session: false }, ((err, user, info) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            return next(new UnauthorizedError());
        }
        req.user = user;
        next();
    }) as AuthenticateCallback)(req, res, next);
};
