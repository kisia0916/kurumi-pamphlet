"use client"

import React, { useEffect, useMemo, useState } from 'react'
import { useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

export default function Page() {
  const params = useParams<{ id: string }>()
  const id = params?.id

  const [quiz_text, set_quiz_text] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [selected, setSelected] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState<boolean>(false)
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
  const [stamp_place_id, set_stamp_place_id] = useState<string>("")
  const router = useRouter()

  type ParsedQuiz = { problem: string; options: string[]; ans: string }
  const parsed: ParsedQuiz | null = useMemo(() => {
    if (!quiz_text) return null
    try {
      // 例: "problem:問題文-options:選択し1,選択し２,.....-ans:答え"
      const parts = quiz_text
        .split('-')
        .map(p => p.trim())
        .filter(Boolean)

      let problem = ''
      let options: string[] = []
      let ans = ''

      for (const part of parts) {
        const [key, ...rest] = part.split(':')
        const value = rest.join(':').trim() // 問題文内に : があるケースに備える
        const k = key?.toLowerCase()
        if (k === 'problem') {
          problem = value
        } else if (k === 'options') {
          options = value.split(',').map(s => s.trim()).filter(Boolean)
        } else if (k === 'ans') {
          ans = value.trim()
        }
      }
      if (!problem || !options.length || !ans) return null
      return { problem, options, ans }
    } catch {
      return null
    }
  }, [quiz_text])

  useEffect(() => {
    const fetchQuiz = async () => {
      if (!id) return
      try {
        setLoading(true)
        setError(null)
        const res = await fetch(`/api/get_stamp_data/get_stamp_quiz/${id}`)
        if (!res.ok) throw new Error('クイズデータの取得に失敗しました')
        const data = await res.json()
        const text = data?.data?.quiz_data ?? data?.quiz_data ?? ''
        if (text === "goal"){
          setIsCorrect(true)
          setSubmitted(true)
        }
          set_stamp_place_id(data?.data?.stampPlaceId ?? "")
          set_quiz_text(text)

      } catch (e) {
        setError('クイズデータの取得に失敗しました。時間をおいて再度お試しください。')
      } finally {
        setLoading(false)
      }
    }
    fetchQuiz()
  }, [id])

  // 正解時にスタンプ登録（Hook順序を固定するため、条件付きreturnの前に置く）
  useEffect(() => {

    const get_cookie = (key: string) => {
      const cookiesList = document.cookie.split(';').reduce((acc, cookie) => {
        const [key, value] = cookie.split('=').map(c => c.trim());
        acc[key] = value;
        return acc;
      }, {} as Record<string, string>);
      return cookiesList[key]
    }
    const registerData = async () => {
      let user_id = get_cookie("stamp_user_id")
      if (!get_cookie("stamp_user_id")) {
        user_id = crypto.randomUUID()
        const future = new Date();
        future.setFullYear(future.getFullYear() + 10);
        document.cookie = "stamp_user_id=" + user_id + `path=/; expires=${future.toUTCString()}`
      }
      try {
        const res = await fetch('/api/get_stamp_data/register_user_stamp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            user_id: user_id,
            stamp_place_id: stamp_place_id,
          }),
        })
        if (!res.ok) throw new Error('スタンプ登録に失敗しました')
      } catch (err) {
        console.error('スタンプ登録エラー:', err)
      }
    }
    if (isCorrect && stamp_place_id) {
      registerData()
    }
  }, [isCorrect, stamp_place_id])

  if (loading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center p-4 text-gray-500">
        クイズを読み込み中…
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center p-4 text-red-500">
        {error}
      </div>
    )
  }
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4">
      <div className="w-full max-w-xl">
        <h1 className=" font-semibold mb-6 text-center text-lg">クイズに正解してスタンプをGET!</h1>
        {!parsed? (
          <p className="text-gray-500 text-center">クイズ形式が不正です。</p>
        ) : (
          <div className="space-y-6">
            <p className="whitespace-pre-wrap text-gray-800 text-2xl text-center">{parsed.problem}</p>

            <div className="space-y-3">
              {parsed.options.map((opt, idx) => {
                const checked = selected === opt
                return (
                  <label
                    key={idx}
                    className={`flex items-center gap-3 cursor-pointer select-none px-3 py-2 rounded-md border ${checked ? 'border-amber-400 bg-amber-50' : 'border-gray-200'}`}
                  >
                    <input
                      type="radio"
                      name="quiz-options"
                      className="h-5 w-5"
                      checked={checked}
                      onChange={() => {
                        setSubmitted(false)
                        setIsCorrect(null)
                        setSelected(opt)
                      }}
                    />
                    <span className="text-gray-800 text-lg">{opt}</span>
                  </label>
                )
              })}
            </div>

            <div className="pt-2">
              <Button
                className="bg-amber-500 hover:bg-amber-600 text-white w-full h-12 text-lg"
                disabled={!selected}
                onClick={() => {
                  setSubmitted(true)
                  const ok = (selected ?? '').trim() === parsed.ans.trim()
                  setIsCorrect(ok)
                }}
              >
                回答する
              </Button>
            </div>

            {submitted && isCorrect !== null && (
              <div className={`mt-3 text-base text-center ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                {isCorrect ? '正解です！' : '不正解です。'}
              </div>
            )}
          </div>
        )}
      </div>
      {/* 正解時のポップアップ */}
      {submitted && isCorrect === true && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-[90%] max-w-sm rounded-2xl bg-white p-6 text-center shadow-xl">
            <h2 className="text-xl font-semibold mb-2">スタンプを獲得しました</h2>
            <p className="text-gray-600 mb-4">おめでとうございます！</p>
            <Button
              className="w-full bg-amber-500 hover:bg-amber-600 text-white"
              onClick={() => router.push('/stamp')}
            >
              ホームに戻る
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}