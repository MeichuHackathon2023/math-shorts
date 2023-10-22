import { prisma } from "@/utils/prisma";
import axios from "../utils/axios";
import { kkShowroomEndpoint } from "@/utils/config";
import originalAxios from "axios";

import crypto from "crypto";
import { VideoStatus } from "@/models/video";

function calculateHash(buffer: Buffer) {
    const sha1 = crypto.createHash("sha1");
    sha1.update(buffer);
    const sha1Digest = sha1.digest();
    const base64Digest = sha1Digest.toString("base64");
    return base64Digest;
}

const kkService = {
    getEmbedLink: async ({ kkVodId }: { kkVodId: string }) => {
        const response = await axios.post(`/bv/cms/v1/resources/tokens`, {
            resource_id: kkVodId,
            resource_type: "RESOURCE_TYPE_VOD_EVENT",
        });
        return `${kkShowroomEndpoint}/embed?token=${response.data.token}`;
    },
    uploadVideo: async ({
        file,
        name,
        description,
    }: {
        name: string;
        description: string;
        file: Express.Multer.File;
    }) => {
        const { mimetype, size, originalname } = file;
        // 1. Obtain Upload URLs
        const {
            data: {
                file: { id: libraryId },
                upload_data: { id: uploadId, parts },
            },
        } = await axios.post("/bv/cms/v1/library/files:upload", {
            file: {
                type: "FILE_TYPE_VIDEO",
                source: "FILE_SOURCE_ADD_VOD",
                name: originalname,
                size,
            },
        });

        console.log(parts);
        // 2. Upload files
        const {
            headers: { etag },
        } = await originalAxios.put(
            parts.find(
                ({ part_number }: { part_number: number }) => part_number == 1,
            ).presigned_url,
            file.buffer,
            {
                headers: { "Content-Type": mimetype },
            },
        );

        // 3. Register for the Uploaded Files
        const {
            data: {
                file: { id: fileId },
            },
        } = await axios.post(
            `/bv/cms/v1/library/files/${libraryId}:complete-upload`,
            {
                complete_data: {
                    checksum_sha1: calculateHash(file.buffer),
                    id: uploadId,
                    parts: [
                        {
                            etag,
                            part_number: 1,
                        },
                    ],
                },
            },
        );

        const {
            data: {
                vod: {
                    id: vodId,
                    source_file_info: { duration },
                },
            },
        } = await axios.post("/bv/cms/v1/vods", {
            name,
            profile_set_id: "dc576e46-81a5-4604-9db7-400737e5cc9e",
            source: {
                type: "SOURCE_TYPE_LIBRARY",
                library: {
                    video: {
                        id: fileId,
                    },
                },
            },
            queue: "QUEUE_STANDARD",
            security: {
                privacy: {
                    type: "SECURITY_PRIVACY_TYPE_PUBLIC",
                },
            },
            schedule: {
                enable: false,
                start_time: "2023-08-24T14:15:22Z",
                end_time: "2023-08-24T14:15:22Z",
            },
            pte: {
                profile: "PTE_PROFILE_UNSPECIFIED",
            },
            metadata: {
                short_description: description,
                long_description: description,
            },
        });
        return {vodId, duration};
    },
    checkVodStatus: async ({
        kkVodId,
    }: {
        kkVodId: string;
    }): Promise<VideoStatus> => {
        const {
            data: {
                vod: { status },
            },
        } = await axios.get(`/bv/cms/v1/vods/${kkVodId}`);

        return status;
    },
};

export default kkService;
