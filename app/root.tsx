import {
    Links,
    Meta,
    Outlet,
    Scripts,
} from "@remix-run/react";
import type { LinksFunction } from "@remix-run/node";

import stylesheet from "./tailwind.css?url";
import { Navigation } from "./components/navigation";

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
                <div className="container mx-auto border-2 border-zinc-400 rounded-lg h-full flex flex-col">
                    <Navigation />
                    <Outlet />
                    <Scripts />
                </div>
            </body>
        </html>
    );
};
