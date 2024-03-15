'use client'

import { Input } from "@/components/ui/input"
import { Activity } from "@prisma/client"
import { ArrowRight, CalendarIcon } from "lucide-react"
import { useState } from "react"
import { updateActivity } from "./actions"
import { Button } from "@/components/ui/button"
import { pad } from "@/lib/formatTime"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"

type Props = {
    activity: Activity
}

type EditItemRowProps = Props & {
    onSave: () => void
}

type EditDateTimeProps = {
    name?: string
    value: Date
}



// Just a complex input field, NOT a whole form, so it will pass the data to it's parent form it we provide it a name and a value, these are attributes sent to formData, Since we need to capture the changing values of whatever user puts in this input field, we defined a state here and onChange of input, that state also changes, Hence the data that is sent to form is essentially the state
// Becuase of consistency (We can't obtain the date selected by the user in the calendar since we're not using an input field for it), We changed our approach to store the date state variable in the hidden input field which has a name, and it will pass on the whole date, so the whole data

const EditDateTime = ({ value, name }: EditDateTimeProps) => {
    const [ date, setDate ] = useState(value)
    return(
        <div>
            <div className="relative flex items-center">
                <input type="hidden" name={name} defaultValue={date.toISOString()}/>
                <Input type="time" value={`${pad(date.getHours())}:${pad(date.getMinutes())}`}
                onChange={(e) => {
                    const [ hours, minutes ] = e.target.value.split(':')
                    const newDate = new Date(date)
                    newDate.setHours(parseInt(hours))
                    newDate.setMinutes(parseInt(minutes))
                    setDate(newDate)
                }}
                className="pr-8"
                />
                <Popover>
                    <PopoverTrigger className="absolute right-2 h-4 w-4">
                        <CalendarIcon size={16} />
                    </PopoverTrigger>
                    <PopoverContent>
                        <Calendar mode="single" selected={date} onSelect={(d) => {
                            if(!d) return
                            d.setHours(date.getHours())
                            d.setMinutes(date.getMinutes())
                            d.setSeconds(date.getSeconds())
                            setDate(d)
                        }}/>
                    </PopoverContent>
                </Popover>
            </div>
        </div> 
    )
}


// This is the actual editing form which contains three input boxes, 
// First is jsut for the name/editing the name of the activity
// Second and third both have two separate things to edit inside them, one is the time and other is the date.
// So second is time of startAt and the date of startAt
// Third is time of endAt and the date of endAt
// We're using the component <EditDateTime /> for second and third boxes, and providing the name and the value to each of them
// Thenn hitting save, will trigger the form's action which is updating the activity and then trigerring onSave which is essentially getting passed from the parent(ActivityItemRow), the parent has a state called isEditing , and onSave we're setting isEditing to false, so that ReadItemRow is displayed after hitting save by the user. The updateActivity is the server action which is editing the activity in the datbase.

const EditItemRow = ({ activity, onSave }: EditItemRowProps) => {
    return(
        <form action={async (data) => {
            await updateActivity(data)
            onSave()
        }} className="flex items-center space-x-2">
            <input type="hidden" name="id" value={activity.id} />
            <Input type="text" name="name" defaultValue={activity.name || ''} className="w-[300px]"/>
            <EditDateTime name="startAt" value={activity.startAt} />
            <EditDateTime name="endAt" value={activity.endAt || new Date()} />
            <Button type="submit">Save</Button>
        </form>
    )
}


// ReadItemRow is essentially a single Item of activity in reading mode

const ReadItemRow = ({ activity }: Props) => {
    return(
        <li className="flex items-center py-2 space-x-2">
            <span className="font-semibold">
                {activity.name}
            </span>
            <span>
                {activity.startAt.toLocaleTimeString()}
            </span>
            <ArrowRight size={16}/>
            <span>
                {activity.endAt?.toLocaleTimeString()}
            </span>
        </li>
    )
}


// This is the parent of all , It is a component that contains a single row of activity, based on the state editing.It also passes the onSave function because the thing we're doing onSave is setting isEditing to false, whcih is a state and this resides inside this component.Also in the main track page, where we're showing the dailyActivites, the activities obtained from the database are mapped over and each ActivitiyRowItem gets a single activity

export const ActivityItemRow = ({ activity }: Props) => {
    const [ isEditing, setIsEditing ] = useState(false)
    return(
        isEditing ? 
        <EditItemRow activity={activity} onSave={() => setIsEditing(false)} />
        :
        <div className="flex justify-between">
            <ReadItemRow activity={activity} />
            <button onClick={() => setIsEditing(true)}>Edit</button>
        </div>
        
    )
}