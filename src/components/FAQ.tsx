import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"

export default function Stats() {
    return (
        <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
                <AccordionTrigger>Frequently Asked Questions</AccordionTrigger>
                <AccordionContent>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    )
}
