import { useState, useEffect } from "react";
import Textarea from "@/components/ui/Textarea";
import Button from "@/components/ui/Button";
import MarkdownRenderer from "./MarkdownRenderer";
import { Code, Eye, EyeOff, LayoutPanelLeft } from "lucide-react";

export default function MarkdownEditor({ value, onChange, placeholder = "Write your post in Markdown..." }) {
  const [view, setView] = useState("split"); // 'edit', 'preview', 'split'
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Force 'edit' or 'preview' on mobile since split doesn't fit
  const activeView = isMobile && view === "split" ? "edit" : view;

  return (
    <div className="border border-border rounded-lg overflow-hidden flex flex-col bg-card">
      <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-surface">
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setView("edit")}
            className={activeView === "edit" ? "bg-[rgba(255,255,255,0.08)] text-zinc-200" : "text-zinc-500"}
          >
            <Code className="w-3.5 h-3.5 mr-1.5" /> Edit
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setView("preview")}
            className={activeView === "preview" ? "bg-[rgba(255,255,255,0.08)] text-zinc-200" : "text-zinc-500"}
          >
            <Eye className="w-3.5 h-3.5 mr-1.5" /> Preview
          </Button>
          {!isMobile && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setView("split")}
              className={activeView === "split" ? "bg-[rgba(255,255,255,0.08)] text-zinc-200" : "text-zinc-500"}
            >
              <LayoutPanelLeft className="w-3.5 h-3.5 mr-1.5" /> Split
            </Button>
          )}
        </div>
        <a 
          href="https://www.markdownguide.org/cheat-sheet/" 
          target="_blank" 
          rel="noreferrer"
          className="text-[12px] text-zinc-500 hover:text-zinc-300 transition-colors"
        >
          Markdown Guide
        </a>
      </div>

      <div className={`flex ${activeView === "split" ? "h-[500px]" : "min-h-[300px]"}`}>
        {(activeView === "edit" || activeView === "split") && (
          <div className={`${activeView === "split" ? "w-1/2 border-r border-border" : "w-full"} p-0 flex flex-col`}>
            <textarea
              className="w-full flex-1 p-4 bg-transparent text-[14px] text-zinc-200 resize-none focus:outline-none placeholder:text-zinc-600 font-mono"
              placeholder={placeholder}
              value={value}
              onChange={(e) => onChange(e.target.value)}
            />
          </div>
        )}
        {(activeView === "preview" || activeView === "split") && (
          <div className={`${activeView === "split" ? "w-1/2 overflow-y-auto" : "w-full"} p-4 sm:p-6 bg-background/50`}>
            {value ? (
              <MarkdownRenderer content={value} />
            ) : (
              <div className="h-full flex items-center justify-center text-[13px] text-zinc-600 italic">
                Preview will appear here...
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
