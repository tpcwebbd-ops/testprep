// RichTextEditorField.tsx

'use client'

import React, { useEffect } from 'react' // Import useEffect
import { useEditor, EditorContent, Editor } from '@tiptap/react'

// Import Tiptap extensions and UI components
import StarterKit from '@tiptap/starter-kit'
import Highlight from '@tiptap/extension-highlight'
import TextAlign from '@tiptap/extension-text-align'
import {
    AlignCenter,
    AlignLeft,
    AlignRight,
    Bold,
    Heading1,
    Heading2,
    Heading3,
    Heading4,
    Heading5,
    Heading6,
    Highlighter,
    Italic,
    List,
    ListOrdered,
    Strikethrough,
} from 'lucide-react'
import { Toggle } from '@/components/ui/toggle'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

// --- EditorMenuBar Component (No changes needed here) ---
// This sub-component is well-structured.
function EditorMenuBar({ editor }: { editor: Editor | null }) {
    if (!editor) {
        return null
    }

    const options = [
        {
            icon: <Heading1 className="size-4" />,
            onClick: () =>
                editor.chain().focus().toggleHeading({ level: 1 }).run(),
            isActive: editor.isActive('heading', { level: 1 }),
        },
        {
            icon: <Heading2 className="size-4" />,
            onClick: () =>
                editor.chain().focus().toggleHeading({ level: 2 }).run(),
            isActive: editor.isActive('heading', { level: 2 }),
        },
        {
            icon: <Heading3 className="size-4" />,
            onClick: () =>
                editor.chain().focus().toggleHeading({ level: 3 }).run(),
            isActive: editor.isActive('heading', { level: 3 }),
        },
        {
            icon: <Heading4 className="size-4" />,
            onClick: () =>
                editor.chain().focus().toggleHeading({ level: 4 }).run(),
            isActive: editor.isActive('heading', { level: 4 }),
        },
        {
            icon: <Heading5 className="size-4" />,
            onClick: () =>
                editor.chain().focus().toggleHeading({ level: 5 }).run(),
            isActive: editor.isActive('heading', { level: 5 }),
        },
        {
            icon: <Heading6 className="size-4" />,
            onClick: () =>
                editor.chain().focus().toggleHeading({ level: 6 }).run(),
            isActive: editor.isActive('heading', { level: 6 }),
        },
        {
            icon: <Bold className="size-4" />,
            onClick: () => editor.chain().focus().toggleBold().run(),
            isActive: editor.isActive('bold'),
        },
        {
            icon: <Italic className="size-4" />,
            onClick: () => editor.chain().focus().toggleItalic().run(),
            isActive: editor.isActive('italic'),
        },
        {
            icon: <Strikethrough className="size-4" />,
            onClick: () => editor.chain().focus().toggleStrike().run(),
            isActive: editor.isActive('strike'),
        },
        {
            icon: <AlignLeft className="size-4" />,
            onClick: () => editor.chain().focus().setTextAlign('left').run(),
            isActive: editor.isActive({ textAlign: 'left' }),
        },
        {
            icon: <AlignCenter className="size-4" />,
            onClick: () => editor.chain().focus().setTextAlign('center').run(),
            isActive: editor.isActive({ textAlign: 'center' }),
        },
        {
            icon: <AlignRight className="size-4" />,
            onClick: () => editor.chain().focus().setTextAlign('right').run(),
            isActive: editor.isActive({ textAlign: 'right' }),
        },
        {
            icon: <List className="size-4" />,
            onClick: () => editor.chain().focus().toggleBulletList().run(),
            isActive: editor.isActive('bulletList'),
        },
        {
            icon: <ListOrdered className="size-4" />,
            onClick: () => editor.chain().focus().toggleOrderedList().run(),
            isActive: editor.isActive('orderedList'),
        },
        {
            icon: <Highlighter className="size-4" />,
            onClick: () => editor.chain().focus().toggleHighlight().run(),
            isActive: editor.isActive('highlight'),
        },
    ]

    return (
        <div className="border rounded-md p-1 mb-2 flex flex-wrap gap-1">
            {options.map((option, index) => (
                <Toggle
                    key={index}
                    size="sm"
                    pressed={option.isActive}
                    onPressedChange={option.onClick}
                    aria-label={option.icon.type.displayName}
                >
                    {option.icon}
                </Toggle>
            ))}
        </div>
    )
}

// --- RichTextEditorField Main Component ---

// Define a clear props interface
export interface RichTextEditorProps {
    id: string
    value: string
    onChange: (content: string) => void
    label?: string
    className?: string
}

export default function RichTextEditorField({
    id,
    value,
    onChange,
    label,
    className,
}: RichTextEditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                bulletList: { HTMLAttributes: { class: 'list-disc pl-4' } },
                orderedList: { HTMLAttributes: { class: 'list-decimal pl-4' } },
            }),
            TextAlign.configure({ types: ['heading', 'paragraph'] }),
            Highlight,
        ],
        // 1. Initialize the editor with the `value` prop.
        content: value,
        editorProps: {
            attributes: {
                class: 'prose dark:prose-invert prose-sm sm:prose-base lg:prose-lg xl:prose-2xl min-h-[150px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
            },
        },
        // 2. On every update, call the parent's `onChange` callback.
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML())
        },
    })

    // 3. CRITICAL FIX: Add a `useEffect` to sync parent state changes to the editor.
    // This ensures that if the `value` prop changes from the outside (e.g., form reset),
    // the editor's content will update to match.
    useEffect(() => {
        if (editor && editor.getHTML() !== value) {
            editor.commands.setContent(value, false) // `false` prevents the cursor from jumping
        }
    }, [value, editor])

    return (
        <div className={cn('grid w-full gap-1.5', className)}>
            {label && <Label htmlFor={id}>{label}</Label>}
            <div className="tiptap-editor">
                <EditorMenuBar editor={editor} />
                {/* We can associate the label with the editor's content area */}
                <EditorContent editor={editor} id={id} />
            </div>
        </div>
    )
}
