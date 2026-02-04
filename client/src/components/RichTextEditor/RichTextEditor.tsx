import { useState, useRef, useEffect } from "react";
import { Code } from "lucide-react";
import { FaCaretDown } from "react-icons/fa";
import {
    MdOutlineFormatAlignJustify,
    MdOutlineFormatAlignLeft,
    MdOutlineFormatAlignRight,
    MdOutlineFormatAlignCenter,
} from "react-icons/md";

interface RichTextEditorProps {
    value?: string;
    onChange: (value: string) => void;
    rows?: number;
    className?: string;
    placeholder?: string;
}

const RichTextEditor = ({
    value = "",
    onChange,
    rows = 8,
    className = "",
}: RichTextEditorProps) => {
    const editorRef = useRef<HTMLDivElement>(null);
    const [showColorPicker, setShowColorPicker] = useState(false);
    const [showHighlightPicker, setShowHighlightPicker] = useState(false);
    const isInternalUpdate = useRef(false);
    const savedSelectionRef = useRef<Range | null>(null);
    const isEditorFocusedRef = useRef(false);

    const isSelectionInEditor = (selection: Selection | null) => {
        if (!selection || selection.rangeCount === 0 || !editorRef.current) return false;
        const range = selection.getRangeAt(0);
        return editorRef.current.contains(range.commonAncestorContainer);
    };

    // Save selection when focus leaves the editor
    const saveSelection = () => {
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0 && isSelectionInEditor(selection)) {
            savedSelectionRef.current = selection.getRangeAt(0).cloneRange();
        }
    };

    // Restore selection before applying formatting
    const restoreSelection = () => {
        if (savedSelectionRef.current && editorRef.current) {
            const selection = window.getSelection();
            if (selection) {
                selection.removeAllRanges();
                selection.addRange(savedSelectionRef.current);
            }
        }
    };

    const textColors = [
        "#000000", "#444444", "#666666", "#999999", "#cccccc", "#eeeeee", "#f3f3f3", "#ffffff",
        "#ff0000", "#ff9900", "#ffff00", "#00ff00", "#00ffff", "#0000ff", "#9900ff", "#ff00ff",
        "#f44336", "#e91e63", "#9c27b0", "#673ab7", "#3f51b5", "#2196f3", "#03a9f4", "#00bcd4",
        "#009688", "#4caf50", "#8bc34a", "#cddc39", "#ffeb3b", "#ffc107", "#ff9800", "#ff5722",
        "#795548", "#9e9e9e", "#607d8b"
    ];
    const highlightColors = [
        "#ffff00", "#00ff00", "#00ffff", "#ff00ff", "#0000ff", "#ff0000",
        "#bfff00", "#7fffd4", "#e6e6fa", "#ffe4e1", "#f0e68c", "#d3d3d3",
        "#ffa500", "#ffb6c1", "#98fb98", "#afeeee", "#f5f5dc", "#ffffff"
    ];

    useEffect(() => {
        if (editorRef.current && !isInternalUpdate.current) {
            if (editorRef.current.innerHTML !== value) {
                editorRef.current.innerHTML = value;
            }
        }
        isInternalUpdate.current = false;
    }, [value]);

    const handleInput = () => {
        if (editorRef.current) {
            isInternalUpdate.current = true;
            onChange(editorRef.current.innerHTML);
        }
    };

    const executeCommand = (command: string, value: string | undefined = undefined) => {
        document.execCommand(command, false, value);
        editorRef.current?.focus();
        handleInput();
    };

    const formatText = (command: string) => {
        executeCommand(command);
    };

    const applyColor = (color: string) => {
        restoreSelection();
        editorRef.current?.focus();
        document.execCommand('foreColor', false, color);
        handleInput();
        setShowColorPicker(false);
    };

    const applyHighlight = (color: string) => {
        restoreSelection();
        editorRef.current?.focus();
        if (!document.execCommand('hiliteColor', false, color)) {
            document.execCommand('backColor', false, color);
        }
        handleInput();
        setShowHighlightPicker(false);
    };

    const applyAlignment = (alignment: string) => {
        const alignmentMap: { [key: string]: string } = {
            'left': 'justifyLeft',
            'center': 'justifyCenter',
            'right': 'justifyRight',
            'justify': 'justifyFull'
        };
        executeCommand(alignmentMap[alignment]);
    };

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (!target.closest(".color-picker-wrapper")) {
                setShowColorPicker(false);
                setShowHighlightPicker(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        const handleSelectionChange = () => {
            if (!isEditorFocusedRef.current) return;
            const selection = window.getSelection();
            if (isSelectionInEditor(selection)) {
                saveSelection();
            }
        };

        document.addEventListener("selectionchange", handleSelectionChange);
        return () => document.removeEventListener("selectionchange", handleSelectionChange);
    }, []);

    const minHeight = `${rows * 1.5}rem`;

    return (
        <div className={className}>
            <div className="relative">
                <div className="absolute flex gap-2 mx-2 mt-2 w-fit z-10">
                    <div className="flex border-2 border-gray-200 rounded bg-white shadow-sm">
                        <ToolbarButton
                            onClick={() => formatText('bold')}
                            className="font-extrabold"
                            title="Bold (Ctrl+B)"
                        >
                            B
                        </ToolbarButton>
                        <ToolbarButton
                            onClick={() => formatText('italic')}
                            className="italic border-r"
                            title="Italic (Ctrl+I)"
                        >
                            I
                        </ToolbarButton>
                        <ToolbarButton
                            onClick={() => formatText('underline')}
                            className="underline"
                            title="Underline (Ctrl+U)"
                        >
                            U
                        </ToolbarButton>
                    </div>

                    <div className="flex border-2 border-gray-200 rounded bg-white shadow-sm">
                        <div className="relative color-picker-wrapper">
                            <ToolbarButton
                                onClick={() => {
                                    saveSelection();
                                    setShowColorPicker(!showColorPicker);
                                    setShowHighlightPicker(false);
                                }}
                                active={showColorPicker}
                                className="w-10 border-r"
                                title="Text Color"
                            >
                                <span className="w-4 h-4 bg-[#606060] text-white flex items-center justify-center text-xs rounded">
                                    A
                                </span>
                                <FaCaretDown size={12} className="ml-1" />
                            </ToolbarButton>
                            {showColorPicker && (
                                <ColorGrid colors={textColors} onSelect={applyColor} />
                            )}
                        </div>

                        <div className="relative color-picker-wrapper">
                            <ToolbarButton
                                onClick={() => {
                                    saveSelection();
                                    setShowHighlightPicker(!showHighlightPicker);
                                    setShowColorPicker(false);
                                }}
                                active={showHighlightPicker}
                                className="w-10"
                                title="Highlight"
                            >
                                <span className="w-4 h-4 mb-1 text-[#606060] flex items-center font-semibold justify-center text-sm rounded underline decoration-2">
                                    A
                                </span>
                                <FaCaretDown size={12} className="ml-1" />
                            </ToolbarButton>
                            {showHighlightPicker && (
                                <ColorGrid colors={highlightColors} onSelect={applyHighlight} />
                            )}
                        </div>
                    </div>

                    <div className="flex border-2 border-gray-200 rounded bg-white shadow-sm">
                        <ToolbarButton
                            onClick={() => applyAlignment('left')}
                            className="border-r"
                            title="Align Left"
                        >
                            <MdOutlineFormatAlignLeft size={18} />
                        </ToolbarButton>
                        <ToolbarButton
                            onClick={() => applyAlignment('center')}
                            className="border-r"
                            title="Align Center"
                        >
                            <MdOutlineFormatAlignCenter size={18} />
                        </ToolbarButton>
                        <ToolbarButton
                            onClick={() => applyAlignment('right')}
                            className="border-r"
                            title="Align Right"
                        >
                            <MdOutlineFormatAlignRight size={18} />
                        </ToolbarButton>
                        <ToolbarButton
                            onClick={() => applyAlignment('justify')}
                            title="Justify"
                        >
                            <MdOutlineFormatAlignJustify size={18} />
                        </ToolbarButton>
                    </div>

                    <div className="flex border-2 border-gray-200 rounded bg-white shadow-sm">
                        <ToolbarButton
                            onClick={() => {
                                const selection = window.getSelection();
                                if (selection && selection.rangeCount > 0) {
                                    const range = selection.getRangeAt(0);
                                    const code = document.createElement('code');
                                    code.style.cssText = 'background: #f1f5f9; padding: 2px 6px; border-radius: 4px; font-family: monospace; font-size: 0.9em;';
                                    try {
                                        range.surroundContents(code);
                                        handleInput();
                                    } catch (e) {
                                        console.error('Code formatting error:', e);
                                    }
                                }
                                editorRef.current?.focus();
                            }}
                            title="Code"
                        >
                            <Code size={18} />
                        </ToolbarButton>
                    </div>
                </div>

                <div
                    ref={editorRef}
                    contentEditable
                    onInput={handleInput}
                    onBlur={saveSelection}
                    onMouseUp={saveSelection}
                    onKeyUp={saveSelection}
                    onFocus={() => {
                        isEditorFocusedRef.current = true;
                    }}
                    onBlurCapture={() => {
                        isEditorFocusedRef.current = false;
                    }}
                    className="custom-input resize-none w-full pt-12 focus:outline-none"
                    style={{ minHeight }}
                    suppressContentEditableWarning
                />

                <style>{`
                    [contentEditable][data-placeholder]:empty:before {
                        content: attr(data-placeholder);
                        color: #9ca3af;
                        cursor: text;
                        pointer-events: none;
                    }
                    [contentEditable] strong, [contentEditable] b { 
                        font-weight: 700; 
                    }
                    [contentEditable] em, [contentEditable] i { 
                        font-style: italic; 
                    }
                    [contentEditable] u { 
                        text-decoration: underline; 
                    }
                    [contentEditable] code { 
                        background: #f1f5f9; 
                        padding: 2px 6px; 
                        border-radius: 4px; 
                        font-family: monospace; 
                        font-size: 0.9em;
                    }
                    [contentEditable]:focus {
                        outline: none;
                    }
                `}</style>
            </div>
        </div>
    );
};

export default RichTextEditor;

const ToolbarButton = ({
    children,
    onClick,
    active = false,
    className = "",
    title
}: {
    children: React.ReactNode;
    onClick: () => void;
    active?: boolean;
    className?: string;
    title?: string;
}) => (
    <button
        type="button"
        onMouseDown={(e) => {
            e.preventDefault();
            onClick();
        }}
        className={`size-7 flex items-center justify-center text-[#606060] hover:bg-gray-100 transition-colors ${active ? 'bg-gray-100' : ''} ${className}`}
        title={title}
    >
        {children}
    </button>
);

const ColorGrid = ({
    colors,
    onSelect
}: {
    colors: string[];
    onSelect: (c: string) => void;
}) => (
    <div className="absolute top-full left-0 mt-1 p-2 bg-white border-2 border-gray-200 rounded-lg shadow-xl z-30 min-w-[200px]">
        <div className="grid grid-cols-6 gap-1.5 mb-2">
            {colors.map(c => (
                <button
                    key={c}
                    type="button"
                    onMouseDown={(e) => {
                        e.preventDefault();
                        onSelect(c);
                    }}
                    className="w-5 h-5 rounded-sm border border-gray-200 hover:scale-110 transition-transform shadow-sm"
                    style={{ backgroundColor: c }}
                    title={c}
                />
            ))}
        </div>
        <div className="border-t pt-2 mt-1">
            <label className="flex items-center gap-2 cursor-pointer group px-1 rounded hover:bg-gray-50 transition-colors">
                <div className="relative w-6 h-6 border rounded overflow-hidden flex-shrink-0">
                    <input
                        type="color"
                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                        onChange={(e) => onSelect(e.target.value)}
                    />
                    <div className="w-full h-full bg-gradient-to-tr from-red-500 via-green-500 to-blue-500" />
                </div>
                <span className="text-xs text-gray-600 group-hover:text-gray-900 transition-colors font-medium">Custom Color</span>
            </label>
        </div>
    </div>
);
