import {
    Link,
    Links,
    Meta,
    Outlet,
    Scripts,
} from "@remix-run/react";
  
export default function App() {
    return (
        <html>
            <head>
                <Meta />
                <Links />
            </head>
            <body>
                <h1>Test</h1>
                <Link to="/about">About</Link>
                <Link to="/about/chat">Chat</Link>
                <Outlet />
  
                <Scripts />
            </body>
        </html>
    );
}
  