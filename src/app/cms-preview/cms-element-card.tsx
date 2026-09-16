"use client";

import { useEffect, useState, type ReactNode } from "react";
import {
  Check,
  X,
  HelpCircle,
  Code,
  FileText,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useDecisions, type ElementMeta } from "./preview-context";

export type CmsElementCardProps = {
  meta: ElementMeta;
  comparisonWith?: string[];
  recommendation?: string;
  children: ReactNode;
};

export function CmsElementCard({
  meta,
  comparisonWith,
  recommendation,
  children,
}: CmsElementCardProps) {
  const { decisions, setDecision, setNote, registerElement, filter } =
    useDecisions();
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    registerElement(meta);
  }, [meta, registerElement]);

  const currentDecision = decisions[meta.id]?.status || "undecided";
  const currentNote = decisions[meta.id]?.note || "";

  if (filter !== "all" && filter !== currentDecision) {
    return null;
  }

  const borderClass =
    currentDecision === "keep"
      ? "border-emerald-500 ring-2 ring-emerald-500/20 bg-emerald-50/10"
      : currentDecision === "delete"
        ? "border-rose-500 ring-2 ring-rose-500/20 bg-rose-50/10 opacity-75"
        : "border-neutral-200 hover:border-neutral-300";

  return (
    <div
      id={`card-${meta.id}`}
      className={`group flex flex-col rounded-2xl border transition-all duration-200 overflow-hidden bg-white shadow-xs ${borderClass}`}
    >
      <div className="border-b border-neutral-100 bg-neutral-50/90 px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">
            {meta.type}
          </span>
          <h3 className="font-semibold text-sm text-neutral-900">
            {meta.name}
          </h3>
          <span className="text-xs text-neutral-400 font-mono flex items-center gap-1">
            <Code className="size-3" />
            {meta.file}
          </span>
        </div>

        <div className="flex items-center gap-1.5 ml-auto">
          <button
            type="button"
            onClick={() => setDecision(meta.id, "keep")}
            className={`px-3 py-1 text-xs font-medium rounded-lg flex items-center gap-1 cursor-pointer transition-all ${
              currentDecision === "keep"
                ? "bg-emerald-600 text-white shadow-xs"
                : "bg-neutral-100 hover:bg-emerald-100 text-neutral-700 hover:text-emerald-800"
            }`}
          >
            <Check className="size-3.5" />
            Behalten
          </button>
          <button
            type="button"
            onClick={() => setDecision(meta.id, "delete")}
            className={`px-3 py-1 text-xs font-medium rounded-lg flex items-center gap-1 cursor-pointer transition-all ${
              currentDecision === "delete"
                ? "bg-rose-600 text-white shadow-xs"
                : "bg-neutral-100 hover:bg-rose-100 text-neutral-700 hover:text-rose-800"
            }`}
          >
            <X className="size-3.5" />
            Löschen
          </button>
          <button
            type="button"
            onClick={() => setDecision(meta.id, "undecided")}
            className={`px-2.5 py-1 text-xs rounded-lg flex items-center gap-1 cursor-pointer transition-all ${
              currentDecision === "undecided"
                ? "bg-neutral-800 text-white"
                : "bg-neutral-100 hover:bg-neutral-200 text-neutral-500"
            }`}
            title="Status zurücksetzen"
          >
            <HelpCircle className="size-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1 rounded-lg hover:bg-neutral-200 text-neutral-500 cursor-pointer ml-1"
            title={isCollapsed ? "Aufklappen" : "Zuklappen"}
          >
            {isCollapsed ? (
              <ChevronDown className="size-4" />
            ) : (
              <ChevronUp className="size-4" />
            )}
          </button>
        </div>
      </div>

      <div className="px-4 py-2 bg-neutral-50/40 text-xs border-b border-neutral-100 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap gap-1.5 items-center">
          <span className="text-neutral-500 font-medium">Merkmale:</span>
          {meta.features.map((feat, idx) => (
            <span
              key={idx}
              className="bg-neutral-200/70 text-neutral-700 px-2 py-0.5 rounded-full text-[11px]"
            >
              {feat}
            </span>
          ))}
        </div>
        {comparisonWith && comparisonWith.length > 0 && (
          <div className="text-neutral-500 text-[11px] flex items-center gap-1">
            <span>Vergleichen mit:</span>
            {comparisonWith.map((c, i) => (
              <a
                key={i}
                href={`#card-${c}`}
                className="text-primary hover:underline font-mono bg-primary/5 px-1.5 py-0.5 rounded"
              >
                {c}
              </a>
            ))}
          </div>
        )}
      </div>

      {recommendation && (
        <div className="px-4 py-1.5 bg-amber-50/70 border-b border-amber-100 text-amber-900 text-xs flex items-center gap-1.5">
          <FileText className="size-3.5 text-amber-600 shrink-0" />
          <span>{recommendation}</span>
        </div>
      )}

      {!isCollapsed && (
        <>
          <div className="p-4 flex-1 flex flex-col justify-center bg-neutral-100/40">
            <div className="w-full rounded-xl overflow-hidden bg-white shadow-xs p-2">
              {children}
            </div>
          </div>

          <div className="p-3 border-t border-neutral-100 bg-white">
            <input
              type="text"
              value={currentNote}
              onChange={(e) => setNote(meta.id, e.target.value)}
              placeholder="Notiz zur Entscheidung hinzufügen..."
              className="w-full px-3 py-1.5 text-xs border border-neutral-200 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30"
            />
          </div>
        </>
      )}
    </div>
  );
}
