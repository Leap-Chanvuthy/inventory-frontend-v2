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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"


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


export function AddressInfo() {
    const [isEditing, setIsEditing] = useState(false)

  return (
    <div className="space-y-4">
      {!isEditing && (
        <AddressInfoCard onEditClick={() => setIsEditing(true)} />
      )}

      {isEditing && (
        <AddressInfoForm onCancel={() => setIsEditing(false)} />
      )}
    </div>
  )
}


// Address Info Detail Card //
type AddressInfoCard = {
  onEditClick: () => void
}

const AddressInfoCard = ({ onEditClick }: AddressInfoCard) => {
  return (
    <Card className="w-full"> 
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Address Details</CardTitle>
          <Button variant="ghost" size="icon" onClick={onEditClick}>
            <SquarePen className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <DetailItem 
            label="House Number" 
            value="123" 
          />
          <DetailItem
            label="Street Number"
            value="456 Elm Street"
          />
          <DetailItem 
            label="Commune" 
            value="Downtown" 
          />
          <DetailItem 
            label="District" 
            value="Central" 
          />
          <DetailItem 
            label="City" 
            value="Metropolis" 
          />
        </div>
      </CardContent>
    </Card>
  )
}




// Address Info Edit Form //
type AddressInfoFormProps = {
  onCancel: () => void
}

const AddressInfoForm = ({ onCancel }: AddressInfoFormProps) => {

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Form submitted!")

}

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Address Info Details</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="grid gap-6">
          {/* Company Name & Email */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="house_number">House Number</Label>
              <Input
                id="house_number"
                defaultValue="Global Innovations Inc."
                placeholder="Enter house number"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="street_number">Street Number</Label>
              <Input
                id="street_number"
                type="text"
                defaultValue="1234 Elm Street"
                placeholder="Enter street number"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="commune">Commune</Label>
              <Input
                id="commune"
                defaultValue="Downtown"
                placeholder="Enter commune"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="district">District</Label>
              <Input
                id="district"
                defaultValue="My district"
                placeholder="Enter district"
              />
            </div>
          </div>

          {/* Industry & Website URL */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                defaultValue="Phnom Penh"
                placeholder="Enter city"
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