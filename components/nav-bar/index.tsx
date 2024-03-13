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
        <div className="flex gap-10 items-center border shadow-md container mx-auto justify-between py-2">
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
            <div className="">
                <img src={`${(await user).image}`} alt="avatar-image" width={40} className="rounded-full"/>
            </div>
        </div>
    )
}