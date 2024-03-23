import {
    Links,
    Meta,
    Outlet,
    Scripts,
} from "@remix-run/react";
import type { LinksFunction } from "@remix-run/node";
import { Navigation } from "./components/navigation";

import stylesheet from "./tailwind.css?url";

export const links: LinksFunction = () => [
    { rel: "stylesheet", href: stylesheet },
];

export default function App() {
    return (
        <html className="h-full">
            <head>
                <Meta />
                <Links />
            </head>
            <body className="h-full p-2">
                <div className="container mx-auto border-2 border-zinc-400 rounded-lg h-full">
                    <main className="flex h-full">
                        <Navigation />
                        <Outlet />
                    </main>
                    <Scripts />
                </div>
            </body>
        </html>
    );
};
