// libs
import {
    useLoaderData,
    Form,
    useActionData,
    useRevalidator
} from "@remix-run/react";
import type { ActionFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useRef, useEffect } from "react";
import { SendHorizonal } from "lucide-react";

// local libs
import { db } from "@/utils/database.server";
import { Message } from "@/components/message";
import { useSocket } from "@/context";

export async function loader({
    params
}: {
    params: {
        chatId: string;
    }
}) {
    // fetch chat for the id to show topic
    const chats = await db.chat.findUnique({
        where: { id: params.chatId }
    });

    // fetch messages for the chat
    const messages = await db.message.findMany({
        where: { chatId: params.chatId }
    });

    return {
        chatId: params.chatId,
        topic: chats?.topic,
        messages
    };
};

export async function action({
    request
}: ActionFunctionArgs) {
    const data = await request.formData();
    await db.message.create({
        data: {
            content: data.get("message") as string,
            chat: {
                connect: {
                    id: data.get("chatId") as string,
                },
            }
        },
    });

    return json({
        ok: true
    });
}

export default function ChatId() {
    const { topic, chatId, messages } = useLoaderData<typeof loader>();

    // listen to new messages
    const socket = useSocket();
    const revalidator = useRevalidator();
    useEffect(() => {
        if (!socket) return;
        socket.on("message", (data) => {
            console.log("New message", data);
            revalidator.revalidate();
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [socket]);
    
    // Reset the form after a successful submission
    const form = useRef<HTMLFormElement>(null);
    const actionData = useActionData<typeof action>();
    useEffect(() => {
        if (actionData?.ok) {
            if (form.current !== null) {
                const formData = new FormData(form.current);
                socket?.emit("message", { chatId, message: formData.get("message") });
            }
            form.current?.reset();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [actionData]);

    // Scroll to the bottom of the messages list on each entry
    const messagesEndRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
        <>
            <h3 className="text-xl border-b-2 border-slate-400 p-2">#{topic}</h3>
            <ul className="overflow-y-auto h-full">
                {messages.map((message) => (
                    <Message key={message.id} message={message} />
                ))}
                <div ref={messagesEndRef} />
            </ul>
            <Form ref={form} method="post" action={`/chat/${chatId}`} className="flex w-full p-2">
                <input placeholder={`Message #${topic}`} type="text" name="message" className="p-2 text-xs mr-1 border-2 rounded w-full" />
                <input type="hidden" name="chatId" value={chatId} />
                <button type="submit" className="bg-blue-500 w-fit text-sm hover:bg-blue-700 text-white font-bold p-2 px-4 rounded">
                    <SendHorizonal />
                </button>
            </Form>
        </>
    );
};
