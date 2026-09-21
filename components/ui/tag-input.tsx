"use client";

import { X } from "lucide-react";
import { useState, type KeyboardEvent } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export type TagInputProps = {
  id?: string;
  value: string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
  "aria-invalid"?: boolean;
  "aria-describedby"?: string;
};

export function TagInput({
  id,
  value,
  onChange,
  placeholder = "Type and press Enter",
  ...aria
}: TagInputProps) {
  const [draft, setDraft] = useState("");

  const add = (raw: string) => {
    const tag = raw.trim();
    if (!tag) {
      return;
    }
    if (value.some((item) => item.toLowerCase() === tag.toLowerCase())) {
      setDraft("");
      return;
    }
    onChange([...value, tag]);
    setDraft("");
  };

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      add(draft);
    }
    if (event.key === "Backspace" && !draft && value.length > 0) {
      onChange(value.slice(0, -1));
    }
  };

  return (
    <div
      className={cn(
        "flex min-h-9 flex-wrap items-center gap-1.5 rounded-md border border-border bg-surface-1 px-2 py-1.5 focus-within:ring-2 focus-within:ring-accent/50",
        aria["aria-invalid"] && "ring-2 ring-red-400/40",
      )}
    >
      {value.map((tag) => (
        <span
          key={tag}
          className="inline-flex items-center gap-1 rounded-full border border-border bg-surface-3 px-2 py-0.5 text-[11px] text-foreground"
        >
          {tag}
          <button
            type="button"
            className="rounded-full text-muted-foreground hover:text-foreground focus-visible:ring-2 focus-visible:ring-accent/50"
            aria-label={`Remove ${tag}`}
            onClick={() => onChange(value.filter((item) => item !== tag))}
          >
            <X className="h-3 w-3" />
          </button>
        </span>
      ))}
      <Input
        id={id}
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        onKeyDown={onKeyDown}
        onBlur={() => add(draft)}
        placeholder={value.length === 0 ? placeholder : ""}
        className="h-6 min-w-24 flex-1 border-0 bg-transparent px-1 focus-visible:ring-0"
        {...aria}
      />
    </div>
  );
}
