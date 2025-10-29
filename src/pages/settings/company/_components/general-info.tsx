import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { SquarePen } from "lucide-react"
import React, { useState } from "react"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils" 
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Textarea } from "@/components/ui/textarea"


type DetailItemProps = {
  label: string
  value: string | React.ReactNode
  className?: string
}

const DetailItem = ({ label, value, className }: DetailItemProps) => {
  return (
    <div className={className}>
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      <p className="text-base text-foreground">{value}</p>
    </div>
  )
}


export function GeneralInfo() {
    const [isEditing, setIsEditing] = useState(false)

  return (
    <div className="space-y-4">
      {!isEditing && (
        <GeneralInfoCard onEditClick={() => setIsEditing(true)} />
      )}

      {isEditing && (
        <GeneralInfoForm onCancel={() => setIsEditing(false)} />
      )}
    </div>
  )
}


// General Info Detail Card //
type GeneralInfoCardProps = {
  onEditClick: () => void
}

export const GeneralInfoCard = ({ onEditClick }: GeneralInfoCardProps) => {
  return (
    <Card className="w-full"> 
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Company Details</CardTitle>
          <Button variant="ghost" size="icon" onClick={onEditClick}>
            <SquarePen className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <DetailItem 
            label="Company Name" 
            value="Global Innovations Inc." 
          />
          <DetailItem
            label="Company Email"
            value="info@globalinnovations.com"
          />
          <DetailItem 
            label="Contact Person" 
            value="Alice Wonderland" 
          />
          <DetailItem 
            label="Phone Number" 
            value="+1 (555) 123-4567" 
          />
          <DetailItem 
            label="Industry" 
            value="Software Development" 
          />
          <DetailItem
            label="Website URL"
            value="https://www.globalinnovations.com"
          />
          
          <DetailItem
            label="Company Description"
            value="Leading the future with cutting-edge software solutions and a commitment to innovation."
            className="md:col-span-2"
          />
          
          <DetailItem 
            label="Date Established" 
            value="2015-03-10" 
          />
          <DetailItem
            label="Tax ID / VAT Number"
            value="GI-TAX-12345"
          />
        </div>
      </CardContent>
    </Card>
  )
}




// General Info Edit Form //
type GeneralInfoFormProps = {
  onCancel: () => void
}

const GeneralInfoForm = ({ onCancel }: GeneralInfoFormProps) => {
  const [dateEstablished, setDateEstablished] = React.useState<Date | undefined>(
    new Date("2015-03-10")
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Form submitted!")
    console.log("Date Established:", dateEstablished)
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Company Details</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="grid gap-6">
          {/* Company Name & Email */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="companyName">Company Name</Label>
              <Input
                id="companyName"
                defaultValue="Global Innovations Inc."
                placeholder="Enter company name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="companyEmail">Company Email</Label>
              <Input
                id="companyEmail"
                type="email"
                defaultValue="info@globalinnovations.com"
                placeholder="Enter company email"
              />
            </div>
          </div>

          {/* Contact Person & Phone Number */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="contactPerson">Contact Person</Label>
              <Input
                id="contactPerson"
                defaultValue="Alice Wonderland"
                placeholder="Enter contact person"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input
                id="phoneNumber"
                defaultValue="+1 (555) 123-4567"
                placeholder="Enter phone number"
              />
            </div>
          </div>

          {/* Industry & Website URL */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="industry">Industry</Label>
              <Input
                id="industry"
                defaultValue="Software Development"
                placeholder="Enter industry"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="websiteUrl">Website URL</Label>
              <Input
                id="websiteUrl"
                type="url"
                defaultValue="https://www.globalinnovations.com"
                placeholder="Enter website URL"
              />
            </div>
          </div>

          {/* Company Description */}
          <div className="space-y-2">
            <Label htmlFor="companyDescription">Company Description</Label>
            <Textarea
              id="companyDescription"
              defaultValue="Leading the future with cutting-edge software solutions and a commitment to innovation."
              placeholder="Enter company description"
              rows={4} // Adjust rows as needed
            />
          </div>

          {/* Date Established & Tax ID / VAT Number */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="dateEstablished">Date Established</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !dateEstablished && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateEstablished ? (
                      format(dateEstablished, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={dateEstablished}
                    onSelect={setDateEstablished}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label htmlFor="taxId">Tax ID / VAT Number</Label>
              <Input
                id="taxId"
                defaultValue="GI-TAX-12345"
                placeholder="Enter Tax ID or VAT Number"
              />
            </div>
          </div>

          {/* Form Footer Buttons */}
          <CardFooter className="flex justify-end gap-2 p-0 pt-6">
            <Button variant="outline" type="button" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </CardFooter>

        </form>
      </CardContent>
    </Card>
  )
}