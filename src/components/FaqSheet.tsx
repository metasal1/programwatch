import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"

export default function FaqSheet() {
    return (
        <Sheet>
            <SheetTrigger>
                <Badge>Frequently Asked Questions</Badge>
            </SheetTrigger>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>Frequently Asked Questions</SheetTitle>
                    <SheetDescription>
                        <h2>
                            Verified vs Non-Verified
                        </h2>
                        To verify a program, please visit...
                        <h2>
                            IDLs
                        </h2>
                        To learn how to create an IDL, please visit...
                        <h2>
                            Executable vs Closed
                        </h2>
                        To learn more about executable and closed programs, please visit...
                        <h2>
                            Upgradeable vs Frozen
                        </h2>
                        To learn more about upgradeable and frozen programs, please visit...
                    </SheetDescription>
                </SheetHeader>
            </SheetContent>
        </Sheet >
    )
}
