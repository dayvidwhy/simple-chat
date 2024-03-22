import { useLoaderData } from "@remix-run/react";
import { db } from "../utils/database.server";

export async function loader({
    params,
}: {
    params: {
        chatId: string;
    }
}) {
    const chats = await db.chat.findUnique({
        where: {
            id: params.chatId,
        },
    });

    return {
        chatId: params.chatId,
        topic: chats?.topic,
    };
};

export default function ChatId() {
    const chat = useLoaderData<typeof loader>();
    console.log(chat);
    return (
        <div className="border-2 p-2 mr-2">
            <h1>{chat.topic}</h1>
        </div>
    );
};
