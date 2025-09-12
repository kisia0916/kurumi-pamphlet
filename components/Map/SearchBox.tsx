"use client"
import { Search, X, ChevronDown } from 'lucide-react'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Badge } from '../ui/badge'
import { Buildings, Project_tag, Projects } from '@prisma/client'
import BuildingInfoCard from './MapCards/BuildingInfoCardMini'
import ProjectCardMini from './MapCards/ProjectCardMini'
import { useTitle } from '@/contexts/TitleContext'
import { ProjectCardMiniProps } from '@/app/map/layout'

interface SuggestionItem {
  label: string
  type: 'genre' | 'project' | 'building'
  id?: string
}


function SearchBox() {
  const [value,setValue] = useState('')
  const [open,setOpen] = useState(false)
  const [loading,setLoading] = useState(false)
  const [suggestions,setSuggestions] = useState<SuggestionItem[]>([])
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [highlight,setHighlight] = useState<number>(-1)
  const [tag_list,set_tag_list] = useState<Project_tag[]>([])
  const [tagsOpen, setTagsOpen] = useState(true)
  const boxRef = useRef<HTMLDivElement|null>(null)
  const abortRef = useRef<AbortController|null>(null)
  const inputRef = useRef<HTMLInputElement|null>(null)
  const [project_list,set_project_list] = useState<ProjectCardMiniProps[]>([])
  const [building_list,set_building_list] = useState<Buildings[]>([])
  const { setHeight } = useTitle();


  // 型エラー回避のため any キャストしたラッパー
  const BuildingInfoCardAny = BuildingInfoCard as any

  // 初期 (フォーカス時) はジャンル一覧
  const openWithDefault = useCallback(()=>{
    setHeight("100px")
    const get_tag_list = async () => {
      try {
        const res = await fetch('/api/get_tag/get_all_tags')
        if (!res.ok) throw new Error('tag list fetch failed')
        const data:{tags:Project_tag[]} = await res.json()
        set_tag_list(data.tags || [])
      } catch(e){
        console.warn(e)
      }
    }
    get_tag_list()
    setOpen(true)
  },[])

  // 初期ロード時に URL の ?tags=foo,bar を読み込んで反映
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search)
      const tagsParam = params.get('tags')
      if (tagsParam) {
        const tags = tagsParam.split(',').map(t => t.trim()).filter(Boolean)
        if (tags.length) {
          setSelectedTags(prev => Array.from(new Set([...prev, ...tags])))
          setOpen(true)
          setTimeout(() => inputRef.current?.focus(), 0)
        }
      }
    } catch {}
  }, [])

  // タグをクエリに追加（重複は追加しない）
  const addTagToQuery = useCallback((tagTitle: string) => {
    setSelectedTags(prev => prev.includes(tagTitle) ? prev : [...prev, tagTitle])
    setOpen(true)
    setHighlight(-1)
  },[])

  const removeTag = useCallback((tagTitle: string) => {
    setSelectedTags(prev => prev.filter(t => t !== tagTitle))
  },[])

  // 他コンポーネントからタグ追加イベントを受け取る（addTagToQuery 定義後に配置）
  useEffect(() => {
    const handler = (e: Event) => {
      const ce = e as CustomEvent<string | { tag: string }>
      const tag = typeof ce.detail === 'string' ? ce.detail : ce.detail?.tag
      if (!tag) return
      addTagToQuery(tag)
      setOpen(true)
      setTimeout(() => inputRef.current?.focus(), 0)
    }
    window.addEventListener('search:addTag', handler as EventListener)
    return () => window.removeEventListener('search:addTag', handler as EventListener)
  }, [addTagToQuery])

  // 入力変化でサーバ検索 (300ms debounce)
  useEffect(()=>{
    if (!open) return
    const tokens: string[] = []
    if (value.trim() !== '') {
      tokens.push(value.trim())
    }
    if (value === ""){
      set_building_list([])
      set_project_list([])
      setTagsOpen(true)
    }
    if (selectedTags.length > 0) tokens.push(...selectedTags)
    if (tokens.length === 0) { openWithDefault(); return }
    const handle = setTimeout(async ()=>{
      try {
        abortRef.current?.abort()
        const ac = new AbortController()
        abortRef.current = ac
        setLoading(true)
        const q = encodeURIComponent(tokens.join(','))
        const res = await fetch(`/api/search?q=${q}`, {
          signal: ac.signal,
        })
        if (!res.ok) throw new Error('search failed')

        const data:{buildings:Buildings[],projects:ProjectCardMiniProps[],query:string,phrases:string[]} = await res.json()
        set_project_list(data.projects)
        set_building_list(data.buildings || [])
        setSuggestions([])
      } catch(e){
        if ((e as any).name !== 'AbortError') console.warn(e)
      } finally {
        setLoading(false)
      }
    },800)
    return ()=> clearTimeout(handle)
  },[value,selectedTags,open,openWithDefault])

  // 外側クリックで閉じる
  useEffect(()=>{
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

  // サジェストカード選択時にドロップダウンを閉じる
  const handleCardSelect = useCallback(() => {
    // ナビゲーション(onClick)を先に処理させるため、次フレームで閉じる
    setTimeout(() => {
      setOpen(false)
      setHighlight(-1)
    }, 0)
  }, [])

  const onKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (!open) return
    if (e.key === 'ArrowDown') { e.preventDefault(); setHighlight(h => Math.min(h+1, suggestions.length-1)) }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setHighlight(h => Math.max(h-1, 0)) }
    else if (e.key === 'Enter') {
      // サジェスト選択中のみ適用。手入力はテキストのまま維持。
      if (highlight >=0 && suggestions[highlight]) { e.preventDefault(); applySuggestion(suggestions[highlight]) }
    } else if (e.key === 'Escape') { setOpen(false); setHighlight(-1) }
  }
  useEffect(()=>{
    if (project_list.length > 0 || building_list.length > 0) {
      setTagsOpen(false)
    }

  },[project_list,building_list])

  return (
    <div className="w-full flex justify-center mt-5" ref={boxRef}>
      <div className="w-[94%] relative">
        <div className="w-full h-14 flex rounded-[50px] z-50 bg-white" style={{boxShadow: '0px 10px 53px 16px rgba(17,17,26,0.08)'}}>
          <div className="w-[70px] h-full flex items-center justify-center">
            <Search size={30} className="text-amber-400" />
          </div>
          <div className='w-[calc(100%-80px)] h-full flex items-center gap-2 overflow-x-auto whitespace-nowrap px-1'>
            {selectedTags.map(tag => (
              <span key={tag} className='inline-flex items-center gap-1 px-2 py-1 rounded-full bg-gray-800 text-white text-xs'>
                {tag}
                <button type='button' onClick={()=>removeTag(tag)} aria-label={`${tag} を削除`} className='opacity-80 hover:opacity-100'>
                  <X className='w-3 h-3'/>
                </button>
              </span>
            ))}
            <input
              type="text"
              value={value}
              onChange={e=>{ setValue(e.target.value); if(!open) setOpen(true) }}
              onFocus={()=> { openWithDefault(); setHighlight(-1) }}
              onKeyDown={onKeyDown}
              placeholder="企画、参加団体を検索"
              ref={inputRef}
              className="flex-1 min-w-[200px] h-full bg-transparent outline-none text-gray-700 placeholder-gray-400 text-[20px]"
            />
          </div>
        </div>
        {open && (
          <div className="absolute left-0 right-0 mt-2 bg-white rounded-2xl border border-gray-200 shadow-lg max-h-72 overflow-auto z-50 p-2 animate-in fade-in-0 zoom-in-95">

            <div className="w-full">
              <div className='w-full flex items-center justify-between'>
                <span className='main-font-thin text-xs text-gray-500'>タグ一覧</span>
                <button
                  type="button"
                  onClick={()=> setTagsOpen(v=>!v)}
                  aria-expanded={tagsOpen}
                  className='p-1 rounded-md hover:bg-gray-100 transition-colors'
                >
                  <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${tagsOpen ? '' : '-rotate-90'}`}/>
                </button>
              </div>
              {tagsOpen && (
                <div className='w-full flex flex-wrap mt-1'>
                  {tag_list.map((tag,i)=>(
                    <button
                      key={i}
                      type="button"
                      onMouseDown={(e)=>{ e.preventDefault(); addTagToQuery(tag.tag) }}
                      className="mt-1 mr-2 cursor-pointer focus:outline-none"
                      aria-label={`タグ ${tag.tag} を追加`}
                    >
                      <Badge className='flex rounded-full bg-gray-800 hover:bg-gray-700 transition-colors'>
                        <span>{tag.tag}</span>
                      </Badge>
                    </button>
                  ))}
                </div>
              )}

              {building_list.length>0?<div className='w-full mt-2'>
                <div className='w-full flex'>
                  <span className='main-font-thin text-xs text-gray-500 '>{`建物-${building_list.length}件`}</span>
                </div>
                <div className='w-full'>
                    {building_list.map((building,i)=>(
                      <div key={i} className='mb-2' onClick={handleCardSelect}>
                        <BuildingInfoCardAny
                          building={building}
                          data={building}
                          item={building}
                          id={building.id}
                          name={(building as any).name}
                          code={(building as any).code}
                        />
                      </div>
                    ))}
                </div>
                </div>: null}
                {project_list.length>0?<div className='w-full mt-2'>
                  <div className='w-full flex'>
                    <span className='main-font-thin text-xs text-gray-500'>{`企画-${project_list.length}件`}</span>
                  </div>
                  <div className='w-full'>
                    {project_list.map((project,i)=>(
                    <div key={i} className='mb-2' onClick={handleCardSelect}>
                      <ProjectCardMini project={project} />
                    </div>
                  ))}
                </div>
              </div>: null}
              </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default SearchBox