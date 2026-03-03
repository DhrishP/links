"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import rehypeRaw from "rehype-raw";
import { Copy, Check } from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

export default function SkillContent({ content }: { content: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopyAll = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div>
      <div className="flex justify-end mb-4">
        <button
          onClick={handleCopyAll}
          className="inline-flex items-center gap-2 px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground bg-secondary hover:bg-secondary/80 cursor-pointer rounded-lg border border-border transition-colors"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-green-400 cursor-pointer" /> Copied
            </>
          ) : (
            <>
              <Copy  className="w-3.5 h-3.5 cursor-pointer" /> Copy All
            </>
          )}
        </button>
      </div>

      <article className="prose prose-invert max-w-none prose-headings:font-bold prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-a:text-primary hover:prose-a:text-primary/80 prose-img:rounded-xl prose-p:leading-relaxed prose-p:my-2 prose-li:my-0.5">
        <ReactMarkdown
          remarkPlugins={[remarkGfm, remarkBreaks]}
          rehypePlugins={[rehypeRaw]}
          components={{
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            code({ className, children, ref, ...rest }) {
              const match = /language-(\w+)/.exec(className || "");
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const styleStr = vscDarkPlus as any;
              const textContent = String(children).replace(/\n$/, "");

              return match ? (
                <div className="my-6 rounded-xl border border-white/10 bg-[#1e1e1e]">
                  <div className="flex items-center justify-between px-4 py-2 border-b border-white/5">
                    <span className="text-xs text-zinc-500 font-mono">
                      {match[1]}
                    </span>
                    <CopyButton text={textContent} />
                  </div>
                  <SyntaxHighlighter
                    PreTag="div"
                    language={match[1]}
                    style={styleStr}
                    customStyle={{
                      margin: 0,
                      padding: "1rem",
                      background: "transparent",
                    }}
                    wrapLongLines={true}
                    className="text-sm"
                  >
                    {textContent}
                  </SyntaxHighlighter>
                </div>
              ) : (
                <code {...rest} className={className}>
                  {children}
                </code>
              );
            },
          }}
        >
          {content}
        </ReactMarkdown>
      </article>
    </div>
  );
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text:", err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="p-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-md border border-white/10 transition-colors shadow-sm"
      title="Copy to clipboard"
    >
      {copied ? (
        <Check className="w-3.5 h-3.5 text-green-400" />
      ) : (
        <Copy className="w-3.5 h-3.5" />
      )}
    </button>
  );
}
