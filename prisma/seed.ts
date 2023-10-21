import { PrismaClient } from "@prisma/client";
import { hashPassword } from "@/utils/crypt";
import { roles, UserRoleType } from "@/utils/role";
import { templates } from "@/utils/template";
import { stages } from "@/utils/stage";
import { siteInfos } from "@/utils/siteInfo";

const prisma = new PrismaClient();

async function main() {
    if (!process.env.ADMIN_PASSWORD?.length)
        throw new Error("Missing ADMIN_PASSWORD ENV var.");

    await Promise.all(roles.map((role) => async () => {
        await prisma.role.upsert({
            where: { name: role.name },
            update: {},
            create: role,
        });
    }))

    templates.forEach(async (template) => {
        await prisma.template.upsert({
            where: { id: template.id },
            update: {},
            create: template,
        });
    });

    stages.forEach(async (stage) => {
        await prisma.stage.upsert({
            where: { id: stage.id },
            update: {},
            create: stage,
        });
    });

    siteInfos.forEach(async (siteInfo) => {
        await prisma.site.upsert({
            where: { id: siteInfo.id },
            update: {},
            create: siteInfo,
        });
    });

    const admin_user = {
        email: "ntugice@ntu.edu.tw",
        name: "管理員",
        roles: {
            connect: [
                {
                    name: UserRoleType.ADMIN,
                },
            ],
        },
        password: await hashPassword(process.env.ADMIN_PASSWORD),
    };

    await prisma.user.upsert({
        where: { email: "ntugice@ntu.edu.tw" },
        update: admin_user,
        create: admin_user,
    });
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
