import { Outlet } from "@remix-run/react";

export default function About () {
    return (
        <p>
            Hello About
            <Outlet />
        </p>
    );
};
