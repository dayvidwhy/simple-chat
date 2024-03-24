import { Outlet, useLoaderData, Form, useNavigate, useParams } from "@remix-run/react";
import { json } from "@remix-run/node";
import type { ActionFunctionArgs } from "@remix-run/node";
import { db } from "@/utils/database.server";
import { Plus } from "lucide-react";
import { useState } from "react";

export async function loader() {
    const chats = await db.chat.findMany();
    return json(chats);
}

export default function Chat () {
    const chats = useLoaderData<typeof loader>();
    const currentParams = useParams();
    const [currentChatId, setCurrentChatId] = useState<string>(currentParams.chatId || "");
    const navigate = useNavigate();
    return (
        <>
            <aside className="w-2/12 h-full flex flex-col bg-slate-100">
                <h3 className="text-xl border-b font-bold border-slate-400 p-2">Channels</h3>
                <Form method="post" action="/chat" className="flex w-full p-2">
                    <input type="text" placeholder="Create.." name="topic" className="p-2 text-xs w-full mr-1 border" />
                    <button type="submit" className="bg-blue-500 w-fit px-2 hover:bg-blue-700 text-white rounded">
                        <Plus />
                    </button>
                </Form>
                <ul className="overflow-y-auto w-full">
                    {chats.map((chat) => (
                        <li className={`cursor-pointer text-slate-400 hover:text-slate-800 ${chat.id === currentChatId ? "bg-slate-200 text-slate-600" : ""}`} key={chat.id}>
                            <button onClick={() => {
                                setCurrentChatId(chat.id);
                                navigate(`/chat/${chat.id}`);
                            }} className="block px-2 py-1 w-full text-left">#{chat.topic}</button>
                        </li>
                    ))}
                </ul>
            </aside>
            <section className="w-10/12 h-full flex flex-col border-l border-zinc-400 justify-between">
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
};
