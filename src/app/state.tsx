/**
 * Learner state: mode, every journey's answers and reviews, kept separately
 * per journey. Saved to localStorage under one versioned, namespaced key.
 * Nothing here is ever sent anywhere, and nothing is placed in the URL.
 */
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import type { BiteKey, JourneyContent, JourneyId, LayerKey, LearningMode, SafetyCheckKey } from '../data/schema';
import { assemblePrompt, type AssembledPrompt, type PromptAnswers } from '../data/promptAssembly';
import { JOURNEYS, LAYER_KEYS } from './registry';

export const STORAGE_KEY = 'prompt-smash:v1:work';

export interface LayerDraft {
  text: string;
  /** Optional layers only: deliberately left out. Only counts once `reason` is filled in. */
  notNeeded: boolean;
  reason: string;
  /** The learner moved past this (recommended) layer while it was empty. */
  skipped: boolean;
}

export type ExerciseStatus = 'correct' | 'needs-another-look' | 'self-checked' | 'answer-shown';
export interface ExerciseRecord {
  status: ExerciseStatus;
  /** Selected option ids, an ordering, a mapping, or free text. */
  response?: string[] | Record<string, string> | string;
  ticks?: string[];
}

export type BiteChoice = 'clear' | 'needs-attention';
export type SafetyChoice = 'needs-attention' | 'action-added' | 'not-relevant';
export interface SafetyRecord {
  state: SafetyChoice;
  /** Reason (Not relevant) or what was done (Action added). */
  note: string;
}

export interface JourneyProgress {
  layers: Record<LayerKey, LayerDraft>;
  currentLayer: LayerKey;
  exercises: Record<string, ExerciseRecord>;
  bite: Partial<Record<BiteKey, BiteChoice>>;
  safety: Partial<Record<SafetyCheckKey, SafetyRecord>>;
}

interface SavedState {
  version: 1;
  mode: LearningMode;
  lastJourney: JourneyId;
  journeys: Partial<Record<JourneyId, JourneyProgress>>;
}

const emptyDraft = (): LayerDraft => ({ text: '', notNeeded: false, reason: '', skipped: false });

export const emptyProgress = (): JourneyProgress => ({
  layers: Object.fromEntries(LAYER_KEYS.map((k) => [k, emptyDraft()])) as Record<LayerKey, LayerDraft>,
  currentLayer: 'goal',
  exercises: {},
  bite: {},
  safety: {},
});

const initialState = (): SavedState => ({ version: 1, mode: 'simple', lastJourney: 'hamburger', journeys: {} });

/* ── Storage (may be blocked or unavailable) ───────────────────────── */

export type StorageStatus = 'available' | 'unavailable' | 'failed';

function probeStorage(): Storage | null {
  try {
    const s = window.localStorage;
    const probe = `${STORAGE_KEY}:probe`;
    s.setItem(probe, '1');
    s.removeItem(probe);
    return s;
  } catch {
    return null;
  }
}

function load(storage: Storage | null): SavedState {
  if (!storage) return initialState();
  try {
    const raw = storage.getItem(STORAGE_KEY);
    if (!raw) return initialState();
    const parsed = JSON.parse(raw) as SavedState;
    if (parsed?.version !== 1) return initialState();
    // Fill any gaps so older or partial saves still work.
    const journeys: SavedState['journeys'] = {};
    for (const [id, p] of Object.entries(parsed.journeys ?? {})) {
      const base = emptyProgress();
      journeys[id as JourneyId] = {
        ...base,
        ...p,
        layers: Object.fromEntries(LAYER_KEYS.map((k) => [k, { ...emptyDraft(), ...p?.layers?.[k] }])) as Record<LayerKey, LayerDraft>,
      };
    }
    return { ...initialState(), ...parsed, journeys };
  } catch {
    return initialState();
  }
}

/* ── Derived values ────────────────────────────────────────────────── */

/** Turns drafts into assembler answers. "Not needed" counts only with a reason. */
export function toAnswers(j: JourneyContent, p: JourneyProgress): PromptAnswers {
  const answers: PromptAnswers = {};
  for (const layer of j.layers) {
    const d = p.layers[layer.key];
    if (layer.status === 'optional' && d.notNeeded && d.reason.trim()) answers[layer.key] = { state: 'not-needed', reason: d.reason.trim() };
    else if (!d.notNeeded && d.text.trim()) answers[layer.key] = { state: 'filled', text: d.text };
    else answers[layer.key] = { state: 'empty' };
  }
  return answers;
}

export type LayerState = 'filled' | 'not-needed' | 'skipped' | 'empty';

export function layerState(j: JourneyContent, p: JourneyProgress, key: LayerKey): LayerState {
  const a = toAnswers(j, p)[key];
  if (a?.state === 'filled') return 'filled';
  if (a?.state === 'not-needed') return 'not-needed';
  return p.layers[key].skipped && j.layers.find((l) => l.key === key)?.status !== 'required' ? 'skipped' : 'empty';
}

export const LAYER_STATE_LABEL: Record<LayerState, string> = {
  filled: 'Added',
  'not-needed': 'Not needed',
  skipped: 'Skipped',
  empty: 'Not started',
};

export function assembled(j: JourneyContent, p: JourneyProgress): AssembledPrompt {
  return assemblePrompt(j.layers, toAnswers(j, p));
}

export function hasProgress(p: JourneyProgress | undefined): boolean {
  if (!p) return false;
  return LAYER_KEYS.some((k) => p.layers[k].text.trim() || p.layers[k].notNeeded || p.layers[k].skipped) || Object.keys(p.exercises).length > 0;
}

/* ── Context ───────────────────────────────────────────────────────── */

interface AppStore {
  mode: LearningMode;
  setMode: (m: LearningMode) => void;
  lastJourney: JourneyId;
  setLastJourney: (j: JourneyId) => void;
  progress: (j: JourneyId) => JourneyProgress;
  savedJourneys: Partial<Record<JourneyId, JourneyProgress>>;
  update: (j: JourneyId, fn: (p: JourneyProgress) => JourneyProgress) => void;
  updateLayer: (j: JourneyId, key: LayerKey, patch: Partial<LayerDraft>) => void;
  resetJourney: (j: JourneyId) => void;
  storageStatus: StorageStatus;
  saveNow: () => boolean;
  clearAllSaved: () => void;
  /** Polite live-region announcement. */
  announce: (message: string) => void;
  announcement: { text: string; id: number };
}

const Ctx = createContext<AppStore | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const storageRef = useRef<Storage | null>(null);
  const [storageStatus, setStorageStatus] = useState<StorageStatus>('available');
  const [state, setState] = useState<SavedState>(() => {
    storageRef.current = probeStorage();
    return load(storageRef.current);
  });
  const [announcement, setAnnouncement] = useState({ text: '', id: 0 });

  useEffect(() => {
    if (!storageRef.current) setStorageStatus('unavailable');
  }, []);

  const write = useCallback((s: SavedState): boolean => {
    const storage = storageRef.current;
    if (!storage) return false;
    try {
      storage.setItem(STORAGE_KEY, JSON.stringify(s));
      setStorageStatus('available');
      return true;
    } catch {
      setStorageStatus('failed');
      return false;
    }
  }, []);

  // Autosave shortly after each change.
  const skipNextSave = useRef(false);
  useEffect(() => {
    if (skipNextSave.current) {
      skipNextSave.current = false;
      return;
    }
    const t = window.setTimeout(() => write(state), 400);
    return () => window.clearTimeout(t);
  }, [state, write]);

  const announce = useCallback((text: string) => setAnnouncement((a) => ({ text, id: a.id + 1 })), []);

  const update = useCallback((j: JourneyId, fn: (p: JourneyProgress) => JourneyProgress) => {
    setState((s) => ({ ...s, journeys: { ...s.journeys, [j]: fn(s.journeys[j] ?? emptyProgress()) } }));
  }, []);

  const store = useMemo<AppStore>(
    () => ({
      mode: state.mode,
      setMode: (mode) => setState((s) => ({ ...s, mode })),
      lastJourney: state.lastJourney,
      setLastJourney: (lastJourney) => setState((s) => (s.lastJourney === lastJourney ? s : { ...s, lastJourney })),
      progress: (j) => state.journeys[j] ?? emptyProgress(),
      savedJourneys: state.journeys,
      update,
      updateLayer: (j, key, patch) =>
        update(j, (p) => ({ ...p, layers: { ...p.layers, [key]: { ...p.layers[key], ...patch } } })),
      // Clears the prompt and its reviews; exercise progress is kept.
      resetJourney: (j) => update(j, (p) => ({ ...emptyProgress(), exercises: p.exercises })),
      storageStatus,
      saveNow: () => write(state),
      clearAllSaved: () => {
        try {
          storageRef.current?.removeItem(STORAGE_KEY);
        } catch {
          /* storage already unavailable */
        }
        skipNextSave.current = true;
        setState((s) => ({ ...initialState(), mode: s.mode }));
      },
      announce,
      announcement,
    }),
    [state, storageStatus, update, write, announce, announcement],
  );

  return <Ctx.Provider value={store}>{children}</Ctx.Provider>;
}

export function useApp(): AppStore {
  const v = useContext(Ctx);
  if (!v) throw new Error('useApp outside AppProvider');
  return v;
}

export const journeyContent = (id: JourneyId) => JOURNEYS[id];
