import { Outlet, useLoaderData, Form, useNavigate, useParams, useSubmit, useActionData } from "@remix-run/react";
import { json } from "@remix-run/node";
import type { ActionFunctionArgs } from "@remix-run/node";
import { db } from "@/utils/database.server";
import { Plus } from "lucide-react";
import { useState, useRef, useEffect } from "react";

export async function loader() {
    // fetch list of chats
    const chats = await db.chat.findMany();
    return json(chats);
}

export async function action({
    request
}: ActionFunctionArgs) {
    const data = await request.formData();
    const topic = data.get("topic");
    if (topic === "") {
        return json({
            message: "Empty topic not allowed",
            id: ""
        });
    }
    const createdChat = await db.chat.create({
        data: {
            topic: topic as string,
        },
    });
    return json({
        message: "Created",
        id: createdChat.id
    });
};

export default function Chat () {
    const chats = useLoaderData<typeof loader>();
    const currentParams = useParams();
    const [currentChatId, setCurrentChatId] = useState<string>(currentParams.chatId || "");
    
    // switch to a new chat on creation
    const actionData = useActionData<typeof action>();
    const navigate = useNavigate();
    useEffect(() => {
        if (!actionData) return;
        setCurrentChatId(actionData.id);
        navigate(`/chat/${actionData.id}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [actionData]);

    // create a new chat
    const submit = useSubmit();
    const form = useRef<HTMLFormElement>(null);
    const createNewChat = (event: React.FormEvent<HTMLFormElement>) => {
        if (form.current === null) return;
        const formData = new FormData(form.current);
        if (formData.get("topic") === "") {
            return;
        }
        submit(event.currentTarget);
    };

    return (
        <>
            <aside className="w-2/12 h-full flex flex-col bg-slate-100">
                <h3 className="text-lg border-b font-bold border-slate-400 p-2">Channels</h3>
                <Form
                    ref={form}
                    onSubmit={createNewChat}
                    method="post"
                    action="/chat"
                    className="flex w-full p-2">
                    <input type="text" placeholder="Create.." name="topic" className="p-2 text-xs w-full mr-1 border" />
                    <button type="submit" className="bg-blue-500 w-fit px-2 hover:bg-blue-700 text-white rounded">
                        <Plus />
                    </button>
                </Form>
                <ul className="overflow-y-auto w-full">
                    {chats.map((chat) => (
                        <li className={`
                            cursor-pointer 
                            text-slate-600 
                            ${chat.id === currentChatId ? "" : "hover:bg-slate-200"}
                            hover:text-slate-800 
                            ${chat.id === currentChatId ? "bg-slate-300 text-slate-800" : ""}
                        `} key={chat.id}>
                            <button
                                onClick={() => {
                                    setCurrentChatId(chat.id);
                                    navigate(`/chat/${chat.id}`);
                                }}
                                className="block px-2 py-1 w-full text-left">
                                #{chat.topic?.toLocaleLowerCase().split(" ").join("-")}
                            </button>
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
