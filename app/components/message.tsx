import { format, isToday, isYesterday } from "date-fns";

const formatTimeAgo = (createdAt: string) => {
    const date = new Date(createdAt);
    const timeStamp = format(date, "p");
    return isToday(date) ?
        `Today at ${timeStamp}` :
        isYesterday(date) ?
            `Yesterday at ${timeStamp}` :
            `${format(date, "P")} ${timeStamp}`;
};

export const Message = ({ message }: {
    message: {
        id: string;
        content: string;
        createdAt: string;
        createdBy: string;
    }
}) => {
    const timeAgo = formatTimeAgo(message.createdAt);
    return (
        <li key={message.id} className="p-2 w-full flex flex-col">
            <div>
                <span className="text-slate-800 font-bold mr-2">
                    {message.createdBy}
                </span>
                <span className="text-xs text-slate-600">
                    {timeAgo}
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
