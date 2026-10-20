export interface LyricCouplet {
  hemistich1: string;
  hemistich2: string;
  vocalCue?: string;
}

export interface LyricSection {
  tag: string;
  persianLabel: string;
  couplets: LyricCouplet[];
}

export interface SunoPromptBlueprint {
  styleOfMusic: string;
  excludeStyles: string;
  tempoAndKey: string;
  instrumentation: string;
  vocalDirection: string;
  sectionTagsGuide: string;
}

export interface ComposedMasterwork {
  title: string;
  subtitle: string;
  language: string;
  genre: string;
  poeticMeter: string;
  rhymeScheme: string;
  literaryNote: string;
  sections: LyricSection[];
  sunoFullLyrics: string;
  sunoPrompt: SunoPromptBlueprint;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  timestamp: string;
  userPrompt?: string;
  clues?: string[];
  language?: string;
  mood?: string;
  poeticStyle?: string;
  masterwork?: ComposedMasterwork;
  textResponse?: string;
}

export interface ChatSession {
  id: string;
  title: string;
  subtitle: string;
  language: string;
  genre: string;
  updatedAt: string;
  pinned?: boolean;
  messages: ChatMessage[];
}
