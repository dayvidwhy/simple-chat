import { Outlet, useLoaderData, Form, Link } from "@remix-run/react";
import { json } from "@remix-run/node";
import type { ActionFunctionArgs } from "@remix-run/node";
import { db } from "@/utils/database.server";
import { Plus } from "lucide-react";

export async function loader() {
    const chats = await db.chat.findMany();
    return json(chats);
}

export default function Chat () {
    const chats = useLoaderData<typeof loader>();
    return (
        <>
            <aside className="w-2/12 h-full flex flex-col">
                <h3 className="text-xl border-b-2 font-bold border-slate-400 p-2">Channels</h3>
                <Form method="post" action="/chat" className="flex w-full p-2">
                    <input type="text" placeholder="Create.." name="topic" className="p-2 text-xs w-full mr-1 border-2" />
                    <button type="submit" className="bg-blue-500 w-fit px-2 hover:bg-blue-700 text-white rounded">
                        <Plus />    
                    </button>
                </Form>
                <ul className="m-1 overflow-y-auto w-full px-2 pb-2">
                    {chats.map((chat) => (
                        <li className="cursor-pointer text-slate-400 hover:text-slate-800 mb-2" key={chat.id}>
                            <Link className="block" to={`/chat/${chat.id}`}>#{chat.topic}</Link>
                        </li>
                    ))}
                </ul>
            </aside>
            <section className="w-9/12 h-full flex flex-col border-l-2 border-zinc-400 justify-between">
                <Outlet />
            </section>
        </>
    );
};

export async function action({
    request
}: ActionFunctionArgs) {
    const data = await request.formData();
    await db.chat.create({
        data: {
            topic: data.get("topic") as string,
        },
    });
    return json({
        message: "Created",
    });
}