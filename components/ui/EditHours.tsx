"use client"

import * as React from "react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./alert-dialog"

import { Button } from "./button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs"
import { Label } from "./label"
import { Input } from "./input"
import { cn } from "@/lib/utils"
import { checkAndSaveFixedSlots, checkAndSaveOpenHours, fetchBusinessPackages, saveFixedSlots, saveOpenHours } from "@/lib/actions/business.actions"
import { toast } from "sonner"
import { CheckIcon } from "lucide-react"

const daysOfWeek = [
  { label: "M", value: "monday" },
  { label: "T", value: "tuesday" },
  { label: "W", value: "wednesday" },
  { label: "Th", value: "thursday" },
  { label: "F", value: "friday" },
  { label: "Sa", value: "saturday" },
  { label: "Su", value: "sunday" },
]

const PackageSelectionDialog = ({
  selectedPackages,
  onChange,
}: {
  selectedPackages: string[]
  onChange: (packages: string[]) => void
}) => {
  const [tempSelection, setTempSelection] = React.useState(selectedPackages)
  const [availablePackages, setAvailablePackages] = React.useState<
    { id: string; title: string }[]
  >([]);
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    if (open) {
      fetchPackages();
    }
  }, [open, selectedPackages]);

  const fetchPackages = async () => {
    try {
      const packagesData = await fetchBusinessPackages();
      setAvailablePackages(packagesData);

      const selectedTitles = selectedPackages
        .map((id) => packagesData.find((pkg) => pkg.id === id)?.title)
        .filter((title): title is string => !!title); // Remove undefined values

      setTempSelection(selectedTitles);
    } catch (error) {
      console.error("Error fetching packages:", error);
    }
  };

  const togglePackage = (pkgId: string) => {
    const pkg = availablePackages.find((p) => p.id === pkgId);
    if (!pkg) return;

    setTempSelection((prev) =>
      prev.includes(pkg.title) ? prev.filter((title) => title !== pkg.title) : [...prev, pkg.title]
    );
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="outline" size="sm">
          Packages
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-white w-80">
        <AlertDialogHeader>
          <AlertDialogTitle>Select the Packages Available in this Time Slot</AlertDialogTitle>
        </AlertDialogHeader>
        <CardContent className="space-y-4">
          {availablePackages.length > 0 ? (
            availablePackages.map((pkg) => (
              <button
                key={pkg.id}
                onClick={() => togglePackage(pkg.id)}
                className={cn(
                  "w-full flex justify-between items-center px-4 py-2 border rounded-md transition-all",
                  tempSelection.includes(pkg.title)
                    ? "bg-custom-6 text-white"
                    : "bg-white text-black border-gray-300"
                )}
              >
                {pkg.title}
                {tempSelection.includes(pkg.title) && <CheckIcon className="w-5 h-5 text-white" />}
              </button>
            ))
          ) : (
            <p className="text-gray-500 text-center">No packages available</p>
          )}
        </CardContent>
        <AlertDialogFooter>
          <Button
            onClick={() => {
              onChange(tempSelection);
              setOpen(false);
            }}
          >
            Save Selection
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

const EditHours = ({ onScheduleUpdate }: { onScheduleUpdate: () => void }) => {

  // OPEN HOURS STATE
    const [openSelectedDays, setOpenSelectedDays] = React.useState<string[]>([])
    const [openHours, setOpenHours] = React.useState({ start: "", end: "" })
    const [unavailableTimes, setUnavailableTimes] = React.useState<{ start: string; end: string }[]>([])

  // FIXED SLOTS STATE
    const [fixedSelectedDays, setFixedSelectedDays] = React.useState<string[]>([])
    const [fixedBlockedTimes, setFixedBlockedTimes] = React.useState<
        { start: string; end: string; allowedPackages: string[] }[]
    >([])

  // HANDLERS
  const toggleDay = (day: string, selectedDays: string[], setSelectedDays: React.Dispatch<React.SetStateAction<string[]>>) => {
    setSelectedDays(prev => prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day])
  }

  const updateTime = (
    index: number, field: "start" | "end", value: string, setTimes: React.Dispatch<React.SetStateAction<any[]>>
  ) => {
    setTimes(prev => prev.map((block, i) => (i === index ? { ...block, [field]: value } : block)))
  }

  const addBlockedTime = (setTimes: React.Dispatch<React.SetStateAction<any[]>>, newBlock: any) => {
    setTimes(prev => [...prev, newBlock])
  }

  const removeBlockedTime = (index: number, setTimes: React.Dispatch<React.SetStateAction<any[]>>) => {
    setTimes(prev => prev.filter((_, i) => i !== index))
  }

  const updateFixedBlockedPackages = (index: number, packages: string[]) => {
    setFixedBlockedTimes(prev =>
      prev.map((block, i) =>
        i === index ? { ...block, allowedPackages: packages } : block
      )
    )
  }

  const [showConfirmDialog, setShowConfirmDialog] = React.useState(false);
  const [overwriteType, setOverwriteType] = React.useState<"open" | "fixed" | null>(null);

  // const handleOpenHoursSubmit = async () => {
  //   await saveOpenHours(openSelectedDays, openHours, unavailableTimes);
  //   onScheduleUpdate()
  //   const formattedDays = openSelectedDays.join(", ");
  //   const formattedTime = `${openHours.start} - ${openHours.end}`;

  //   toast("Open Hours Updated!", {
  //     description: `Days: ${formattedDays} | Time: ${formattedTime}`,
  //   });
  // };
  
  // const handleFixedSlotsSubmit = async () => {
  //   await saveFixedSlots(fixedSelectedDays, fixedBlockedTimes);
  //   onScheduleUpdate()
    
  //   const formattedDays = fixedSelectedDays.join(", ");
  //   const formattedSlots = fixedBlockedTimes
  //     .map((slot) => `${slot.start} - ${slot.end}`)
  //     .join(", ");

  //   toast("Fixed Slots Updated!", {
  //     description: `Days: ${formattedDays} | Time Slots: ${formattedSlots}`,
  //   });
  // };  

  const handleOpenHoursSubmit = async () => {
    const { exists } = await checkAndSaveOpenHours(openSelectedDays, openHours, unavailableTimes);

    if (exists) {
      setOverwriteType("open");
      setShowConfirmDialog(true);
    } else {
      await saveOpenHours(openSelectedDays, openHours, unavailableTimes);
      onScheduleUpdate();
      toast("Open Hours Updated!", {
        description: `Days: ${openSelectedDays.join(", ")} | Time: ${openHours.start} - ${openHours.end}`,
      });
    }
};

  const handleFixedSlotsSubmit = async () => {
    const { exists } = await checkAndSaveFixedSlots(fixedSelectedDays, fixedBlockedTimes);
    
    if (exists) {
      setOverwriteType("fixed");
      setShowConfirmDialog(true);
    } else {
      await saveFixedSlots(fixedSelectedDays, fixedBlockedTimes);
      onScheduleUpdate();
      toast("Fixed Slots Updated!", {
        description: `Days: ${fixedSelectedDays.join(", ")} | Time Slots: ${fixedBlockedTimes.map(slot => `${slot.start} - ${slot.end}`).join(", ")}`,
      });
    }
  };

  const confirmOverwrite = async () => {
    setShowConfirmDialog(false);
    
    if (overwriteType === "open") {
      await saveOpenHours(openSelectedDays, openHours, unavailableTimes);
      toast("Open Hours Overwritten!", {
        description: `Days: ${openSelectedDays.join(", ")} | Time: ${openHours.start} - ${openHours.end}`,
      });
    } else if (overwriteType === "fixed") {
      await saveFixedSlots(fixedSelectedDays, fixedBlockedTimes);
      toast("Fixed Slots Overwritten!", {
        description: `Days: ${fixedSelectedDays.join(", ")} | Time Slots: ${fixedBlockedTimes.map(slot => `${slot.start} - ${slot.end}`).join(", ")}`,
      });
    }

    onScheduleUpdate();
    setOverwriteType(null);
  };

  return (
    <>
      {showConfirmDialog && (
        <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
          <AlertDialogContent className="bg-white">
            <AlertDialogHeader>
              <AlertDialogTitle>Overwrite Existing Schedule?</AlertDialogTitle>
              <p>
                {overwriteType === "open" ? (
                  <>
                    <div>Open Hours already exists for the selected days:</div>
                    <div className="text-md font-bold">{openSelectedDays.join(", ")}</div>
                  </>
                ) : (
                  <>
                    <div>Fixed Slots already exist for the selected days:</div>
                    <div className="text-md font-bold">{fixedSelectedDays.join(", ")}</div>
                  </>
                )}
                <br />
                Do you want to overwrite it?
              </p>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <Button onClick={() => setShowConfirmDialog(false)}>Cancel</Button>
              <Button className="bg-red-600 text-white shadow-lg hover:shadow-xl transition-shadow" onClick={confirmOverwrite}>Yes, Overwrite</Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}

    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline">Edit My Available Hours</Button>
      </AlertDialogTrigger>

      <AlertDialogContent className="bg-white">
        <AlertDialogHeader>
          <AlertDialogTitle>Edit Hours of Operation</AlertDialogTitle>
        </AlertDialogHeader>

        <Tabs defaultValue="open_hours" className="w-[450px]">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="open_hours">Open</TabsTrigger>
            <TabsTrigger value="fixed_slots">Fixed</TabsTrigger>
          </TabsList>

          {/* Open Hours */}
          <TabsContent value="open_hours">
            <Card>
              <CardHeader>
                <CardTitle>Open Hours</CardTitle>
                <CardDescription>
                  <ul className="list-disc pl-5">
                    <li>Set your general availability.</li>
                    <li>Block off specific times when you're not available.</li>
                  </ul>
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="flex space-x-2">
                  {daysOfWeek.map((day) => (
                    <button
                      key={day.value}
                      onClick={() => toggleDay(day.value, openSelectedDays, setOpenSelectedDays)}
                      className={cn(
                        "w-8 h-8 flex items-center justify-center rounded-full border transition-all",
                        openSelectedDays.includes(day.value)
                          ? "bg-custom-6 text-white"
                          : "bg-white text-black border-gray-300"
                      )}
                    >
                      {day.label}
                    </button>
                  ))}
                </div>

                <div className="flex gap-5 justify-center items-center">
                        <Label htmlFor="start">Start:</Label>
                        <Input
                            type="time"
                            value={openHours.start}
                            onChange={(e) => setOpenHours({ ...openHours, start: e.target.value })}
                        />
                        <Label htmlFor="end">End:</Label>
                        <Input
                            type="time"
                            value={openHours.end}
                            onChange={(e) => setOpenHours({ ...openHours, end: e.target.value })}
                        />
                </div>

                {unavailableTimes.map((block, index) => (
                  <div key={index} className="flex gap-3">
                    <Input
                      type="time"
                      value={block.start}
                      onChange={(e) => updateTime(index, "start", e.target.value, setUnavailableTimes)}
                    />
                    <Input
                      type="time"
                      value={block.end}
                      onChange={(e) => updateTime(index, "end", e.target.value, setUnavailableTimes)}
                    />
                    <Button onClick={() => removeBlockedTime(index, setUnavailableTimes)}>✕</Button>
                  </div>
                ))}
                <Button onClick={() => addBlockedTime(setUnavailableTimes, { start: "", end: "" })}>+ Add Unavailable Time</Button>
              </CardContent>

              <CardFooter>
                <Button onClick={handleOpenHoursSubmit}>Save Open Hours</Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Fixed Slots */}
          <TabsContent value="fixed_slots">
            <Card>
                <CardHeader>
                <CardTitle>Fixed Slots</CardTitle>
                <CardDescription>
                  <ul className="list-disc pl-5">
                    <li>Set Fixed Blocks of Time you are Available for.</li>
                    <li>Choose the specific packages you offer during each block.</li>
                  </ul>
                </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="flex space-x-2">
                      {daysOfWeek.map((day) => (
                      <button
                          key={day.value}
                          onClick={() => toggleDay(day.value, fixedSelectedDays, setFixedSelectedDays)}
                          className={cn(
                          "w-8 h-8 flex items-center justify-center rounded-full border transition-all",
                          fixedSelectedDays.includes(day.value)
                              ? "bg-custom-6 text-white"
                              : "bg-white text-black border-gray-300"
                          )}
                      >
                          {day.label}
                      </button>
                      ))}
                  </div>

                  {fixedBlockedTimes.map((block, index) => (
                    <div key={index} className="flex gap-3 items-center">
                      <Input
                        type="time"
                        value={block.start}
                        onChange={(e) => updateTime(index, "start", e.target.value, setFixedBlockedTimes)}
                      />
                      <Input
                        type="time"
                        value={block.end}
                        onChange={(e) => updateTime(index, "end", e.target.value, setFixedBlockedTimes)}
                      />
                    {/* Button to open the package selection dialog */}
                      <PackageSelectionDialog
                        selectedPackages={block.allowedPackages}
                        onChange={(packages) =>
                          updateFixedBlockedPackages(index, packages)
                        }
                      />
                      <Button onClick={() => removeBlockedTime(index, setFixedBlockedTimes)} className="ghost">✕</Button>
                    </div>
                  ))}
                  <Button onClick={() => addBlockedTime(setFixedBlockedTimes, { start: "", end: "", allowedPackages: [] })}>+ Add Slot</Button>
                </CardContent>

                <CardFooter>
                <Button onClick={handleFixedSlotsSubmit}>Save Fixed Slots</Button>
                </CardFooter>
            </Card>
            </TabsContent>
        </Tabs>
        <AlertDialogFooter>
            <AlertDialogAction>Done</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
    </>
  )
}

export default EditHours
