// libs
import {
    useLoaderData,
    Form,
    useActionData,
    useRevalidator,
    useSubmit
} from "@remix-run/react";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { authenticator } from "@/services/auth.server";
import { useRef, useEffect } from "react";
import { SendHorizonal, Hash } from "lucide-react";

// local libs
import { db } from "@/utils/database.server";
import { Message } from "@/components/message";
import { useSocket } from "@/context";

export async function loader({
    params,
    request
}: LoaderFunctionArgs) {
    await authenticator.isAuthenticated(request, {
        failureRedirect: "/login",
    });

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
    const user = await authenticator.isAuthenticated(request);
    if (!user) {
        return new Response("Unauthorized", {
            status: 401,
            statusText: "Unauthorized",
        });
    }

    const data = await request.formData();
    const message = data.get("message");
    const chatId = data.get("chatId");
    if (
        message === "" || typeof message !== "string" ||
        chatId === "" || typeof chatId !== "string"
    ) {
        return new Response("Empty message not allowed", {
            status: 400,
            statusText: "Bad Request",
        });
    }

    let createdChatResult;
    try {
        createdChatResult = await db.message.create({
            data: {
                content: message,
                createdBy: user.name,
                user: {
                    connect: {
                        id: user.id,
                    },
                },
                chat: {
                    connect: {
                        id: chatId,
                    },
                }
            },
        });
    } catch (error) {
        return new Response("Failed to create chat", {
            status: 500,
            statusText: "Internal Server Error",
        });
    }

    return new Response(JSON.stringify({
        ok: true,
        id: createdChatResult.id,
        createdAt: createdChatResult.createdAt
    }), {
        status: 201,
        headers: {
            "Content-Type": "application/json"
        }
    });
}

export default function ChatId() {
    const { topic, chatId, messages } = useLoaderData<typeof loader>();

    // listen to new messages
    const socket = useSocket();
    const revalidator = useRevalidator();
    useEffect(() => {
        if (!socket) return;
        console.log("Subscribing to chat", chatId);
        socket.on(`message-${chatId}`, (data) => {
            console.log("New message for current chat", data);
            revalidator.revalidate();
        });
        return function () {
            console.log("Unsubscribing from chat", chatId);
            socket.off(`message-${chatId}`);
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [socket, chatId]);
    
    // Reset the form after a successful submission
    const form = useRef<HTMLFormElement>(null);
    const actionData = useActionData<typeof action>();
    useEffect(() => {
        if (actionData?.ok) {
            if (form.current !== null) {
                const formData = new FormData(form.current);
                const message = { 
                    chatId,
                    content: formData.get("message"),
                    createdAt: actionData.createdAt,
                    id: actionData.id
                };
                socket?.emit("message", message);
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

    const submit = useSubmit();
    const submitNewMessage = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (form.current === null) return;
        const formData = new FormData(form.current);
        const message = formData.get("message");
        if (message === "") {
            return;
        }
        submit(event.currentTarget);
    };

    return (
        <>
            <h3 className="bg-slate-100 border-b border-slate-400 p-2">
                <span><Hash className="inline-block text-slate-400" /></span>
                <span className="pl-2 text-lg">{topic?.toLocaleLowerCase().split(" ").join("-")}</span>
            </h3>
            <ul className="overflow-y-auto h-full">
                {messages.map((message) => (
                    <Message key={message.id} message={message} />
                ))}
                <div ref={messagesEndRef} />
            </ul>
            <Form
                ref={form}
                method="post"
                onSubmit={submitNewMessage}
                action={`/chat/${chatId}`}
                className="flex w-full p-2">
                <input autoComplete="off" placeholder={`Message #${topic}`} type="text" name="message" className="px-4 py-2 bg-slate-50 text-md mr-1 border rounded w-full" />
                <input type="hidden" name="chatId" value={chatId} />
                <button type="submit" className="bg-blue-500 w-fit hover:bg-blue-700 text-white font-bold p-2 px-4 rounded">
                    <SendHorizonal />
                </button>
            </Form>
        </>
    );
};
