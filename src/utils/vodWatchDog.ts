import { VideoStatus } from "@/models/video";
import kkService from "@/services/kkService";
import videoService from "@/services/videoService";

export const updateStatus = async () => {
    console.log("started to update status");
    const processignVideo = await videoService.getProcessingVideo();

    processignVideo.forEach(async (video) => {
        const { id, kkVodId } = video;
        const status = await kkService.checkVodStatus({ kkVodId });
        if (status === VideoStatus.VOD_STATUS_SUCCEEDED) {
            await videoService.markVideoProcessed({ videoId: id });
        }
    });
};
