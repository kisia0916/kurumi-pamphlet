import { ArrowUpRight, Calendar } from "lucide-react"
import { Card,  CardContent } from "../ui/card-food"

interface AnnouncementCardProps {
  title: string
  description: string
  tags: string[]
  date: string
  href: string
  className?: string
}

export function NotificationCard({ title, description, date, href }: AnnouncementCardProps) {
  return (
    <Card className='border-[1px] border-gray-200  flex flex-col main-font-thin mb-3'>

      <CardContent className="p-x-4 py-4 pt-3 pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-4">
            {/* Date */}


            {/* Tags */}

            {/* Title */}
            <span className="text-[18px] font-semibold leading-tight text-balance text-card-foreground group-hover:text-primary transition-colors">
              {title}
            </span>

            {/* Description */}
            <p className=" leading-relaxed text-pretty mb-2 text-gray-500 mt-2">{description}</p>

            {href?<div className="">
              <button
                className="rounded-full h-7 bg-blue-300"
              >
                <a href={href} className="flex items-center ml-2 mr-2">
                  <span className="text-[11px]">リンクを開く</span>
                  <ArrowUpRight className="h-4 w-4" />
                </a>
              </button>
            </div>:<></>}
                        <div className="flex items-center gap-2 text-sm ">
              <Calendar className="h-4 w-4" />
              <time dateTime={date} className="font-mono tracking-wider text-black">
                {new Date(date)
                  .toLocaleDateString("ja-JP", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                  })
                  .replace(/\//g, ".")}
              </time>
            </div>
          </div>


        </div>

        {/* Subtle border line */}
        <div className="absolute bottom-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-border to-transparent opacity-50" />
      </CardContent>
    </Card>
  )
}
export default NotificationCard