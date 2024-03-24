import { format } from "date-fns";

export const Message = ({ message }: {
    message: {
        id: string;
        content: string;
        createdAt: string;
    }
}) => {
    const timeStamp = format(new Date(message.createdAt), "p");
    return (
        <li key={message.id} className="p-2 w-full flex flex-col">
            <div className="mr-2">
                <span className="text-xs text-slate-600 ">
                    {timeStamp}{" "}
                </span>
            </div>
            <div className="text-wrap overflow-x-hidden">
                <span className="text-md">
                    {message.content}
                </span>
            </div>
        </li>
    );
};
