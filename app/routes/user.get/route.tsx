import type { LoaderFunctionArgs } from "@remix-run/node";
import { prisma } from "../../utils/prisma.server";
import { json } from "@remix-run/node";

export async function loader({ request }: LoaderFunctionArgs) {
    const users = await prisma.user.findMany();
    console.log(users);
    return json({ users: users });
}
