import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Copy, Check, ArrowUpRight, Package, PackageX, SnowflakeIcon, SquareTerminalIcon, CircleX, ShieldCheck, ShieldX, Upload, LucideIcon } from "lucide-react";

interface TooltipComponentProps {
    title: string;
    content: string;
    icon?: LucideIcon;
    iconSize?: number;
    iconColor?: string;
    textColor?: string;
    bgColor?: string;
}

const TooltipComponent = ({
    title,
    content,
    icon: Icon,
    iconSize = 16,
    iconColor = "text-gray-600",
    textColor = "text-gray-700",
    bgColor = "bg-white"
}: TooltipComponentProps) => {
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger className={`inline-flex items-center gap-2 rounded px-2 py-1 hover:bg-gray-100 ${bgColor}`}>
                    {Icon && (
                        <span className={iconColor}>
                            <Icon size={iconSize} />
                        </span>
                    )}
                    <span className={`${textColor}`}>{title}</span>
                </TooltipTrigger>
                <TooltipContent>
                    <p>{content}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
};

export default TooltipComponent;
