import { Package, PackageX, SnowflakeIcon, SquareTerminalIcon, CircleX, ShieldCheck, ShieldX, Upload } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger, } from "@/components/ui/accordion"

export function Legend() {
    return (
        <>
            <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                    <AccordionTrigger>Legend</AccordionTrigger>
                    <AccordionContent>
                        <div className="text-sm grid grid-cols-2 gap-2">
                            <div className="flex items-center gap-2 bg-green-500/10 p-1 rounded-md">
                                <ShieldCheck className="h-4 w-4 text-green-500" />
                                <span>Verified</span>
                            </div>
                            <div className="flex items-center gap-2 bg-red-500/10 p-1 rounded-md">
                                <ShieldX className="h-4 w-4 text-red-500" />
                                <span>Not Verified</span>
                            </div>
                            <div className="flex items-center gap-2 bg-green-500/10 p-1 rounded-md">
                                <Package className="h-4 w-4 text-green-500" />
                                <span>IDL Available</span>
                            </div>
                            <div className="flex items-center gap-2 bg-red-500/10 p-1 rounded-md">
                                <PackageX className="h-4 w-4 text-red-500" />
                                <span>No IDL</span>
                            </div>
                            <div className="flex items-center gap-2 bg-green-500/10 p-1 rounded-md">
                                <Upload className="h-4 w-4 text-green-500" />
                                <span>Upgradable</span>
                            </div>
                            <div className="flex items-center gap-2 bg-red-500/10 p-1 rounded-md">
                                <SnowflakeIcon className="h-4 w-4 text-red-500" />
                                <span>Frozen</span>
                            </div>
                            <div className="flex items-center gap-2 bg-green-500/10 p-1 rounded-md">
                                <SquareTerminalIcon className="h-4 w-4 text-green-500" />
                                <span>Executable</span>
                            </div>
                            <div className="flex items-center gap-2 bg-red-500/10 p-1 rounded-md">
                                <CircleX className="h-4 w-4 text-red-500" />
                                <span>Closed</span>
                            </div>
                        </div>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>

        </>
    );
}

