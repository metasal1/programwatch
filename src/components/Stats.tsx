import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { StatisticsDashboard } from "./StatisticsDashboard"

export default function Stats() {
    return (
        <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
                <AccordionTrigger>Statistics</AccordionTrigger>
                <AccordionContent>
                    <StatisticsDashboard />

                </AccordionContent>
            </AccordionItem>
        </Accordion>
    )
}
