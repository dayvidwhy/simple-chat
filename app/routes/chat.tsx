import { Outlet, useLoaderData, Form } from "@remix-run/react";
import { json } from "@remix-run/node";
import type { ActionFunctionArgs } from "@remix-run/node";
import { db } from "../utils/database.server";

export async function loader() {
    const chats = await db.chat.findMany();
    console.log(chats);
    return json(chats);
}

export default function Chat () {
    const chats = useLoaderData<typeof loader>();
    return (
        <div className="container flex flex-row h-full">
            <div className="w-1/4">
                <div className="p-2 w-full">
                    <Form method="post" action="/chat" className="flex w-full">
                        <input type="text" name="topic" className="p-2 text-xs w-1/2 mr-1 border-2 rounded" />
                        <button type="submit" className="bg-blue-500 w-1/2 text-xs hover:bg-blue-700 text-white font-bold py-2 rounded">
                            Create    
                        </button>
                    </Form>
                    <ul className="m-1">
                        {chats.map((chat) => (
                            <li className="p-2 mb-2 border-b-2" key={chat.id}>
                                <a href={`/chat/${chat.id}`}>{chat.topic}</a>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
            <div className="w-3/4">
                <div className="p-2">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export async function action({
    request,
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