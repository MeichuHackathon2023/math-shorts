import { Router } from "express";
import { z } from "zod";

import jwt from "jsonwebtoken";

import { createRoute } from "@/utils/route";
import { userSchema } from "@/models/user";

import { Grade } from "@prisma/client";
import passport from "@/utils/passport";
import { ForbiddenError, UnauthorizedError } from "@/models/errors";
import { AuthenticateCallback } from "passport";
import { hashPassword } from "../utils/crypt";

const secretKey = process.env.JWT_TOKEN ?? "";

export const authRoute = {
    router: Router(),
    basePath: "/auth",
    tags: ["Auth"],
};

createRoute({
    ...authRoute,
    method: "post",
    path: "/login",
    summary: "登入",
    needAuthenticated: false,

    schemas: {
        request: {
            body: z.object({
                email: z.string().email(),
                password: z.string(),
            }),
        },
        response: z.object({
            token: z.string(),
        }),
    },

    handlers: [
        (req, res, next) => {
            passport.authenticate("signin", { session: false }, ((
                err,
                user,
                info,
            ) => {
                if (err) {
                    return next(err);
                }
                if (!user) {
                    return next(new UnauthorizedError());
                }
                const token = jwt.sign({ userId: user.id }, secretKey, {
                    expiresIn: "24h",
                });
                res.status(200).validateAndSend({ token });
            }) as AuthenticateCallback)(req, res, next);
        },
    ],
});

createRoute({
    ...authRoute,
    method: "post",
    path: "/register",
    summary: "註冊",
    needAuthenticated: false,

    schemas: {
        request: {
            body: z.object({
                name: z.string(),
                email: z.string().email(),
                password: z.string(),
                grade: z.nativeEnum(Grade),
            }),
        },
        response: userSchema,
    },

    handler: async (req, res) => {
        const {
            body: { name, email, password, grade },
            services: { user: userService },
        } = req;
        const newUser = await userService.createUser({
            name,
            email,
            password: await hashPassword(password),
            grade,
        });
        res.status(200).validateAndSend(newUser);
    },
});