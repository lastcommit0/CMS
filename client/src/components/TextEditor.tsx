import { useRef, useState } from "react";



export default function TextEditor() {
    const editorRef = useRef<HTMLDivElement>(null);
    const [showHtml, setShowHtml] = useState(false);

    const exec = (command: string, value?: string) => {
        editorRef.current?.focus()
        document.execCommand(command, false, value);
    }

    return (
        <div className="w-full">
            <div className="flex flex-wrap items-center gap-1 border border-gray-200 bg-gray-50 px-2 py-2 rounded-t-md">
                <ToolbarButton label="B" onClick={()=> exec("bold")}></ToolbarButton>
            </div>
        </div>
    )
}

function ToolbarButton({ label, onClick }: {label: string, onClick: ()=> void}){
    return (
        <button 
            onClick={onClick}
            className="px-2 py-1 border border-gray-300 rounded text-sm hover:bg-white transition font-semibold"
        >
            {label}
        </button>
    )
}

function ColorPicker({onChange}: {onChange: (v: string) => void}){
    return (
        <input 
            type="color"
            onChange={(e)=> onChange(e.target.value)} 
            className="size-8 border border-gray-300 rounded cursor-pointer"
            title="Text Color"
        />
    )
}

function BgColorPicker({onChange}: {onChange: (v: string) => void}){
    return (
        <input 
            type="color" 
            onChange={(e)=> onChange(e.target.value)}
            className="size-8 border border-gray-300 rounded cursor-pointer"
        />
    )
}