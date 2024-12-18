import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { Book } from "lucide-react"

export default function FaqSheet() {
    return (
        <Sheet>
            <SheetTrigger>
                <Book className="w-8 h-8" />
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
                        <h2>Native Program List</h2>
                        <a target="_blank" href="https://docs.solanalabs.com/runtime/programs">https://docs.solanalabs.com/runtime/programs</a>
                    </SheetDescription>
                </SheetHeader>
            </SheetContent>
        </Sheet >
    )
}
