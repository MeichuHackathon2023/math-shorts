import passport from "passport";
import { ExtractJwt, Strategy as JWTStrategy } from "passport-jwt";
import { Strategy as LocalStrategy } from "passport-local";
import userService from "@/services/userService";
import { authentication } from "@/utils/crypt";
import { UnauthorizedError } from "@/models/errors";

// 目前沒做權限管理
// function isAdmin(roles: string[]) {
//     return roles.some((item) => item === UserRoleType.ADMIN);
// }

passport.use(
    "token",
    new JWTStrategy(
        {
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.JWT_TOKEN,
        },
        (payload, done) => {
            const { userId } = payload;
            userService
                .getUser({ userId })
                .then((user) => {
                    if (user) {
                        done(null, user);
                    } else {
                        done(null, false, {
                            message: "no user is associated with given userId",
                        });
                    }
                })
                .catch((err) => {
                    done(err);
                });
        },
    ),
);

passport.use(
    "signin",
    new LocalStrategy(
        {
            usernameField: "email",
        },
        (email: string, password: string, done) => {
            userService
                .getUser({ email })
                .then((user) => {
                    if (user?.password) {
                        authentication(password, user.password).then(
                            (result) => {
                                if (result) done(null, user);
                                else
                                    done(null, false, {
                                        message:
                                            "Incorrect email / password combination.",
                                    });
                            },
                        );
                    } else
                        done(null, false, {
                            message: "Incorrect email / password combination.",
                        });
                })
                .catch((err) => {
                    console.log("catched!");
                    done(err);
                });
        },
    ),
);

export default passport;
