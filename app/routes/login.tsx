import { Form } from "@remix-run/react";
import { Github } from "lucide-react";

export default function Login() {
    return (
        <div className="w-full h-full flex flex-col justify-center">
            <Form className="flex justify-center" action="/auth/github" method="post">
                <button
                    className="flex border rounded border-slate-400 p-4 hover:bg-slate-200">
                    <Github />Login with GitHub
                </button>
            </Form>
        </div>
    );
};

