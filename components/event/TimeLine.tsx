"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { SquareArrowOutUpRight } from "lucide-react";
import { Projects } from "@prisma/client";

export type EventItem = {
  id: string;
  title: string;
  start: string; // "HH:MM"
  end: string; // "HH:MM"
  project_id: string;
  project:Projects
};

export type TimelineProps = {
  events: EventItem[];
  color:string
  startHour?: number; // default 9
  endHour?: number; // default 17
  hourHeight?: number; // default 80(px)
};

const MapOpenButton = (props:{path:string,color:string}) => {
  const router = useRouter();
  return (
    <Button size="sm" onClick={() => router.push(props.path)} className={`bg-${props.color}-400`}>
      <SquareArrowOutUpRight />
    </Button>
  );
};

const parseMinutes = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map((v) => parseInt(v, 10));
  return (h || 0) * 60 + (m || 0);
};

export default function TimeLine({
  events,
  color,
  startHour = 9,
  endHour = 17,
  hourHeight = 120,
}: TimelineProps) {
  const hours = React.useMemo(
    () => Array.from({ length: endHour - startHour + 1 }, (_, i) => startHour + i),
    [startHour, endHour]
  );

  const toPosition = (startHHMM: string, endHHMM: string) => {
    // 表示範囲へクランプ
    const startMin = Math.max(parseMinutes(`${startHour}:00`), parseMinutes(startHHMM));
    const endMin = Math.min(parseMinutes(`${endHour}:00`), parseMinutes(endHHMM));
    const top = ((startMin - startHour * 60) / 60) * hourHeight;
    const height = Math.max(24, ((endMin - startMin) / 60) * hourHeight);
    return { top, height };
  };

  return (
    <div className="py-4 overflow-y-hidden">
      <div className="relative" style={{ height: `${(endHour - startHour) * hourHeight}px` }}>
        {/* 時間ライン */}
        {hours.map((h) => (
          <div key={h} className="absolute left-0 right-0" style={{ top: `${(h - startHour) * hourHeight-11}px` }}>
            <div className="flex items-center">
              <div className="w-16 text-right pr-3 text-[15px] main-font-thin tabular-nums text-neutral-600">
                {String(h).padStart(2, "0")}:00
              </div>
              <div className="flex-1 h-px bg-neutral-300" />
            </div>
          </div>
        ))}

        {/* 30分ごとの点線（例: 9:30〜16:30） */}
        {hours.slice(0, -1).map((h) => (
          <div
            key={`${h}-30`}
            className="absolute left-0 right-0"
            style={{ top: `${(h - startHour) * hourHeight + hourHeight / 2}px` }}
            aria-hidden="true"
          >
            <div className="flex items-center">
              <div className="w-16 pr-3" />
              <div className="flex-1 border-t border-dashed border-neutral-300" />
            </div>
          </div>
        ))}

        {/* イベントカードレイヤー */}
        <div className="absolute inset-0 ml-16 pl-3">
          {events.map((ev) => {
            const { top, height } = toPosition(ev.start, ev.end);
            return (
              <div
                key={ev.id}
                className="absolute left-0 right-2 rounded-md border bg-white shadow-sm overflow-hidden"
                style={{ top, height }}
              >
                {/* 左側の黄色いライン */}
                <div className={`absolute left-0 top-0 h-full w-2 bg-${color}-400 rounded-l-2xl" aria-hidden="true`}/>
                <div className="h-full overflow-y-auto p-3 pl-4 flex justify-between">
                    <div>
                    <p className="text-sm font-medium line-clamp-2">{ev.title}</p>
                    <p className="text-xs text-neutral-600 mb-2">
                    {ev.start} - {ev.end}
                  </p>
                  </div>
                  {ev.project_id?
                    <MapOpenButton path={`/map/project/${ev.project.id}?floor=${ev.project.floor_id}`} color={color}/>:<></>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
