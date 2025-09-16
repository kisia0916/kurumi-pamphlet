import React from 'react'
import Image from 'next/image';
import { useRouter } from 'next/navigation';

function NavigationButton(props: {
  now_page: "map" | "food" | "stamp" | "event",
  set_now_page: (page: "map" | "food" | "stamp" | "event") => void,
  page: "map" | "food" | "stamp" | "event",
  icon: string,
  title: string,
  size:"l"|"s"
}) {
  const router = useRouter();

  // ページ名からエンドポイントへのマッピング
  const pageToPath: Record<typeof props.page, string> = {
    map: '/map/home',
    food: '/food',
    stamp: '/stamp',
    event: '/event',
  };

  const handleClick = () => {
    props.set_now_page(props.page);
    router.push(pageToPath[props.page]);
  };

  return (
    <button className={`${props.size === "l"?"h-full w-12":"w-full h-17"}`} onClick={handleClick}>
      <div
        className={`w-full flex relative transition-transform duration-200 ${props.now_page === props.page ? "scale-110" : "scale-100"}`}
      >
        {props.now_page === props.page ? (
          <div
            className={`absolute left-1/2 top-1/2 ${props.size === "l"?"w-4 h-4":"w-3 h-3"} rounded-[50px] bg-amber-300 -z-10`}
            style={{ transform: 'translate(-50%, -50%)' }}
          ></div>
        ) : null}
        <Image src={props.icon} alt={props.title} width={props.size === 'l' ? 24 : 16} height={props.size === 'l' ? 24 : 16} className={props.size === "l"?'w-6 h-6 m-auto':'w-4 h-4 m-auto'} />
      </div>
      <div className='w-full flex mt-[2px] justify-center'>
        <span className={`text-xs main-font-thin ${props.size === "l"?"text-[11px]":"text-[9px]"} text-center whitespace-nowrap overflow-hidden text-ellipsis max-w-full block`}>{props.title}</span>
      </div>
    </button>
  );
}

export default NavigationButton