import { useLoaderData, Form } from "@remix-run/react";
import type { ActionFunctionArgs } from "@remix-run/node";

import { db } from "../utils/database.server";

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

export default function ChatId() {
    const { topic, chatId, messages } = useLoaderData<typeof loader>();
    return (
        <section className="border-2 p-2 mr-2">
            <h3>{topic}</h3>
            {messages.map((message) => (
                <p key={message.id} className="p-2 border-b-2">
                    {message.content}
                </p>
            ))}
            <Form method="post" action={`/chat/${chatId}`} className="flex w-full pt-2">
                <input type="text" name="message" className="p-2 text-xs mr-1 border-2 rounded w-full" />
                <input type="hidden" name="chatId" value={chatId} />
                <button type="submit" className="bg-blue-500 w-24 text-xs hover:bg-blue-700 text-white font-bold py-2 rounded">
                    Send
                </button>
            </Form>
        </section>
    );
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

    return null;
}