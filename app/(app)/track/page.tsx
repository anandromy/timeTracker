import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getUserSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Activity } from "@prisma/client";
import { revalidatePath } from "next/cache";

type NewActivityProps = {
   activity?: Activity | null
}

const NewActivity = ({ activity }: NewActivityProps ) => {
   async function createActivity(data: FormData){
      'use server'
      const user = await getUserSession()
      const activity = await prisma.activity.create({
         data: {
            name: data.get('name') as string,
            startAt: new Date(),
            tenant: { connect: {id: user.tenant.id} },
            user: { connect: {id: user.id} }
         }
      })
      revalidatePath('/track')
   }
   return(
      <div>
         <h2 className="text-xl font-medium">What are you working on?</h2>
         <form action={createActivity} className="flex items-center gap-4 my-2">
            <Input type="text" name="name" defaultValue={activity?.name || ''} /> 
            <Button type="submit">Start</Button>
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
  