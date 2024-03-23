import { format } from "date-fns";

export const Message = ({ message }: {
    message: {
        id: string;
        content: string;
        createdAt: string;
    }
}) => {
    const timeStamp = format(new Date(message.createdAt), "pp");
    return (
        <li key={message.id} className="p-2 border-b-2 w-full flex">
            <div className="text-sm text-slate-600 mr-2">
                <span>
                    {timeStamp.slice(0, timeStamp.length - 2)}{" "}
                </span>
            </div>
            <div className="text-wrap overflow-x-hidden">
                <p>
                    {message.content}
                </p>
            </div>
        </li>
    );
};
