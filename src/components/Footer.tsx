"use client";

import DeployTimestamp from "./DeployTimestamp";
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"

import { Button } from "@/components/ui/button"
import { Badge } from "./ui/badge";
import { ArrowUpRight } from "lucide-react";

export default function Footer() {
    return (
        <div className="sticky bottom-0 w-full z-50 p-2 flex justify-center ">
            <Drawer>
                <DrawerTrigger>
                    <Badge className="cursor-pointer animate-bounce">@metasal
                    </Badge>
                </DrawerTrigger>
                <DrawerContent>
                    <DrawerHeader>
                        <DrawerTitle className="flex items-center justify-center hover:text-red-600 cursor-pointer" onClick={() => window.open("https://metasal.xyz", "_blank")}>
                            by Metasal <ArrowUpRight />
                        </DrawerTitle>
                        <DrawerDescription className="text-center p-4">
                            <strong>
                                Disclaimer:
                            </strong>
                            This data is from the Solana blockchain and is updated periodically. IDLs and verification were correct at time of last update. IDL may be incorrect if program is not verified. IDL may be missing if it was not generated.
                            <div className="text-center p-2">
                                <DeployTimestamp />
                            </div>
                        </DrawerDescription>
                    </DrawerHeader>
                    <DrawerFooter>
                        <DrawerClose>
                            <Button>Ok</Button>
                        </DrawerClose>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
        </div >


    )
}
