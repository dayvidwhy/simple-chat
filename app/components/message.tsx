import { format } from "date-fns";

export const Message = ({ message }: {
    message: {
        id: string;
        content: string;
        createdAt: string;
        createdBy: string;
    }
}) => {
    const timeStamp = format(new Date(message.createdAt), "p");
    return (
        <li key={message.id} className="p-2 w-full flex flex-col">
            <div>
                <span className="text-slate-800 font-bold mr-2">
                    {message.createdBy}
                </span>
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
