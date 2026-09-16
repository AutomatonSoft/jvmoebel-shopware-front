"use client";

import {
  createContext,
  useContext,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { toast } from "sonner";

export type DecisionStatus = "keep" | "delete" | "undecided";

export type ElementDecision = {
  status: DecisionStatus;
  note: string;
};

export type ElementMeta = {
  id: string;
  name: string;
  type: string;
  category: string;
  file: string;
  features: string[];
};

type DecisionContextType = {
  decisions: Record<string, ElementDecision>;
  setDecision: (id: string, status: DecisionStatus) => void;
  setNote: (id: string, note: string) => void;
  resetAll: () => void;
  filter: "all" | DecisionStatus;
  setFilter: (filter: "all" | DecisionStatus) => void;
  copyReportToClipboard: () => Promise<void>;
  registeredElements: ElementMeta[];
  registerElement: (meta: ElementMeta) => void;
};

const DecisionContext = createContext<DecisionContextType | null>(null);

const STORAGE_KEY = "jvm_cms_showroom_decisions";
const emptyDecisions: Record<string, ElementDecision> = {};
const decisionListeners = new Set<() => void>();
let cachedDecisions = emptyDecisions;
let cachedStorageValue: string | null | undefined;

function getStoredDecisions() {
  let storageValue: string | null;

  try {
    storageValue = localStorage.getItem(STORAGE_KEY);
  } catch {
    return cachedDecisions;
  }

  if (storageValue === cachedStorageValue) {
    return cachedDecisions;
  }

  cachedStorageValue = storageValue;

  if (!storageValue) {
    cachedDecisions = emptyDecisions;
    return cachedDecisions;
  }

  try {
    cachedDecisions = JSON.parse(storageValue) as Record<
      string,
      ElementDecision
    >;
  } catch {
    cachedDecisions = emptyDecisions;
  }

  return cachedDecisions;
}

function subscribeToStoredDecisions(onStoreChange: () => void) {
  decisionListeners.add(onStoreChange);

  function handleStorage(event: StorageEvent) {
    if (event.key === STORAGE_KEY) {
      cachedStorageValue = undefined;
      onStoreChange();
    }
  }

  window.addEventListener("storage", handleStorage);

  return () => {
    decisionListeners.delete(onStoreChange);
    window.removeEventListener("storage", handleStorage);
  };
}

function saveStoredDecisions(decisions: Record<string, ElementDecision>) {
  try {
    const storageValue = JSON.stringify(decisions);
    localStorage.setItem(STORAGE_KEY, storageValue);

    cachedDecisions = decisions;
    cachedStorageValue = storageValue;
    decisionListeners.forEach((listener) => listener());

    return true;
  } catch {
    return false;
  }
}

export function DecisionProvider({ children }: { children: ReactNode }) {
  const decisions = useSyncExternalStore(
    subscribeToStoredDecisions,
    getStoredDecisions,
    () => emptyDecisions,
  );
  const [filter, setFilter] = useState<"all" | DecisionStatus>("all");
  const [registeredElements, setRegisteredElements] = useState<ElementMeta[]>(
    [],
  );

  const saveDecisions = (newDecisions: Record<string, ElementDecision>) => {
    if (!saveStoredDecisions(newDecisions)) {
      toast.error("Die Entscheidungen konnten nicht gespeichert werden.");
      return false;
    }

    return true;
  };

  const setDecision = (id: string, status: DecisionStatus) => {
    saveDecisions({
      ...decisions,
      [id]: {
        status,
        note: decisions[id]?.note || "",
      },
    });
  };

  const setNote = (id: string, note: string) => {
    saveDecisions({
      ...decisions,
      [id]: {
        status: decisions[id]?.status || "undecided",
        note,
      },
    });
  };

  const resetAll = () => {
    if (confirm("Alle Entscheidungen zurücksetzen?") && saveDecisions({})) {
      toast.info("Alle Entscheidungen wurden zurückgesetzt.");
    }
  };

  const registerElement = (meta: ElementMeta) => {
    setRegisteredElements((prev) => {
      if (prev.some((e) => e.id === meta.id)) return prev;
      return [...prev, meta];
    });
  };

  const copyReportToClipboard = async () => {
    const keepList: string[] = [];
    const deleteList: string[] = [];
    const undecidedList: string[] = [];

    registeredElements.forEach((el) => {
      const dec = decisions[el.id];
      const status = dec?.status || "undecided";
      const note = dec?.note ? ` (Notiz: ${dec.note})` : "";
      const item = `- **\`${el.type}\`** (${el.name}) [${el.category}]${note}`;

      if (status === "keep") keepList.push(item);
      else if (status === "delete") deleteList.push(item);
      else undecidedList.push(item);
    });

    const report = `# Prüfung der CMS-Elemente

## ✅ Behalten (${keepList.length})
${keepList.length ? keepList.join("\n") : "_Keine Elemente ausgewählt_"}

## ❌ Löschen (${deleteList.length})
${deleteList.length ? deleteList.join("\n") : "_Keine Elemente ausgewählt_"}

## ⏳ Unentschieden (${undecidedList.length})
${undecidedList.length ? undecidedList.join("\n") : "_Alle Elemente wurden bewertet_"}
`;

    try {
      await navigator.clipboard.writeText(report);
      toast.success("Der Bericht wurde in die Zwischenablage kopiert.");
    } catch {
      toast.error("Der Bericht konnte nicht kopiert werden.");
    }
  };

  return (
    <DecisionContext.Provider
      value={{
        decisions,
        setDecision,
        setNote,
        resetAll,
        filter,
        setFilter,
        copyReportToClipboard,
        registeredElements,
        registerElement,
      }}
    >
      {children}
    </DecisionContext.Provider>
  );
}

export function useDecisions() {
  const ctx = useContext(DecisionContext);
  if (!ctx)
    throw new Error(
      "useDecisions muss innerhalb von DecisionProvider verwendet werden.",
    );
  return ctx;
}
