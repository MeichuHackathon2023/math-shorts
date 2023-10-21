import { prisma } from "@/utils/prisma";
import { Grade } from "@prisma/client";
import { string } from "zod";

const userInclude = {
    videos: true,
    playlists: true,
};

const userService = {
    // Get the data of a user
    getUser: async ({ userId, email }: { userId?: number; email?: string }) => {
        let user = await prisma.user.findUnique({
            where: userId ? { id: userId } : { email },
            include: userInclude,
        });
        return user;
    },
    createUser: async ({
        name,
        email,
        password,
        grade,
    }: {
        name: string;
        email: string;
        password: string;
        grade: Grade;
    }) => {
        let newUser = await prisma.user.create({
            data: {
                name,
                email,
                password,
                grade,
            },
            include: userInclude,
        });
        return newUser;
    },
};

export default userService;
