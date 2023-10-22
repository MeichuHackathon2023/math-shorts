import { prisma } from "@/utils/prisma";
import { Playlist, PlaylistUserInput } from "@/models/playlist";
import kkService from "./kkService";
import videoService from "./videoService";

const playlistService = {
    getPlaylists: async ({ userId }: { userId: number }) => {
        const playlists = await prisma.playlist.findMany({
            where: {
                users: {
                    some: {
                        id: userId,
                    },
                },
            },
            include: {
                users: true,
                videos: true,
            },
        });
        return await Promise.all(
            playlists.map(async ({ videos, ...attr }) => {
                return {
                    videos: await Promise.all(
                        videos.map(
                            async ({ id: videoId }) =>
                                await videoService.getVideo({ videoId }),
                        ),
                    ),
                    ...attr,
                };
            }),
        );
    },
    updateOrCreatePlaylist: async (playlist: PlaylistUserInput | Playlist) => {
        const { id, description, name, users, videos } = playlist;

        const newPlaylist = await prisma.playlist.upsert({
            where: {
                id: id,
            },
            update: {
                id: id,
                description: description,
                name: name,
                users: {
                    set: users.map((user) => ({ id: user.id })),
                },
                videos: {
                    set: videos.map((video) => ({ id: video.id })), // Use connect to update existing videos by ID
                },
            },
            create: {
                id: id,
                description: description,
                name: name,
                users: {
                    connect: users.map((user) => ({ id: user.id })),
                },
                videos: {
                    connect: videos.map((video) => ({ id: video.id })), // Use connect to update existing videos by ID
                },
            },
            include: {
                users: true,
                videos: true,
            },
        });
        
        // Destructure the playlist to get videos and other attributes
        const { videos: newVideos, ...attr } = newPlaylist;

        // Process videos in the playlist
        const processedVideos = await Promise.all(
            newVideos.map(async ({ id: videoId }) => {
                // Fetch details for each video using its ID
                const videoDetails = await videoService.getVideo({ videoId });
                return videoDetails;
            })
        );

        // Return the processed playlist with videos
        return {
            videos: processedVideos,
            ...attr
        };
    },
};

export default playlistService;
