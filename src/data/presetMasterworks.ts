import { ChatSession, ComposedMasterwork } from '../types';

export const LION_AND_SUN_MASTERWORK: ComposedMasterwork = {
  title: 'طلوع شیر و خورشید (سپیده‌دم میهن)',
  subtitle: 'چکامه حماسی و ملی در هوای آزادی ایران، پایان شب ستم و بازگشت شکوه پادشاهی به مام وطن',
  language: 'فارسی (Persian)',
  genre: 'حماسی ملی - سمفونیک ارکسترال (Epic National Anthem / Symphonic Rock)',
  poeticMeter: 'بحر رمل مثمن محذوف (فاعلاتن فاعلاتن فاعلاتن فاعلن) — هم‌وزن شاهکارهای حماسی و سرودهای جاودان ملی',
  rhymeScheme: 'مثنوی-ترجیع‌بند و چهارپاره مقفا با ردیف و قافیه‌های درونی و پایانی (شام/جام، بیداد/آزاد، تاج/عاج، خورشید/امید)',
  literaryNote:
    'این چکامه بر پایه عروض کلاسیک فارسی و با بهره‌گیری از آرایه‌های ادبی استعاره، تشخیص، تضاد (شب ستم در برابر طلوع مهر) و تلمیح به اساطیر شاهنامه (کاوه، فریدون، دماوند و درفش کاویان) سروده شده است. ضرب‌آهنگ هجاها به‌گونه‌ای تنظیم شده که در موتور صوتی Suno AI با کوبش طبل‌های حماسی و اوج‌گیری ارکستر سمفونیک کاملاً منطبق شود.',
  sections: [
    {
      tag: '[Intro: Majestic Persian Symphonic Orchestra,Santoor & Epic Timpani]',
      persianLabel: 'پیش‌درآمد و طلیعه ارکسترال',
      couplets: [
        {
          hemistich1: 'می‌رسد از قلهٔ البرز، بانگِ روزگار',
          hemistich2: 'می‌دمد از مشرقِ تاریخ، مهرِ تابناک و ماندگار',
          vocalCue: 'Declamatory Baritone · حماسی و با صلابت'
        },
        {
          hemistich1: 'پردهٔ تاریکِ استبداد و بیداد و فریب',
          hemistich2: 'پاره شد با نعرهٔ گردانِ این خاکِ نجیب',
          vocalCue: 'Rising Strings · اوج‌گیری زهی‌ها'
        }
      ]
    },
    {
      tag: '[Verse 1: Powerful Emotional Male Lead, Rhythmic Daf & Cello]',
      persianLabel: 'بند اول — خروش از دل شبِ ستم',
      couplets: [
        {
          hemistich1: 'سال‌ها بر سینه‌مان زخمِ تبرها کاشتند',
          hemistich2: 'بر سرِ ویرانه‌ها پرچمِ ماتم داشـتند',
          vocalCue: 'Deep Somber Tone · لحن سنگین و پرخروش'
        },
        {
          hemistich1: 'خونِ پاکِ لاله‌ها جوشید از رگ‌های خاک',
          hemistich2: 'تا بشوید دامنِ میهن ز لوثِ دیوِ پاک',
          vocalCue: 'Building Brass · همراهی سازهای بادی برنجی'
        },
        {
          hemistich1: 'ای ستمگر! کاخِ ظلمت بر سرِ تو می‌تپد',
          hemistich2: 'موجِ طوفان‌زایِ ملت، ریشه‌ات را می‌کَنَد',
          vocalCue: 'Crescendo · اوج کوبنده'
        }
      ]
    },
    {
      tag: '[Chorus: Grand Mixed Choir, Soaring Brass, Heavy War Drums]',
      persianLabel: 'ترجیع‌بند (همخوانی حماسی انقلاب شیر و خورشید)',
      couplets: [
        {
          hemistich1: 'برفراز ای پرچمِ زرینِ شیر و آفتاب!',
          hemistich2: 'ای شکوهِ جاودانِ ملکِ کورش، بی‌نقاب!',
          vocalCue: 'Full Anthemic Choir · همسرایی پرشکوه'
        },
        {
          hemistich1: 'شاهِ ایران بازمی‌گردد به آغوشِ وطن',
          hemistich2: 'تاجِ مهر و داد می‌رقصد به دشت و انجمن',
          vocalCue: 'Soaring High Notes · اوج حماسی'
        },
        {
          hemistich1: 'انقلابِ شیر و خورشید است و صبحِ رستخیز',
          hemistich2: 'ای وطن برخیز و از زنجیرِ اهریمن گریز!',
          vocalCue: 'Triumphant Timpani · کوبش پیروزمندانه'
        }
      ]
    },
    {
      tag: '[Verse 2: Noble Operatic Tenor, Epic Electric Guitar & Kamancheh]',
      persianLabel: 'بند دوم — پیمان بازگشت و شکوه تاج و تختِ مردمی',
      couplets: [
        {
          hemistich1: 'از پاسارگاد تا توس و خلیجِ پارسی',
          hemistich2: 'می‌خروشد نغمهٔ آزادگی با پارسی',
          vocalCue: 'Lyrical & Proud · فاخر و غرورآفرین'
        },
        {
          hemistich1: 'وارثِ دیهیم و پیمان، با فروغِ ایزدی',
          hemistich2: 'می‌گشاید در به رویِ روزگارِ سرمدی',
          vocalCue: 'Orchestral Swell · موج ارکستر'
        },
        {
          hemistich1: 'دختران و پسرانِ روشنایی در صف‌اند',
          hemistich2: 'وارثانِ کاوه و آرش، سرافرازِ کف‌اند',
          vocalCue: 'Rhythmic March · گام‌های استوار مارش'
        }
      ]
    },
    {
      tag: '[Bridge: Dramatic Pause, Solo Setar & Whispered Choir Building to Roar]',
      persianLabel: 'پل موسیقایی — سوگند به خاک و فرّ ایران‌زمین',
      couplets: [
        {
          hemistich1: 'قسم به البرزِ سپید، قسم به کارونِ رشید',
          hemistich2: 'که شب نمانَد جاودان، دمیده صبحِ پر امید',
          vocalCue: 'Intimate to Explosive · از نجوا تا فریاد'
        },
        {
          hemistich1: 'شمشیرِ شیرِ پاسدار، در دستِ مهرِ خاوران',
          hemistich2: 'نگاهبانِ مرزِ ماست، زِ کرخه تا مازندران',
          vocalCue: 'Drum Roll Crescendo · رول طبل تا انفجار کورس'
        }
      ]
    },
    {
      tag: '[Final Chorus: Maximum Orchestral Power, Choir + Lead Vocal Harmony]',
      persianLabel: 'فرود پایانی و اوج سرود پیروزی',
      couplets: [
        {
          hemistich1: 'برفراز ای پرچمِ زرینِ شیر و آفتاب!',
          hemistich2: 'ای شکوهِ جاودانِ ملکِ کورش، بی‌نقاب!',
          vocalCue: 'Grand Finale · اوج نهایی تمام ارکستر'
        },
        {
          hemistich1: 'شاهِ ایران بازمی‌گردد به آغوشِ وطن',
          hemistich2: 'تاجِ مهر و داد می‌رقصد به دشت و انجمن',
          vocalCue: 'Key Change +2 Semitones · مدولاسیون به گام بالاتر'
        },
        {
          hemistich1: 'جاودان بادا وطن، پاینده بادا نامِ شاه',
          hemistich2: 'روشن از خورشیدِ آزادی، زمین و مهر و ماه!',
          vocalCue: 'Sustained Final Chord & Cymbal Crash · آکورد ممتد پایانی'
        }
      ]
    }
  ],
  sunoFullLyrics: `[Intro: Majestic Persian Symphonic Orchestra, Santoor, Kamancheh & Epic War Drums]
می‌رسد از قلهٔ البرز، بانگِ روزگار
می‌دمد از مشرقِ تاریخ، مهرِ تابناک و ماندگار
پردهٔ تاریکِ استبداد و بیداد و فریب
پاره شد با نعرهٔ گردانِ این خاکِ نجیب

[Verse 1: Powerful Emotional Male Baritone, Rhythmic Daf & Cinematic Cello]
سال‌ها بر سینه‌مان زخمِ تبرها کاشتند
بر سرِ ویرانه‌ها پرچمِ ماتم داشـتند
خونِ پاکِ لاله‌ها جوشید از رگ‌های خاک
تا بشوید دامنِ میهن ز لوثِ دیوِ پاک
ای ستمگر! کاخِ ظلمت بر سرِ تو می‌تپد
موجِ طوفان‌زایِ ملت، ریشه‌ات را می‌کَنَد

[Chorus: Grand Mixed Operatic Choir, Soaring French Horns, Heavy Timpani]
برفراز ای پرچمِ زرینِ شیر و آفتاب!
ای شکوهِ جاودانِ ملکِ کورش، بی‌نقاب!
شاهِ ایران بازمی‌گردد به آغوشِ وطن
تاجِ مهر و داد می‌رقصد به دشت و انجمن
انقلابِ شیر و خورشید است و صبحِ رستخیز
ای وطن برخیز و از زنجیرِ اهریمن گریز!

[Instrumental Interlude: Virtuoso Kamancheh & Symphonic Rock Electric Guitar Solo]

[Verse 2: Noble Heroic Vocal, Orchestral March Rhythm]
از پاسارگاد تا توس و خلیجِ پارسی
می‌خروشد نغمهٔ آزادگی با پارسی
وارثِ دیهیم و پیمان، با فروغِ ایزدی
می‌گشاید در به رویِ روزگارِ سرمدی
دختران و پسرانِ روشنایی در صف‌اند
وارثانِ کاوه و آرش، سرافرازِ کف‌اند

[Bridge: Dramatic Breakdown, Solo Setar Building to Thunderous Crescendo]
قسم به البرزِ سپید، قسم به کارونِ رشید
که شب نمانَد جاودان، دمیده صبحِ پر امید
شمشیرِ شیرِ پاسدار، در دستِ مهرِ خاوران
نگاهبانِ مرزِ ماست، زِ کرخه تا مازندران!

[Final Chorus: Maximum Symphonic Power, Key Modulation, Full Choir & Brass]
برفراز ای پرچمِ زرینِ شیر و آفتاب!
ای شکوهِ جاودانِ ملکِ کورش، بی‌نقاب!
شاهِ ایران بازمی‌گردد به آغوشِ وطن
تاجِ مهر و داد می‌رقصد به دشت و انجمن
جاودان بادا وطن، پاینده بادا نامِ شاه
روشن از خورشیدِ آزادی، زمین و مهر و ماه!

[Outro: Triumphant Brass Fanfare, Santoor Arpeggio & Resonant Final Gong]`,
  sunoPrompt: {
    styleOfMusic:
      'Epic Persian Patriotic Symphonic Rock Anthem, Cinematic Orchestra, Heroic Male Baritone + Grand Mixed Choir, Traditional Kamancheh & Daf, Soaring Brass, Heavy War Drums, 118 BPM, D Minor to D Major',
    excludeStyles:
      'lo-fi, mumble rap, trap hi-hats, EDM synth drop, autotune, comedic, minimalist bedroom pop',
    tempoAndKey: '118 BPM · گام رِ مینور حماسی با مدولاسیون درخشان به رِ ماژور در کورس پایانی (دستگاه همایون / اصفهان)',
    instrumentation:
      'ارکستر سمفونیک ۸۰ نفره، کمانچه و سنتور سولو، دف و دهل و تیمپانی‌های کوبنده، فرنچ‌هورن و ترومپت‌های سلطنتی، گیتار الکتریک دیستروشن در اوج کورس',
    vocalDirection:
      'خواننده مرد با صدای باریتون/تنور پرصلابت و اپرایی (در تراز سرودهای ملی-حماسی کلاسیک)، به همراه گروه کر مختلط چهارصدایی در بخش ترجیع‌بند (Chorus)',
    sectionTagsGuide:
      'تگ‌های داخل کروشه مانند [Chorus: Grand Mixed Operatic Choir] را دقیقاً در کادر Lyrics سونو قرار دهید (حالت Custom Mode را روشن کنید) تا موتور هوش مصنوعی سونو اوج و فرودهای ارکستر را در لحظه مناسب اجرا کند.'
  }
};

export const INITIAL_SESSIONS: ChatSession[] = [
  {
    id: 'session-lion-and-sun',
    title: 'طلوع شیر و خورشید و آزادی وطن',
    subtitle: 'ترانه حماسی ملی میهنی · فارسی',
    language: 'فارسی (Persian)',
    genre: 'حماسی ملی - سمفونیک',
    updatedAt: 'همین الان',
    pinned: true,
    messages: [
      {
        id: 'msg-user-1',
        role: 'user',
        timestamp: '۱۲:۴۵',
        userPrompt:
          'یک ترانه حماسی ملی میهنی می‌خوام در مورد آزادی ایران از دست دولت ستمگر و در این ترانه در مورد آزادی وطن از دست ستمگر و در مورد بازگشت شاه به وطن و انقلاب شیر و خورشید برام بنویس.',
        clues: ['آزادی ایران از ستمگر', 'بازگشت شاه به وطن', 'انقلاب شیر و خورشید', 'سرود حماسی ملی'],
        language: 'فارسی (Persian)',
        mood: 'حماسی و پیروزمندانه (Epic & Triumphant)',
        poeticStyle: 'کلاسیک فاخر و سرود ملی (Classical Epic Anthem)'
      },
      {
        id: 'msg-assistant-1',
        role: 'assistant',
        timestamp: '۱۲:۴۶',
        masterwork: LION_AND_SUN_MASTERWORK
      }
    ]
  },
  {
    id: 'session-romantic-ghazal',
    title: 'نجوای باران و شراب شیراز',
    subtitle: 'غزل-ترانه عاشقانه و عرفانی · فارسی',
    language: 'فارسی (Persian)',
    genre: 'پاپ کلاسیک و تلفیقی (Persian Fusion Ballad)',
    updatedAt: 'دیروز',
    pinned: false,
    messages: [
      {
        id: 'msg-user-2',
        role: 'user',
        timestamp: '۲۰:۱۵',
        userPrompt:
          'یک ترانه عاشقانه و لطیف با حال و هوای باغ‌های شیراز، عطر بهارنارنج، دلتنگی شبانه و امید وصال به سبک غزل-ترانه‌های فاخر بنویس.',
        clues: ['عطر بهارنارنج شیراز', 'دلتنگی شبانه', 'وصال یار'],
        language: 'فارسی (Persian)',
        mood: 'عاشقانه و نوستالژیک (Romantic & Nostalgic)',
        poeticStyle: 'غزل-ترانه معاصر (Lyrical Ghazal)'
      },
      {
        id: 'msg-assistant-2',
        role: 'assistant',
        timestamp: '۲۰:۱۶',
        masterwork: {
          title: 'عطر بهارنارنج و ماهِ شیراز',
          subtitle: 'غزل-ترانه‌ای در دستگاه بیات اصفهان با نغمهٔ عود و پیانو',
          language: 'فارسی (Persian)',
          genre: 'پاپ کلاسیک ایرانی و نئوکلاسیک (Persian Cinematic Ballad)',
          poeticMeter: 'بحر مضارع مثمن اخرب مکفوف محذوف (مفعول فاعلات مفاعیل فاعلن)',
          rhymeScheme: 'غزل-ترانه با قافیه‌های هم‌آوا (مهتاب/خواب، شیراز/راز، باران/یاران)',
          literaryNote:
            'در این اثر از تصویرسازی حسی (حس‌آمیزی عطر بهارنارنج و نور مهتاب) و موسیقی درونی واژگان نرم و کشیده استفاده شده تا خواننده در Suno بتواند تحریرهای لطیف ایرانی را روی کشش مصوت‌های بلند اجرا کند.',
          sections: [
            {
              tag: '[Intro: Solo Acoustic Piano & Persian Oud, Gentle Rain Ambience]',
              persianLabel: 'پیش‌درآمد — نجوای پیانو و عود',
              couplets: [
                {
                  hemistich1: 'امشب دوباره عطرِ بهارنارنج و بوی یار',
                  hemistich2: 'پیچیده در رواقِ خیال و شبِ دیار',
                  vocalCue: 'Soft Breathless Vocal · نجوای گرم و صمیمی'
                }
              ]
            },
            {
              tag: '[Verse 1: Warm Velvety Vocal, Slow Fretless Bass & Strings]',
              persianLabel: 'بند اول — کوچه باغ‌های دلتنگی',
              couplets: [
                {
                  hemistich1: 'در کوچه‌باغ‌هایِ غزل‌خیزِ شهرِ راز',
                  hemistich2: 'می‌خوانمت به زمزمهٔ تار و سوزِ ساز',
                  vocalCue: 'Melancholic & Smooth · مخملی و احساسی'
                },
                {
                  hemistich1: 'باران به شیشه می‌زند و یادِ چشمِ تو',
                  hemistich2: 'آتش به جانِ خستهٔ این عاشقانه زد',
                  vocalCue: 'String Swell · همراهی ویولنسل'
                }
              ]
            },
            {
              tag: '[Chorus: Emotional Soaring Vocal, Lush Cinematic Violins & Santoor]',
              persianLabel: 'ترجیع‌بند — ماهِ تمامِ شیراز',
              couplets: [
                {
                  hemistich1: 'برگرد ای ستارهٔ شب‌هایِ بی‌قرار!',
                  hemistich2: 'ای در خزانِ سینهٔ من، مژدهٔ بهار!',
                  vocalCue: 'Emotional Peak · اوج احساسی با تحریر ملایم'
                },
                {
                  hemistich1: 'بی تو تمامِ شهر پر از غربتِ شب است',
                  hemistich2: 'با تو طلوعِ عشق و شرابِ معطر است',
                  vocalCue: 'Lush Harmony · هارمونی دوصدایی'
                }
              ]
            }
          ],
          sunoFullLyrics: `[Intro: Solo Grand Piano, Persian Oud & Soft Rain]
امشب دوباره عطرِ بهارنارنج و بوی یار
پیچیده در رواقِ خیال و شبِ دیار

[Verse 1: Warm Velvety Male Vocal, Cello & Acoustic Guitar]
در کوچه‌باغ‌هایِ غزل‌خیزِ شهرِ راز
می‌خوانمت به زمزمهٔ تار و سوزِ ساز
باران به شیشه می‌زند و یادِ چشمِ تو
آتش به جانِ خستهٔ این عاشقانه زد

[Chorus: Soaring Emotional Vocal, Lush String Orchestra & Santoor]
برگرد ای ستارهٔ شب‌هایِ بی‌قرار!
ای در خزانِ سینهٔ من، مژدهٔ بهار!
بی تو تمامِ شهر پر از غربتِ شب است
با تو طلوعِ عشق و شرابِ معطر است

[Outro: Fading Piano Chords & Solo Violin]`,
          sunoPrompt: {
            styleOfMusic:
              'Romantic Persian Neoclassical Ballad, Lush Cinematic Strings, Grand Piano, Persian Oud & Santoor, Warm Velvety Male Vocal, Emotional Melancholic Melody, 78 BPM, C Minor',
            excludeStyles: 'heavy metal, rap, electronic club beat, harsh distortion, fast tempo',
            tempoAndKey: '78 BPM · گام دو مینور (در حال و هوای بیات اصفهان)',
            instrumentation: 'پیانو گرند آکوستیک، ارکستر زهی (ویولن و ویولنسل)، عود، سنتور و پرکاشن نرم',
            vocalDirection: 'صدای گرم و مخملی با تحریرهای لطیف و حس دلتنگی عمیق',
            sectionTagsGuide: 'تگ‌های [Intro] و [Chorus] را در بخش Lyrics سونو حفظ کنید تا پیانو و زهی‌ها در لحظه درست اوج بگیرند.'
          }
        }
      }
    ]
  }
];

export const QUICK_INSPIRATION_TEMPLATES = [
  {
    id: 'lion-sun-epic',
    label: 'حماسه شیر و خورشید و آزادی وطن',
    language: 'فارسی (Persian)',
    mood: 'حماسی و پیروزمندانه (Epic & Triumphant)',
    poeticStyle: 'کلاسیک فاخر و سرود ملی (Classical Epic Anthem)',
    clues: ['آزادی ایران از دولت ستمگر', 'بازگشت شاه به وطن', 'انقلاب شیر و خورشید', 'طلوع دوباره شکوه ایران'],
    prompt:
      'یک ترانه حماسی ملی میهنی می‌خوام در مورد آزادی ایران از دست دولت ستمگر و در این ترانه در مورد آزادی وطن از دست ستمگر و در مورد بازگشت شاه به وطن و انقلاب شیر و خورشید برام بنویس'
  },
  {
    id: 'persian-myth-rock',
    label: 'خروش کاوه و دماوند (راک سمفونیک)',
    language: 'فارسی (Persian)',
    mood: 'شورانگیز و انقلابی (Fierce & Awakening)',
    poeticStyle: 'چهارپاره حماسی شاهنامه‌ای (Shahnameh Epic Meter)',
    clues: ['درفش کاویانی', 'قله دماوند', 'شکست اهریمن', 'اتحاد ملت'],
    prompt:
      'یک ترانه راک سمفونیک حماسی با الهام از شاهنامه فردوسی، خروش دماوند و درفش کاویانی در برابر ظلم و تاریکی بساز که مناسب اجرای گروه کر و گیتار الکتریک در سونو باشد.'
  },
  {
    id: 'english-royal-anthem',
    label: 'Crown of the Rising Sun (English Epic)',
    language: 'انگلیسی (English)',
    mood: 'حماسی و پیروزمندانه (Epic & Triumphant)',
    poeticStyle: 'الشعر الغنائي السيمفوني / Shakespearean & Cinematic Verse',
    clues: ['Golden Lion and Sun', 'Return of the King to Persia', 'Breaking the Chains of Tyranny', 'Dawn of Freedom'],
    prompt:
      'Write a majestic English cinematic symphonic anthem about the liberation of Iran from tyranny, the Lion and Sun revolution, and the triumphant return of the Shah to the homeland.'
  },
  {
    id: 'classical-love-ballad',
    label: 'غزل-ترانه عاشقانه در شب شیراز',
    language: 'فارسی (Persian)',
    mood: 'عاشقانه و نوستالژیک (Romantic & Nostalgic)',
    poeticStyle: 'غزل-ترانه معاصر (Lyrical Ghazal)',
    clues: ['باران شبانه', 'عطر بهارنارنج', 'چشمان یار', 'امید وصال'],
    prompt:
      'یک غزل-ترانه عاشقانه و عمیق با وزن عروضی دقیق در مورد دلتنگی شبانه، عطر بهارنارنج و امید دیدار دوباره معشوق بنویس که با پیانو و ویولن در سونو ساخته شود.'
  }
];
