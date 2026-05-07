/* eslint-disable react/prop-types */
import { useEffect, useRef } from "react";

function RichTextEditor({ value, onChange, placeholder }) {
  const editorRef = useRef(null);

  useEffect(() => {
    if (!editorRef.current) return;
    const currentHtml = editorRef.current.innerHTML;
    const nextHtml = value || "";
    if (currentHtml !== nextHtml) {
      editorRef.current.innerHTML = nextHtml;
    }
  }, [value]);

  const runCommand = (command, commandValue = null) => {
    editorRef.current?.focus();
    document.execCommand(command, false, commandValue);
    onChange(editorRef.current?.innerHTML || "");
  };

  const isEmpty = !value || value === "<br>" || value === "<div><br></div>" || value === "<p><br></p>";

  return (
    <div className="rounded-lg border border-slate-300 bg-white p-2">
      <div className="mb-2 flex flex-wrap items-center gap-1 border-b border-slate-200 pb-2">
        <button type="button" onClick={() => runCommand("bold")} className="rounded border border-slate-300 px-2 py-1 text-xs font-bold">
          B
        </button>
        <button type="button" onClick={() => runCommand("italic")} className="rounded border border-slate-300 px-2 py-1 text-xs italic">
          I
        </button>
        <button type="button" onClick={() => runCommand("insertOrderedList")} className="rounded border border-slate-300 px-2 py-1 text-xs">
          1.
        </button>
        <label className="inline-flex items-center gap-1 rounded border border-slate-300 px-2 py-1 text-xs">
          Color
          <input
            type="color"
            className="h-5 w-6 cursor-pointer border-0 p-0"
            onChange={(e) => runCommand("foreColor", e.target.value)}
          />
        </label>
      </div>
      <div className="relative min-h-[140px]">
        {isEmpty ? <p className="pointer-events-none absolute left-2 top-2 text-sm text-slate-400">{placeholder}</p> : null}
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          className="min-h-[140px] rounded p-2 text-sm outline-none"
          onInput={(event) => onChange(event.currentTarget.innerHTML)}
        />
      </div>
    </div>
  );
}

export default RichTextEditor;
