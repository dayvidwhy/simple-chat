// libs
import {
    Links,
    Meta,
    Outlet,
    Scripts,
    useLoaderData
} from "@remix-run/react";
import type { LinksFunction, LoaderFunctionArgs } from "@remix-run/node";
import { useEffect, useState } from "react";
import type { Socket } from "socket.io-client";
import io from "socket.io-client";

// local libs
import { Navigation } from "@/components/navigation";
import { SocketProvider } from "@/context";
import stylesheet from "@/tailwind.css?url";
import { authenticator } from "./services/auth.server";

export const links: LinksFunction = () => [
    { rel: "stylesheet", href: stylesheet },
];

export async function loader({ request }: LoaderFunctionArgs) {
    const user = await authenticator.isAuthenticated(request);
    return {
        authenticated: user ? true : false,
    };
}

export default function App() {
    const { authenticated } = useLoaderData<typeof loader>();
    // setup socket to provide to context
    const [socket, setSocket] = useState<Socket>();
    useEffect(() => {
        const socket = io();
        setSocket(socket);
        return () => {
            socket.close();
        };
    }, []);
    
    useEffect(() => {
        if (!socket) return;
        socket.on("confirmation", (data) => {
            console.log(data);
        });
    }, [socket]);

    return (
        <html className="h-full">
            <head>
                <Meta />
                <Links />
            </head>
            <body className="h-full">
                <div className="border border-zinc-400 rounded-sm h-full">
                    <main className="flex h-full">
                        <Navigation loggedIn={authenticated} />
                        <SocketProvider socket={socket}>
                            <Outlet />
                        </SocketProvider>
                    </main>
                    <Scripts />
                </div>
            </body>
        </html>
    );
};
