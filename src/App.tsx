import React, { useState, useEffect, useRef } from 'react';
import {
  Menu,
  X,
  Send,
  Plus,
  Trash2,
  Copy,
  Check,
  Music,
  FileText,
  User,
  Sparkles,
  SlidersHorizontal,
  ChevronDown,
  Globe,
  PlusCircle,
  RefreshCw,
  Download,
  Key,
  Cpu,
  ShieldCheck,
  AlertCircle,
  ExternalLink,
  CheckCircle2,
  XCircle,
  Loader2,
  Mic,
  Flame,
  Radio,
  Disc,
  Heart,
  Shield,
  Compass,
  Coffee,
  Layers,
  Gauge,
  History,
  Bookmark,
  Eye,
  CheckCheck,
  Edit3,
  Wand2,
  Save,
  Award
} from 'lucide-react';
import { SongGenerationResult, SongQualityAudit } from '../server';

interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  timestamp: string;
  text?: string;
  songResult?: SongGenerationResult;
  source?: string;
  warning?: string;
  error?: string;
  failedProvider?: string;
}

interface ChatSession {
  id: string;
  title: string;
  subtitle: string;
  updatedAt: string;
  messages: ChatMessage[];
}

export interface SavedSong {
  id: string;
  title: string;
  songResult: SongGenerationResult;
  savedAt: string;
  source?: string;
  actionTrigger?: 'copy_lyrics' | 'copy_prompt' | 'download' | 'manual';
}

export interface OpenRouterModelPreset {
  id: string;
  name: string;
  desc: string;
  badge: string;
  isFree: boolean;
}

export const OPENROUTER_FREE_MODELS: OpenRouterModelPreset[] = [
  {
    id: 'meta-llama/llama-3.3-70b-instruct:free',
    name: 'متا لاما ۳.۳ ۷۰B (رایگان)',
    desc: 'مدل پرقدرت متا با تسلط عالی بر وزن، قافیه، پایداری بالا و ادبیات فارسی',
    badge: 'پیشنهادی · پایدارترین',
    isFree: true,
  },
  {
    id: 'google/gemma-2-9b-it:free',
    name: 'گوگل گما ۲ ۹B (رایگان)',
    desc: 'مدل پرسرعت و پایدار گوگل برای سرایش شعر و پرامپت‌نویسی سونو',
    badge: 'پرسرعت · رایگان',
    isFree: true,
  },
  {
    id: 'minimax/minimax-m3.1-flash:free',
    name: 'مینی‌مکس M3.1 فلش (رایگان)',
    desc: 'مدل چابک و باهوش با درک غنی از صنایع ادبی و داستان‌سرایی',
    badge: 'جدید · رایگان',
    isFree: true,
  },
  {
    id: 'deepseek/deepseek-r1:free',
    name: 'دیپ‌سیک R1 (رایگان)',
    desc: 'تفکر عمیق و استدلال شاعرانه شاهکار و بسیار باهوش',
    badge: 'استدلال عمیق',
    isFree: true,
  },
  {
    id: 'mistralai/mistral-small-3.2-24b-instruct:free',
    name: 'میسترال ۲۴B (رایگان)',
    desc: 'مدل سبک و دقیق در ترانه‌سرایی و ریتم کلامی',
    badge: 'سبک · رایگان',
    isFree: true,
  },
  {
    id: 'deepseek/deepseek-chat:free',
    name: 'دیپ‌سیک چت V3 (رایگان)',
    desc: 'مدل گفتگومحور و ترانه‌سرایی روان و پیوسته',
    badge: 'رایگان',
    isFree: true,
  },
];

export const OPENROUTER_POPULAR_MODELS: OpenRouterModelPreset[] = [
  {
    id: 'qwen/qwen-2.5-72b-instruct',
    name: 'Qwen 2.5 72B Instruct',
    desc: 'سلطان شعر فارسی، وزن‌های عروضی و استعاره‌ها',
    badge: 'تخصصی شعر فارسی',
    isFree: false,
  },
  {
    id: 'openai/gpt-4o-mini',
    name: 'OpenAI GPT-4o Mini',
    desc: 'هوش مصنوعی سریع و پایدار از OpenAI',
    badge: 'پایدار',
    isFree: false,
  },
  {
    id: 'anthropic/claude-3.5-sonnet',
    name: 'Claude 3.5 Sonnet',
    desc: 'قوی‌ترین هوش مصنوعی در درک ظرایف و استعاره‌ها',
    badge: 'کیفیت اعلا',
    isFree: false,
  },
];

const STORAGE_KEY = 'chakameh_chatbot_sessions_v6';
const SAVED_SONGS_KEY = 'chakameh_saved_library_songs_v1';
const OPENROUTER_KEY_STORAGE = 'chakameh_openrouter_api_key_v1';
const OPENROUTER_MODEL_STORAGE = 'chakameh_openrouter_model_v1';
const GROQ_KEY_STORAGE = 'taraneh_groq_api_key_v1';
const CLOUDFLARE_KEY_STORAGE = 'taraneh_cloudflare_api_token_v1';
const CLOUDFLARE_ACCOUNT_STORAGE = 'taraneh_cloudflare_account_id_v1';
const CLOUDFLARE_MODEL_STORAGE = 'taraneh_cloudflare_model_v1';

// 1. DIVERSE GENRES & STYLES (شامل انواع سبک‌های رپ و موسیقی بدون تکرار)
export const GENRE_OPTIONS = [
  {
    id: 'rap_boombap',
    label: 'رپ بوم‌بپ کلاسیک ۹۰s (90s Boom Bap)',
    short: 'رپ بوم‌بپ ۹۰s',
    desc: 'بیت بوم‌بپ طلایی، سمپل وینیل، پیانو Rhodes، ساب‌بیس گرم و فلو داستانی عمیق',
    icon: Mic,
    color: 'from-amber-500/20 to-orange-500/20 text-amber-400 border-amber-500/40',
  },
  {
    id: 'trap_drill',
    label: 'ترپ و دریل دارک مدرن (Dark Trap & Drill)',
    short: 'ترپ و دریل دارک',
    desc: 'دریل بریتانیایی/ایرانی با های‌هت‌های تریپلت، اسلاید ۸۰۸، گیتار دارک و فلو تند',
    icon: Flame,
    color: 'from-red-500/20 to-rose-500/20 text-rose-400 border-rose-500/40',
  },
  {
    id: 'melodic_cloud_rap',
    label: 'رپ ملودیک و کلاود (Melodic Cloud Rap)',
    short: 'رپ ملودیک و کلاود',
    desc: 'آرپژ گیتار نایلون، سینت‌های پد ابری، اتوتیون عاطفی و هوک دلنشین',
    icon: Heart,
    color: 'from-cyan-500/20 to-blue-500/20 text-cyan-400 border-cyan-500/40',
  },
  {
    id: 'oriental_fusion_rap',
    label: 'رپ فیوژن شرقی با ساز سنتی (Oriental Fusion Rap)',
    short: 'رپ فیوژن با سه‌تار و تار',
    desc: 'تلفیق سه‌تار، تار و کمانچه اصیل ایرانی با درامز سنگین هیپ‌هاپ و بیس حجیم',
    icon: Sparkles,
    color: 'from-emerald-500/20 to-teal-500/20 text-emerald-400 border-emerald-500/40',
  },
  {
    id: 'hardcore_rap',
    label: 'رپ هاردکور خیابانی (Hardcore Street Rap)',
    short: 'رپ هاردکور خیابانی',
    desc: 'بیس فوق‌سنگین دیستورت، انرژی اعتراضی انفجاری، ریف‌های الکتریک و دلیوری تند',
    icon: Flame,
    color: 'from-orange-600/20 to-red-600/20 text-orange-400 border-orange-500/40',
  },
  {
    id: 'g_funk_rap',
    label: 'رپ جی‌فانک و وست‌کوست (West Coast G-Funk)',
    short: 'جی‌فانک و وست‌کوست',
    desc: 'سینت لید جیغی Moog، بیس گانگستری نرم و رقصان، کِلَپ و هوک خاطره‌انگیز',
    icon: Radio,
    color: 'from-yellow-500/20 to-amber-500/20 text-yellow-400 border-yellow-500/40',
  },
  {
    id: 'lofi_jazz_rap',
    label: 'رپ لو-فای و جز-هاپ (Lo-Fi Jazz Rap)',
    short: 'لو-فای و جز-هاپ',
    desc: 'پیانو جَز ملو، ریتم سوئینگ شبانه، کنترباس آکوستیک، باران و خش خش وینیل',
    icon: Coffee,
    color: 'from-amber-600/20 to-stone-600/20 text-amber-300 border-amber-600/40',
  },
  {
    id: 'pop',
    label: 'پاپ مدرن و رادیویی (Modern Pop)',
    short: 'پاپ مدرن',
    desc: 'ملودی‌های جذاب، هوک گیرا، درامز مدرن و پروداکشن پولیش‌شده',
    icon: Radio,
    color: 'from-pink-500/20 to-purple-500/20 text-pink-400 border-pink-500/40',
  },
  {
    id: 'sonati',
    label: 'سنتی و دستگاهی اصیل (Traditional Sonati)',
    short: 'سنتی اصیل',
    desc: 'دستگاه‌های شور، همایون، اصفهان با تار، سه‌تار، نی، تنبک و تحریر',
    icon: Sparkles,
    color: 'from-emerald-500/20 to-teal-500/20 text-emerald-400 border-emerald-500/40',
  },
  {
    id: 'rock',
    label: 'راک و متال (Rock & Metal)',
    short: 'راک و متال',
    desc: 'گیتار الکتریک دیستورشن، درامز زنده، سولو آتشین و بیس کوبنده',
    icon: Disc,
    color: 'from-red-600/20 to-purple-600/20 text-red-400 border-red-500/40',
  },
  {
    id: 'electronic',
    label: 'الکترونیک، هاوس و تکنو (EDM & House)',
    short: 'الکترونیک و کلاب',
    desc: 'ملودیک تکنو، پروگرسیو هاوس، بیس پامپینگ، بیلدآپ و دراپ انفجاری',
    icon: Gauge,
    color: 'from-cyan-500/20 to-blue-500/20 text-cyan-400 border-cyan-500/40',
  },
  {
    id: 'rnb_soul',
    label: 'آر اند بی و نئو سول (R&B & Neo-Soul)',
    short: 'آر اند بی و سول',
    desc: 'پیانو الکتریک فندر رودز، ساکسوفون مخملی، بیس گرم و فضای شبانه',
    icon: Heart,
    color: 'from-violet-500/20 to-indigo-500/20 text-violet-400 border-violet-500/40',
  },
  {
    id: 'epic_orchestral',
    label: 'حماسی و سینمایی سمفونیک (Cinematic Epic)',
    short: 'حماسی و سینمایی',
    desc: 'ارکستر سمفونیک ۹۰ نفره، طبل‌های جنگی، کُرال باشکوه و شیپورهای پیروزی',
    icon: Shield,
    color: 'from-yellow-500/20 to-amber-500/20 text-yellow-400 border-yellow-500/40',
  },
  {
    id: 'folk_regional',
    label: 'فولکلور و موسیقی نواحی (Folkloric & Regional)',
    short: 'فولکلور و نواحی',
    desc: 'بندری شاد ۶/۸، لری، کردی پرشور، گیلکی بارانی و آذری',
    icon: Compass,
    color: 'from-green-500/20 to-lime-500/20 text-lime-400 border-lime-500/40',
  },
  {
    id: 'fusion',
    label: 'تلفیقی و فیوژن جهانی (World & Fusion)',
    short: 'تلفیقی و فیوژن',
    desc: 'پیوند سازهای غربی و شرقی، تار الکتریک با درامز و کرال چندزبانه',
    icon: Layers,
    color: 'from-indigo-500/20 to-cyan-500/20 text-indigo-400 border-indigo-500/40',
  },
];

// 2. SONG STRUCTURES
export const SONG_TYPE_OPTIONS = [
  { id: 'storytelling_epic', label: 'شاهکار روایی داستانی ۴ پرده‌ای (Four-Act Narrative Storytelling: Prologue, Rising Tension, Climax, Resolution)', short: 'روایی داستانی ۴ پرده‌ای' },
  { id: 'full_song', label: 'ترانه کامل با ورس، کورس و بریج (Full Song: Verse-Chorus-Bridge)', short: 'ترانه کامل استاندارد' },
  { id: 'rap_storytelling', label: 'رپ داستانی سناریومحور ۳۲ باری (Narrative Storytelling Rap / 32 Bars Cinematic)', short: 'رپ داستانی سناریومحور' },
  { id: 'rap_bars', label: 'تکست رپ چند ورس با هوک و پانچ‌لاین (Rap Bars & Catchy Hook)', short: 'تکست رپ با هوک' },
  { id: 'drill_sliding', label: 'دریل دارک با ساختار دراپ و اینترلود (Dark Drill: Gliding Bass, Triplets & Fast Hook)', short: 'دریل دارک با اسلاید' },
  { id: 'ghazal_tasnif', label: 'غزل، تصنیف و آواز دستگاهی (Ghazal & Traditional Tasnif)', short: 'تصنیف و آواز سنتی' },
  { id: 'chahar_pareh', label: 'چهارپاره نوین ادبی با تمپوی ملودیک (Modern Persian Chahar-Pareh Cycle)', short: 'چهارپاره نوین ادبی' },
  { id: 'sheer_nou_nimai', label: 'شعر نو نیمایی آهنگین با ریتم آزاد (Nimai Modern Poetry with Free Melodic Cadence)', short: 'شعر نو نیمایی آهنگین' },
  { id: 'rnb_slow_jam', label: 'اسلو جم و آر اند بی با آترو و بداهه‌خوانی (R&B Slow Jam with Vocal Ad-libs & Outro Fade)', short: 'اسلو جم آر اند بی' },
  { id: 'rock_anthem_solo', label: 'راک ارکسترال با سولو گیتار الکتریک و اوج حماسی (Rock Anthem with Shredding Guitar Solo)', short: 'راک آنتم با سولو گیتار' },
  { id: 'ballad_crescendo', label: 'بالاد احساسی با کرشندو و اوج ارکسترال (Cinematic Crescendo Ballad)', short: 'بالاد با کرشندو' },
  { id: 'anthem_march', label: 'سرود ملی و مارش باشکوه حماسی (National Anthem & March)', short: 'سرود ملی و مارش' },
  { id: 'club_dance_drop', label: 'ترک پارتی با دراپ الکترونیک (Dance Track & Drop)', short: 'پارتی با دراپ' },
  { id: 'party_bandari_6_8', label: 'قطعه شاد پایکوبی ۶/۸ با کسر و نی‌انبان (Festive 6/8 Folkloric Dance with Drop)', short: 'شاد ۶/۸ پایکوبی نواحی' },
  { id: 'acoustic_unplugged', label: 'آکوستیک آنپلاگد صمیمی گیتار/پیانو (Intimate Acoustic Unplugged & Spoken Word)', short: 'آکوستیک آنپلاگد صمیمی' },
  { id: 'diss_protest', label: 'دیس ترک و تکست اعتراضی طوفانی (Diss Track / Protest)', short: 'دیس ترک / اعتراضی' },
  { id: 'short_viral', label: 'ترانه کوتاه با هوک ویرال (Short Viral Hook)', short: 'هوک کوتاه ویرال' },
];

// 3. TEMPO / BPM
export const TEMPO_OPTIONS = [
  { id: 'auto', label: 'خودکار بر اساس سبک (Auto by Genre)', short: 'خودکار با سبک' },
  { id: 'slow', label: 'آرام و اسلو (65-85 BPM)', short: 'آرام (65-85 BPM)' },
  { id: 'mid', label: 'متوسط و ریتمیک (90-115 BPM)', short: 'متوسط (90-115 BPM)' },
  { id: 'fast', label: 'تند و پرحرارت (120-145+ BPM)', short: 'تند (120-145+ BPM)' },
];

// 4. MOOD OPTIONS
export const MOOD_OPTIONS = [
  { id: 'حماسی', label: 'حماسی و ملی میهنی (Epic & Patriotic)', short: 'حماسی و ملی' },
  { id: 'اعتراضی', label: 'اعتراضی، دارک و خیابانی (Protest & Street Gritty)', short: 'اعتراضی و خیابانی' },
  { id: 'اگزیستانسیال', label: 'عمیق، فلسفی و اگزیستانسیال (Existential & Thought-Provoking)', short: 'فلسفی و اگزیستانسیال' },
  { id: 'دلتنگی_غربت', label: 'دلتنگی، غم پاییزی و غربت (Nostalgic Heartache & Autumn Melancholy)', short: 'دلتنگی و غربت پاییزی' },
  { id: 'عصیانگر', label: 'خشمگین، پرحرارت و عصیان‌گر (Aggressive, Fiery Anger & Moshpit)', short: 'خشمگین و عصیان‌گر' },
  { id: 'احساسی', label: 'احساسی، پرشور و عاشقانه پاک (Romantic, Passionate & Devoted)', short: 'عاشقانه و پرشور' },
  { id: 'شاد', label: 'شاد و ریتمیک (جشن، عروسی و پایکوبی)', short: 'شاد و پایکوبی' },
  { id: 'غمگین', label: 'غمگین، دل‌شکسته و اشکبار (Deep Melancholic & Heartbroken)', short: 'غمگین و دل‌شکسته' },
  { id: 'انگیزشی', label: 'انگیزشی، تسخیرناپذیر و پیروز (Triumphant & Unstoppable Motivation)', short: 'انگیزشی و تسخیرناپذیر' },
  { id: 'عرفانی', label: 'عرفانی، صوفیانه و کیهانی (Mystical, Transcendental & Cosmic)', short: 'عرفانی و کیهانی' },
  { id: 'نوستالژیک', label: 'نوستالژیک و خاطره‌انگیز دهه ۵۰ و ۶۰ (Retro Golden Era Nostalgia)', short: 'نوستالژیک دهه ۵۰ و ۶۰' },
  { id: 'تعلیق_سینمایی', label: 'دلهره‌آور، سینمایی و تعلیق‌برانگیز (Cinematic Thriller & Suspenseful)', short: 'دلهره‌آور و تعلیق' },
  { id: 'سوررئال', label: 'سوررئال، رویاگونه و اثیری (Dreamy, Psychedelic & Surreal Ethereal)', short: 'سوررئال و رویاگونه' },
  { id: 'آرامش‌بخش', label: 'آرامش‌بخش، ملو و شبانه (Nocturnal Chill, Mellow & Ambient Peace)', short: 'آرامش‌بخش و شبانه' },
];

// 5. VOCALS
export const VOCAL_OPTIONS = [
  { id: 'مرد', label: 'با صدای مرد (Male Solo)', short: 'صدای مرد' },
  { id: 'زن', label: 'با صدای زن (Female Solo)', short: 'صدای زن' },
  { id: 'زن و مرد', label: 'دو صدایی زن و مرد (Duet)', short: 'زن و مرد (دو صدایی)' },
];

// 6. LANGUAGES
export const DEFAULT_LANGUAGES = [
  'فارسی',
  'لری',
  'کردی',
  'گیلکی',
  'ترکی',
  'انگلیسی',
  'بلوچی',
  'مازندرانی',
  'عربی',
  'فرانسوی',
];

// 7. DIVERSE QUICK PROMPTS COVERING ALL GENRES
export const QUICK_PROMPTS = [
  {
    title: 'تکست رپ اعتراضی و خیابانی (بیس ۸۰۸ سنگین)',
    genre: 'رپ و هیپ‌هاپ (Rap & Hip-Hop)',
    songType: 'تکست رپ چند ورس با هوک و پانچ‌لاین (Rap Bars & Catchy Hook)',
    prompt:
      'یک تکست رپ اعتراضی خیابانی با فلو تند، قافیه‌های چندسیلابی پیوسته، بیت بوم‌بپ سنگین و بیس ۸۰۸ درباره خروش نسل جوان، بیداری و ایستادگی با صدای مرد بنویس',
    vocal: 'با صدای مرد (Male Solo)',
    mood: 'اعتراضی، دارک و خیابانی (Protest & Street Gritty)',
    tempo: 'متوسط و ریتمیک (90-115 BPM)',
    languages: ['فارسی'],
  },
  {
    title: 'راک آلترناتیو آتشین با گیتار الکتریک و درامز',
    genre: 'راک و متال (Rock & Metal)',
    songType: 'ترانه کامل با ورس، کورس و بریج (Full Song: Verse-Chorus-Bridge)',
    prompt:
      'یک ترانه راک آلترناتیو آتشین و پرانرژی با ریف‌های سنگین گیتار الکتریک دیستورشن، سولو کوبنده و درامز زنده درباره شکستن قفس و فریاد رهایی بنویس',
    vocal: 'با صدای مرد (Male Solo)',
    mood: 'انگیزشی و پرانرژی (Hype & Motivational)',
    tempo: 'تند و پرحرارت (120-145+ BPM)',
    languages: ['فارسی'],
  },
  {
    title: 'تصنیف اصیل سنتی در دستگاه شور با سه‌تار و دف',
    genre: 'سنتی و دستگاهی اصیل (Traditional Sonati)',
    songType: 'غزل، تصنیف و آواز دستگاهی (Ghazal & Traditional Tasnif)',
    prompt:
      'یک تصنیف عارفانه و پرشور سنتی در دستگاه شور و گوشه حجاز با نوای سه‌تار، نی، تنبک و دف و تحریرهای اصیل آوازی بنویس',
    vocal: 'با صدای زن (Female Solo)',
    mood: 'عرفانی و صوفیانه (Mystical & Spiritual)',
    tempo: 'آرام و اسلو (65-85 BPM)',
    languages: ['فارسی'],
  },
  {
    title: 'سرود حماسی آزادی ایران و بازگشت شیر و خورشید',
    genre: 'حماسی و سینمایی سمفونیک (Cinematic Epic)',
    songType: 'سرود ملی و مارش باشکوه حماسی (National Anthem & March)',
    prompt:
      'یک سرود حماسی ملی میهنی در مورد آزادی ایران از دست دولت ستمگر، بازگشت شاه به وطن و انقلاب شیر و خورشید با صدای مرد و کر ارکسترال بنویس',
    vocal: 'با صدای مرد (Male Solo)',
    mood: 'حماسی و ملی میهنی (Epic & Patriotic)',
    tempo: 'تند و پرحرارت (120-145+ BPM)',
    languages: ['فارسی'],
  },
  {
    title: 'ترک دریل دارک مدرن با اسلاید ۸۰۸ و گیتار',
    genre: 'ترپ و دریل دارک (Dark Trap & Drill)',
    songType: 'تکست رپ چند ورس با هوک و پانچ‌لاین (Rap Bars & Catchy Hook)',
    prompt:
      'یک ترک دریل دارک مدرن با گیتار سمپل غمگین، های‌هت‌های تریپلت فوق‌سریع و اسلاید ۸۰۸ درباره واقعیت‌های تلخ شب‌های شهر بنویس',
    vocal: 'با صدای مرد (Male Solo)',
    mood: 'اعتراضی، دارک و خیابانی (Protest & Street Gritty)',
    tempo: 'تند و پرحرارت (120-145+ BPM)',
    languages: ['فارسی'],
  },
  {
    title: 'ترانه شاد ۶/۸ بندری با نی‌انبان و دمام جنوب',
    genre: 'فولکلور و موسیقی نواحی (Folkloric & Regional)',
    songType: 'ترک پارتی با دراپ الکترونیک (Dance Track & Drop)',
    prompt:
      'یک ترانه شاد پرانرژی ۶/۸ بندری با نوای اصیل نی‌انبان، دمام، کسر و دست‌افشانی پرشور لب دریا و جشن عروسی بنویس',
    vocal: 'دو صدایی زن و مرد (Duet)',
    mood: 'شاد و ریتمیک (جشن، عروسی و رقص)',
    tempo: 'تند و پرحرارت (120-145+ BPM)',
    languages: ['فارسی'],
  },
  {
    title: 'آر اند بی و نئو سول مخملی با ساکسوفون شبانه',
    genre: 'آر اند بی و نئو سول (R&B & Neo-Soul)',
    songType: 'بالاد احساسی و ملودیک (Emotional Melodic Ballad)',
    prompt:
      'یک ترانه آرام و مخملی R&B نئو سول شبانه با صدای پیانو الکتریک فندر رودز و ساکسوفون در هوای باران پاییزی بنویس',
    vocal: 'با صدای زن (Female Solo)',
    mood: 'احساسی و عاشقانه (Romantic & Emotional)',
    tempo: 'آرام و اسلو (65-85 BPM)',
    languages: ['فارسی'],
  },
  {
    title: 'ملودیک هاوس و کلاب دنس با دراپ الکترونیک',
    genre: 'الکترونیک، هاوس و تکنو (EDM & House)',
    songType: 'ترک پارتی با دراپ الکترونیک (Dance Track & Drop)',
    prompt:
      'یک موزیک الکترونیک پروگرسیو هاوس با آرپژهای آنالوگ، خط بیس پامپینگ و دراپ پرحرارت کلاب برای اوج پایکوبی بنویس',
    vocal: 'با صدای مرد (Male Solo)',
    mood: 'شاد و ریتمیک (جشن، عروسی و رقص)',
    tempo: 'تند و پرحرارت (120-145+ BPM)',
    languages: ['فارسی'],
  },
  {
    title: 'ترانه چندزبانه اقوام: فارسی + کردی + لری + گیلکی',
    genre: 'تلفیقی و فیوژن جهانی (World & Fusion)',
    songType: 'ترانه کامل با ورس، کورس و بریج (Full Song: Verse-Chorus-Bridge)',
    prompt:
      'یک ترانه چندزبانه حماسی و شورانگیز با ترکیب زبان‌های فارسی، کردی، لری و گیلکی در وصف همبستگی، عشق به وطن و رهایی بنویس',
    vocal: 'دو صدایی زن و مرد (Duet)',
    mood: 'حماسی و ملی میهنی (Epic & Patriotic)',
    tempo: 'متوسط و ریتمیک (90-115 BPM)',
    languages: ['فارسی', 'کردی', 'لری', 'گیلکی'],
  },
];

const API_BASE_STORAGE = 'taraneh_api_base_url';

function apiUrl(path: string): string {
  const base = (localStorage.getItem(API_BASE_STORAGE) || '').trim().replace(/\/$/, '');
  return base ? base + path : path;
}

export default function App() {
  const [sessions, setSessions] = useState<ChatSession[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // Fallback
    }
    return [
      {
        id: 'session-default',
        title: 'استودیو ترانه‌سرایی حرفه‌ای',
        subtitle: 'آماده دریافت سفارش در سبک‌های مختلف',
        updatedAt: 'همین الان',
        messages: [],
      },
    ];
  });

  const [activeSessionId, setActiveSessionId] = useState<string>(() => {
    return sessions[0]?.id || 'session-default';
  });

  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [inputText, setInputText] = useState<string>('');

  // Song Parameters State
  const [selectedGenre, setSelectedGenre] = useState<string>(GENRE_OPTIONS[0].label);
  const [selectedSongType, setSelectedSongType] = useState<string>(SONG_TYPE_OPTIONS[0].label);
  const [selectedTempo, setSelectedTempo] = useState<string>(TEMPO_OPTIONS[0].label);
  const [selectedVocal, setSelectedVocal] = useState<string>(VOCAL_OPTIONS[0].label);
  const [selectedMood, setSelectedMood] = useState<string>(MOOD_OPTIONS[0].label);

  // Multi-language state
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(['فارسی']);
  const [availableLanguages, setAvailableLanguages] = useState<string[]>(DEFAULT_LANGUAGES);
  const [customLangInput, setCustomLangInput] = useState<string>('');
  const [showAddCustomLang, setShowAddCustomLang] = useState<boolean>(false);

  // Active Option Tab in Settings Panel
  const [activeOptionTab, setActiveOptionTab] = useState<'genre' | 'structure' | 'tempo' | 'mood' | 'vocal' | 'lang'>('genre');

  // OpenRouter Unified AI Key & Model State (تنها یک کلید برای اوپن‌روتر و یک کادر برای نام مدل)
  const [openrouterApiKey, setOpenrouterApiKey] = useState<string>(() => {
    return localStorage.getItem(OPENROUTER_KEY_STORAGE) || '';
  });

  const [openrouterModel, setOpenrouterModel] = useState<string>(() => {
    return localStorage.getItem(OPENROUTER_MODEL_STORAGE) || 'deepseek/deepseek-r1:free';
  });

  const [groqApiKey, setGroqApiKey] = useState<string>(() => localStorage.getItem(GROQ_KEY_STORAGE) || '');
  const [cloudflareApiToken, setCloudflareApiToken] = useState<string>(() => localStorage.getItem(CLOUDFLARE_KEY_STORAGE) || '');
  const [cloudflareAccountId, setCloudflareAccountId] = useState<string>(() => localStorage.getItem(CLOUDFLARE_ACCOUNT_STORAGE) || '');
  const [cloudflareModel, setCloudflareModel] = useState<string>(() => localStorage.getItem(CLOUDFLARE_MODEL_STORAGE) || 'meta/muse-spark-open');

  const [showKeyModal, setShowKeyModal] = useState<boolean>(false);
  const [testingOpenRouter, setTestingOpenRouter] = useState<boolean>(false);
  const [keyTestStatus, setKeyTestStatus] = useState<{ success: boolean; message: string } | null>(null);
  const [keySaveMessage, setKeySaveMessage] = useState<string>('');

  // Saved Songs History & Archive State (accessible from 3-bar Drawer menu)
  const [savedSongs, setSavedSongs] = useState<SavedSong[]>(() => {
    try {
      const saved = localStorage.getItem(SAVED_SONGS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // Fallback
    }
    return [];
  });
  const [drawerTab, setDrawerTab] = useState<'sessions' | 'history'>('sessions');
  const [historySearch, setHistorySearch] = useState<string>('');
  const [selectedHistorySong, setSelectedHistorySong] = useState<SavedSong | null>(null);

  // Manual Lyric / Song Editing Modal State (ویرایش ترانه توسط مخاطب)
  const [manualEditState, setManualEditState] = useState<{
    isOpen: boolean;
    messageId: string;
    originalSong: SongGenerationResult;
    title: string;
    lyrics: string;
    musicPrompt: string;
    composerNote: string;
    isAuditing: boolean;
    auditResult?: SongQualityAudit;
  } | null>(null);

  // AI Song Revision / Editing Modal State (ویرایش ترانه توسط هوش مصنوعی)
  const [aiEditState, setAiEditState] = useState<{
    isOpen: boolean;
    messageId: string;
    song: SongGenerationResult;
    instruction: string;
    isSubmitting: boolean;
    error?: string;
  } | null>(null);

  const [showOptionsBar, setShowOptionsBar] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [copiedMap, setCopiedMap] = useState<{ [key: string]: boolean }>({});

  // Auto-retry Notification State (وضعیت بازتلاش خودکار با مدل پایدار جایگزین)
  const [retryNotification, setRetryNotification] = useState<string | null>(null);

  // Smart Rhyme Assistant State for Manual Lyric Editing (دستیار قافیه هوشمند داستانی)
  const [rhymeAssistant, setRhymeAssistant] = useState<{
    targetWord: string;
    isLoading: boolean;
    suggestions: Array<{ rhyme: string; meaning: string; sampleLine: string }>;
    error?: string;
    customInput: string;
  }>({
    targetWord: '',
    isLoading: false,
    suggestions: [],
    customInput: '',
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
    } catch {
      // Ignore
    }
  }, [sessions]);

  useEffect(() => {
    try {
      localStorage.setItem(SAVED_SONGS_KEY, JSON.stringify(savedSongs));
    } catch {
      // Ignore
    }
  }, [savedSongs]);

  useEffect(() => {
    try {
      localStorage.setItem(OPENROUTER_KEY_STORAGE, openrouterApiKey);
      localStorage.setItem(OPENROUTER_MODEL_STORAGE, openrouterModel);
    } catch {
      // Ignore
    }
  }, [openrouterApiKey, openrouterModel]);

  useEffect(() => {
    try {
      localStorage.setItem(GROQ_KEY_STORAGE, groqApiKey);
      localStorage.setItem(CLOUDFLARE_KEY_STORAGE, cloudflareApiToken);
      localStorage.setItem(CLOUDFLARE_ACCOUNT_STORAGE, cloudflareAccountId);
      localStorage.setItem(CLOUDFLARE_MODEL_STORAGE, cloudflareModel);
    } catch {
      // Ignore storage errors; never log API credentials.
    }
  }, [groqApiKey, cloudflareApiToken, cloudflareAccountId, cloudflareModel]);

  const activeSession =
    sessions.find((s) => s.id === activeSessionId) || sessions[0];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeSession?.messages, isLoading]);

  // Automatically save or bookmark song into persistent History archive
  const saveSongToHistory = (
    song: SongGenerationResult,
    source?: string,
    actionTrigger: 'copy_lyrics' | 'copy_prompt' | 'download' | 'manual' = 'manual'
  ) => {
    setSavedSongs((prev) => {
      // Check if song with identical title and lyrics already exists
      const existingIndex = prev.findIndex(
        (s) => s.title === song.title && s.songResult.lyrics === song.lyrics
      );
      const timeStr = new Date().toLocaleDateString('fa-IR', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });

      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          savedAt: timeStr,
          actionTrigger,
        };
        return updated;
      }

      const newEntry: SavedSong = {
        id: `saved-song-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        title: song.title || 'ترانه بدون عنوان',
        songResult: song,
        savedAt: timeStr,
        source: source || 'openrouter',
        actionTrigger,
      };
      return [newEntry, ...prev];
    });
  };

  const copyToClipboard = (text: string, id: string, songToSave?: SongGenerationResult, isPrompt?: boolean) => {
    navigator.clipboard.writeText(text);
    setCopiedMap((prev) => ({ ...prev, [id]: true }));
    if (songToSave) {
      saveSongToHistory(songToSave, undefined, isPrompt ? 'copy_prompt' : 'copy_lyrics');
    }
    setTimeout(() => {
      setCopiedMap((prev) => ({ ...prev, [id]: false }));
    }, 2500);
  };

  const handleSaveOpenRouterConfig = (keyInput?: string, modelInput?: string) => {
    const k = (keyInput !== undefined ? keyInput : openrouterApiKey).trim();
    const m = (modelInput !== undefined ? modelInput : openrouterModel).trim() || 'deepseek/deepseek-r1:free';
    setOpenrouterApiKey(k);
    setOpenrouterModel(m);
    localStorage.setItem(OPENROUTER_KEY_STORAGE, k);
    localStorage.setItem(OPENROUTER_MODEL_STORAGE, m);
    setKeySaveMessage('کلید و مدل هوش مصنوعی با موفقیت در مرورگر ذخیره شدند.');
    setTimeout(() => setKeySaveMessage(''), 3500);
  };

  const handleClearOpenRouterKey = () => {
    setOpenrouterApiKey('');
    localStorage.removeItem(OPENROUTER_KEY_STORAGE);
    setKeyTestStatus(null);
    setKeySaveMessage('کلید با موفقیت حذف گردید.');
    setTimeout(() => setKeySaveMessage(''), 3500);
  };

  const handleTestOpenRouterKey = async (overrideKey?: string, overrideModel?: string) => {
    const k = (overrideKey !== undefined ? overrideKey : openrouterApiKey).trim();
    const m = (overrideModel !== undefined ? overrideModel : openrouterModel).trim() || 'deepseek/deepseek-r1:free';

    if (!k) {
      setKeyTestStatus({
        success: false,
        message: 'لطفاً ابتدا کلید API اوپن‌روتر خود را در کادر وارد نمایید.',
      });
      return;
    }

    setTestingOpenRouter(true);
    setKeyTestStatus(null);

    try {
      const resp = await fetch(apiUrl('/api/test-key'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider: 'openrouter',
          apiKey: k,
          model: m,
        }),
      });
      const data = await resp.json();
      setKeyTestStatus({
        success: !!data.valid,
        message: data.message || (data.valid ? 'کلید با موفقیت متصل شد.' : 'خطا در اعتبارسنجی کلید.'),
      });
    } catch (e: any) {
      setKeyTestStatus({
        success: false,
        message: `خطای اتصال به سرور: ${e?.message || 'خطای شبکه'}`,
      });
    } finally {
      setTestingOpenRouter(false);
    }
  };

  const handleDownloadSong = (song: SongGenerationResult) => {
    const fileContent = `=====================================================
${song.title}
سبک موسیقی: ${song.genre || 'مشخص شده'}
ساختار ترانه: ${song.songType || 'ترانه کامل'}
زبان: ${song.language} | خواننده: ${song.vocalType} | حس: ${song.mood}
وزن عروضی / هجایی: ${song.poeticMeter}
طرح قافیه: ${song.rhymeScheme}
=====================================================

[SUNO AI - STYLE OF MUSIC PROMPT]
${song.musicPrompt}

[TEMPO & KEY]
${song.tempoAndKey}

[INSTRUMENTATION]
${song.instrumentation}

[EXCLUDE STYLES]
${song.excludeStyles}

=====================================================
[متن ترانه همراه با تگ‌های انگلیسی سونو]
=====================================================
${song.lyrics}

=====================================================
توضیحات آهنگساز و شاعر:
${song.composerNote}
آفریده شده در استودیو هوشمند ترانه سرای فرخزاد
=====================================================`;

    saveSongToHistory(song, undefined, 'download');

    const blob = new Blob([fileContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${song.title.replace(/[\\/:*?"<>|]/g, '_')}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleToggleLanguage = (lang: string) => {
    if (selectedLanguages.includes(lang)) {
      if (selectedLanguages.length > 1) {
        setSelectedLanguages(selectedLanguages.filter((l) => l !== lang));
      }
    } else {
      setSelectedLanguages([...selectedLanguages, lang]);
    }
  };

  const handleAddCustomLanguage = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = customLangInput.trim();
    if (!trimmed) return;
    if (!availableLanguages.includes(trimmed)) {
      setAvailableLanguages([...availableLanguages, trimmed]);
    }
    if (!selectedLanguages.includes(trimmed)) {
      setSelectedLanguages([...selectedLanguages, trimmed]);
    }
    setCustomLangInput('');
    setShowAddCustomLang(false);
  };

  const handleStartNewChat = () => {
    const newId = `session-${Date.now()}`;
    const newSession: ChatSession = {
      id: newId,
      title: 'گفتگوی جدید و ترانه تازه',
      subtitle: `${selectedGenre.split('(')[0]} · ${selectedVocal.split('(')[0]}`,
      updatedAt: 'همین الان',
      messages: [],
    };
    setSessions((prev) => [newSession, ...prev]);
    setActiveSessionId(newId);
    setInputText('');
    setIsDrawerOpen(false);
  };

  const handleDeleteSession = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const remaining = sessions.filter((s) => s.id !== id);
    if (remaining.length === 0) {
      const resetSession: ChatSession = {
        id: `session-${Date.now()}`,
        title: 'گفتگوی جدید',
        subtitle: 'ترانه جدید',
        updatedAt: 'همین الان',
        messages: [],
      };
      setSessions([resetSession]);
      setActiveSessionId(resetSession.id);
    } else {
      setSessions(remaining);
      if (activeSessionId === id) {
        setActiveSessionId(remaining[0].id);
      }
    }
  };

  // Manual Editing Handlers (ویرایش مستقیم توسط مخاطب)
  const handleOpenManualEdit = (messageId: string, song: SongGenerationResult) => {
    setManualEditState({
      isOpen: true,
      messageId,
      originalSong: song,
      title: song.title,
      lyrics: song.lyrics,
      musicPrompt: song.musicPrompt,
      composerNote: song.composerNote,
      isAuditing: false,
      auditResult: song.qualityAudit,
    });
    setRhymeAssistant({
      targetWord: '',
      isLoading: false,
      suggestions: [],
      error: undefined,
      customInput: '',
    });
  };

  const handleFetchRhymes = async (targetWord: string, contextLine?: string) => {
    const clean = targetWord.replace(/[،.؛:!؟?«»"'\n\r\(\)\[\]]+/g, '').trim();
    if (!clean || clean.length < 2) return;

    setRhymeAssistant((prev) => ({
      ...prev,
      targetWord: clean,
      isLoading: true,
      error: undefined,
    }));

    try {
      const res = await fetch(apiUrl('/api/rhyme-assistant'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          word: clean,
          contextLine: contextLine || '',
          lyrics: manualEditState?.lyrics || '',
          genre: manualEditState?.originalSong.genre || selectedGenre,
          storyTheme: manualEditState?.title || selectedMood,
          openrouterApiKey: openrouterApiKey.trim(),
          openrouterModel: openrouterModel.trim(),
        }),
      });
      const data = await res.json();
      if (data.suggestions && data.suggestions.length > 0) {
        setRhymeAssistant((prev) => ({
          ...prev,
          targetWord: clean,
          isLoading: false,
          suggestions: data.suggestions,
          error: undefined,
        }));
      } else {
        setRhymeAssistant((prev) => ({
          ...prev,
          targetWord: clean,
          isLoading: false,
          suggestions: [],
          error: data.error || 'قافیه‌ای برای این واژه یافت نشد.',
        }));
      }
    } catch {
      setRhymeAssistant((prev) => ({
        ...prev,
        targetWord: clean,
        isLoading: false,
        suggestions: [],
        error: 'خطا در ارتباط با سرور دستیار قافیه.',
      }));
    }
  };

  const handleApplyRhymeToLyrics = (rhymeWord: string) => {
    if (!manualEditState) return;
    const wordToReplace = rhymeAssistant.targetWord;
    const current = manualEditState.lyrics;

    if (wordToReplace && current.includes(wordToReplace)) {
      // Replace the last occurrence or occurrences
      const updated = current.split(wordToReplace).join(rhymeWord);
      setManualEditState((prev) => (prev ? { ...prev, lyrics: updated } : null));
    } else {
      setManualEditState((prev) => (prev ? { ...prev, lyrics: `${current}\n${rhymeWord}` } : null));
    }
  };

  const handleAuditManualEdit = async () => {
    if (!manualEditState) return;
    setManualEditState((prev) => (prev ? { ...prev, isAuditing: true } : null));
    try {
      const res = await fetch(apiUrl('/api/audit-song'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lyrics: manualEditState.lyrics,
          genre: manualEditState.originalSong.genre || '',
          prompt: manualEditState.title,
        }),
      });
      const data = await res.json();
      if (data.audit) {
        setManualEditState((prev) =>
          prev ? { ...prev, auditResult: data.audit, isAuditing: false } : null
        );
      } else {
        setManualEditState((prev) => (prev ? { ...prev, isAuditing: false } : null));
      }
    } catch {
      setManualEditState((prev) => (prev ? { ...prev, isAuditing: false } : null));
    }
  };

  const handleSaveManualEdit = () => {
    if (!manualEditState) return;
    const updatedSong: SongGenerationResult = {
      ...manualEditState.originalSong,
      title: manualEditState.title.trim() || manualEditState.originalSong.title,
      lyrics: manualEditState.lyrics.trim(),
      musicPrompt: manualEditState.musicPrompt.trim(),
      composerNote: manualEditState.composerNote.trim(),
      qualityAudit: manualEditState.auditResult || manualEditState.originalSong.qualityAudit,
    };

    setSessions((prev) =>
      prev.map((s) => ({
        ...s,
        messages: s.messages.map((m) =>
          m.id === manualEditState.messageId ? { ...m, songResult: updatedSong } : m
        ),
      }))
    );

    saveSongToHistory(updatedSong, undefined, 'manual');
    setManualEditState(null);
  };

  // AI Editing Handlers (ویرایش و بازبینی هوشمند توسط خود هوش مصنوعی)
  const handleOpenAiEdit = (messageId: string, song: SongGenerationResult) => {
    setAiEditState({
      isOpen: true,
      messageId,
      song,
      instruction: '',
      isSubmitting: false,
    });
  };

  const handleSubmitAiEdit = async (customInstruction?: string) => {
    if (!aiEditState) return;
    const instructionText = (customInstruction || aiEditState.instruction).trim();
    if (!instructionText) {
      setAiEditState((prev) =>
        prev ? { ...prev, error: 'لطفاً دستور یا درخواست ویرایش را مشخص کنید.' } : null
      );
      return;
    }

    setAiEditState((prev) =>
      prev ? { ...prev, isSubmitting: true, error: undefined } : null
    );

    try {
      const res = await fetch(apiUrl('/api/edit-song'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentSong: aiEditState.song,
          instruction: instructionText,
          provider: 'openrouter',
          openrouterApiKey: openrouterApiKey.trim(),
          openrouterModel: openrouterModel.trim() || 'deepseek/deepseek-r1:free',
          groqApiKey: groqApiKey.trim(),
          cloudflareApiToken: cloudflareApiToken.trim(),
          cloudflareAccountId: cloudflareAccountId.trim(),
          cloudflareModel: cloudflareModel.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        setAiEditState((prev) =>
          prev
            ? {
                ...prev,
                isSubmitting: false,
                error: data.error || 'خطا در ویرایش ترانه توسط هوش مصنوعی.',
              }
            : null
        );
        return;
      }

      if (data.result) {
        const revisedSong: SongGenerationResult = data.result;
        setSessions((prev) =>
          prev.map((s) => ({
            ...s,
            messages: s.messages.map((m) =>
              m.id === aiEditState.messageId
                ? { ...m, songResult: revisedSong, source: data.source || m.source }
                : m
            ),
          }))
        );

        saveSongToHistory(revisedSong, data.source || 'openrouter', 'manual');
        setAiEditState(null);
      }
    } catch (e: any) {
      setAiEditState((prev) =>
        prev
          ? {
              ...prev,
              isSubmitting: false,
              error: `عدم امکان ارتباط با سرور: ${e?.message || 'خطا'}`,
            }
          : null
      );
    }
  };

  const handleSendMessage = async (customPrompt?: string, customLangs?: string[]) => {
    const promptToSend = (customPrompt !== undefined ? customPrompt : inputText).trim();
    if (!promptToSend || isLoading) return;

    const langsToSend = customLangs || selectedLanguages;

    const timeString = new Date().toLocaleTimeString('fa-IR', {
      hour: '2-digit',
      minute: '2-digit',
    });

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      timestamp: timeString,
      text: promptToSend,
    };

    const updatedTitle =
      activeSession.messages.length === 0
        ? promptToSend.slice(0, 32) + (promptToSend.length > 32 ? '...' : '')
        : activeSession.title;

    const langSummary =
      langsToSend.length > 1
        ? `چندزبانه (${langsToSend.join(' + ')})`
        : langsToSend[0];

    const genreSummary = selectedGenre.split('(')[0].trim();

    setSessions((prev) =>
      prev.map((s) =>
        s.id === activeSession.id
          ? {
              ...s,
              title: updatedTitle,
              subtitle: `${genreSummary} · ${langSummary} · ${selectedVocal.split('(')[0]}`,
              updatedAt: 'همین الان',
              messages: [...s.messages, userMsg],
            }
          : s
      )
    );

    if (customPrompt === undefined) {
      setInputText('');
    }
    setIsLoading(true);

    const primaryModel = openrouterModel.trim() || 'meta-llama/llama-3.3-70b-instruct:free';
    const fallbackModel = primaryModel === 'meta-llama/llama-3.3-70b-instruct:free'
      ? 'google/gemma-2-9b-it:free'
      : 'meta-llama/llama-3.3-70b-instruct:free';

    const sendChatRequest = async (modelToUse: string) => {
      return await fetch(apiUrl('/api/chat'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: promptToSend,
          musicGenre: selectedGenre,
          songStructure: selectedSongType,
          tempoBpm: selectedTempo,
          vocalType: selectedVocal,
          mood: selectedMood,
          languages: langsToSend,
          language: langsToSend.join(' + '),
          provider: 'openrouter',
          openrouterApiKey: openrouterApiKey.trim(),
          openrouterModel: modelToUse,
          groqApiKey: groqApiKey.trim(),
          cloudflareApiToken: cloudflareApiToken.trim(),
          cloudflareAccountId: cloudflareAccountId.trim(),
          cloudflareModel: cloudflareModel.trim(),
          conversationHistory: activeSession.messages.slice(-6).map((m) => ({
            text: m.text || m.songResult?.title || '',
            role: m.sender === 'user' ? 'user' : 'model',
          })),
        }),
      });
    };

    let response: Response | null = null;
    let data: any = null;
    let usedModel = primaryModel;
    let isRetried = false;

    try {
      response = await sendChatRequest(primaryModel);
      data = await response.json().catch(() => ({}));

      // Check if primary call failed and automatic retry should trigger
      if (!response.ok || data.error) {
        console.warn(`[Auto-Retry] Primary model ${primaryModel} failed. Automatically retrying once with stable fallback model ${fallbackModel}...`);
        setRetryNotification(`اتصال با مدل اولیه (${primaryModel.split('/').pop()}) ناموفق بود؛ در حال تلاش مجدد خودکار با مدل پایدار جایگزین (${fallbackModel.split('/').pop()})...`);
        isRetried = true;
        usedModel = fallbackModel;

        await new Promise((r) => setTimeout(r, 1200));

        response = await sendChatRequest(fallbackModel);
        data = await response.json().catch(() => ({}));
      }
    } catch (err: any) {
      console.warn(`[Auto-Retry Catch] Primary model error: ${err?.message}. Retrying with ${fallbackModel}...`);
      setRetryNotification(`خطای اتصال با مدل اولیه؛ در حال بازتلاش خودکار با مدل پشتیبان (${fallbackModel.split('/').pop()})...`);
      isRetried = true;
      usedModel = fallbackModel;

      try {
        await new Promise((r) => setTimeout(r, 1200));
        response = await sendChatRequest(fallbackModel);
        data = await response.json().catch(() => ({}));
      } catch (err2: any) {
        setRetryNotification(null);
        const botErr: ChatMessage = {
          id: `bot-err-${Date.now()}`,
          sender: 'bot',
          timestamp: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
          error: `خطای شبکه در ارتباط با سرور: ${err2?.message || 'مشکل اتصال اینترنت'}`,
          failedProvider: 'openrouter',
        };

        setSessions((prev) =>
          prev.map((s) =>
            s.id === activeSession.id
              ? { ...s, messages: [...s.messages, botErr] }
              : s
          )
        );
        return;
      }
    } finally {
      setRetryNotification(null);
      setIsLoading(false);
    }

    if (!response || !response.ok || data?.error) {
      const errorMsg: ChatMessage = {
        id: `bot-err-${Date.now()}`,
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
        error: data?.error || 'خطا در ارتباط با سرویس هوش مصنوعی (حتی پس از تلاش مجدد با مدل پایدار جایگزین).',
        failedProvider: data?.provider || 'openrouter',
      };

      setSessions((prev) =>
        prev.map((s) =>
          s.id === activeSession.id
            ? {
                ...s,
                messages: [...s.messages, errorMsg],
              }
            : s
        )
      );
      return;
    }

    if (data.result) {
      const warningNote = isRetried
        ? `مدل اولیه به دلیل ترافیک بالا در دسترس نبود؛ سرایش با مدل پایدار جایگزین (${usedModel.split('/').pop()}) انجام شد.`
        : data.warning;

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
        songResult: data.result,
        source: data.source || `openrouter (${usedModel})`,
        warning: warningNote,
      };

      setSessions((prev) =>
        prev.map((s) =>
          s.id === activeSession.id
            ? {
                ...s,
                messages: [...s.messages, botMsg],
              }
            : s
        )
      );
    }
  };

  const handleSelectQuickPrompt = (qp: (typeof QUICK_PROMPTS)[0]) => {
    setSelectedGenre(qp.genre);
    setSelectedSongType(qp.songType);
    setSelectedVocal(qp.vocal);
    setSelectedMood(qp.mood);
    setSelectedTempo(qp.tempo);
    setSelectedLanguages(qp.languages);
    setInputText(qp.prompt);
    handleSendMessage(qp.prompt, qp.languages);
  };

  const getProviderBadge = (providerName: string) => {
    if (providerName.includes('openrouter')) {
      const modelPart = providerName.replace('openrouter', '').replace(/[()]/g, '').trim() || openrouterModel;
      const shortName = modelPart.split('/').pop() || modelPart;
      const isFree = modelPart.includes(':free');
      return {
        label: `OpenRouter (${shortName}${isFree ? ' · رایگان' : ''})`,
        short: isFree ? `🌐 ${shortName} (رایگان)` : `🌐 ${shortName}`,
        bg: isFree
          ? 'bg-cyan-500/15 text-cyan-300 border-cyan-500/40'
          : 'bg-purple-500/15 text-purple-300 border-purple-500/40',
      };
    }
    if (providerName.includes('gemini')) {
      return {
        label: 'Google Gemini (پشتیبان ابری)',
        short: 'جِمِنای',
        bg: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
      };
    }
    return {
      label: 'ترانه سرای فرخزاد (موتور اختصاصی)',
      short: 'استودیو فرخزاد',
      bg: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    };
  };

  const activeGenreObj = GENRE_OPTIONS.find((g) => g.label === selectedGenre) || GENRE_OPTIONS[0];

  return (
    <div
      dir="rtl"
      className="flex h-screen w-screen overflow-hidden bg-[#090A0F] text-[#F4EFE6] font-sans select-text antialiased"
    >
      {/* Drawer Overlay for Mobile and Desktop */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-40 flex">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity"
            onClick={() => setIsDrawerOpen(false)}
          />
          <aside className="relative z-50 w-80 max-w-[85vw] bg-[#0E1017] border-l border-white/10 flex flex-col h-full shadow-2xl transition-transform animate-in slide-in-from-right duration-200">
            <div className="p-4 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37]">
                  <Music className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-[#F4EFE6]">
                    ترانه سرای فرخزاد
                  </h2>
                  <p className="text-[10px] text-[#8E8779]">
                    استودیو ترانه‌سرایی داستانی و پرامپت سونو
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsDrawerOpen(false)}
                className="p-1 rounded-lg text-[#8E8779] hover:text-[#F4EFE6] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 flex-1 flex flex-col overflow-hidden">
              <button
                type="button"
                onClick={handleStartNewChat}
                className="w-full py-2.5 px-3 rounded-xl bg-[#D4AF37] hover:bg-[#E5C354] text-[#090A0F] font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-md"
              >
                <Plus className="w-4 h-4" />
                <span>گفتگوی جدید و ترانه تازه</span>
              </button>

              {/* AI Key & Provider Button in Drawer */}
              <button
                type="button"
                onClick={() => {
                  setShowKeyModal(true);
                  setIsDrawerOpen(false);
                }}
                className="mt-2.5 w-full py-2 px-3 rounded-xl bg-[#171B2A] hover:bg-[#202538] border border-[#D4AF37]/35 text-xs text-[#D4AF37] font-semibold flex items-center justify-between transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Key className="w-3.5 h-3.5" />
                  <span>تنظیم کلید OpenRouter و نام هوش مصنوعی</span>
                </div>
                <span className="text-[10px] bg-cyan-500/15 border border-cyan-500/30 px-1.5 py-0.5 rounded text-cyan-300 font-mono" dir="ltr">
                  {openrouterModel.split('/').pop()}
                </span>
              </button>

              {/* Drawer Navigation Tabs: Sessions vs Saved Songs History */}
              <div className="mt-3 flex items-center p-1 bg-[#12141F] rounded-xl border border-white/10 text-xs">
                <button
                  type="button"
                  onClick={() => setDrawerTab('sessions')}
                  className={`flex-1 py-1.5 px-2 rounded-lg font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    drawerTab === 'sessions'
                      ? 'bg-[#D4AF37] text-[#090A0F] shadow-sm'
                      : 'text-[#A69F91] hover:text-[#F4EFE6]'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>گفتگوها ({sessions.length.toLocaleString('fa-IR')})</span>
                </button>
                <button
                  type="button"
                  onClick={() => setDrawerTab('history')}
                  className={`flex-1 py-1.5 px-2 rounded-lg font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    drawerTab === 'history'
                      ? 'bg-[#D4AF37] text-[#090A0F] shadow-sm'
                      : 'text-[#A69F91] hover:text-[#F4EFE6]'
                  }`}
                >
                  <History className="w-3.5 h-3.5" />
                  <span>تاریخچه ترانه‌ها ({savedSongs.length.toLocaleString('fa-IR')})</span>
                </button>
              </div>

              {/* Tab 1: Sessions List */}
              {drawerTab === 'sessions' && (
                <div className="mt-3 flex-1 overflow-y-auto space-y-2 pr-1">
                  <div className="text-[11px] font-medium text-[#8E8779] px-1 mb-1">
                    جلسات چت ذخیره‌شده ({sessions.length.toLocaleString('fa-IR')})
                  </div>
                  {sessions.map((sess) => {
                    const isCurrent = sess.id === activeSession.id;
                    return (
                      <div
                        key={sess.id}
                        onClick={() => {
                          setActiveSessionId(sess.id);
                          setIsDrawerOpen(false);
                        }}
                        className={`group rounded-xl p-3 border transition-all cursor-pointer flex items-start justify-between gap-2 ${
                          isCurrent
                            ? 'bg-[#181B26] border-[#D4AF37]/50 shadow-sm'
                            : 'bg-[#11131C] border-white/5 hover:border-white/20'
                        }`}
                      >
                        <div className="min-w-0 flex-1">
                          <h4 className="text-xs font-semibold text-[#F4EFE6] truncate">
                            {sess.title}
                          </h4>
                          <p className="text-[11px] text-[#8E8779] truncate mt-0.5">
                            {sess.subtitle}
                          </p>
                          <span className="text-[10px] text-[#696357] mt-1 block">
                            {sess.updatedAt}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => handleDeleteSession(sess.id, e)}
                          title="حذف این گفتگو"
                          className="opacity-0 group-hover:opacity-100 p-1 text-[#696357] hover:text-rose-400 rounded-md transition-all cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Tab 2: Saved Songs History & Archive */}
              {drawerTab === 'history' && (
                <div className="mt-3 flex-1 flex flex-col overflow-hidden">
                  <div className="px-1 mb-2">
                    <input
                      type="text"
                      placeholder="جستجو در ترانه‌های ذخیره‌شده..."
                      value={historySearch}
                      onChange={(e) => setHistorySearch(e.target.value)}
                      className="w-full h-8 px-2.5 rounded-lg bg-[#141724] border border-white/10 text-xs text-[#F4EFE6] placeholder-[#696357] focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>

                  {savedSongs.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center p-4 text-center text-[#8E8779] space-y-2">
                      <Bookmark className="w-8 h-8 text-[#D4AF37]/40 stroke-1" />
                      <p className="text-xs font-medium text-[#A69F91]">
                        هنوز ترانه‌ای در تاریخچه ثبت نشده است
                      </p>
                      <p className="text-[10px] text-[#696357] leading-relaxed">
                        با زدن دکمه «کپی متن ترانه»، «کپی پرامپت سونو» یا «دانلود فایل متنی»، ترانه به صورت خودکار در این تاریخچه بایگانی می‌شود.
                      </p>
                    </div>
                  ) : (
                    <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                      {savedSongs
                        .filter(
                          (s) =>
                            !historySearch ||
                            s.title.toLowerCase().includes(historySearch.toLowerCase()) ||
                            (s.songResult.genre && s.songResult.genre.toLowerCase().includes(historySearch.toLowerCase()))
                        )
                        .map((s) => (
                          <div
                            key={s.id}
                            className="group rounded-xl p-2.5 bg-[#121522] border border-white/10 hover:border-[#D4AF37]/50 transition-all flex flex-col gap-1.5"
                          >
                            <div className="flex items-start justify-between gap-1.5">
                              <div className="min-w-0 flex-1">
                                <h5 className="text-xs font-bold text-[#F4EFE6] truncate">
                                  {s.title}
                                </h5>
                                <div className="flex items-center gap-1 text-[10px] text-[#8E8779] mt-0.5">
                                  <span>{s.songResult.genre?.split('(')[0].trim() || 'ترانه'}</span>
                                  <span>·</span>
                                  <span>{s.savedAt}</span>
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={() => {
                                  setSavedSongs((prev) => prev.filter((item) => item.id !== s.id));
                                }}
                                title="حذف از تاریخچه"
                                className="opacity-0 group-hover:opacity-100 p-1 text-[#696357] hover:text-rose-400 rounded-md transition-all cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            {/* History Item Quick Actions */}
                            <div className="flex items-center gap-1.5 pt-1.5 border-t border-white/5">
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedHistorySong(s);
                                }}
                                className="flex-1 py-1 px-1.5 rounded bg-white/5 hover:bg-white/10 text-[10px] text-[#D4AF37] font-semibold flex items-center justify-center gap-1 cursor-pointer transition-colors"
                              >
                                <Eye className="w-3 h-3" />
                                <span>مشاهده کامل</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => copyToClipboard(s.songResult.lyrics, `hist-lyr-${s.id}`)}
                                title="کپی متن ترانه"
                                className="p-1 rounded bg-[#D4AF37]/15 hover:bg-[#D4AF37]/25 text-[#D4AF37] cursor-pointer"
                              >
                                {copiedMap[`hist-lyr-${s.id}`] ? (
                                  <Check className="w-3 h-3 text-emerald-400 stroke-[3]" />
                                ) : (
                                  <Copy className="w-3 h-3" />
                                )}
                              </button>
                              <button
                                type="button"
                                onClick={() => copyToClipboard(s.songResult.musicPrompt, `hist-prm-${s.id}`)}
                                title="کپی پرامپت سونو"
                                className="p-1 rounded bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 cursor-pointer"
                              >
                                {copiedMap[`hist-prm-${s.id}`] ? (
                                  <Check className="w-3 h-3 text-emerald-400 stroke-[3]" />
                                ) : (
                                  <Music className="w-3 h-3" />
                                )}
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDownloadSong(s.songResult)}
                                title="دانلود فایل متنی"
                                className="p-1 rounded bg-blue-500/15 hover:bg-blue-500/25 text-blue-300 cursor-pointer"
                              >
                                <Download className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              )}

              {/* Drawer Footer Info */}
              <div className="pt-3 border-t border-white/10 text-[11px] text-[#696357] text-center">
                استودیو ترانه‌سرایی فرخزاد · آفرینش شعر داستانی و مهندسی پرامپت سونو v4
              </div>
            </div>
          </aside>
        </div>
      )}

      {/* Unified OpenRouter AI Key & Model Management Modal */}
      {showKeyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-xs"
            onClick={() => setShowKeyModal(false)}
          />
          <div className="relative z-10 w-full max-w-xl bg-[#10131F] border border-[#D4AF37]/50 rounded-2xl p-5 sm:p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37]">
                  <Key className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#F4EFE6] flex items-center gap-2">
                    <span>تنظیم کلید و مدل هوش مصنوعی (OpenRouter)</span>
                    <span className="text-[10px] bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 px-2 py-0.5 rounded font-mono">
                      Universal API
                    </span>
                  </h3>
                  <p className="text-xs text-[#A69F91] mt-0.5">
                    اتصال به صدها مدل هوش مصنوعی قدرتمند جهان با یک کلید واحد و مدل‌های با توکن رایگان
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowKeyModal(false)}
                className="p-1 rounded-lg text-[#8E8779] hover:text-[#F4EFE6] hover:bg-white/5 cursor-pointer transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Explanation & OpenRouter Link Card */}
            <div className="p-3.5 rounded-xl bg-gradient-to-r from-[#141726] to-[#121420] border border-[#D4AF37]/30 text-xs text-[#E2DDD3] space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-[#D4AF37] font-bold">
                  <Sparkles className="w-4 h-4 text-[#D4AF37] shrink-0" />
                  <span>دسترسی آزاد به بهترین هوش مصنوعی‌های جهان:</span>
                </div>
                <a
                  href="https://openrouter.ai/keys"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[11px] text-cyan-400 hover:text-cyan-300 hover:underline flex items-center gap-1"
                >
                  <span>دریافت کلید رایگان</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <p className="text-[11px] text-[#A69F91] leading-relaxed">
                با داشتن یک کلید از <strong>OpenRouter</strong>، نیازی به ثبت نام جداگانه در OpenAI یا Anthropic ندارید. مدل‌های دارای پسوند <code className="text-cyan-300 font-mono">:free</code> توکن کاملاً رایگان دارند و می‌توانید بدون هزینه از آنها برای سرایش شعر و ساخت پرامپت سونو استفاده کنید.
              </p>
            </div>

            {/* Field 1: OpenRouter API Key Input */}
            <div className="p-3.5 rounded-xl bg-[#141724] border border-white/10 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-[#F4EFE6] flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>۱. کادر وارد کردن کلید OpenRouter (با sk-or- شروع می‌شود):</span>
                </label>
                {openrouterApiKey ? (
                  <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-semibold">
                    <ShieldCheck className="w-3 h-3" /> کلید ذخیره شده
                  </span>
                ) : (
                  <span className="text-[10px] text-amber-400">کلید وارد نشده</span>
                )}
              </div>

              <div className="flex gap-2">
                <input
                  type="password"
                  placeholder="sk-or-v1-..."
                  value={openrouterApiKey}
                  onChange={(e) => {
                    setOpenrouterApiKey(e.target.value);
                    setKeyTestStatus(null);
                  }}
                  className="flex-1 h-9 px-3 rounded-lg bg-[#0A0C13] border border-white/15 text-xs text-[#F4EFE6] placeholder-[#696357] focus:outline-none focus:border-[#D4AF37] font-mono"
                  dir="ltr"
                />
                <button
                  type="button"
                  onClick={() => handleSaveOpenRouterConfig()}
                  className="h-9 px-3 rounded-lg bg-[#D4AF37] hover:bg-[#E5C354] text-[#090A0F] text-xs font-bold cursor-pointer transition-colors shrink-0 flex items-center gap-1"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>ذخیره کلید</span>
                </button>
                {openrouterApiKey && (
                  <button
                    type="button"
                    onClick={handleClearOpenRouterKey}
                    title="حذف کلید"
                    className="h-9 px-2.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 border border-rose-500/30 text-xs text-rose-300 font-medium cursor-pointer transition-colors shrink-0"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* API server URL is needed by the standalone Android app. */}
            <div className="p-3.5 rounded-xl bg-[#141724] border border-cyan-500/20 space-y-2">
              <label className="text-xs font-bold text-cyan-200">نشانی سرور برنامه (برای نسخه APK)</label>
              <input type="url" autoComplete="url" placeholder="https://your-service.onrender.com" defaultValue={localStorage.getItem('taraneh_api_base_url') || ''} onChange={(e) => { const value = e.target.value.trim().replace(/\/$/, ''); if (value) localStorage.setItem('taraneh_api_base_url', value); else localStorage.removeItem('taraneh_api_base_url'); }} className="w-full h-9 px-3 rounded-lg bg-[#0A0C13] border border-white/15 text-xs text-[#F4EFE6] placeholder-[#696357] focus:outline-none focus:border-cyan-400 font-mono" dir="ltr" />
              <p className="text-[10px] leading-relaxed text-[#A69F91]">بعد از انتشار سرور، نشانی HTTPS آن را اینجا وارد کن. اگر این کادر خالی باشد، برنامه فقط روی وبِ هم‌مبدأ کار می‌کند؛ در APK درخواست‌های هوش مصنوعی وصل نمی‌شوند.</p>
            </div>

            {/* Additional fallback providers: user-owned keys stay in this browser/device storage. */}
            <div className="p-3.5 rounded-xl bg-[#141724] border border-emerald-500/20 space-y-3">
              <div className="flex items-center justify-between gap-2"><div className="text-xs font-bold text-emerald-300">پشتیبان خودکار پس از خطای سرویس اصلی</div><span className="text-[10px] text-[#A69F91]">کلیدهای شخصی شما</span></div>
              <div className="space-y-1.5"><label className="text-xs text-[#E2DDD3]">کلید API سرویس Groq</label><input type="password" autoComplete="off" placeholder="gsk_..." value={groqApiKey} onChange={(e) => setGroqApiKey(e.target.value)} className="w-full h-9 px-3 rounded-lg bg-[#0A0C13] border border-white/15 text-xs text-[#F4EFE6] placeholder-[#696357] focus:outline-none focus:border-emerald-400 font-mono" dir="ltr" /><p className="text-[10px] text-[#8E8779]">محدودیت و سهمیه رایگان خود Groq همچنان برقرار است.</p></div>
              <div className="space-y-1.5"><label className="text-xs text-[#E2DDD3]">Cloudflare Account ID</label><input type="text" autoComplete="off" placeholder="شناسه حساب Cloudflare" value={cloudflareAccountId} onChange={(e) => setCloudflareAccountId(e.target.value)} className="w-full h-9 px-3 rounded-lg bg-[#0A0C13] border border-white/15 text-xs text-[#F4EFE6] placeholder-[#696357] focus:outline-none focus:border-orange-400 font-mono" dir="ltr" /></div>
              <div className="space-y-1.5"><label className="text-xs text-[#E2DDD3]">Cloudflare API Token</label><input type="password" autoComplete="off" placeholder="توکن محرمانه Cloudflare" value={cloudflareApiToken} onChange={(e) => setCloudflareApiToken(e.target.value)} className="w-full h-9 px-3 rounded-lg bg-[#0A0C13] border border-white/15 text-xs text-[#F4EFE6] placeholder-[#696357] focus:outline-none focus:border-orange-400 font-mono" dir="ltr" /></div>
              <div className="space-y-1.5"><label className="text-xs text-[#E2DDD3]">شناسه مدل Cloudflare</label><input type="text" autoComplete="off" placeholder="@cf/meta/llama-3.1-8b-instruct" value={cloudflareModel} onChange={(e) => setCloudflareModel(e.target.value)} className="w-full h-9 px-3 rounded-lg bg-[#0A0C13] border border-white/15 text-xs text-[#F4EFE6] placeholder-[#696357] focus:outline-none focus:border-orange-400 font-mono" dir="ltr" /><p className="text-[10px] text-[#8E8779]">شناسه مدل را می‌توان تغییر داد؛ مدل‌های Workers AI معمولاً با @cf/ شروع می‌شوند.</p></div>
              <p className="text-[10px] leading-relaxed text-amber-300/90">توکن را در GitHub یا چت منتشر نکن. در این نسخه، کلیدها در فضای ذخیره‌سازی مرورگر همین دستگاه ذخیره می‌شوند و رمزنگاری‌شده نیستند.</p>
            </div>

            {/* Field 2: AI Model Name Input (همان کادر اسم هوش مصنوعی درخواستی کاربر) */}
            <div className="p-3.5 rounded-xl bg-[#141724] border border-white/10 space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-[#F4EFE6] flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                  <span>۲. کادر نوشتن نام مدل هوش مصنوعی (Model Name):</span>
                </label>
                <span className="text-[10px] text-[#A69F91]">
                  مدل فعال:{' '}
                  <span className="font-mono text-cyan-300 font-bold" dir="ltr">
                    {openrouterModel.split('/').pop()}
                  </span>
                </span>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="مثال: meta-llama/llama-3.3-70b-instruct:free یا deepseek/deepseek-r1:free"
                  value={openrouterModel}
                  onChange={(e) => {
                    const val = e.target.value;
                    setOpenrouterModel(val);
                    localStorage.setItem(OPENROUTER_MODEL_STORAGE, val);
                    setKeyTestStatus(null);
                  }}
                  className="flex-1 h-9 px-3 rounded-lg bg-[#0A0C13] border border-white/15 text-xs text-[#F4EFE6] placeholder-[#696357] focus:outline-none focus:border-cyan-400 font-mono"
                  dir="ltr"
                />
                <button
                  type="button"
                  disabled={testingOpenRouter}
                  onClick={() => handleTestOpenRouterKey()}
                  className="h-9 px-3 rounded-lg bg-cyan-900/50 hover:bg-cyan-900 border border-cyan-500/40 text-xs text-cyan-200 font-semibold cursor-pointer transition-colors shrink-0 flex items-center gap-1.5"
                >
                  {testingOpenRouter ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>تست اتصال...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>تست اتصال کلید</span>
                    </>
                  )}
                </button>
              </div>

              {/* Status and notification alerts */}
              {keySaveMessage && (
                <div className="text-[11px] p-2 rounded-lg bg-emerald-950/40 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>{keySaveMessage}</span>
                </div>
              )}

              {keyTestStatus && (
                <div
                  className={`text-[11px] p-2.5 rounded-lg flex items-center gap-2 ${
                    keyTestStatus.success
                      ? 'bg-emerald-950/40 text-emerald-300 border border-emerald-500/30'
                      : 'bg-rose-950/40 text-rose-300 border border-rose-500/30'
                  }`}
                >
                  {keyTestStatus.success ? (
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                  ) : (
                    <XCircle className="w-4 h-4 shrink-0 text-rose-400" />
                  )}
                  <span className="leading-relaxed">{keyTestStatus.message}</span>
                </div>
              )}

              {/* Quick Pick: Free Models */}
              <div className="pt-2 border-t border-white/5 space-y-2">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-semibold text-cyan-300 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    انتخاب سریع مدل‌های با توکن رایگان (کلیک کنید):
                  </span>
                  <span className="text-[10px] text-[#8E8779]">بدون نیاز به شارژ مالی</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  {OPENROUTER_FREE_MODELS.map((model) => {
                    const isSelected = openrouterModel === model.id;
                    return (
                      <button
                        key={model.id}
                        type="button"
                        onClick={() => {
                          setOpenrouterModel(model.id);
                          handleSaveOpenRouterConfig(undefined, model.id);
                        }}
                        className={`p-2 rounded-lg border text-right transition-all cursor-pointer flex flex-col gap-0.5 ${
                          isSelected
                            ? 'bg-cyan-950/50 border-cyan-400 text-white shadow-sm ring-1 ring-cyan-400/40'
                            : 'bg-[#0E1018] border-white/10 hover:border-cyan-500/40 text-[#A69F91] hover:text-[#F4EFE6]'
                        }`}
                      >
                        <div className="flex items-center justify-between w-full">
                          <span className="text-xs font-bold text-white">{model.name}</span>
                          <span className="text-[9px] bg-cyan-500/20 text-cyan-300 px-1.5 py-0.2 rounded border border-cyan-500/30 font-semibold">
                            رایگان
                          </span>
                        </div>
                        <span className="text-[10px] text-[#8E8779] line-clamp-1">{model.desc}</span>
                        <span className="text-[9px] text-[#696357] font-mono mt-0.5" dir="ltr">
                          {model.id}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Quick Pick: Top Literary Models */}
              <div className="pt-2 border-t border-white/5 space-y-2">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-semibold text-purple-300 flex items-center gap-1">
                    <Award className="w-3 h-3" />
                    مدل‌های تخصصی شعر و ادبیات فارسی (در صورت داشتن موجودی):
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5">
                  {OPENROUTER_POPULAR_MODELS.map((model) => {
                    const isSelected = openrouterModel === model.id;
                    return (
                      <button
                        key={model.id}
                        type="button"
                        onClick={() => {
                          setOpenrouterModel(model.id);
                          handleSaveOpenRouterConfig(undefined, model.id);
                        }}
                        className={`p-2 rounded-lg border text-right transition-all cursor-pointer flex flex-col gap-0.5 ${
                          isSelected
                            ? 'bg-purple-950/50 border-purple-400 text-white shadow-sm ring-1 ring-purple-400/40'
                            : 'bg-[#0E1018] border-white/10 hover:border-purple-500/40 text-[#A69F91] hover:text-[#F4EFE6]'
                        }`}
                      >
                        <span className="text-xs font-bold text-white">{model.name}</span>
                        <span className="text-[10px] text-[#8E8779] line-clamp-1">{model.desc}</span>
                        <span className="text-[9px] text-[#696357] font-mono mt-0.5" dir="ltr">
                          {model.id.split('/').pop()}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="pt-3 border-t border-white/10 flex items-center justify-between">
              <span className="text-[11px] text-[#8E8779]">
                کلید در مرورگر شما محلی ذخیره می‌شود و مستقیماً به OpenRouter ارسال می‌گردد.
              </span>
              <button
                type="button"
                onClick={() => setShowKeyModal(false)}
                className="px-4 py-2 rounded-xl bg-[#D4AF37] hover:bg-[#E5C354] text-[#090A0F] font-bold text-xs cursor-pointer shadow-md transition-colors"
              >
                تأیید و بازگشت به استودیو
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Selected History Song Modal */}
      {selectedHistorySong && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/85 backdrop-blur-xs"
            onClick={() => setSelectedHistorySong(null)}
          />
          <div className="relative z-10 w-full max-w-2xl bg-[#0F121C] border border-[#D4AF37]/50 rounded-2xl p-5 sm:p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37]">
                  <Bookmark className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#F4EFE6]">
                    {selectedHistorySong.title}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-[#8E8779] mt-0.5">
                    <span>سبک: {selectedHistorySong.songResult.genre || 'مشخص شده'}</span>
                    <span>·</span>
                    <span>تاریخ ثبت: {selectedHistorySong.savedAt}</span>
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedHistorySong(null)}
                className="p-1 rounded-lg text-[#8E8779] hover:text-[#F4EFE6] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Actions in Modal */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => copyToClipboard(selectedHistorySong.songResult.lyrics, `hist-modal-lyr-${selectedHistorySong.id}`)}
                className="px-3 py-1.5 rounded-lg bg-[#D4AF37] hover:bg-[#E5C354] text-[#090A0F] font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
              >
                {copiedMap[`hist-modal-lyr-${selectedHistorySong.id}`] ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-950 stroke-[3]" />
                    <span>کپی شد!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>کپی متن ترانه</span>
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => copyToClipboard(selectedHistorySong.songResult.musicPrompt, `hist-modal-prm-${selectedHistorySong.id}`)}
                className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
              >
                {copiedMap[`hist-modal-prm-${selectedHistorySong.id}`] ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-black stroke-[3]" />
                    <span>کپی شد!</span>
                  </>
                ) : (
                  <>
                    <Music className="w-3.5 h-3.5" />
                    <span>کپی پرامپت سونو</span>
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => handleDownloadSong(selectedHistorySong.songResult)}
                className="px-3 py-1.5 rounded-lg bg-[#181C2A] hover:bg-[#22273B] border border-white/10 text-xs text-[#F4EFE6] flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>دانلود فایل متنی</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  const song = selectedHistorySong.songResult;
                  const histId = selectedHistorySong.id;
                  setSelectedHistorySong(null);
                  handleOpenManualEdit(histId, song);
                }}
                className="px-3 py-1.5 rounded-lg bg-[#181C2A] hover:bg-[#22273B] border border-[#D4AF37]/50 text-xs text-[#D4AF37] font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>ویرایش ترانه</span>
              </button>
            </div>

            {/* Quality Audit Summary in History Modal */}
            {selectedHistorySong.songResult.qualityAudit && (
              <div className="p-3 rounded-xl bg-[#090C14] border border-[#D4AF37]/30 flex flex-wrap items-center justify-between gap-2 text-xs">
                <span className="font-bold text-[#F4EFE6] flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
                  <span>اعتبارسنجی بک‌اند: {selectedHistorySong.songResult.qualityAudit.verdict}</span>
                </span>
                <div className="flex items-center gap-3 text-[11px]">
                  <span className="text-[#D4AF37]">قافیه: {selectedHistorySong.songResult.qualityAudit.rhymeScore}٪</span>
                  <span className="text-emerald-400">وزن: {selectedHistorySong.songResult.qualityAudit.meterScore}٪</span>
                  <span className="text-cyan-400">روایت: {selectedHistorySong.songResult.qualityAudit.narrativeScore}٪</span>
                </div>
              </div>
            )}

            {/* Lyrics View */}
            <div className="p-4 rounded-xl bg-[#090B10] border border-white/10 overflow-hidden">
              <h4 className="text-xs font-bold text-[#D4AF37] mb-2 flex items-center gap-1">
                <FileText className="w-3.5 h-3.5" />
                متن ترانه همراه با تگ‌های انگلیسی سونو:
              </h4>
              <pre
                dir="rtl"
                className="font-poetic text-sm text-[#F4EFE6] leading-relaxed whitespace-pre-wrap selection:bg-[#D4AF37]/30 max-h-64 overflow-y-auto"
              >
                {selectedHistorySong.songResult.lyrics}
              </pre>
            </div>

            {/* Suno Prompt View */}
            <div className="p-4 rounded-xl bg-[#090B10] border border-[#D4AF37]/40 space-y-2">
              <h4 className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                <Music className="w-3.5 h-3.5" />
                پرامپت انگلیسی سونو (Style of Music Prompt for Suno AI):
              </h4>
              <div
                dir="ltr"
                className="p-3 rounded-lg bg-[#111420] border border-white/10 font-mono-code text-xs text-emerald-300 leading-relaxed select-all"
              >
                {selectedHistorySong.songResult.musicPrompt}
              </div>
            </div>

            {selectedHistorySong.songResult.composerNote && (
              <p className="text-xs text-[#A69F91] leading-relaxed bg-[#141724] p-3 rounded-xl border border-white/5">
                {selectedHistorySong.songResult.composerNote}
              </p>
            )}
          </div>
        </div>
      )}

      {/* User Manual Lyric & Song Edit Modal (ویرایش توسط مخاطب) */}
      {manualEditState && manualEditState.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
          <div
            className="fixed inset-0 bg-black/85 backdrop-blur-xs"
            onClick={() => setManualEditState(null)}
          />
          <div className="relative z-10 w-full max-w-3xl bg-[#0F121C] border border-[#D4AF37]/50 rounded-2xl p-4 sm:p-6 shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37]">
                  <Edit3 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#F4EFE6] flex items-center gap-2">
                    <span>ویرایش ترانه توسط شما (مخاطب)</span>
                    <span className="text-[10px] bg-[#D4AF37]/15 text-[#D4AF37] px-2 py-0.5 rounded border border-[#D4AF37]/30">
                      ویرایش دستی
                    </span>
                  </h3>
                  <p className="text-xs text-[#8E8779] mt-0.5">
                    متن ترانه، ابیات، تگ‌های سونو یا عنوان را آزادانه تغییر دهید و سپس اعتبارسنجی قافیه و وزن را بسنجید.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setManualEditState(null)}
                className="p-1.5 rounded-lg text-[#8E8779] hover:text-[#F4EFE6] hover:bg-white/5 cursor-pointer transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Title Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#D4AF37] block">
                عنوان ترانه:
              </label>
              <input
                type="text"
                value={manualEditState.title}
                onChange={(e) =>
                  setManualEditState((prev) => (prev ? { ...prev, title: e.target.value } : null))
                }
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#141724] border border-white/10 text-sm text-[#F4EFE6] focus:outline-none focus:border-[#D4AF37]/60"
                placeholder="عنوان ترانه..."
              />
            </div>

            {/* Lyrics Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-[#D4AF37] flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5" />
                  <span>متن کامل ترانه و تگ‌های انگلیسی سونو:</span>
                </label>
                <span className="text-[11px] text-[#8E8779]">
                  تگ‌هایی مانند [Intro]، [Verse]، [Chorus]، [Outro] را حفظ کنید.
                </span>
              </div>
              <textarea
                dir="rtl"
                rows={10}
                value={manualEditState.lyrics}
                onChange={(e) =>
                  setManualEditState((prev) => (prev ? { ...prev, lyrics: e.target.value } : null))
                }
                className="w-full p-3.5 rounded-xl bg-[#090B10] border border-white/10 font-poetic text-sm text-[#F4EFE6] leading-relaxed focus:outline-none focus:border-[#D4AF37]/60 resize-y"
                placeholder="متن ترانه خود را اینجا وارد یا ویرایش نمایید..."
              />
            </div>

            {/* Smart Rhyme Assistant (دستیار قافیه هوشمند داستانی) */}
            <div className="p-3.5 rounded-xl bg-gradient-to-r from-[#131626] to-[#10121F] border border-[#D4AF37]/45 space-y-3 shadow-md">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37]">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[#F4EFE6] block">
                      دستیار قافیه هوشمند (متناسب با داستان و وزن ترانه)
                    </span>
                    <span className="text-[10px] text-[#A69F91]">
                      روی هر کلمه از ترانه کلیک کنید یا کلمه مورد نظر را بنویسید تا ۳ قافیه متناسب با قصه دریافت نمایید.
                    </span>
                  </div>
                </div>

                {rhymeAssistant.isLoading && (
                  <span className="text-[11px] text-[#D4AF37] flex items-center gap-1 font-semibold">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>در حال یافتن ۳ قافیه هوشمند...</span>
                  </span>
                )}
              </div>

              {/* Quick Word Clicker: Line-ending words from current lyrics */}
              {(() => {
                const endingWords = manualEditState.lyrics
                  .split('\n')
                  .map((l) => l.trim())
                  .filter((l) => l.length > 0 && !l.startsWith('[') && !l.startsWith('('))
                  .map((l) => {
                    const cleanL = l.replace(/[،.؛:!؟?«»"']+/g, '').trim();
                    const words = cleanL.split(/\s+/);
                    return { word: words[words.length - 1], line: l };
                  })
                  .filter((item, idx, arr) => item.word && item.word.length >= 2 && arr.findIndex(x => x.word === item.word) === idx)
                  .slice(0, 14);

                return (
                  <div className="space-y-1.5 pt-1 border-t border-white/5">
                    <span className="text-[11px] text-[#8E8779] block">
                      کلمات انتهای ابیات ترانه شما (برای دریافت ۳ قافیه هوشمند روی کلمه کلیک کنید):
                    </span>
                    <div className="flex flex-wrap items-center gap-1.5">
                      {endingWords.map((item, idx) => {
                        const isSelected = rhymeAssistant.targetWord === item.word;
                        return (
                          <button
                            key={`${item.word}-${idx}`}
                            type="button"
                            onClick={() => handleFetchRhymes(item.word, item.line)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer flex items-center gap-1 ${
                              isSelected
                                ? 'bg-[#D4AF37] text-[#090A0F] font-bold shadow-sm ring-1 ring-[#D4AF37]'
                                : 'bg-[#181B28] text-[#E2DDD3] hover:text-[#D4AF37] border border-white/10 hover:border-[#D4AF37]/40'
                            }`}
                          >
                            <span>{item.word}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })()}

              {/* Custom Word Search Row */}
              <div className="flex items-center gap-2 pt-1 border-t border-white/5">
                <input
                  type="text"
                  placeholder="یا نوشتن هر کلمه دیگر برای قافیه‌یابی هوشمند (مثلاً: خروش، طوفان، امید)..."
                  value={rhymeAssistant.customInput}
                  onChange={(e) => {
                    const val = e.target.value;
                    setRhymeAssistant((prev) => ({ ...prev, customInput: val }));
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      if (rhymeAssistant.customInput.trim()) {
                        handleFetchRhymes(rhymeAssistant.customInput.trim());
                      }
                    }
                  }}
                  className="flex-1 h-8 px-3 rounded-lg bg-[#0C0E16] border border-white/10 text-xs text-[#F4EFE6] placeholder-[#696357] focus:outline-none focus:border-[#D4AF37]"
                />
                <button
                  type="button"
                  disabled={rhymeAssistant.isLoading || !rhymeAssistant.customInput.trim()}
                  onClick={() => handleFetchRhymes(rhymeAssistant.customInput.trim())}
                  className="h-8 px-3 rounded-lg bg-[#D4AF37] hover:bg-[#E5C354] disabled:opacity-40 text-[#090A0F] font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>یافتن قافیه</span>
                </button>
              </div>

              {/* Rhyme Suggestions Results Display */}
              {rhymeAssistant.suggestions.length > 0 && (
                <div className="pt-2 border-t border-white/10 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-[#D4AF37] flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>۳ قافیه پیشنهادی با معنای داستانی برای «{rhymeAssistant.targetWord}»:</span>
                    </span>
                    <span className="text-[10px] text-[#8E8779]">
                      برای اعمال در متن روی «جایگزینی در متن» کلیک کنید
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {rhymeAssistant.suggestions.map((sug, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded-xl bg-[#0B0D15] border border-[#D4AF37]/30 hover:border-[#D4AF37]/60 transition-all flex flex-col justify-between gap-2 shadow-xs"
                      >
                        <div>
                          <div className="flex items-center justify-between pb-1.5 border-b border-white/5">
                            <span className="text-sm font-bold text-[#F4EFE6] font-poetic">
                              {sug.rhyme}
                            </span>
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#D4AF37]/15 text-[#D4AF37] font-semibold">
                              پیشنهاد #{idx + 1}
                            </span>
                          </div>
                          <p className="text-[11px] text-[#A69F91] leading-relaxed mt-1.5">
                            💡 <strong className="text-[#E2DDD3]">تناسب داستانی:</strong> {sug.meaning}
                          </p>
                          {sug.sampleLine && (
                            <p className="text-[10px] text-[#8E8779] italic mt-1 bg-white/5 p-1.5 rounded-md font-poetic">
                              📜 «{sug.sampleLine}»
                            </p>
                          )}
                        </div>

                        <div className="flex items-center gap-1.5 pt-1.5 border-t border-white/5">
                          <button
                            type="button"
                            onClick={() => handleApplyRhymeToLyrics(sug.rhyme)}
                            title="جایگزینی این قافیه در متن ترانه"
                            className="flex-1 py-1 px-2 rounded-lg bg-[#D4AF37] hover:bg-[#E5C354] text-[#090A0F] font-bold text-[10px] flex items-center justify-center gap-1 transition-colors cursor-pointer"
                          >
                            <Check className="w-3 h-3" />
                            <span>جایگزینی در متن</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => copyToClipboard(sug.rhyme, `rhyme-sug-${idx}`)}
                            title="کپی واژه قافیه"
                            className="p-1 rounded-lg bg-white/5 hover:bg-white/10 text-[#D4AF37] cursor-pointer"
                          >
                            {copiedMap[`rhyme-sug-${idx}`] ? (
                              <Check className="w-3 h-3 text-emerald-400" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {rhymeAssistant.error && (
                <div className="text-[11px] text-amber-300 bg-amber-500/10 p-2 rounded-lg border border-amber-500/20">
                  ⚠️ {rhymeAssistant.error}
                </div>
              )}
            </div>

            {/* Live Backend Rhyme & Meter Validation Panel */}
            <div className="p-3.5 rounded-xl bg-[#121624] border border-[#D4AF37]/35 space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
                  <span className="text-xs font-bold text-[#F4EFE6]">
                    اعتبارسنجی بک‌اند برای متن ویرایش‌شده
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleAuditManualEdit}
                  disabled={manualEditState.isAuditing}
                  className="px-3 py-1.5 rounded-lg bg-[#181C2B] hover:bg-[#22273B] border border-[#D4AF37]/40 text-xs text-[#D4AF37] font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  {manualEditState.isAuditing ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>در حال ارزیابی وزن و قافیه...</span>
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>ارزیابی مجدد قافیه و وزن عروضی</span>
                    </>
                  )}
                </button>
              </div>

              {manualEditState.auditResult && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs pt-1">
                  <div className="p-2 rounded-lg bg-[#0C0F17] border border-white/5 space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-[#8E8779]">دقت قافیه:</span>
                      <span className="font-bold text-[#D4AF37]">
                        {manualEditState.auditResult.rhymeScore}٪
                      </span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden">
                      <div
                        className="h-full bg-[#D4AF37] rounded-full"
                        style={{ width: `${manualEditState.auditResult.rhymeScore}%` }}
                      />
                    </div>
                  </div>

                  <div className="p-2 rounded-lg bg-[#0C0F17] border border-white/5 space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-[#8E8779]">وزن و ریتم عروضی:</span>
                      <span className="font-bold text-emerald-400">
                        {manualEditState.auditResult.meterScore}٪
                      </span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden">
                      <div
                        className="h-full bg-emerald-400 rounded-full"
                        style={{ width: `${manualEditState.auditResult.meterScore}%` }}
                      />
                    </div>
                  </div>

                  <div className="p-2 rounded-lg bg-[#0C0F17] border border-white/5 space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-[#8E8779]">انسجام روایی:</span>
                      <span className="font-bold text-cyan-400">
                        {manualEditState.auditResult.narrativeScore}٪
                      </span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden">
                      <div
                        className="h-full bg-cyan-400 rounded-full"
                        style={{ width: `${manualEditState.auditResult.narrativeScore}%` }}
                      />
                    </div>
                  </div>

                  {manualEditState.auditResult.notes && (
                    <div className="col-span-1 sm:col-span-3 text-[11px] text-[#A69F91] bg-black/30 p-2 rounded-lg border border-white/5 mt-1">
                      💡 {manualEditState.auditResult.notes}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Suno Prompt Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                <Music className="w-3.5 h-3.5" />
                <span>پرامپت انگلیسی سبک موسیقی سونو (Suno Style Prompt):</span>
              </label>
              <textarea
                dir="ltr"
                rows={2}
                value={manualEditState.musicPrompt}
                onChange={(e) =>
                  setManualEditState((prev) =>
                    prev ? { ...prev, musicPrompt: e.target.value } : null
                  )
                }
                className="w-full p-2.5 rounded-xl bg-[#090B10] border border-white/10 font-mono-code text-xs text-emerald-300 focus:outline-none focus:border-emerald-500/60"
                placeholder="Persian Rap, 808 Sub-Bass, Fast Flow, 92 BPM..."
              />
            </div>

            {/* Modal Actions */}
            <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => setManualEditState(null)}
                className="px-4 py-2 rounded-xl bg-[#161824] hover:bg-[#202336] text-[#A69F91] text-xs font-medium cursor-pointer transition-colors"
              >
                انصراف
              </button>
              <button
                type="button"
                onClick={handleSaveManualEdit}
                className="px-5 py-2.5 rounded-xl bg-[#D4AF37] hover:bg-[#E5C354] text-[#090A0F] font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md transition-colors"
              >
                <Save className="w-4 h-4" />
                <span>ذخیره تغییرات ترانه</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AI Song Refiner & Editor Modal (ویرایش ترانه توسط هوش مصنوعی) */}
      {aiEditState && aiEditState.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
          <div
            className="fixed inset-0 bg-black/85 backdrop-blur-xs"
            onClick={() => !aiEditState.isSubmitting && setAiEditState(null)}
          />
          <div className="relative z-10 w-full max-w-2xl bg-[#0F121C] border border-[#D4AF37]/50 rounded-2xl p-4 sm:p-6 shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400">
                  <Wand2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#F4EFE6] flex items-center gap-2">
                    <span>ویرایش و ارتقای ترانه با هوش مصنوعی</span>
                    <span className="text-[10px] bg-purple-500/15 text-purple-300 px-2 py-0.5 rounded border border-purple-500/30">
                      {getProviderBadge(openrouterModel).short}
                    </span>
                  </h3>
                  <p className="text-xs text-[#8E8779] mt-0.5">
                    ترانه «{aiEditState.song.title}» بر اساس دستور یا یکی از گزینه‌های زیر بازنویسی و اعتبارسنجی می‌شود.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => !aiEditState.isSubmitting && setAiEditState(null)}
                disabled={aiEditState.isSubmitting}
                className="p-1.5 rounded-lg text-[#8E8779] hover:text-[#F4EFE6] hover:bg-white/5 cursor-pointer transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Action Presets (پیش‌فرض‌های ویرایش سریع) */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-[#D4AF37] block">
                دستورات ویرایش آماده و پرتکرار (با یک کلیک اعمال کنید):
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[
                  {
                    id: 'poet-story',
                    title: '📜 تفکر شاعرانه و پیوند با قصه اصلی',
                    desc: 'تفکر در قامت شاعر اصیل و پیوند بی‌نقص معنای بیت‌ها با داستان اصلی',
                    prompt: 'دقیقاً مانند یک شاعر و ترانه‌سرای نابغه فکر کن و بنویس؛ معنا و تصاویر تمام بیت‌ها را مستقیماً با داستان اصلی ترانه پیوند بده و از آوردن کلمات بی‌ربط یا زوری صرفاً برای جور کردن قافیه اکیداً پرهیز نما.',
                  },
                  {
                    id: 'expand-length',
                    title: '📏 افزایش طول و تکمیل ساختار ترانه',
                    desc: 'بسط ترانه به ۲۸ تا ۳۴ مصراع با ورس ۱، کورس، ورس ۲، بریج و اوترو',
                    prompt: 'ترانه را به یک اثر کامل، پربار و بلند (حداقل ۲۸ الی ۳۴ مصراع) تبدیل کن؛ ورس اول، ترجیع‌بند، ورس دوم با حادثه داستانی جدید، بریج و اوترو را به کمال برسان.',
                  },
                  {
                    id: 'rhyme',
                    title: '🎯 تقویت و صیقل قافیه‌ها',
                    desc: 'پرهیز از تکرار، استفاده از حروف روی قوی‌تر و قافیه‌های طبیعی',
                    prompt: 'قافیه‌ها و هم‌آوایی‌های ابیات را صیقل بده، از کلمات وصله‌پینه‌ای پرهیز کن و قافیه‌های غنی‌تر و چندسیلابی بساز.',
                  },
                  {
                    id: 'meter',
                    title: '⚖️ اصلاح و توازن وزن عروضی',
                    desc: 'توازن هجاها و ریتم ضرب‌آهنگ بدون شکستگی وزن',
                    prompt: 'توازن هجاهای هر مصراع را دقیقاً منظم کن و ریتم و ضرب‌آهنگ عروضی شعر را بدون شکستگی وزن بازنویسی نما.',
                  },
                  {
                    id: 'narrative',
                    title: '📖 تعمیق پیوند روایی و دراماتیک',
                    desc: 'ارتقای تسلسل منطقی و پیوند داستانی عاطفی میان ابیات',
                    prompt: 'تسلسل معنایی و پیوند منطقی داستان را بین ابیات عمیق‌تر و روان‌تر کن تا داستان ترانه از آغاز تا پایان تاثیرگذارتر شود.',
                  },
                  {
                    id: 'hook',
                    title: '💥 بازنویسی هوک / کورس آهنگ',
                    desc: 'خلق ترجیع‌بند گیرا، ماندگار و مناسب برای همخوانی',
                    prompt: 'ترجیع‌بند و کورس آهنگ را بازنویسی کن تا به‌یادماندنی‌تر، ریتمیک‌تر و گیرا برای همخوانی مخاطب باشد.',
                  },
                  {
                    id: 'verse',
                    title: '➕ افزودن ورس دوم و بریج جدید',
                    desc: 'توسعه داستان آهنگ با ورس دوم و پل عاطفی جدید',
                    prompt: 'یک ورس جدید و بخش بریج عاطفی با قافیه‌های تازه به ترانه اضافه کن تا ساختار ترانه کامل‌تر شود.',
                  },
                  {
                    id: 'flow',
                    title: '⚡ فلو رپ تند و کوبنده',
                    desc: 'پانچ‌لاین‌های خیابانی و ریتم سریع‌تر هجاها',
                    prompt: 'فلو و ریتم ترانه را به ضرب‌آهنگ تند، کلمات کوبنده و پانچ‌لاین‌های خیابانی تغییر بده.',
                  },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setAiEditState((prev) =>
                        prev ? { ...prev, instruction: item.prompt } : null
                      );
                    }}
                    className="p-2.5 rounded-xl bg-[#141724] hover:bg-[#1C2033] border border-white/5 hover:border-[#D4AF37]/40 text-right transition-all cursor-pointer space-y-0.5 group"
                  >
                    <span className="text-xs font-bold text-[#F4EFE6] group-hover:text-[#D4AF37] block">
                      {item.title}
                    </span>
                    <span className="text-[11px] text-[#8E8779] block">
                      {item.desc}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Instruction Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#F4EFE6] block">
                یا دستور ویرایش دلخواه خود را بنویسید:
              </label>
              <textarea
                dir="rtl"
                rows={3}
                value={aiEditState.instruction}
                onChange={(e) =>
                  setAiEditState((prev) =>
                    prev ? { ...prev, instruction: e.target.value } : null
                  )
                }
                placeholder="مثلاً: بخش ورس ۱ را غمگین‌تر کن، در کورس از واژه‌های کوه و باران استفاده کن و ریتم را حماسی‌تر بساز..."
                className="w-full p-3 rounded-xl bg-[#090B10] border border-white/10 text-xs sm:text-sm text-[#F4EFE6] leading-relaxed focus:outline-none focus:border-purple-500/60"
              />
            </div>

            {/* Error Notice */}
            {aiEditState.error && (
              <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/40 text-xs text-rose-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{aiEditState.error}</span>
              </div>
            )}

            {/* Modal Actions */}
            <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => setAiEditState(null)}
                disabled={aiEditState.isSubmitting}
                className="px-4 py-2 rounded-xl bg-[#161824] hover:bg-[#202336] text-[#A69F91] text-xs font-medium cursor-pointer transition-colors"
              >
                انصراف
              </button>
              <button
                type="button"
                onClick={() => handleSubmitAiEdit()}
                disabled={aiEditState.isSubmitting}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-[#D4AF37] hover:from-purple-500 hover:to-[#E5C354] text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-lg transition-all"
              >
                {aiEditState.isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>شاعر هوش مصنوعی در حال بازنویسی و اعتبارسنجی است...</span>
                  </>
                ) : (
                  <>
                    <Wand2 className="w-4 h-4" />
                    <span>اعمال ویرایش و بازبینی هوشمند ترانه</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Chat Interface */}
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#090A0F]">
        {/* Header Bar */}
        <header className="h-14 sm:h-16 border-b border-[#D4AF37]/25 px-4 sm:px-6 flex items-center justify-between bg-[#0E1017] shrink-0">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsDrawerOpen(true)}
              className="p-2 rounded-xl bg-[#161824] hover:bg-[#202336] text-[#D4AF37] border border-[#D4AF37]/30 transition-colors cursor-pointer"
              title="باز کردن منوی گفتگوها و تنظیمات"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm sm:text-base font-bold text-[#F4EFE6] tracking-tight">
                  ترانه سرای فرخزاد
                </h1>
                <span className="hidden sm:inline-block text-[10px] bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/35 px-2 py-0.5 rounded-full font-bold">
                  مکتب ادبی فرخزاد · Suno v4 Pro
                </span>
              </div>
              <p className="text-[11px] text-[#8E8779] hidden xs:block truncate max-w-sm sm:max-w-md">
                سبک: <span className="text-[#D4AF37] font-semibold">{activeGenreObj.short}</span> · ساختار: <span className="text-cyan-300 font-semibold">{selectedSongType.split('(')[0].trim()}</span> · حس: <span className="text-emerald-300 font-semibold">{selectedMood.split('(')[0].trim()}</span>
              </p>
            </div>
          </div>

          {/* Header Action Buttons */}
          <div className="flex items-center gap-2">
            {/* Active AI Provider Switcher Pill */}
            <button
              type="button"
              onClick={() => setShowKeyModal(true)}
              className={`px-2.5 py-1 sm:py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                getProviderBadge(openrouterModel).bg
              }`}
              title="تنظیم کلید OpenRouter و تغییر مدل هوش مصنوعی"
            >
              <Cpu className="w-3.5 h-3.5 shrink-0" />
              <span className="hidden sm:inline">{getProviderBadge(openrouterModel).label}</span>
              <span className="sm:hidden">{getProviderBadge(openrouterModel).short}</span>
            </button>

            {/* History Archive Quick Access Button */}
            <button
              type="button"
              onClick={() => {
                setDrawerTab('history');
                setIsDrawerOpen(true);
              }}
              className="h-8 sm:h-9 px-2.5 sm:px-3 rounded-xl bg-[#161824] hover:bg-[#202336] text-[#D4AF37] border border-[#D4AF37]/35 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="مشاهده تاریخچه ترانه‌های کپی و دانلود شده"
            >
              <History className="w-4 h-4" />
              <span className="hidden sm:inline">تاریخچه ترانه‌ها</span>
              {savedSongs.length > 0 && (
                <span className="w-4 h-4 rounded-full bg-[#D4AF37] text-black text-[10px] font-bold flex items-center justify-center">
                  {savedSongs.length}
                </span>
              )}
            </button>

            {/* New Chat Button */}
            <button
              type="button"
              onClick={handleStartNewChat}
              className="h-8 sm:h-9 px-3 rounded-xl bg-[#D4AF37] hover:bg-[#E5C354] text-[#090A0F] font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
              title="شروع گفتگوی جدید"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">گفتگوی جدید</span>
            </button>
          </div>
        </header>

        {/* Chat Messages Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {activeSession.messages.length === 0 ? (
            /* Empty State: Rich Dashboard with Genres & Quick Prompts */
            <div className="max-w-4xl mx-auto py-4 sm:py-8 space-y-6">
              <div className="text-center space-y-2">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[#D4AF37] mb-2 shadow-lg">
                  <Sparkles className="w-7 h-7" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-[#F4EFE6]">
                  استودیو ترانه‌سرایی و آهنگسازی هوش مصنوعی
                </h2>
                <p className="text-xs sm:text-sm text-[#A69F91] max-w-xl mx-auto leading-relaxed">
                  تولید ۱۰۰٪ اختصاصی و نامکرر ترانه‌ها در بیش از ۱۱ سبک موسیقی حرفه‌ای (رپ، راک، سنتی، پاپ، دریل، الکترونیک، بندری و...) همراه با پرامپت انگلیسی تخصصی برای Suno AI.
                </p>
              </div>

              {/* Genre Showcase Grid */}
              <div className="p-4 rounded-2xl bg-[#10131F] border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#D4AF37] flex items-center gap-2">
                    <Music className="w-4 h-4" />
                    <span>سبک‌های موسیقی قابل انتخاب (برای تنظیم سریع کلیک کنید):</span>
                  </span>
                  <span className="text-[11px] text-[#8E8779]">
                    سبک فعال: <strong className="text-[#F4EFE6]">{activeGenreObj.short}</strong>
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                  {GENRE_OPTIONS.map((g) => {
                    const isCurrent = g.label === selectedGenre;
                    const IconComp = g.icon;
                    return (
                      <button
                        key={g.id}
                        type="button"
                        onClick={() => {
                          setSelectedGenre(g.label);
                          // Auto set matching defaults
                          if (g.id === 'rap' || g.id === 'trap_drill') {
                            setSelectedSongType(SONG_TYPE_OPTIONS[1].label);
                          } else if (g.id === 'sonati') {
                            setSelectedSongType(SONG_TYPE_OPTIONS[2].label);
                          }
                        }}
                        className={`p-2.5 rounded-xl border text-right transition-all cursor-pointer flex items-start gap-2 ${
                          isCurrent
                            ? 'bg-[#1C2033] border-[#D4AF37] shadow-md ring-1 ring-[#D4AF37]/40'
                            : 'bg-[#131622] border-white/5 hover:border-white/20'
                        }`}
                      >
                        <div className={`p-1.5 rounded-lg border bg-gradient-to-br ${g.color} shrink-0`}>
                          <IconComp className="w-4 h-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <span className={`text-xs font-bold block truncate ${isCurrent ? 'text-[#D4AF37]' : 'text-[#F4EFE6]'}`}>
                            {g.short}
                          </span>
                          <span className="text-[10px] text-[#8E8779] block truncate mt-0.5">
                            {g.desc.slice(0, 24)}...
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Ready Presets / Quick Prompts Grid */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-[#D4AF37] flex items-center gap-1.5">
                    <Flame className="w-4 h-4 text-orange-400" />
                    <span>نمونه پرامپت‌های آماده چندسبکی (روی هر کدام بزنید فوراً تولید می‌شود):</span>
                  </h3>
                  <span className="text-[11px] text-[#8E8779]">
                    تنوع کامل سبک‌ها
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {QUICK_PROMPTS.map((qp, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectQuickPrompt(qp)}
                      className="p-3.5 rounded-xl bg-[#12141F] hover:bg-[#181B2B] border border-white/10 hover:border-[#D4AF37]/50 text-right transition-all cursor-pointer flex flex-col justify-between group shadow-sm hover:shadow-md"
                    >
                      <div>
                        <div className="flex items-center justify-between text-[10px] text-[#A69F91] mb-1.5">
                          <span className="bg-[#D4AF37]/15 text-[#D4AF37] px-2 py-0.5 rounded font-semibold border border-[#D4AF37]/30">
                            {qp.genre.split('(')[0]}
                          </span>
                          <span className="text-[#8E8779]">{qp.vocal.split('(')[0]}</span>
                        </div>
                        <h4 className="text-xs font-bold text-[#F4EFE6] group-hover:text-[#D4AF37] transition-colors leading-snug">
                          {qp.title}
                        </h4>
                        <p className="text-[11px] text-[#8E8779] mt-1.5 line-clamp-2 leading-relaxed">
                          {qp.prompt}
                        </p>
                      </div>
                      <div className="mt-2.5 pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-[#696357]">
                        <span>حس: {qp.mood.split('(')[0]}</span>
                        <span className="text-[#D4AF37] group-hover:underline">سرایش سریع ←</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            activeSession.messages.map((msg, index) => {
              if (msg.sender === 'user') {
                return (
                  <div key={msg.id} className="flex justify-end">
                    <div className="max-w-xl rounded-2xl bg-[#1C202E] border border-white/10 p-4 text-sm text-[#F4EFE6] shadow-sm leading-relaxed">
                      <div className="flex items-center justify-between text-[11px] text-[#8E8779] mb-1.5">
                        <span className="flex items-center gap-1 font-medium text-[#D4AF37]">
                          <User className="w-3 h-3" />
                          شما
                        </span>
                        <span>{msg.timestamp}</span>
                      </div>
                      <p className="whitespace-pre-wrap">{msg.text}</p>
                    </div>
                  </div>
                );
              }

              // Render Error Card if Provider Failed
              if (msg.error) {
                return (
                  <div key={msg.id} className="flex justify-start">
                    <div className="w-full max-w-2xl rounded-2xl bg-[#1A1215] border border-rose-500/40 p-5 shadow-lg space-y-3">
                      <div className="flex items-center gap-2 text-rose-400 font-bold text-xs sm:text-sm">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>خطای ارائه‌دهنده هوش مصنوعی ({msg.failedProvider?.toUpperCase()}):</span>
                      </div>
                      <p className="text-xs text-[#E2D5D5] leading-relaxed">
                        {msg.error}
                      </p>
                      <div className="pt-2 flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setShowKeyModal(true)}
                          className="px-3 py-1.5 rounded-lg bg-rose-900/40 hover:bg-rose-900/60 border border-rose-500/40 text-xs font-semibold text-rose-200 flex items-center gap-1.5 cursor-pointer"
                        >
                          <Key className="w-3.5 h-3.5" />
                          <span>تنظیم و بررسی کلید API</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setOpenrouterModel('meta-llama/llama-3.3-70b-instruct:free');
                            handleSendMessage();
                          }}
                          className="px-3 py-1.5 rounded-lg bg-[#181B26] hover:bg-[#202433] border border-white/10 text-xs text-[#D4AF37] flex items-center gap-1.5 cursor-pointer"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>تلاش مجدد با مدل رایگان (Llama 3.3 Free)</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              }

              const res = msg.songResult;
              if (!res) return null;

              const prevUserMsg = activeSession.messages[index - 1]?.text || activeSession.title;
              const sourceBadge = getProviderBadge(msg.source || openrouterModel);

              return (
                <div key={msg.id} className="flex justify-start">
                  <div className="w-full max-w-3xl rounded-2xl bg-[#10121A] border border-[#D4AF37]/35 overflow-hidden shadow-xl">
                    {/* Bot Message Header */}
                    <div className="p-4 sm:p-5 bg-gradient-to-r from-[#171A26] to-[#10121A] border-b border-white/10 flex flex-wrap items-center justify-between gap-3">
                      <div>
                        {/* Provider Source Badge */}
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${sourceBadge.bg}`}>
                            {sourceBadge.label}
                          </span>
                          {msg.warning && (
                            <span className="text-[10px] text-amber-400 bg-amber-950/30 px-2 py-0.5 rounded border border-amber-500/30">
                              موتور اضطراری استودیو
                            </span>
                          )}
                        </div>

                        {/* Song Details Badges */}
                        <div className="flex flex-wrap items-center gap-1.5 text-xs text-[#D4AF37] font-medium">
                          {res.genre && (
                            <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded font-bold">
                              🎵 {res.genre}
                            </span>
                          )}
                          <span className="bg-[#D4AF37]/15 px-2 py-0.5 rounded text-[#D4AF37]">
                            🌐 {res.language}
                          </span>
                          <span className="bg-white/5 px-2 py-0.5 rounded text-[#E2DDD3]">
                            🎤 {res.vocalType}
                          </span>
                          <span className="bg-white/5 px-2 py-0.5 rounded text-[#E2DDD3]">
                            🎭 {res.mood}
                          </span>
                        </div>

                        <h3 className="text-lg sm:text-xl font-bold text-[#F4EFE6] mt-2 font-poetic">
                          {res.title}
                        </h3>

                        {res.composerNote && (
                          <p className="text-xs text-[#A69F91] mt-1.5 leading-relaxed">
                            {res.composerNote}
                          </p>
                        )}

                        <div className="mt-2.5 flex flex-wrap items-center gap-2 text-[11px] text-[#A69F91]">
                          <span className="bg-white/5 px-2 py-0.5 rounded border border-white/10 text-[#D4AF37]">
                            وزن: {res.poeticMeter}
                          </span>
                          <span className="bg-white/5 px-2 py-0.5 rounded border border-white/10 text-[#E2DDD3]">
                            قافیه: {res.rhymeScheme}
                          </span>
                        </div>
                      </div>

                      {/* Header Utility Actions: Manual Edit, AI Edit, Regenerate & Download */}
                      <div className="flex flex-wrap items-center gap-2">
                        {/* Edit by User (مخاطب) */}
                        <button
                          type="button"
                          onClick={() => handleOpenManualEdit(msg.id, res)}
                          title="ویرایش مستقیم متن ترانه، عنوان و پرامپت توسط شما"
                          className="px-3 py-1.5 rounded-lg bg-[#181C2A] hover:bg-[#22273B] border border-[#D4AF37]/50 text-xs text-[#D4AF37] font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>ویرایش دستی ترانه</span>
                        </button>

                        {/* Edit by AI (هوش مصنوعی) */}
                        <button
                          type="button"
                          onClick={() => handleOpenAiEdit(msg.id, res)}
                          title="ویرایش، صیقل قافیه‌ها و بازنویسی ترانه توسط خود هوش مصنوعی"
                          className="px-3 py-1.5 rounded-lg bg-purple-950/40 hover:bg-purple-900/50 border border-purple-500/40 text-xs text-purple-200 font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                        >
                          <Wand2 className="w-3.5 h-3.5 text-purple-300" />
                          <span>ویرایش با هوش مصنوعی</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleSendMessage(`نسخه جدید و کاملاً متفاوت با وزن، فلو و قافیه دیگر بسرای: ${prevUserMsg}`)}
                          title="سرایش یک نسخه جدید و متفاوت برای همین درخواست"
                          className="px-3 py-1.5 rounded-lg bg-[#181C2A] hover:bg-[#22273B] border border-white/10 text-xs text-[#E2DDD3] flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <RefreshCw className="w-3.5 h-3.5 text-[#D4AF37]" />
                          <span className="hidden sm:inline">نسخه دیگر</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDownloadSong(res)}
                          title="دانلود متن ترانه و پرامپت سونو در فایل متنی"
                          className="px-3 py-1.5 rounded-lg bg-[#181C2A] hover:bg-[#22273B] border border-white/10 text-xs text-[#F4EFE6] flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">دانلود (.txt)</span>
                        </button>
                      </div>
                    </div>

                    <div className="p-4 sm:p-6 space-y-6">
                      {/* Rhyme, Meter & Narrative Quality Audit Section (سیستم اعتبارسنجی بک‌اند) */}
                      {res.qualityAudit && (
                        <div className="rounded-xl bg-[#0C0F17] border border-[#D4AF37]/35 p-3.5 sm:p-4 space-y-3 shadow-md">
                          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/5 pb-2.5">
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-lg bg-[#D4AF37]/15 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37]">
                                <ShieldCheck className="w-4 h-4" />
                              </div>
                              <div>
                                <span className="text-xs font-bold text-[#F4EFE6] block">
                                  سیستم اعتبارسنجی بک‌اند: قافیه، وزن عروضی و پیوند روایی
                                </span>
                                <span className="text-[10px] text-[#A69F91]">
                                  ارزیابی خودکار و اعتبارسنجی پیش از نهایی‌سازی اثر · {res.qualityAudit.attemptsMade ? `تأییدشده در ${res.qualityAudit.attemptsMade} مرحله بررسی هوشمند` : 'تأییدشده'}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <span
                                className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                                  res.qualityAudit.passed
                                    ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/35'
                                    : 'bg-amber-500/15 text-amber-300 border-amber-500/35'
                                }`}
                              >
                                {res.qualityAudit.verdict} ({res.qualityAudit.overallScore}٪)
                              </span>
                            </div>
                          </div>

                          {/* Metric Scores Grid */}
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                            {/* Rhyme Score */}
                            <div className="p-2.5 rounded-lg bg-[#141824] border border-white/5 space-y-1.5">
                              <div className="flex items-center justify-between text-[11px]">
                                <span className="text-[#8E8779]">دقت قافیه و حروف روی:</span>
                                <span className="font-bold text-[#D4AF37]">{res.qualityAudit.rhymeScore}٪</span>
                              </div>
                              <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden">
                                <div
                                  className="h-full bg-gradient-to-r from-amber-500 to-[#D4AF37] rounded-full"
                                  style={{ width: `${res.qualityAudit.rhymeScore}%` }}
                                />
                              </div>
                              <span className="text-[10px] text-[#6E685C] block">
                                سنجش انتهای ابیات و عدم تکرار ملال‌آور
                              </span>
                            </div>

                            {/* Meter & Prosody Score */}
                            <div className="p-2.5 rounded-lg bg-[#141824] border border-white/5 space-y-1.5">
                              <div className="flex items-center justify-between text-[11px]">
                                <span className="text-[#8E8779]">وزن و ریتم عروضی:</span>
                                <span className="font-bold text-emerald-400">{res.qualityAudit.meterScore}٪</span>
                              </div>
                              <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden">
                                <div
                                  className="h-full bg-gradient-to-r from-teal-500 to-emerald-400 rounded-full"
                                  style={{ width: `${res.qualityAudit.meterScore}%` }}
                                />
                              </div>
                              <span className="text-[10px] text-[#6E685C] block">
                                توازن هجاها و ریتم متناسب با سبک
                              </span>
                            </div>

                            {/* Narrative & Meaning Score */}
                            <div className="p-2.5 rounded-lg bg-[#141824] border border-white/5 space-y-1.5">
                              <div className="flex items-center justify-between text-[11px]">
                                <span className="text-[#8E8779]">انسجام منطقی و روایی:</span>
                                <span className="font-bold text-cyan-400">{res.qualityAudit.narrativeScore}٪</span>
                              </div>
                              <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden">
                                <div
                                  className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full"
                                  style={{ width: `${res.qualityAudit.narrativeScore}%` }}
                                />
                              </div>
                              <span className="text-[10px] text-[#6E685C] block">
                                پیوند معنایی آغاز تا فرود ترانه
                              </span>
                            </div>
                          </div>

                          {res.qualityAudit.notes && (
                            <p className="text-[11px] text-[#A69F91] bg-black/30 p-2.5 rounded-lg border border-white/5 leading-relaxed">
                              💡 <strong className="text-[#F4EFE6]">تحلیل کارشناسی سیستم:</strong> {res.qualityAudit.notes}
                            </p>
                          )}
                        </div>
                      )}

                      {/* Box 1: FULL LYRICS with ENGLISH SUNO TAGS & PROMINENT COPY BUTTON */}
                      <div className="rounded-xl bg-[#090B10] border border-white/10 overflow-hidden">
                        <div className="p-3 sm:px-4 sm:py-2.5 bg-[#141724] border-b border-white/10 flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-[#D4AF37]" />
                            <span className="text-xs font-bold text-[#F4EFE6]">
                              متن ترانه همراه با تگ‌های انگلیسی سونو ([Intro], [Verse], [Chorus]...)
                            </span>
                          </div>

                          <button
                            type="button"
                            onClick={() => copyToClipboard(res.lyrics, `lyrics-${msg.id}`, res, false)}
                            className="px-3 py-1.5 rounded-lg bg-[#D4AF37] hover:bg-[#E5C354] text-[#090A0F] font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
                          >
                            {copiedMap[`lyrics-${msg.id}`] ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-950 stroke-[3]" />
                                <span className="text-emerald-950">کپی و در تاریخچه ثبت شد!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5 text-[#090A0F]" />
                                <span>کپی متن ترانه</span>
                              </>
                            )}
                          </button>
                        </div>

                        <div className="p-4 sm:p-5 overflow-x-auto">
                          <pre
                            dir="rtl"
                            className="font-poetic text-sm sm:text-base text-[#F4EFE6] leading-relaxed whitespace-pre-wrap selection:bg-[#D4AF37]/30"
                          >
                            {res.lyrics}
                          </pre>
                        </div>
                      </div>

                      {/* Box 2: SUNO AI ENGLISH MUSIC PROMPT WITH DEDICATED COPY BUTTON */}
                      <div className="rounded-xl bg-[#090B10] border border-[#D4AF37]/40 overflow-hidden">
                        <div className="p-3 sm:px-4 sm:py-2.5 bg-[#181C2B] border-b border-white/10 flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <Music className="w-4 h-4 text-emerald-400" />
                            <span className="text-xs font-bold text-[#F4EFE6]">
                              پرامپت انگلیسی سونو (Style of Music Prompt for Suno AI)
                            </span>
                          </div>

                          <button
                            type="button"
                            onClick={() => copyToClipboard(res.musicPrompt, `prompt-${msg.id}`, res, true)}
                            className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
                          >
                            {copiedMap[`prompt-${msg.id}`] ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-black stroke-[3]" />
                                <span>کپی و در تاریخچه ذخیره شد!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5 text-black" />
                                <span>کپی پرامپت سونو</span>
                              </>
                            )}
                          </button>
                        </div>

                        <div className="p-4 bg-[#0A0C14] space-y-3">
                          <div
                            dir="ltr"
                            className="p-3 rounded-lg bg-[#111420] border border-white/10 font-mono-code text-xs sm:text-sm text-emerald-300 leading-relaxed select-all"
                          >
                            {res.musicPrompt}
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2 border-t border-white/5 text-xs text-[#A69F91]">
                            <div>
                              <span className="text-[#D4AF37] font-semibold block text-[11px]">
                                ⏱️ Tempo & Key:
                              </span>
                              <span dir="ltr" className="font-mono-code text-[11px] block mt-0.5 text-[#E2DDD3]">
                                {res.tempoAndKey}
                              </span>
                            </div>
                            <div>
                              <span className="text-[#D4AF37] font-semibold block text-[11px]">
                                🎻 Instrumentation:
                              </span>
                              <span dir="ltr" className="font-mono-code text-[11px] block mt-0.5 text-[#E2DDD3]">
                                {res.instrumentation}
                              </span>
                            </div>
                            <div>
                              <span className="text-[#D4AF37] font-semibold block text-[11px]">
                                🚫 Exclude Styles:
                              </span>
                              <span dir="ltr" className="font-mono-code text-[11px] block mt-0.5 text-[#E2DDD3]">
                                {res.excludeStyles}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}

          {/* Loading Animation & Retry State */}
          {isLoading && (
            <div className="flex justify-start">
              <div className="rounded-2xl bg-[#11131E] border border-[#D4AF37]/40 p-4 flex flex-col gap-2.5 max-w-lg shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37] animate-spin shrink-0">
                    <Music className="w-4 h-4" />
                  </div>
                  <div className="text-xs">
                    <span className="font-bold text-[#F4EFE6] block">
                      شاعر و آهنگساز هوش مصنوعی ({getProviderBadge(openrouterModel).short}) در حال سرایش ترانه در سبک «{activeGenreObj.short}» است...
                    </span>
                    <span className="text-[#8E8779]">
                      تنظیم وزن، ریتم، قافیه‌ها، تگ‌های تخصصی انگلیسی سونو و پرامپت اختصاصی موزیک
                    </span>
                  </div>
                </div>

                {retryNotification && (
                  <div className="p-2.5 rounded-xl bg-amber-500/15 border border-amber-500/40 text-amber-300 text-xs flex items-center gap-2 animate-pulse">
                    <RefreshCw className="w-4 h-4 animate-spin shrink-0 text-amber-400" />
                    <span className="leading-relaxed font-semibold">{retryNotification}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Chatbot Bottom Controls & Input Area */}
        <div className="p-3 sm:p-4 bg-[#0E1017] border-t border-[#D4AF37]/25 shrink-0">
          <div className="max-w-4xl mx-auto space-y-2.5">
            {/* Quick Summary Bar & Toggle */}
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setShowOptionsBar(!showOptionsBar)}
                className="text-[11px] text-[#D4AF37] hover:underline flex items-center gap-1.5 cursor-pointer font-semibold"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>
                  تنظیمات سبک و آهنگ ({activeGenreObj.short} · {selectedSongType.split('(')[0].trim()} · {selectedTempo.split('(')[0].trim()} · {selectedVocal.split('(')[0]})
                </span>
                <ChevronDown
                  className={`w-3 transformation transition-transform ${
                    showOptionsBar ? 'rotate-180' : ''
                  }`}
                />
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowKeyModal(true)}
                  className="text-[11px] text-[#A69F91] hover:text-[#D4AF37] flex items-center gap-1 cursor-pointer"
                >
                  <Key className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>تنظیم کلید هوش مصنوعی ({getProviderBadge(openrouterModel).short})</span>
                </button>
                <span className="text-[#696357]">|</span>
                <div className="flex items-center gap-1 text-[11px] text-[#A69F91]">
                  <Globe className="w-3 h-3 text-[#D4AF37]" />
                  <span>{selectedLanguages.length.toLocaleString('fa-IR')} زبان</span>
                </div>
              </div>
            </div>

            {/* Extended Options Bar with Genre, Structure, Tempo, Mood, Vocals, Languages */}
            {showOptionsBar && (
              <div className="p-3 rounded-xl bg-[#131622] border border-white/10 space-y-2.5 text-xs">
                {/* Setting Category Tabs */}
                <div className="flex items-center gap-1 overflow-x-auto pb-1 border-b border-white/10 scrollbar-none">
                  <button
                    type="button"
                    onClick={() => setActiveOptionTab('genre')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1 ${
                      activeOptionTab === 'genre'
                        ? 'bg-[#D4AF37] text-[#090A0F]'
                        : 'text-[#A69F91] hover:text-[#F4EFE6] hover:bg-white/5'
                    }`}
                  >
                    <Music className="w-3 h-3" />
                    <span>۱. سبک موسیقی ({activeGenreObj.short})</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveOptionTab('structure')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1 ${
                      activeOptionTab === 'structure'
                        ? 'bg-[#D4AF37] text-[#090A0F]'
                        : 'text-[#A69F91] hover:text-[#F4EFE6] hover:bg-white/5'
                    }`}
                  >
                    <Layers className="w-3 h-3" />
                    <span>۲. ساختار ترانه</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveOptionTab('tempo')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1 ${
                      activeOptionTab === 'tempo'
                        ? 'bg-[#D4AF37] text-[#090A0F]'
                        : 'text-[#A69F91] hover:text-[#F4EFE6] hover:bg-white/5'
                    }`}
                  >
                    <Gauge className="w-3 h-3" />
                    <span>۳. تمپو و BPM</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveOptionTab('mood')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1 ${
                      activeOptionTab === 'mood'
                        ? 'bg-[#D4AF37] text-[#090A0F]'
                        : 'text-[#A69F91] hover:text-[#F4EFE6] hover:bg-white/5'
                    }`}
                  >
                    <Heart className="w-3 h-3" />
                    <span>۴. حس آهنگ</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveOptionTab('vocal')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1 ${
                      activeOptionTab === 'vocal'
                        ? 'bg-[#D4AF37] text-[#090A0F]'
                        : 'text-[#A69F91] hover:text-[#F4EFE6] hover:bg-white/5'
                    }`}
                  >
                    <Mic className="w-3 h-3" />
                    <span>۵. خواننده</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveOptionTab('lang')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1 ${
                      activeOptionTab === 'lang'
                        ? 'bg-[#D4AF37] text-[#090A0F]'
                        : 'text-[#A69F91] hover:text-[#F4EFE6] hover:bg-white/5'
                    }`}
                  >
                    <Globe className="w-3 h-3" />
                    <span>۶. زبان‌ها</span>
                  </button>
                </div>

                {/* Tab 1: Genres */}
                {activeOptionTab === 'genre' && (
                  <div className="space-y-1.5 animate-in fade-in duration-150">
                    <span className="text-[#8E8779] text-[11px] block">
                      سبک مورد نظر خود را انتخاب نمایید (متن ترانه، وزن، قافیه، سازبندی و پرامپت سونو دقیقاً بر پایه این سبک تنظیم خواهد شد):
                    </span>
                    <div className="flex flex-wrap items-center gap-1.5">
                      {GENRE_OPTIONS.map((g) => {
                        const isSelected = selectedGenre === g.label;
                        const IconComp = g.icon;
                        return (
                          <button
                            key={g.id}
                            type="button"
                            onClick={() => setSelectedGenre(g.label)}
                            className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                              isSelected
                                ? 'bg-[#D4AF37] text-[#090A0F] font-bold shadow-sm'
                                : 'bg-[#1A1D2C] text-[#A69F91] hover:text-[#F4EFE6] border border-white/5'
                            }`}
                          >
                            <IconComp className="w-3.5 h-3.5 shrink-0" />
                            <span>{g.short}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Tab 2: Structure */}
                {activeOptionTab === 'structure' && (
                  <div className="space-y-1.5 animate-in fade-in duration-150">
                    <span className="text-[#8E8779] text-[11px] block">
                      ساختار و فرم اثر را تعیین کنید:
                    </span>
                    <div className="flex flex-wrap items-center gap-1.5">
                      {SONG_TYPE_OPTIONS.map((st) => {
                        const isSelected = selectedSongType === st.label;
                        return (
                          <button
                            key={st.id}
                            type="button"
                            onClick={() => setSelectedSongType(st.label)}
                            className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                              isSelected
                                ? 'bg-[#D4AF37] text-[#090A0F] font-bold shadow-sm'
                                : 'bg-[#1A1D2C] text-[#A69F91] hover:text-[#F4EFE6] border border-white/5'
                            }`}
                          >
                            {isSelected && <Check className="w-3 h-3 shrink-0" />}
                            <span>{st.short}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Tab 3: Tempo */}
                {activeOptionTab === 'tempo' && (
                  <div className="space-y-1.5 animate-in fade-in duration-150">
                    <span className="text-[#8E8779] text-[11px] block">
                      تمپو، سرعت و ضرب‌آهنگ (BPM):
                    </span>
                    <div className="flex flex-wrap items-center gap-1.5">
                      {TEMPO_OPTIONS.map((t) => {
                        const isSelected = selectedTempo === t.label;
                        return (
                          <button
                            key={t.id}
                            type="button"
                            onClick={() => setSelectedTempo(t.label)}
                            className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                              isSelected
                                ? 'bg-[#D4AF37] text-[#090A0F] font-bold shadow-sm'
                                : 'bg-[#1A1D2C] text-[#A69F91] hover:text-[#F4EFE6] border border-white/5'
                            }`}
                          >
                            {isSelected && <Check className="w-3 h-3 shrink-0" />}
                            <span>{t.short}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Tab 4: Mood */}
                {activeOptionTab === 'mood' && (
                  <div className="space-y-1.5 animate-in fade-in duration-150">
                    <span className="text-[#8E8779] text-[11px] block">
                      حس و حال عاطفی آهنگ (Mood):
                    </span>
                    <div className="flex flex-wrap items-center gap-1.5">
                      {MOOD_OPTIONS.map((m) => {
                        const isSelected = selectedMood === m.label;
                        return (
                          <button
                            key={m.id}
                            type="button"
                            onClick={() => setSelectedMood(m.label)}
                            className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                              isSelected
                                ? 'bg-[#D4AF37] text-[#090A0F] font-bold shadow-sm'
                                : 'bg-[#1A1D2C] text-[#A69F91] hover:text-[#F4EFE6] border border-white/5'
                            }`}
                          >
                            {isSelected && <Check className="w-3 h-3 shrink-0" />}
                            <span>{m.short}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Tab 5: Vocals */}
                {activeOptionTab === 'vocal' && (
                  <div className="space-y-1.5 animate-in fade-in duration-150">
                    <span className="text-[#8E8779] text-[11px] block">
                      خواننده و وکال اصلی ترانه:
                    </span>
                    <div className="flex flex-wrap items-center gap-1.5">
                      {VOCAL_OPTIONS.map((v) => {
                        const isSelected = selectedVocal === v.label;
                        return (
                          <button
                            key={v.id}
                            type="button"
                            onClick={() => setSelectedVocal(v.label)}
                            className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                              isSelected
                                ? 'bg-[#D4AF37] text-[#090A0F] font-bold shadow-sm'
                                : 'bg-[#1A1D2C] text-[#A69F91] hover:text-[#F4EFE6] border border-white/5'
                            }`}
                          >
                            {isSelected && <Check className="w-3 h-3 shrink-0" />}
                            <span>{v.short}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Tab 6: Languages */}
                {activeOptionTab === 'lang' && (
                  <div className="space-y-2 animate-in fade-in duration-150">
                    <div className="flex items-center justify-between">
                      <span className="text-[#8E8779] text-[11px]">
                        انتخاب زبان‌ها و گویش‌ها (امکان انتخاب هم‌زمان چند زبان برای ساخت آهنگ‌های چندزبانه):
                      </span>
                      <button
                        type="button"
                        onClick={() => setShowAddCustomLang(!showAddCustomLang)}
                        className="text-[11px] text-[#D4AF37] hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <PlusCircle className="w-3 h-3" />
                        <span>افزودن گویش</span>
                      </button>
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5">
                      {availableLanguages.map((lang) => {
                        const isSelected = selectedLanguages.includes(lang);
                        return (
                          <button
                            key={lang}
                            type="button"
                            onClick={() => handleToggleLanguage(lang)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer flex items-center gap-1 ${
                              isSelected
                                ? 'bg-[#D4AF37] text-[#090A0F] font-bold shadow-sm'
                                : 'bg-[#1C2030] text-[#A69F91] hover:text-[#F4EFE6] border border-white/5'
                            }`}
                          >
                            {isSelected && <Check className="w-3 h-3 shrink-0" />}
                            <span>{lang}</span>
                          </button>
                        );
                      })}
                    </div>

                    {showAddCustomLang && (
                      <form
                        onSubmit={handleAddCustomLanguage}
                        className="mt-2 flex items-center gap-1.5 max-w-sm"
                      >
                        <input
                          type="text"
                          value={customLangInput}
                          onChange={(e) => setCustomLangInput(e.target.value)}
                          placeholder="نام گویش (مثلاً: تالشی، عربی، آلمانی)..."
                          className="flex-1 h-8 px-2.5 rounded-lg bg-[#0E1017] border border-white/15 text-xs text-[#F4EFE6] placeholder-[#696357] focus:outline-none focus:border-[#D4AF37]"
                        />
                        <button
                          type="submit"
                          className="h-8 px-3 rounded-lg bg-[#D4AF37] text-[#090A0F] font-bold text-xs hover:bg-[#E5C354] transition-colors cursor-pointer"
                        >
                          افزودن
                        </button>
                      </form>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Input Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-end gap-2 bg-[#12141F] rounded-2xl border border-white/15 focus-within:border-[#D4AF37] p-2 transition-colors shadow-lg"
            >
              <textarea
                ref={textareaRef}
                rows={2}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder={`موضوع یا ایده ترانه را بنویسید (سبک فعلی: ${activeGenreObj.short})...`}
                className="flex-1 bg-transparent border-0 text-sm text-[#F4EFE6] placeholder-[#696357] focus:outline-none resize-none px-2 py-1 leading-relaxed max-h-28"
              />

              <button
                type="submit"
                disabled={isLoading || !inputText.trim()}
                className="h-11 px-5 rounded-xl bg-[#D4AF37] hover:bg-[#E5C354] disabled:opacity-40 text-[#090A0F] font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-colors cursor-pointer shrink-0 shadow-md"
              >
                <span>سرایش</span>
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
