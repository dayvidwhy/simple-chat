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
    console.log("In action", data.get("message"), data.get("chatId"));
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
    const form = useRef<HTMLFormElement>(null);
    useEffect(() => {
        console.log("In effect", actionData);
        if (actionData?.ok) {
            form.current?.reset();
        }
    }, [actionData]);

    return (
        <>
            <div>
                <h3>{topic}</h3>
                <ul>
                    {messages.map((message) => (
                        <Message key={message.id} message={message} />
                    ))}
                </ul>
            </div>
            <Form ref={form} method="post" action={`/chat/${chatId}`} className="flex w-full pt-2">
                <input type="text" name="message" className="p-2 text-xs mr-1 border-2 rounded w-full" />
                <input type="hidden" name="chatId" value={chatId} />
                <button type="submit" className="bg-blue-500 w-24 text-sm hover:bg-blue-700 text-white font-bold py-2 rounded">
                    Send
                </button>
            </Form>
        </>
    );
};
