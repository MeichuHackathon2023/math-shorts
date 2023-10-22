import { prisma } from "@/utils/prisma";

const tagService = {
    getTags: async () => {
        // 取得所有 tag
        const tags = await prisma.tag.findMany();
        return tags;
    },
    createTag: async ({ name }: { name: string }) => {
        // 新增一個 tag
        let tag = await prisma.tag.create({
            data: {
                name,
            },
        });
        return tag;
    },
};

export default tagService;
