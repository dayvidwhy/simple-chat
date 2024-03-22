import {
    Link
} from "@remix-run/react";

export const Navigation = () => {
    const routes = [
        { name: "Home", path: "/" },
        { name: "Chat", path: "/chat" },
    ];

    return (
        <nav className="p-2">
            <ul className="flex">
                {routes.map((route, index) => (
                    <li className="mr-6" key={index}>
                        <Link className="text-blue-500 hover:text-blue-800" to={route.path}>
                            {route.name}
                        </Link>
                    </li>
                ))}
            </ul>
        </nav>
    );
};
