import { useLoaderData, Form, useActionData } from "@remix-run/react";
import type { ActionFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useRef, useEffect } from "react";

import { db } from "../utils/database.server";
import { Message } from "../components/message";

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
    const actionData = useActionData<typeof action>();

    // Reset the form after a successful submission
    const form = useRef<HTMLFormElement>(null);
    useEffect(() => {
        if (actionData?.ok) {
            form.current?.reset();
        }
    }, [actionData]);

    // Scroll to the bottom of the messages list on each entry
    const messagesEndRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
        <>
            <h3 className="text-2xl border-b-2 border-slate-400">#{topic}</h3>
            <ul className="overflow-y-scroll h-full">
                {messages.map((message) => (
                    <Message key={message.id} message={message} />
                ))}
                <div ref={messagesEndRef} />
            </ul>
            <Form ref={form} method="post" action={`/chat/${chatId}`} className="flex w-full pt-2">
                <input placeholder={`Message #${topic}`} type="text" name="message" className="p-2 text-xs mr-1 border-2 rounded w-full" />
                <input type="hidden" name="chatId" value={chatId} />
                <button type="submit" className="bg-blue-500 w-24 text-sm hover:bg-blue-700 text-white font-bold py-2 rounded">
                    Send
                </button>
            </Form>
        </>
    );
};
