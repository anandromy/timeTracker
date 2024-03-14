'use client'
import { formatTime } from "@/lib/formatTime"
import { useEffect, useState } from "react"

type ActivityDurationProps = {
    startAt: Date
}

export const ActivityDuration = ({ startAt }: ActivityDurationProps) => {

    const now = new Date()
    const [ elpasedTime, setElapsedTime ] = useState(0)

    useEffect(() => {
        const interval = setInterval(() => {
            const elapsed = now.getTime() - startAt.getTime()
            setElapsedTime(elapsed)
        }, 1000)
        return () => clearInterval(interval)
    })

    return(
        <div className="slashed-zero tabular-nums font-medium">
            {formatTime(elpasedTime)}
        </div>
    )
}