import Link from "next/link"
import { getUserSession } from "@/lib/auth"
const links = [
    {
        href: "/track",
        label: "Track"
    }
]

export default async function Navbar(){
    const user = await getUserSession()
    return(
        <div className="shadow-md">
            <div className="flex gap-10 items-center container mx-auto justify-between py-2">
                <span className="font-semibold">Time tracker</span>
            <nav>
                {
                    links.map((link) => (
                        <ul key={link.href} className="">
                            <Link href={link.href}>{link.label}</Link>
                        </ul>
                    ))
                }
            </nav>
            <div className="flex flex-1 justify-end">
                <img src={`${user.image}`} alt="avatar-image" width={40} className="rounded-full"/>
            </div>
        </div>
        </div>
    )
}