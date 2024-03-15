import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getUserSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Activity } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { ActivityDuration } from "./duration";
import { ArrowRight, Play, Square } from "lucide-react";
import { ActivityItemRow } from "./activity-item-row";

type NewActivityProps = {
   activity?: Activity | null
}

type DailyActivitiesProps = {
   activities: Activity[]
}

const NewActivity = ({ activity }: NewActivityProps ) => {
   async function upsertActivity(data: FormData){
      'use server'
      const user = await getUserSession()
      await prisma.activity.upsert({
         where: {
            id: data.get('id') as string
         },
         create: {
            name: data.get('name') as string,
            startAt: new Date(),
            tenant: { connect: { id: user.tenant.id } },
            user: { connect: { id: user.id} }
         },
         update: {
            name: data.get('name') as string
         }
      })
      revalidatePath('/track')
   }

   async function stopActivity(data: FormData){
      'use server'

      await prisma.activity.update({
         where: {
            id: data.get('id') as string
         },
         data: {
            endAt: new Date(),
            name: data.get('name') as string
         }
      })
      revalidatePath('/track')
   }

   return(
      <div>
         <h2 className="text-xl font-medium">What are you working on?</h2>
         <form action={activity ? stopActivity : upsertActivity} className="flex items-center gap-4 my-2">
            <Input type="text" name="name" defaultValue={activity?.name || ''} />
            <input type="hidden" name="id" defaultValue={activity?.id || ''}/> 
            {
               activity && <ActivityDuration startAt={activity.startAt} />
            }
            <Button type="submit" className="rounded-full h-[40px] w-[40px] px-2">
               {activity ? <Square size={20}/>: <Play size={20}/>}
            </Button>
         </form>
      </div>
   )
}

const DailyActivities = ({ activities }: DailyActivitiesProps) => {
   return(
      <div>
         <h2 className="font-semibold text-xl my-3">What have you done today</h2>
         <ul>
            {
               activities.map((activity) => (
                  <ActivityItemRow activity={activity}/>
               ))
            }
         </ul>
      </div>
   )
}

export default async function TrackPage() {

   const user = await getUserSession()
   const currentActivity = await prisma.activity.findFirst({
      where: {
         tenantId: user.tenant.id,
         userId: user.id,
         endAt: null
      }
   })

   const now = new Date()
   const startOfToday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
   )
   const endOfToday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      23,
      59,
      59
   )

   const dailyActivities = await prisma.activity.findMany({
      where: {
         tenantId: user.tenant.id,
         userId: user.id,
         startAt: {
            gte: startOfToday
         },
         endAt: {
            lte: endOfToday
         }
      },
      orderBy: {
         startAt: 'asc'
      }
   })
    return (
     <main className="min-h-screen mx-auto container py-4">
         <NewActivity activity={currentActivity} />
         <DailyActivities activities={dailyActivities} />
     </main>
    );
  }
  