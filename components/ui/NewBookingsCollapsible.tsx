import React from 'react'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './collapsible'
import { Button } from './button'
import { ChevronsUpDown } from 'lucide-react'

const NewBookingsCollapsible = () => {
    const [isOpen, setIsOpen] = React.useState(false)

return (
    <Collapsible
    open={isOpen}
    onOpenChange={setIsOpen}
    className="w-[350px] space-y-2"
    >
    <div className="flex items-center justify-between space-x-4 px-4">
        <h4 className="text-sm font-semibold">
            You Have 5 New Bookings Today
        </h4>
        <CollapsibleTrigger asChild>
        <Button variant="ghost" size="sm" className="w-9 p-0">
            <ChevronsUpDown className="h-4 w-4" />
            <span className="sr-only">Toggle</span>
        </Button>
        </CollapsibleTrigger>
    </div>
    <div className="rounded-md border px-4 py-3 font-mono text-sm">
        Booking 1
    </div>
    <CollapsibleContent className="space-y-2">
        <div className="rounded-md border px-4 py-3 font-mono text-sm">
            Booking 2
        </div>
        <div className="rounded-md border px-4 py-3 font-mono text-sm">
            Booking 3
        </div>
    </CollapsibleContent>
    </Collapsible>
)
}

export default NewBookingsCollapsible