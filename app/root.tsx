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
            <body className="h-full">
                <Navigation />
                <Outlet />
                <Scripts />
            </body>
        </html>
    );
};
  