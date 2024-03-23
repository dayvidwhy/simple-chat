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
        <nav className="p-2 border-r-2 border-zinc-400 w-1/12">
            <ul className="flex flex-col">
                {routes.map((route, index) => (
                    <li className="mr-6 w-full flex flex-row justify-center" key={index}>
                        <Link className="text-slate-100 my-2 bg-slate-400 hover:bg-slate-700 p-3 rounded w-fit" to={route.path}>
                            <route.icon />
                        </Link>
                    </li>
                ))}
            </ul>
        </nav>
    );
};
