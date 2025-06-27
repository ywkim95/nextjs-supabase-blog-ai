'use client'

import { useState, KeyboardEvent } from 'react'
import { XMarkIcon } from '@heroicons/react/24/outline'

interface TagInputProps {
  tags: string[]
  onChange: (tags: string[]) => void
  placeholder?: string
  maxTags?: number
}

export default function TagInput({ 
  tags, 
  onChange, 
  placeholder = "태그를 입력하고 Enter를 누르세요",
  maxTags = 10
}: TagInputProps) {
  const [inputValue, setInputValue] = useState('')

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addTag()
    } else if (e.key === 'Backspace' && inputValue === '' && tags.length > 0) {
      // Remove last tag when backspace is pressed on empty input
      removeTag(tags.length - 1)
    }
  }

  const addTag = () => {
    const trimmedValue = inputValue.trim()
    
    if (trimmedValue === '') return
    if (tags.includes(trimmedValue)) {
      setInputValue('')
      return
    }
    if (tags.length >= maxTags) return

    onChange([...tags, trimmedValue])
    setInputValue('')
  }

  const removeTag = (indexToRemove: number) => {
    onChange(tags.filter((_, index) => index !== indexToRemove))
  }

  const handleInputBlur = () => {
    if (inputValue.trim()) {
      addTag()
    }
  }

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        태그 ({tags.length}/{maxTags})
      </label>
      
      <div className="min-h-[42px] w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus-within:ring-orange-500 focus-within:border-orange-500">
        <div className="flex flex-wrap gap-2 items-center">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800"
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTag(index)}
                className="ml-1 inline-flex items-center justify-center w-4 h-4 rounded-full text-orange-400 hover:bg-orange-200 hover:text-orange-600 focus:outline-none"
              >
                <XMarkIcon className="w-3 h-3" />
              </button>
            </span>
          ))}
          
          {tags.length < maxTags && (
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={handleInputBlur}
              placeholder={tags.length === 0 ? placeholder : ''}
              className="flex-1 min-w-[120px] outline-none bg-transparent text-sm placeholder-gray-400"
            />
          )}
        </div>
      </div>
      
      <div className="mt-1 text-xs text-gray-500">
        {tags.length >= maxTags ? (
          <span className="text-amber-600">최대 {maxTags}개까지 태그를 추가할 수 있습니다</span>
        ) : (
          <span>Enter를 눌러 태그를 추가하세요. 최대 {maxTags}개까지 가능합니다.</span>
        )}
      </div>
    </div>
  )
}
