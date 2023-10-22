import { prisma } from "@/utils/prisma";
import kkService from "./kkService";
import { NotFoundError } from "@/models/errors";
import { string } from "zod";

const videoSelect = {
    id: true,
    name: true,
    description: true,
    kkVodId: true,
    user: {
        select: {
            id: true,
            name: true,
            grade: true,
        },
    },
    tags: {
        select: {
            id: true,
            name: true,
        },
    },
    duration: true,
    embedLink: true,
};

const videoService = {
    getVideo: async ({ videoId }: { videoId: number }) => {
        const video = await prisma.video.findUnique({
            where: { id: videoId },
            select: videoSelect,
        });
        if (video == null) throw new NotFoundError();
        return video;
    },

    getAllVideo: async () => {
        const allVideos = await prisma.video.findMany({ select: videoSelect });
        return allVideos;
    },

    checkVideoStatus: async ({ videoId }: { videoId: number }) => {
        const video = await prisma.video.findUnique({
            where: { id: videoId },
            select: videoSelect,
        });
        if (video == null) throw new NotFoundError();
        const { kkVodId } = video;
        return await kkService.checkVodStatus({ kkVodId });
    },

    getProcessingVideo: async () => {
        return await prisma.video.findMany({ where: { processed: false } });
    },

    markVideoProcessed: async ({ videoId }: { videoId: number }) => {
        await prisma.video.update({
            where: { id: videoId },
            data: {
                processed: true,
            },
        });
    },

    createVideo: async ({
        name,
        description,
        tags,
        file,
        userId,
    }: {
        name: string;
        description: string;
        tags: string;
        userId: number;
        file: Express.Multer.File;
    }) => {
        const { vodId, duration } = await kkService.uploadVideo({
            file,
            name,
            description,
        });

        const newVideo = await prisma.video.create({
            data: {
                name,
                description,
                kkVodId: vodId,
                user: {
                    connect: { id: userId },
                },
                tags: tags.trim().length
                    ? {
                          connect: tags
                              .split(",")
                              .map((tag) => ({ name: tag })),
                      }
                    : undefined,
                duration,
                embedLink: await kkService.getEmbedLink({ kkVodId: vodId }),
            },
            select: videoSelect,
        });

        return newVideo;
    },

    search: async ({
        keyword,
        tags,
    }: {
        keyword: string;
        tags: Array<string>;
    }) => {
        // @ts-expect-error
        const segmenterZh = new Intl.Segmenter("zh-TW", {
            granularity: "word",
        });

        const iter = segmenterZh.segment(keyword)[Symbol.iterator]();

        // @ts-expect-error
        const segmentation = Array.from(iter).map((item) => item.segment);

        const videos = await videoService.getAllVideo();

        const sortedVideos = videos.sort((a, b) => {
            const calcScore = ({
                name,
                description,
                tags: videoTags,
            }: {
                name: string;
                description: string;
                tags: Array<string>;
            }): number => {
                return (
                    segmentation.reduce(
                        (accu, curr) => accu + (name.indexOf(curr) != -1),
                        0,
                    ) +
                    segmentation.reduce(
                        (accu, curr) =>
                            accu + (description.indexOf(curr) != -1),
                        0,
                    ) +
                    videoTags.reduce(
                        (accu, curr) =>
                            accu + (tags.includes(curr) ? 1 : 0),
                        0,
                    )
                );
            };
            return (
                calcScore({ ...b, tags: b.tags.map(({ name }) => name) }) -
                calcScore({ ...a, tags: a.tags.map(({ name }) => name) })
            );
        });

        return sortedVideos.slice(0, 10);
    },

    // getVideoByMe : async ({ userId }: { userId: number }) => {
    //     const user = await prisma.user.findUnique({where : {id : userId}})
    //     const videos = await prisma.video.findMa({ where: { user : user } });
    //     if (video == null) throw new NotFoundError();
    //     const {id, name, description, embedLink, tags} = video
    //     return {
    //         id:
    //         ...video,
    //         kkVodId: undefined,
    //         embedLink: await kkService.getEmbedLink({ kkVodId: video.kkVodId }),
    //     };
    // },
};

export default videoService;
