"use client";

import { useTitle } from "@/contexts/TitleContext";
import React from "react";
import TimeLine, { type EventItem as TimelineEventItem } from "@/components/event/TimeLine";
import { event_date } from "@prisma/client";

// API: /api/get_event_data/get_all_place の戻り値想定
type EventSpace = {
  id: string;
  name: string;
  color: string;
  map_pin_id: string;
  createdAt: string;
};

function Page() {
  // 選択中タブのインデックスとタブ要素参照
  const [activeIdx, setActiveIdx] = React.useState(0);
  const tabRefs = React.useRef<Array<HTMLButtonElement | null>>([]);
  const { is_display_navigation } = useTitle();

  // タブ（会場）一覧をAPIから取得
  const [places, setPlaces] = React.useState<EventSpace[]>([]);
  const [loadingPlaces, setLoadingPlaces] = React.useState(false);
  const [errorPlaces, setErrorPlaces] = React.useState<string | null>(null);

  // タイムラインのイベント型（TimeLineコンポーネントの型を流用）
  type EventItem = TimelineEventItem;
  const [events, setEvents] = React.useState<EventItem[]>([]);
  const [loadingEvents, setLoadingEvents] = React.useState(false);
  // 日付タブ（開催日）: date_dataをベースに動的生成
  const [date_data,set_date_data] = React.useState<event_date[]>([])
  const [dayIdx, setDayIdx] = React.useState(0);

  // キーボード操作（左右移動）
  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
    if (places.length === 0) return;
    e.preventDefault();
    const nextIdx =
      e.key === "ArrowRight"
        ? (activeIdx + 1) % places.length
        : (activeIdx - 1 + places.length) % places.length;
    setActiveIdx(nextIdx);
    tabRefs.current[nextIdx]?.focus();
  };

  // 会場の取得（提示フォーマットに準拠）
  React.useEffect(() => {
    let aborted = false;
    const run = async () => {
      try {
        setLoadingPlaces(true);
        setErrorPlaces(null);
        const place_res = await fetch(`/api/get_event_data/get_all_place`);
        const place_json = await place_res.json();
        const event_place_list: EventSpace[] = place_json.data.place_data;
        const date_list:event_date[] = place_json.data.date_data;
        if (aborted) return;
        console.log(event_place_list)
        setPlaces(event_place_list);
        set_date_data(date_list)
        // 先頭タブに合わせてインデックスをリセット
        setActiveIdx(0);
  setDayIdx(0);
      } catch (e) {
        if (!aborted) setErrorPlaces("会場一覧の取得に失敗しました");
      } finally {
        if (!aborted) setLoadingPlaces(false);
      }
    };
    run();
    return () => {
      aborted = true;
    };
  }, []);

  // 選択中の会場のイベントを取得（任意: 最小の連携）
  React.useEffect(() => {
    const active = places[activeIdx];
    const activeDate = date_data[dayIdx];
    if (!active || !activeDate) {
      setEvents([]);
      return;
    }
    let aborted = false;
    const run = async () => {
      try {
        setLoadingEvents(true);
        const ev_res = await fetch(`/api/get_event_data/event_time_line/${active.id}?data_id=${activeDate.id}`);
        const ev_json = await ev_res.json();
        const rawList: any[] = ev_json?.data ?? [];
        if (aborted) return;
        const mapped: EventItem[] = Array.isArray(rawList)
          ? rawList.map((it) => ({
              id: String(it.id),
              title: String(it.title ?? it.project?.title ?? ""),
              start: String(it.start_time ?? ""),
              end: String(it.end_time ?? ""),
              project_id: String(it.project_id ?? it.project?.id ?? ""),
              project: it.project,
            }))
          : [];
        setEvents(mapped);
      } catch (e) {
        if (!aborted) setEvents([]);
      } finally {
        if (!aborted) setLoadingEvents(false);
      }
    };
    run();
    return () => {
      aborted = true;
    };
  }, [places, activeIdx, date_data, dayIdx]);

  return (
    <div className="w-full overflow-x-hidden main-font-thin" onKeyDown={onKeyDown}>
      <div className="w-full h-17 flex">
        <p className="main-font-thin text-2xl m-auto ml-5">イベント</p>
      </div>
              {/* 開催日タブ（date_dataに基づく動的生成） */}
        <div role="tablist" aria-label="開催日タブ" className="max-w-screen-md mx-auto px-3 ">
          <div className="w-full h-10 flex gap-2 overflow-x-auto">
            {date_data.length === 0 ? (
              <span className="text-sm text-neutral-500 my-auto">開催日がありません</span>
            ) : (
              date_data
                .slice()
                .sort((a, b) => (a.index ?? 0) - (b.index ?? 0))
                .map((d, i) => {
                  const selected = dayIdx === i;
                  return (
                    <button
                      key={d.id}
                      className={
                        "whitespace-nowrap rounded-full border px-4 py-2 text-sm transition-colors " +
                        (selected
                          ? "bg-amber-400 text-white border-amber-400"
                          : "bg-white text-black hover:bg-neutral-100 border-neutral-300")
                      }
                      aria-selected={selected}
                      onClick={() => setDayIdx(i)}
                    >
                      {d.name}
                    </button>
                  );
                })
            )}
          </div>
        </div>
      <div
        role="tablist"
        aria-label="イベント会場タブ"
        className="w-full sticky top-0 z-10 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b"
      >
        <div className="max-w-screen-md mx-auto flex gap-2 overflow-x-auto p-3">
          {places.map((p, i) => {
            const selected = activeIdx === i;
            return (
              <button
                key={p.id}
                ref={(el) => {
                  tabRefs.current[i] = el;
                }}
                onClick={() => setActiveIdx(i)}
                className={
                  "whitespace-nowrap rounded-full border px-4 py-2 text-sm transition-colors " +
                  (selected
                    ? `text-white border-${p.color}-400 bg-${p.color}-400`
                    : " text-black hover:bg-neutral-100 border-neutral-300")
                }
              >
                {p.name}
              </button>
            );
          })}
          {loadingPlaces && (
            <span className="text-sm text-neutral-500">読み込み中...</span>
          )}

        </div>

      </div>

      {/* Panel */}
      <div
        id={`panel-${places[activeIdx]?.id ?? "none"}`}
        role="tabpanel"
        aria-labelledby={places[activeIdx]?.name ?? "panel"}
        className="max-w-screen-md mx-auto overflow-y-scroll "
        style={{ height: is_display_navigation?'calc(100dvh - 60px - 170px)':'calc(100dvh - 170px)' }} 
      >
        <div className="m-3 rounded-lg  bg-white overflow-y-auto">
          {loadingEvents ? (
            <div className="p-4 text-sm text-neutral-500">タイムテーブルを読み込み中...</div>
          ) : events.length === 0 ? (
            <div className="p-4 text-sm text-neutral-500">予定はありません</div>
          ) : (
            <TimeLine events={events} color={places[activeIdx].color}/>
          )}
        </div>
      </div>
    </div>
  );
}

export default Page;