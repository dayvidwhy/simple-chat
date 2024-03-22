import type { ActionFunctionArgs } from "@remix-run/node";
import { prisma } from "../../utils/prisma.server";
import { json } from "@remix-run/node";

export async function action({
    request,
}: ActionFunctionArgs) {
    const data = await request.json();
    await prisma.user.create({
        data: {
            name: data.name
        },
    });
    return json({
        message: "Created",
    });
}
