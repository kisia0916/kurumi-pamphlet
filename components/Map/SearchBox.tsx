"use client"
import { Search } from 'lucide-react'
import React from 'react'

interface SuggestionItem {
  label: string
  type: 'genre' | 'project' | 'building'
  id?: string
}

const GENRE_JP = ['販売','生徒企画','理科展示','文化展示','公演','音楽','飲食','体験']

function SearchBox() {
  const [value,setValue] = React.useState('')
  const [open,setOpen] = React.useState(false)
  const [loading,setLoading] = React.useState(false)
  const [suggestions,setSuggestions] = React.useState<SuggestionItem[]>([])
  const [highlight,setHighlight] = React.useState<number>(-1)
  const boxRef = React.useRef<HTMLDivElement|null>(null)
  const abortRef = React.useRef<AbortController|null>(null)

  // 初期 (フォーカス時) はジャンル一覧
  const openWithDefault = React.useCallback(()=>{
    setSuggestions(GENRE_JP.map(g=>({label:g,type:'genre'})))
    setOpen(true)
  },[])

  // 入力変化でサーバ検索 (300ms debounce)
  React.useEffect(()=>{
    if (!open) return
    if (value.trim()==='') { openWithDefault(); return }
    const handle = setTimeout(async ()=>{
      try {
        abortRef.current?.abort()
        const ac = new AbortController()
        abortRef.current = ac
        setLoading(true)
        const q = encodeURIComponent(value.replace(/\s+/g,','))
        const res = await fetch(`/api/search?q=${q}`,{signal:ac.signal})
        if (!res.ok) throw new Error('search failed')
        const data = await res.json()
        // data.projects / data.buildings から名称抽出
  const projItems:SuggestionItem[] = (data.projects||[]).slice(0,20).map((p:any)=>({label:p.name,type:'project' as const,id:p.id}))
  const buildItems:SuggestionItem[] = (data.buildings||[]).slice(0,20).map((b:any)=>({label:b.name,type:'building' as const,id:b.id}))
        // 入力文字に前方一致するジャンル (重複排除)
        const genreFiltered:SuggestionItem[] = GENRE_JP
          .filter(g=> g.includes(value.trim()))
          .map(g=>({label:g,type:'genre' as const}))
        const uniq = new Map<string,SuggestionItem>()
        ;[...genreFiltered,...projItems,...buildItems].forEach(it=>{ 
          const key = it.type+':'+it.label
          if(!uniq.has(key)) uniq.set(key,it) 
        })
        setSuggestions(Array.from(uniq.values()).slice(0,12))
      } catch(e){
        if ((e as any).name !== 'AbortError') console.warn(e)
      } finally {
        setLoading(false)
      }
    },300)
    return ()=> clearTimeout(handle)
  },[value,open,openWithDefault])

  // 外側クリックで閉じる
  React.useEffect(()=>{
    const onClick = (e:MouseEvent)=>{
      if(!boxRef.current) return
      if(!boxRef.current.contains(e.target as Node)){
        setOpen(false)
        setHighlight(-1)
      }
    }
    window.addEventListener('mousedown',onClick)
    return ()=> window.removeEventListener('mousedown',onClick)
  },[])

  const applySuggestion = (s:SuggestionItem) => {
    setValue(s.label)
    setOpen(false)
  }

  const onKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (!open) return
    if (e.key === 'ArrowDown') { e.preventDefault(); setHighlight(h => Math.min(h+1, suggestions.length-1)) }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setHighlight(h => Math.max(h-1, 0)) }
    else if (e.key === 'Enter') {
      if (highlight >=0 && suggestions[highlight]) { e.preventDefault(); applySuggestion(suggestions[highlight]) }
    } else if (e.key === 'Escape') { setOpen(false); setHighlight(-1) }
  }

  return (
    <div className="w-full flex justify-center mt-5" ref={boxRef}>
      <div className="w-[94%] relative">
        <div className="w-full h-14 flex rounded-[50px] z-50 bg-white" style={{boxShadow: '0px 10px 53px 16px rgba(17,17,26,0.08)'}}>
          <div className="w-[70px] h-full flex items-center justify-center">
            <Search size={30} className="text-amber-400" />
          </div>
          <div className='w-[calc(100%-80px)] h-full flex items-center'>
            <input
              type="text"
              value={value}
              onChange={e=>{ setValue(e.target.value); if(!open) setOpen(true) }}
              onFocus={()=> { openWithDefault(); setHighlight(-1) }}
              onKeyDown={onKeyDown}
              placeholder="企画、参加団体を検索"
              className="w-full h-full bg-transparent outline-none text-gray-700 placeholder-gray-400 text-[20px]"
            />
          </div>
        </div>
        {open && (
          <div className="absolute left-0 right-0 mt-2 bg-white rounded-2xl border border-gray-200 shadow-lg max-h-72 overflow-auto z-50 p-2 animate-in fade-in-0 zoom-in-95">
            {loading && suggestions.length===0 && (
              <div className='py-6 text-center text-sm text-gray-400'>検索中...</div>
            )}
            {!loading && suggestions.length===0 && (
              <div className='py-6 text-center text-sm text-gray-400'>候補なし</div>
            )}
            <ul className="space-y-1">
              {suggestions.map((s,i)=> (
                <li key={s.type+':'+s.label}>
                  <button
                    type='button'
                    onMouseDown={(e)=> { e.preventDefault(); applySuggestion(s) }}
                    className={`w-full flex items-center justify-between px-4 py-2 rounded-xl text-left text-sm transition-colors ${i===highlight ? 'bg-amber-100' : 'hover:bg-gray-100'}`}
                  >
                    <span className='truncate'>{s.label}</span>
                    <span className='ml-3 text-[10px] text-gray-400 uppercase'>{s.type}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}

export default SearchBox