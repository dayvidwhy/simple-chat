import {
    Link,
    useLocation
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

    const location = useLocation();

    return (
        <nav className="border-r border-zinc-400 bg-gray-50">
            <ul className="flex flex-col">
                {routes.map((route, index) => {
                    const isActive = location.pathname === route.path || location.pathname.startsWith(route.path + "/");
                    return (
                        <li className="w-full flex flex-row justify-center" key={index}>
                            <Link className={`
                                border-l-2
                                ${isActive ? "border-slate-700" : "border-gray-50"}
                                ${isActive ? "text-slate-700" : "text-slate-400"}
                                hover:text-slate-700
                                p-3`} to={route.path}>
                                <route.icon />
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
};
