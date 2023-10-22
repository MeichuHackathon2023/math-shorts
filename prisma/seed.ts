import { PrismaClient, Grade } from "@prisma/client";

import vods from "@/assets/vods.json";
import tags from "@/assets/tags.json";
import questionTags from "@/assets/question_tags.json";

import { hashPassword } from "@/utils/crypt";

import fs from "fs";

const prisma = new PrismaClient();

const users = [
    {
        name: "Charlie",
        email: "charlie@example.com",
        password: "12345678",
        grade: Grade.FRESHMAN,
    },
    ...Array.from({ length: 9 }, (value, index) => {
        return {
            name: `測試${index + 1}`,
            email: `user${index + 1}@example.com`,
            password: "12345678",
            grade: Grade.FRESHMAN,
        };
    }),
];

let userId = [];

async function main() {
    // create 10 users
    const newUsers = await Promise.all(
        users.map(async (user) => {
            const data = {
                ...user,
                password: await hashPassword(user.password),
            };
            return prisma.user.upsert({
                where: {
                    email: user.email,
                },
                update: data,
                create: data,
            });
        }),
    );

    // create all tags
    for (var tag of tags) {
        const upsertTag = await prisma.tag.upsert({
            where: {
                name: tag,
            },
            update: {
                name: tag,
            },
            create: {
                name: tag,
            },
        });
    }

    const newVideos = await Promise.all(
        vods.map(async (vod) => {
            const [year, num] = (vod[2] as string).split(".")[0].split("-");
            const data = {
                name: `${year}學年度學測第${num}題`,
                description: "",
                kkVodId: vod[0] as string,
                user: {
                    connect: { id: newUsers[0].id },
                },
                processed: true,
                duration: vod[1] as number,
                tags: {
                    connect: (
                        questionTags.find(
                            ([question, _]) =>
                                question === (vod[2] as string).split(".")[0],
                        )![1] as string[]
                    ).map((item) => ({ name: item })),
                },
            };
            return await prisma.video.upsert({
                where: { kkVodId: vod[0] as string },
                update: data,
                create: data,
            });
        }),
    );

    // 刪掉這 10 個 user 的 playProgress
    await prisma.playProgress.deleteMany({
        where: {
            userId: {
                in: newUsers.map(({ id }) => id),
            },
            videoId: {
                in: newVideos.map(({ id }) => id),
            },
        },
    });

    // create 10*video PlayProgress
    for (let newUser of newUsers) {
        const array = Array.from({ length: newVideos.length }, (_, k) => k); // [0,10,20,30,...,490]
        const shuffled = array.sort(() => 0.5 - Math.random());
        let selected = shuffled.slice(0, 10);
        for (let randomVideoIndex of selected) {
            await prisma.playProgress.create({
                data: {
                    userId: newUser.id,
                    videoId: newVideos[randomVideoIndex].id,
                    percentageElapsed: Math.random(),
                    updateTime: new Date(),
                },
            });
        }
    }
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
