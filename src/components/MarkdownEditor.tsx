'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { EyeIcon, PencilIcon } from '@heroicons/react/24/outline'

// Dynamically import MDEditor to avoid SSR issues
const MDEditor = dynamic(
  () => import('@uiw/react-md-editor').then((mod) => mod.default),
  { ssr: false }
)

interface MarkdownEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  height?: number
}

export default function MarkdownEditor({ 
  value, 
  onChange, 
  placeholder = "Write your post content in Markdown...",
  height = 400 
}: MarkdownEditorProps) {
  const [mode, setMode] = useState<'edit' | 'preview' | 'live'>('live')

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <label className="block text-sm font-medium text-gray-700">
          Content (Markdown)
        </label>
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() => setMode(mode === 'edit' ? 'live' : 'edit')}
            className={`inline-flex items-center px-3 py-1 rounded-md text-xs font-medium ${
              mode === 'edit' 
                ? 'bg-orange-100 text-orange-700' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <PencilIcon className="w-3 h-3 mr-1" />
            Edit
          </button>
          <button
            type="button"
            onClick={() => setMode(mode === 'preview' ? 'live' : 'preview')}
            className={`inline-flex items-center px-3 py-1 rounded-md text-xs font-medium ${
              mode === 'preview' 
                ? 'bg-orange-100 text-orange-700' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <EyeIcon className="w-3 h-3 mr-1" />
            Preview
          </button>
        </div>
      </div>
      
      <div className="border border-gray-300 rounded-md overflow-hidden">
        <MDEditor
          value={value}
          onChange={(val) => onChange(val || '')}
          height={height}
          textareaProps={{
            placeholder,
            style: {
              fontSize: 14,
              lineHeight: 1.5,
              fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
            },
          }}
          preview={mode}
          hideToolbar={false}
          data-color-mode="light"
        />
      </div>
      
      <div className="mt-2 text-xs text-gray-500">
        <span>Supports </span>
        <a 
          href="https://www.markdownguide.org/basic-syntax/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-orange-600 hover:text-orange-500"
        >
          Markdown syntax
        </a>
        <span> including tables, code blocks, and links.</span>
      </div>
    </div>
  )
}
