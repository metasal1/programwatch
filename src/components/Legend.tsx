import { Package, PackageX, SnowflakeIcon, SquareTerminalIcon, CircleX, ShieldCheck, ShieldX, Upload } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger, } from "@/components/ui/accordion"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export function Legend() {
    return (
        <>
            <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                    <AccordionTrigger>Legend</AccordionTrigger>
                    <AccordionContent>
                        <div className="text-sm grid grid-cols-2 gap-2">
                            <div className="flex items-center gap-2 bg-green-500/10 p-1 rounded-md">
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger>
                                            <div className="flex items-center gap-2">
                                                <ShieldCheck className="h-4 w-4 text-green-500" />
                                                <span>Verified</span>
                                            </div>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>Program has been verified onchain against <br />the source code in the open source repository.</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </div>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger>
                                        <div className="flex items-center gap-2 bg-red-500/10 p-1 rounded-md">
                                            <ShieldX className="h-4 w-4 text-gray-500" />
                                            <span>Not Verified</span>
                                        </div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Program has not been verified onchain.</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger>
                                        <div className="flex items-center gap-2 bg-green-500/10 p-1 rounded-md">
                                            <Package className="h-4 w-4 text-green-500" />
                                            <span>IDL Available</span>
                                        </div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>The program has an IDL available and is <br />available to be download.</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger>
                                        <div className="flex items-center gap-2 bg-red-500/10 p-1 rounded-md">
                                            <PackageX className="h-4 w-4 text-gray-500" />
                                            <span>No IDL</span>
                                        </div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>The program does not have an IDL available.</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>

                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger>
                                        <div className="flex items-center gap-2 bg-green-500/10 p-1 rounded-md">
                                            <Upload className="h-4 w-4 text-green-500" />
                                            <span>Upgradable</span>
                                        </div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>The program is upgradable.</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>

                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger>

                                        <div className="flex items-center gap-2 bg-red-500/10 p-1 rounded-md">
                                            <SnowflakeIcon className="h-4 w-4 text-gray-500" />
                                            <span>Frozen</span>
                                        </div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>The program is frozen and cannot be upgraded.</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>

                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger>


                                        <div className="flex items-center gap-2 bg-green-500/10 p-1 rounded-md">
                                            <SquareTerminalIcon className="h-4 w-4 text-green-500" />
                                            <span>Executable</span>
                                        </div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>The program is executable.</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger>
                                        <div className="flex items-center gap-2 bg-red-500/10 p-1 rounded-md">
                                            <CircleX className="h-4 w-4 text-gray-500" />
                                            <span>Closed</span>
                                        </div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>The program is not executable.</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>

                        </div>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>

        </>
    );
}

