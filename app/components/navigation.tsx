import {
    Link
} from "@remix-run/react";
import {
    Home,
    MessageSquareQuote
} from "lucide-react";

export const Navigation = () => {
    const routes = [
        { icon: Home, path: "/" },
        { icon: MessageSquareQuote, path: "/chat" },
    ];

    return (
        <nav className="border-r border-zinc-400 bg-gray-100">
            <ul className="flex flex-col">
                {routes.map((route, index) => (
                    <li className="w-full flex flex-row justify-center" key={index}>
                        <Link className="
                            border-l-4
                            border-slate-400
                            hover:border-slate-700
                            text-slate-400
                            hover:text-slate-700
                            p-3" to={route.path}>
                            <route.icon />
                        </Link>
                    </li>
                ))}
            </ul>
        </nav>
    );
};
