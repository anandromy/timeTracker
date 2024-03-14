import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getUserSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Activity } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { ActivityDuration } from "./duration";
import { Play, Square } from "lucide-react";

type NewActivityProps = {
   activity?: Activity | null
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

export default async function TrackPage() {

   const user = await getUserSession()
   const currentActivity = await prisma.activity.findFirst({
      where: {
         tenantId: user.tenant.id,
         userId: user.id,
         endAt: null
      }
   })
    return (
     <main className="min-h-screen mx-auto container py-4">
         <NewActivity activity={currentActivity} />
     </main>
    );
  }
  