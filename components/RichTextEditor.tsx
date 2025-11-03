'use client'

import { useState, useRef } from 'react'

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  rows?: number
  className?: string
  label?: string
  showCharacterCount?: boolean
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder = "Enter text...",
  rows = 6,
  className = "",
  label = "Description",
  showCharacterCount = true
}: RichTextEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [draft, setDraft] = useState('')

  const insertText = (text: string) => {
    const textarea = textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const newText = value.substring(0, start) + text + value.substring(end)
    
    onChange(newText)
    
    // Set cursor position after inserted text
    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(start + text.length, start + text.length)
    }, 0)
  }

  const wrapSelection = (prefix: string, suffix: string = '') => {
    const textarea = textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = value.substring(start, end)
    
    if (selectedText) {
      const newText = value.substring(0, start) + prefix + selectedText + suffix + value.substring(end)
      onChange(newText)
      
      setTimeout(() => {
        textarea.focus()
        textarea.setSelectionRange(start + prefix.length, end + prefix.length)
      }, 0)
    } else {
      insertText(prefix + suffix)
    }
  }

  const formatList = (type: 'bullet' | 'number' | 'dash') => {
    const lines = value.split('\n')
    const cursorPos = textareaRef.current?.selectionStart || 0
    let currentLine = 0
    let charCount = 0
    
    for (let i = 0; i < lines.length; i++) {
      if (charCount + lines[i].length >= cursorPos) {
        currentLine = i
        break
      }
      charCount += lines[i].length + 1 // +1 for newline
    }
    
    const line = lines[currentLine]
    let prefix = ''
    
    switch (type) {
      case 'bullet':
        prefix = '• '
        break
      case 'number':
        prefix = '1. '
        break
      case 'dash':
        prefix = '- '
        break
    }
    
    // Check if line already has formatting
    if (line.match(/^[\s]*[•\-\d+\.]/)) {
      // Remove existing formatting
      lines[currentLine] = line.replace(/^[\s]*[•\-\d+\.]\s*/, '')
    } else {
      // Add formatting
      lines[currentLine] = prefix + line
    }
    
    const newText = lines.join('\n')
    onChange(newText)
  }

  const alignText = (alignment: 'left' | 'center' | 'right') => {
    // For textarea, we'll add alignment markers that can be styled
    const markers = {
      left: '',
      center: '→ ',
      right: '→→ '
    }
    
    const lines = value.split('\n')
    const cursorPos = textareaRef.current?.selectionStart || 0
    let currentLine = 0
    let charCount = 0
    
    for (let i = 0; i < lines.length; i++) {
      if (charCount + lines[i].length >= cursorPos) {
        currentLine = i
        break
      }
      charCount += lines[i].length + 1
    }
    
    const line = lines[currentLine]
    const marker = markers[alignment]
    
    // Remove existing alignment markers
    const cleanLine = line.replace(/^→+\s*/, '')
    lines[currentLine] = marker + cleanLine
    
    const newText = lines.join('\n')
    onChange(newText)
  }

  const addLineSpacing = () => {
    insertText('\n\n')
  }

  const clearFormatting = () => {
    const cleanText = value
      .replace(/^[\s]*[•\-\d+\.]\s*/gm, '') // Remove list markers
      .replace(/^→+\s*/gm, '') // Remove alignment markers
      .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold
      .replace(/\*(.*?)\*/g, '$1') // Remove italic
      .replace(/`(.*?)`/g, '$1') // Remove code
    onChange(cleanText)
  }

  const ToolbarButton = ({ 
    onClick, 
    children, 
    title, 
    active = false 
  }: { 
    onClick: () => void
    children: React.ReactNode
    title: string
    active?: boolean
  }) => (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`px-2 py-1 text-sm rounded hover:bg-gray-600 transition-colors ${
        active ? 'bg-blue-600 text-white' : 'text-gray-300 hover:text-white'
      }`}
    >
      {children}
    </button>
  )

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <label className="block text-sm font-medium text-gray-300">{label}</label>
        {showCharacterCount && (
          <span className="text-xs text-gray-400">{value.length} characters</span>
        )}
      </div>
      
      {/* Toolbar */}
      <div className="bg-gray-800 border border-gray-600 rounded-lg p-2 space-y-2">
        {/* Lists */}
        <div className="flex items-center gap-1">
          <span className="text-xs text-gray-400 mr-2">Lists:</span>
          <ToolbarButton onClick={() => formatList('bullet')} title="Bullet List">
            • List
          </ToolbarButton>
          <ToolbarButton onClick={() => formatList('number')} title="Numbered List">
            1. List
          </ToolbarButton>
          <ToolbarButton onClick={() => formatList('dash')} title="Dash List">
            - List
          </ToolbarButton>
        </div>
        
        {/* Text Formatting */}
        <div className="flex items-center gap-1">
          <span className="text-xs text-gray-400 mr-2">Format:</span>
          <ToolbarButton onClick={() => wrapSelection('**', '**')} title="Bold">
            <strong>B</strong>
          </ToolbarButton>
          <ToolbarButton onClick={() => wrapSelection('*', '*')} title="Italic">
            <em>I</em>
          </ToolbarButton>
          <ToolbarButton onClick={() => wrapSelection('`', '`')} title="Code">
            &lt;/&gt;
          </ToolbarButton>
        </div>
        
        {/* Alignment */}
        <div className="flex items-center gap-1">
          <span className="text-xs text-gray-400 mr-2">Align:</span>
          <ToolbarButton onClick={() => alignText('left')} title="Align Left">
            ⬅️
          </ToolbarButton>
          <ToolbarButton onClick={() => alignText('center')} title="Align Center">
            ↔️
          </ToolbarButton>
          <ToolbarButton onClick={() => alignText('right')} title="Align Right">
            ➡️
          </ToolbarButton>
        </div>
        
        {/* Spacing & Actions */}
        <div className="flex items-center gap-1">
          <span className="text-xs text-gray-400 mr-2">Tools:</span>
          <ToolbarButton onClick={addLineSpacing} title="Add Line Spacing">
            ↕️ Space
          </ToolbarButton>
          <ToolbarButton onClick={clearFormatting} title="Clear Formatting">
            🧹 Clear
          </ToolbarButton>
          <ToolbarButton 
            onClick={() => {
              setDraft(value)
              alert('Draft saved!')
            }} 
            title="Save Draft"
          >
            💾 Save
          </ToolbarButton>
          {draft && (
            <ToolbarButton 
              onClick={() => {
                onChange(draft)
                setDraft('')
              }} 
              title="Restore Draft"
            >
              📋 Restore
            </ToolbarButton>
          )}
          <ToolbarButton onClick={() => onChange('')} title="Clear All">
            🗑️ Clear
          </ToolbarButton>
        </div>
      </div>
      
      {/* Textarea */}
      <div className="relative">
        <textarea
          ref={textareaRef}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white min-h-[140px] resize-y focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors ${className}`}
          rows={rows}
          required
        />
      </div>
      
      {/* Help Text */}
      <div className="text-xs text-gray-400">
        💡 <strong>Tips:</strong> Use toolbar above for formatting • Press Enter for new lines • 
        <strong>Ctrl+B</strong> for bold • <strong>Ctrl+I</strong> for italic • Select text to format
      </div>
    </div>
  )
}
