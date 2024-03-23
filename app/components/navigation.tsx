import {
    Link
} from "@remix-run/react";

export const Navigation = () => {
    const routes = [
        { name: "Home", path: "/" },
        { name: "Chat", path: "/chat" },
    ];

    return (
        <nav className="p-2 border-r-2 border-zinc-400">
            <ul className="flex flex-col">
                {routes.map((route, index) => (
                    <li className="mr-6 w-full" key={index}>
                        <Link className="text-slate-100 my-2 bg-slate-400 hover:bg-slate-700 px-2 block text-center rounded" to={route.path}>
                            {route.name}
                        </Link>
                    </li>
                ))}
            </ul>
        </nav>
    );
};
