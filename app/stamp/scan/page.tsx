"use client";

import { useZxing } from "react-zxing";
import { useEffect, useState } from "react";
import type { Result } from "@zxing/library";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";

function page() {
  const [result, setResult] = useState<string>("");
  const router = useRouter();

  const { ref } = useZxing({
    onDecodeResult(result: Result) {
      setResult(result.getText());
    },
    constraints: {
      video: {
        facingMode: "environment", // 背面カメラを優先
      },
    },
  });
  useEffect(()=>{
    if(result)router.push(`/stamp/quiz/${result}`)
  },[result])
  return (
    <div className="relative w-full h-full">
      {/* Close (×) button at top-right */}
      <button
        type="button"
        aria-label="閉じる"
        onClick={() => router.back()}
        className="absolute top-3 right-3 z-50 w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 focus:outline-none focus:ring-2 focus:ring-white/60"
      >
        <X className="w-6 h-6" />
      </button>

      <div className="w-full h-full flex">
        <div className="m-auto w-[300px]">
            <div className="m-auto w-[250px] h-12 flex mb-10 bg-black rounded-full ">
                <p className="m-auto main-font-thin text-[20px] text-white">QRコードをスキャン</p>
            </div>
            <video
                ref={ref}
                style={{ width: "300px"}}
                className="rounded-2xl"
            />
        </div>
      </div>
    </div>
  );
}

export default page