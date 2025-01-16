import React, { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

const NewPackage = () => {
  const [status, setStatus] = useState(true);

  return (
    <div className="rounded-xl border p-5 shadow mt-10">
        <h1 className="header-2 mb-5">New Package</h1>
        <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="package">Package</Label>
            <Input type="packageTitle" id="package" placeholder="Package Title" />
        </div>
        <div className="grid w-full max-w-sm items-center gap-1.5 mt-5">
            <Label htmlFor="capacity">Capacity</Label>
            <Input type="capacity" id="capacity" placeholder="Maximum number of guests" />
        </div>
        <div className="grid w-full max-w-sm items-center gap-1.5 mt-5">
            <Label htmlFor="price">Price</Label>
            <Input type="price" id="price" placeholder="Total Price" />
        </div>
        <div className=" flex items-center space-x-4 rounded-md border p-2 mt-5">
          <div className="flex-1 space-y-1">
            <p className="text-sm font-medium leading-none">
              Status
            </p>
          </div>
          <div className="flex gap-5">
            <p className={status === true ? "text-green-700" : "text-red-500"}> {status === true ? "available" : "unavailable"}</p>
            <Switch
              checked={status}
              onCheckedChange={(checked) => setStatus(checked)}
            />
          </div>
          
        </div>
    </div>
  )
}

export default NewPackage