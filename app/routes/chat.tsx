import { Outlet, useLoaderData, Form } from "@remix-run/react";
import { json } from "@remix-run/node";
import type { ActionFunctionArgs } from "@remix-run/node";
import { db } from "../utils/database.server";

export async function loader() {
    const chats = await db.chat.findMany();
    return json(chats);
}

export default function Chat () {
    const chats = useLoaderData<typeof loader>();
    return (
        <>
            <aside className="w-1/4 p-2 flex flex-col">
                <Form method="post" action="/chat" className="flex w-full">
                    <input type="text" name="topic" className="p-2 text-xs w-full mr-1 border-2" />
                    <button type="submit" className="bg-blue-500 w-fit-content pl-2 pr-2 text-xs hover:bg-blue-700 text-white font-bold rounded">
                        Create    
                    </button>
                </Form>
                <ul className="m-1 overflow-y-scroll w-full">
                    {chats.map((chat) => (
                        <li className="p-2 mb-2 border-b-2" key={chat.id}>
                            <a href={`/chat/${chat.id}`}>#{chat.topic}</a>
                        </li>
                    ))}
                </ul>
            </aside>
            <section className="w-3/4 flex flex-col border-l-2 border-zinc-400 justify-between p-2">
                <Outlet />
            </section>
        </>
    );
};

export async function action({
    request
}: ActionFunctionArgs) {
    const data = await request.formData();
    console.log("In action", data.get("topic"));
    await db.chat.create({
        data: {
            topic: data.get("topic") as string,
        },
    });
    return json({
        message: "Created",
    });
}