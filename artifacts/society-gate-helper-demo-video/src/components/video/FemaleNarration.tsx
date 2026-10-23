import { useCallback, useEffect, useState } from 'react';
import { useSceneTimer } from '@/lib/video';

const NARRATION: Record<string, { at: number; line: string }> = {
  overview: { at: 450, line: 'At the gate, every arrival starts with a clear record.' },
  simulator: { at: 680, line: 'A signed test event is recorded, then routed to the right decision queue.' },
  resident: { at: 410, line: 'The resident makes the call. Approval records a decision; it never opens the gate.' },
  gateDesk: { at: 290, line: 'The attendant verifies who’s at the entrance. Familiar visits can match a schedule.' },
  record: { at: 360, line: 'Every arrival and decision stays in a searchable visitor record.' },
  finale: { at: 140, line: 'Society Gate. Record first. Decide clearly. Verify at the gate.' },
};

const FEMALE_VOICE_NAMES = /female|samantha|victoria|karen|zira|aria|jenny|susan|allison|emma|hazel|tessa|moira|fiona|ava|serena|natasha|siri.*female/i;

type BrowserVoice = { name: string; lang: string };
type BrowserUtterance = {
  voice: BrowserVoice | null;
  lang: string;
  rate: number;
  pitch: number;
  volume: number;
};
type BrowserSpeech = {
  getVoices: () => BrowserVoice[];
  addEventListener: (event: string, callback: () => void) => void;
  removeEventListener: (event: string, callback: () => void) => void;
  cancel: () => void;
  speak: (utterance: BrowserUtterance) => void;
  pause: () => void;
  resume: () => void;
};
type SpeechRuntime = typeof globalThis & {
  speechSynthesis?: BrowserSpeech;
  SpeechSynthesisUtterance?: new (text: string) => BrowserUtterance;
};
const speechRuntime = () => globalThis as SpeechRuntime;

export function FemaleNarration({
  sceneKey,
  paused,
  muted,
}: {
  sceneKey: string;
  paused: boolean;
  muted: boolean;
}) {
  const [voice, setVoice] = useState<BrowserVoice | null>(null);
  const current = NARRATION[sceneKey.replace(/_r[12]$/, '')];

  useEffect(() => {
    const speech = speechRuntime().speechSynthesis;
    if (!speech) return;
    const chooseVoice = () => {
      const available = speech.getVoices();
      const english = available.filter((candidate) => candidate.lang.toLowerCase().startsWith('en'));
      setVoice(english.find((candidate) => FEMALE_VOICE_NAMES.test(candidate.name)) ?? null);
    };
    chooseVoice();
    speech.addEventListener('voiceschanged', chooseVoice);
    return () => speech.removeEventListener('voiceschanged', chooseVoice);
  }, []);

  const speak = useCallback(() => {
    const runtime = speechRuntime();
    const speech = runtime.speechSynthesis;
    const Utterance = runtime.SpeechSynthesisUtterance;
    if (muted || !voice || !current || !speech || !Utterance) return;
    speech.cancel();
    const utterance = new Utterance(current.line);
    utterance.voice = voice;
    utterance.lang = voice.lang;
    utterance.rate = 0.94;
    utterance.pitch = 1.04;
    utterance.volume = 0.92;
    speech.speak(utterance);
  }, [current, muted, voice]);

  useSceneTimer(current ? [{ time: current.at, callback: speak }] : []);

  useEffect(() => {
    const speech = speechRuntime().speechSynthesis;
    if (!speech) return;
    if (paused) speech.pause();
    else speech.resume();
  }, [paused]);

  useEffect(() => {
    const speech = speechRuntime().speechSynthesis;
    if (muted) speech?.cancel();
  }, [muted]);

  useEffect(() => () => {
    speechRuntime().speechSynthesis?.cancel();
  }, [sceneKey]);

  return null;
}
