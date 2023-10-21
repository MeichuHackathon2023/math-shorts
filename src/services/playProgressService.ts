
import { prisma } from "@/utils/prisma";

const playProgressService = {
    getPlayProgress: async ({ userId, videoId }: { userId: number; videoId: number}) => {
        const playProgress = await prisma.playProgress.findUnique({
            where: { 
                userId_videoId: {
                    userId: userId,
                    videoId: videoId,
                },
            },
        });
        return playProgress;
    },
    updateOrCreatePlayProgress: async ({ userId, videoId, secondElapsed }: { userId: number, videoId: number, secondElapsed: number }) => {
        const playProgress = await prisma.playProgress.upsert({
            where: { 
                userId_videoId: {
                    userId: userId,
                    videoId: videoId,
                },
            },
            update: { secondElapsed: secondElapsed },
            create: { userId: userId, videoId: videoId, secondElapsed: secondElapsed },
        });
        return playProgress;
    }
};

export default playProgressService;
