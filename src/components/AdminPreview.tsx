import React, { useState, useMemo } from 'react';
import { useAppContent } from '../context/ContentContext';
import type { StudyModule, ScriptureReference } from '../types/content';

// Simple Material Icon mimic if not loaded (though we have Icon / Material Icons font loaded globally)
const Icon: React.FC<{ name: string; className?: string }> = ({ name, className = '' }) => (
  <span className={`material-symbols-outlined ${className}`}>{name}</span>
);

// Accent class matching HomeScreen.jsx
const accentClass = (accent: string) => {
  if (accent === 'secondary') {
    return 'bg-secondary-fixed text-on-secondary-fixed';
  }
  if (accent === 'primary') {
    return 'bg-primary-fixed text-on-primary-fixed';
  }
  return 'bg-surface-container text-primary';
};

// Card styles matching SalvationAssuranceScreen / QuietTimeScreen
const getCardStyle = (accent?: string) => {
  if (accent === 'primary') {
    return 'bg-primary text-white shadow-[0_28px_72px_rgba(40,53,28,0.22)] p-8 rounded-[2.35rem] relative overflow-hidden';
  }
  if (accent === 'secondary') {
    return 'bg-secondary text-white shadow-[0_28px_72px_rgba(121,89,0,0.22)] p-8 rounded-[2.35rem] relative overflow-hidden';
  }
  if (accent === 'tertiary') {
    return 'bg-surface-container-low p-6 rounded-[2rem] text-primary border border-outline-variant/50 shadow-[0_18px_42px_rgba(40,53,28,0.08)]';
  }
  return 'bg-surface-container-lowest p-6 rounded-[2rem] text-primary border border-outline-variant/30 shadow-[0_18px_42px_rgba(40,53,28,0.08)]';
};

// Reusable mock Scripture reveal accordion
const ScriptureToggle: React.FC<{ scripture: ScriptureReference }> = ({ scripture }) => {
  const [isOpen, setIsOpen] = useState(false);
  if (!scripture) return null;

  return (
    <div className="rounded-[1.45rem] border border-outline-variant/60 bg-surface-container-lowest text-on-surface">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex w-full items-center justify-between gap-4 p-4 text-left text-primary"
      >
        <span>
          {scripture.book && (
            <span className="block font-body text-[11px] font-extrabold tracking-[0.2em] text-secondary">
              {scripture.book}
            </span>
          )}
          <span className="mt-1 block font-headline text-[1.15rem] leading-tight text-primary">
            {scripture.reference}
          </span>
        </span>
        <Icon
          name={isOpen ? 'expand_less' : 'expand_more'}
          className="shrink-0 text-[24px] text-secondary"
        />
      </button>
      {isOpen && (
        <div className="border-t border-outline-variant/50 px-4 pb-5 pt-4">
          <p className="font-headline text-[1.05rem] leading-8 text-primary">
            {scripture.chinese || (scripture as any).verse}
          </p>
          {scripture.english && (
            <p className="mt-4 text-sm leading-7 text-on-surface-variant">
              {scripture.english}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

// 1. Home Preview (Header, Hero Section, Cards list, CTA, and Footer)
export const HomePreview: React.FC = () => {
  const { homeCards, customScreenTexts } = useAppContent();

  return (
    <div className="w-full bg-surface text-on-surface select-none pb-24 font-sans">
      <header className="sticky top-0 z-30 border-b border-[rgba(40,53,28,0.05)] bg-white/80 backdrop-blur-md">
        <div className="flex h-16 items-center justify-between px-5">
          <div className="flex items-center gap-2">
            <Icon name="menu_book" className="text-xl text-primary" />
            <p className="font-headline text-sm font-bold tracking-tight text-primary truncate max-w-[140px] sm:max-w-xs">
              {customScreenTexts['home:hero-title'] || '基督門徒訓練'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-full border border-outline-variant bg-surface-container-lowest text-secondary">
              <Icon name="admin_panel_settings" className="text-[16px]" />
            </div>
            <button className="flex h-7 items-center gap-1 rounded-full bg-surface-container-lowest px-3 text-[10px] font-semibold text-on-surface ring-1 ring-[rgba(40,53,28,0.06)] shadow-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-secondary" />
              登錄
            </button>
          </div>
        </div>
      </header>

      <main className="relative overflow-hidden px-5 pt-8">
        <div className="pointer-events-none absolute inset-x-0 top-3 z-0 flex justify-center">
          <div className="h-36 w-36 rounded-full bg-secondary/10 blur-[64px]" />
        </div>

        <section className="relative z-10 mx-auto mb-10 mt-2 text-center">
          <h1 className="font-headline text-3xl font-black leading-tight tracking-tight text-primary">
            {customScreenTexts['home:hero-title'] || '基督門徒訓練'}
          </h1>
          <p className="mx-auto mt-3 max-w-[18rem] text-sm leading-6 text-on-surface-variant">
            {customScreenTexts['home:hero-subtitle'] || '在信仰中成長的旅程，一步一腳印。'}
          </p>
        </section>

        <section className="relative z-10 space-y-4 max-w-xl mx-auto">
          {homeCards.map((card) => (
            <div
              key={card.id}
              className="group block overflow-hidden rounded-[1.5rem] bg-white p-5 border border-outline-variant/30 shadow-sm transition hover:shadow-md cursor-pointer"
            >
              <div className="flex items-start gap-4">
                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${accentClass(
                    card.accent,
                  )}`}
                >
                  <Icon name={card.icon} className="text-xl" />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="font-headline text-lg font-bold text-primary truncate">
                    {card.title}
                  </h2>
                  <p className="mt-1 text-xs leading-5 text-on-surface-variant line-clamp-2">
                    {card.description}
                  </p>
                </div>
                <Icon
                  name="arrow_forward"
                  className="self-center text-lg text-secondary"
                />
              </div>
            </div>
          ))}
        </section>

        <section className="relative z-10 mt-10 text-center">
          <button
            type="button"
            className="inline-flex items-center rounded-full bg-secondary px-6 py-3 text-xs font-extrabold tracking-widest text-white shadow-md active:scale-95"
          >
            開啟你的旅程
          </button>
          <p className="mt-3 text-[10px] font-extrabold tracking-widest text-primary/40">
            {customScreenTexts['home:footer-text'] || '每週更新課程'}
          </p>
        </section>
      </main>
    </div>
  );
};

// 2. Journey Path Preview (Visual 12 steps flow)
export const JourneyPreview: React.FC = () => {
  const { discipleshipSteps, customScreenTexts } = useAppContent();

  const sortedSteps = [...discipleshipSteps].sort((a, b) => a.order - b.order);

  return (
    <div className="w-full bg-surface text-on-surface pb-24 font-sans select-none">
      <header className="p-5 border-b border-[rgba(40,53,28,0.05)] bg-white/80 backdrop-blur-md">
        <h1 className="font-headline text-2xl font-black text-primary">
          {customScreenTexts['journey:title'] || '門徒生命成長路徑'}
        </h1>
        <p className="text-xs font-bold text-secondary">
          {customScreenTexts['journey:subtitle'] || 'Discipleship Journey'}
        </p>
      </header>

      <main className="px-5 pt-6 max-w-xl mx-auto">
        <div className="relative">
          {/* Central connector line */}
          <div className="absolute bottom-4 left-9 top-4 -z-10 w-0.5 bg-outline-variant/60" />

          {sortedSteps.map((step) => {
            const isLocked = step.status === 'locked';
            const isActive = step.status === 'active';
            const isComplete = step.status === 'complete';

            return (
              <div
                key={step.id}
                className={`relative mb-3.5 flex w-full items-center rounded-2xl border p-4 text-left bg-white shadow-sm border-outline-variant/30 ${
                  isLocked ? 'opacity-55 grayscale' : ''
                } ${isActive ? 'ring-2 ring-secondary' : ''}`}
              >
                <div
                  className={`mr-4 flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                    isActive
                      ? 'bg-secondary text-white'
                      : isComplete
                      ? 'bg-green-100 text-green-700'
                      : 'bg-surface-container-high text-primary'
                  }`}
                >
                  <Icon name={isLocked ? 'lock' : step.icon} className="text-lg" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-secondary">
                      Step {step.order}
                    </span>
                    {isComplete && (
                      <Icon name="check_circle" className="text-xs text-green-600" />
                    )}
                  </div>
                  <h3 className="font-headline text-sm font-bold leading-tight text-primary truncate">
                    {step.title}
                  </h3>
                  <p className="truncate text-[10px] text-on-surface-variant/70">
                    {step.subtitle}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
};

// 3. Quiet Time Library Preview — full faithful replica of LibraryScreen
export const QuietTimeLibraryPreview: React.FC = () => {
  const { quietTimeEntries } = useAppContent();
  const [viewMode, setViewMode] = useState<'directory' | 'deck'>('directory');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBook, setSelectedBook] = useState('all');
  const [selectedTopic, setSelectedTopic] = useState('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest');
  const [starredOnly, setStarredOnly] = useState(false);
  const [filtersExpanded, setFiltersExpanded] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<any | null>(null);
  const [starredIds, setStarredIds] = useState<string[]>([]);
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const [deckCard, setDeckCard] = useState<any | null>(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [drawnIds, setDrawnIds] = useState<string[]>([]);

  const allBooks = useMemo(() => Array.from(new Set(quietTimeEntries.map((e) => e.book))), [quietTimeEntries]);
  const allTopics = useMemo(() => Array.from(new Set(quietTimeEntries.flatMap((e) => e.topics))), [quietTimeEntries]);

  const filteredEntries = useMemo(() => {
    let result = [...quietTimeEntries];
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          e.book.toLowerCase().includes(q) ||
          e.scriptureText.toLowerCase().includes(q) ||
          e.topics.some((t: string) => t.toLowerCase().includes(q)),
      );
    }
    if (selectedBook !== 'all') result = result.filter((e) => e.book === selectedBook);
    if (selectedTopic !== 'all') result = result.filter((e) => e.topics.includes(selectedTopic));
    if (starredOnly) result = result.filter((e) => starredIds.includes(e.id));
    result.sort((a, b) => {
      const da = new Date(a.dateAdded).getTime();
      const db = new Date(b.dateAdded).getTime();
      return sortBy === 'newest' ? db - da : da - db;
    });
    return result;
  }, [quietTimeEntries, searchQuery, selectedBook, selectedTopic, starredOnly, starredIds, sortBy]);

  const toggleStar = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setStarredIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  const drawCard = () => {
    let pool = quietTimeEntries.filter((e) => !drawnIds.includes(e.id));
    if (pool.length === 0) {
      pool = [...quietTimeEntries];
      setDrawnIds([]);
    }
    const chosen = pool[Math.floor(Math.random() * pool.length)];
    if (!chosen) return;
    setDeckCard(chosen);
    setIsFlipped(false);
    setDrawnIds((prev) => [...prev, chosen.id]);
  };

  return (
    <div className="relative w-full bg-[#fbf9f5] text-on-surface select-none font-sans" style={{ minHeight: '100%' }}>
      {/* Page Header */}
      <header className="sticky top-0 z-30 border-b border-[rgba(40,53,28,0.08)] bg-white/90 backdrop-blur-md">
        <div className="flex h-14 items-center gap-3 px-4">
          <Icon name="arrow_back" className="text-lg text-primary" />
          <p className="font-headline text-sm font-black text-primary">自修學習</p>
        </div>
      </header>

      {/* View Mode Tabs */}
      <div className="sticky z-20 bg-[#fbf9f5] px-4 py-3 border-b border-[#efe9dd]" style={{ top: '3.5rem' }}>
        <div className="flex bg-[#efeee9] rounded-full p-1 w-full border border-[#c5c8bd]/30">
          <button
            onClick={() => setViewMode('directory')}
            className={`flex-1 py-2 rounded-full text-[11px] font-bold flex items-center justify-center gap-1 transition-all ${viewMode === 'directory' ? 'bg-primary text-white shadow-sm' : 'text-on-surface-variant'}`}
          >
            <Icon name="collections_bookmark" className="text-xs" />
            靈修目錄
          </button>
          <button
            onClick={() => { setViewMode('deck'); if (!deckCard) drawCard(); }}
            className={`flex-1 py-2 rounded-full text-[11px] font-bold flex items-center justify-center gap-1 transition-all ${viewMode === 'deck' ? 'bg-primary text-white shadow-sm' : 'text-on-surface-variant'}`}
          >
            <Icon name="style" className="text-xs" />
            靈修抽卡
          </button>
        </div>
      </div>

      {/* ── DIRECTORY MODE ── */}
      {viewMode === 'directory' && (
        <div className="px-4 py-4 pb-16 space-y-4">
          {/* Search + Filter bar */}
          <div className="bg-white rounded-[1.3rem] border border-[#c5c8bd]/30 p-4 shadow-sm space-y-3">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-outline">
                  <Icon name="search" className="text-[18px]" />
                </span>
                <input
                  type="text"
                  placeholder="搜尋題目或關鍵字..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-2xl border border-outline-variant bg-surface-container-low/55 text-xs text-on-surface outline-none"
                />
              </div>
              <button
                onClick={() => setFiltersExpanded(!filtersExpanded)}
                className={`flex items-center justify-center h-10 w-10 rounded-2xl border transition ${filtersExpanded ? 'bg-primary text-white border-primary' : 'bg-surface-container-low/55 text-on-surface-variant border-outline-variant/40'}`}
              >
                <Icon name={filtersExpanded ? 'expand_less' : 'filter_list'} className="text-[18px]" />
              </button>
            </div>

            {/* Active filter chips */}
            {(selectedBook !== 'all' || selectedTopic !== 'all' || starredOnly) && (
              <div className="flex flex-wrap gap-1.5">
                {selectedBook !== 'all' && (
                  <span className="inline-flex items-center gap-1 bg-[#ffdfa0]/40 text-[#795900] text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border border-[#ffdfa0]/80">
                    書卷: {selectedBook}
                    <button onClick={() => setSelectedBook('all')}><Icon name="close" className="text-[9px]" /></button>
                  </span>
                )}
                {selectedTopic !== 'all' && (
                  <span className="inline-flex items-center gap-1 bg-surface-container-low text-on-surface-variant text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border border-[#c5c8bd]/30">
                    主題: {selectedTopic}
                    <button onClick={() => setSelectedTopic('all')}><Icon name="close" className="text-[9px]" /></button>
                  </span>
                )}
                {starredOnly && (
                  <span className="inline-flex items-center gap-1 bg-[#ffdfa0]/50 text-secondary text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border border-[#ffdfa0]/80">
                    僅顯示收藏
                    <button onClick={() => setStarredOnly(false)}><Icon name="close" className="text-[9px]" /></button>
                  </span>
                )}
                <button
                  onClick={() => { setSelectedBook('all'); setSelectedTopic('all'); setStarredOnly(false); }}
                  className="text-[10px] font-extrabold text-[#795900] underline ml-1 self-center"
                >
                  清除全部
                </button>
              </div>
            )}

            {/* Expanded filters */}
            {filtersExpanded && (
              <div className="pt-3 border-t border-[#efe9dd] space-y-3">
                {allBooks.length > 0 && (
                  <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                    <span className="text-[10px] font-extrabold text-outline shrink-0">書卷:</span>
                    {(['all', ...allBooks] as string[]).map((b) => (
                      <button key={b} onClick={() => setSelectedBook(b)}
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold whitespace-nowrap transition ${selectedBook === b ? 'bg-primary-container text-white' : 'bg-surface-container-low text-on-surface-variant'}`}>
                        {b === 'all' ? '全部' : b}
                      </button>
                    ))}
                  </div>
                )}
                {allTopics.length > 0 && (
                  <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                    <span className="text-[10px] font-extrabold text-outline shrink-0">主題:</span>
                    {(['all', ...allTopics] as string[]).map((t) => (
                      <button key={t} onClick={() => setSelectedTopic(t)}
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold whitespace-nowrap transition ${selectedTopic === t ? 'bg-primary-container text-white' : 'bg-surface-container-low text-on-surface-variant'}`}>
                        {t === 'all' ? '全部' : t}
                      </button>
                    ))}
                  </div>
                )}
                <div className="flex items-center justify-between pt-2 border-t border-[#efe9dd]">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-extrabold text-outline">排序:</span>
                    <select value={sortBy} onChange={(e: any) => setSortBy(e.target.value)}
                      className="bg-transparent text-[10px] font-bold text-primary outline-none">
                      <option value="newest">最新上架</option>
                      <option value="oldest">由舊到新</option>
                    </select>
                  </div>
                  <button onClick={() => setStarredOnly(!starredOnly)}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-full border text-[10px] font-bold transition ${starredOnly ? 'border-[#ffc641] bg-secondary-fixed/30 text-secondary' : 'border-outline-variant text-on-surface-variant'}`}>
                    <Icon name={starredOnly ? 'star' : 'star_border'} className="text-xs" />
                    僅顯示收藏
                  </button>
                </div>
              </div>
            )}

            <div className="pt-2 border-t border-[#efe9dd]/50 text-[10px] font-extrabold text-outline">
              共找到 {filteredEntries.length} 篇靈修材料
            </div>
          </div>

          {/* Card list */}
          {filteredEntries.length > 0 ? (
            <div className="space-y-3">
              {filteredEntries.map((entry) => (
                <div
                  key={entry.id}
                  onClick={() => setSelectedEntry(entry)}
                  className="bg-white border border-[#c5c8bd]/30 rounded-[1.4rem] p-4 shadow-sm cursor-pointer active:scale-[0.99] transition-all hover:shadow-md"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-extrabold tracking-wider text-secondary bg-[#ffdfa0]/50 px-2.5 py-0.5 rounded-full whitespace-nowrap">
                        {entry.book} {entry.passage}
                      </span>
                    </div>
                    <button onClick={(e) => toggleStar(entry.id, e)} className="h-7 w-7 flex items-center justify-center rounded-full">
                      <Icon name={starredIds.includes(entry.id) ? 'star' : 'star_border'} className={`text-lg ${starredIds.includes(entry.id) ? 'text-[#795900]' : 'text-outline'}`} />
                    </button>
                  </div>
                  <h3 className="font-headline text-sm font-bold text-primary">{entry.title}</h3>
                  <p className="mt-1.5 text-[11px] text-on-surface-variant line-clamp-2 leading-relaxed">{entry.content[0]}</p>
                  <div className="mt-3 pt-2 border-t border-[#efe9dd]/60 flex flex-wrap gap-1">
                    {entry.topics.map((t: string) => (
                      <span key={t} onClick={(e: React.MouseEvent) => { e.stopPropagation(); setSelectedTopic(t); }}
                        className="text-[9px] font-extrabold bg-surface-container-low text-on-surface-variant/80 px-2 py-0.5 rounded-full uppercase cursor-pointer">
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-[1.3rem] border border-[#c5c8bd]/30 p-10 text-center shadow-sm">
              <span className="material-symbols-outlined text-[40px] text-outline/30">find_in_page</span>
              <p className="mt-3 text-xs font-bold text-primary">沒有找到符合條件的靈修材料</p>
              <button onClick={() => { setSearchQuery(''); setSelectedBook('all'); setSelectedTopic('all'); setStarredOnly(false); }}
                className="mt-4 inline-flex items-center gap-1.5 px-4 py-1.5 bg-primary text-white text-[10px] font-bold rounded-full">
                重設所有篩選
              </button>
            </div>
          )}
        </div>
      )}

      {/* ── DECK MODE ── */}
      {viewMode === 'deck' && (
        <div className="flex flex-col items-center justify-center py-8 px-4 space-y-6">
          <div className="relative w-full max-w-[240px] aspect-[3/4]" style={{ perspective: '1000px' }}>
            {deckCard ? (
              <div
                onClick={() => setIsFlipped(!isFlipped)}
                className="absolute inset-0 cursor-pointer transition-transform duration-700"
                style={{ transformStyle: 'preserve-3d', transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
              >
                {/* Card Back */}
                <div className="absolute inset-0 rounded-[1.8rem] bg-gradient-to-br from-[#28351c] to-[#3e4c31] border-4 border-[#efe9dd] shadow-xl flex flex-col items-center justify-between p-5"
                  style={{ backfaceVisibility: 'hidden' }}>
                  <Icon name="auto_stories" className="text-xl text-[#ffdfa0]/60" />
                  <div className="text-center">
                    <p className="text-lg font-bold text-[#ffdfa0] font-headline">每日靈修卡</p>
                    <p className="text-[9px] text-[#efe9dd]/50 tracking-widest mt-1">IFU DISCIPLESHIP</p>
                  </div>
                  <p className="text-[9px] text-[#ffdfa0]/70 font-bold flex items-center gap-1">
                    <Icon name="touch_app" className="text-[9px]" />點擊翻面讀經
                  </p>
                </div>
                {/* Card Front */}
                <div className="absolute inset-0 rounded-[1.8rem] bg-[#fbf9f5] border border-[#c5c8bd]/30 shadow-xl p-5 flex flex-col justify-between"
                  style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
                  <div>
                    <div className="flex justify-between items-center">
                      <span className="text-[9px] font-extrabold text-secondary bg-[#ffdfa0]/50 px-2 py-0.5 rounded-full">
                        {deckCard.book} {deckCard.passage}
                      </span>
                      <button onClick={(e) => toggleStar(deckCard.id, e)}>
                        <Icon name={starredIds.includes(deckCard.id) ? 'star' : 'star_border'} className={`text-base ${starredIds.includes(deckCard.id) ? 'text-[#795900]' : 'text-outline'}`} />
                      </button>
                    </div>
                    <h2 className="mt-3 font-headline text-base font-bold text-primary">{deckCard.title}</h2>
                    <div className="mt-3 p-2.5 bg-surface-container-low/70 border-l-2 border-[#795900] rounded-r-lg">
                      <p className="text-[10px] font-headline text-primary/90 italic leading-relaxed line-clamp-4">{deckCard.scriptureText}</p>
                    </div>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); setSelectedEntry(deckCard); }}
                    className="mt-3 w-full py-2 bg-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center gap-1"
                  >
                    <Icon name="menu_book" className="text-xs" />閱讀整篇靈修
                  </button>
                </div>
              </div>
            ) : (
              <div className="w-full h-full rounded-[1.8rem] border-2 border-dashed border-outline-variant flex flex-col items-center justify-center text-center p-6">
                <Icon name="style" className="text-[40px] text-outline/30" />
                <p className="mt-3 text-xs font-bold text-primary">靈修卡片庫已空</p>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            {drawnIds.length > 0 && (
              <button onClick={() => { setDeckCard(null); setDrawnIds([]); setIsFlipped(false); }}
                className="px-4 py-2 border border-outline-variant text-on-surface-variant text-[10px] font-bold rounded-full">
                洗牌 / 重置
              </button>
            )}
            <button onClick={drawCard}
              className="px-5 py-2 bg-secondary text-on-secondary-fixed text-[10px] font-extrabold rounded-full flex items-center gap-1.5">
              <Icon name="casino" className="text-xs" />
              {deckCard ? '抽下一張' : '開始抽卡'}
            </button>
          </div>
          {drawnIds.length > 0 && (
            <p className="text-[9px] font-bold text-outline">已抽: {drawnIds.length} / {quietTimeEntries.length} 張</p>
          )}
        </div>
      )}

      {/* ── CARD DETAIL MODAL ── */}
      {selectedEntry && (
        <div className="absolute inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm">
          <div className="absolute inset-0" onClick={() => setSelectedEntry(null)} />
          <div className="relative w-full bg-[#fbf9f5] rounded-t-[1.8rem] shadow-2xl flex flex-col max-h-[88%] overflow-hidden z-10">
            {/* Drag handle */}
            <div className="h-5 shrink-0 flex justify-center items-center">
              <div className="h-1 w-8 rounded-full bg-outline-variant/40" />
            </div>

            {/* Scrollable content */}
            <div className="overflow-y-auto px-5 pb-20 space-y-5 flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-extrabold tracking-widest text-secondary bg-[#ffdfa0]/50 px-2 py-0.5 rounded-full">
                    {selectedEntry.book} {selectedEntry.passage}
                  </span>
                  <h2 className="mt-2 font-headline text-xl font-bold text-primary">{selectedEntry.title}</h2>
                </div>
                <div className="flex gap-1.5 shrink-0 ml-3">
                  <button onClick={() => toggleStar(selectedEntry.id)}
                    className="h-9 w-9 flex items-center justify-center rounded-full bg-surface-container">
                    <Icon name={starredIds.includes(selectedEntry.id) ? 'star' : 'star_border'} className={`text-lg ${starredIds.includes(selectedEntry.id) ? 'text-[#795900]' : 'text-outline'}`} />
                  </button>
                  <button onClick={() => setSelectedEntry(null)}
                    className="h-9 w-9 flex items-center justify-center rounded-full bg-surface-container text-on-surface-variant">
                    <Icon name="close" className="text-lg" />
                  </button>
                </div>
              </div>

              {/* 【經文】 */}
              <div className="p-4 bg-surface-container-low border-l-4 border-secondary rounded-r-xl space-y-1">
                <span className="block text-[10px] font-extrabold tracking-[0.2em] text-secondary">【經文】</span>
                <p className="font-headline text-base leading-7 text-primary font-bold">{selectedEntry.scriptureText}</p>
              </div>

              {/* 【靈修分享】 */}
              <div>
                <span className="block text-[10px] font-extrabold tracking-[0.2em] text-outline mb-2">【靈修分享】</span>
                <div className="space-y-3 text-xs leading-6 text-on-surface-variant">
                  {selectedEntry.content.map((para: string, i: number) => (
                    <p key={i} className="text-justify">{para}</p>
                  ))}
                </div>
              </div>

              {/* 【默想應用】 */}
              <div className="p-4 bg-white border border-[#c5c8bd]/30 rounded-2xl space-y-2 shadow-sm">
                <span className="flex items-center gap-1 text-[10px] font-extrabold tracking-[0.2em] text-primary">
                  <Icon name="help" className="text-xs text-secondary" />
                  【默想應用】
                </span>
                <ul className="space-y-2 text-[11px] text-on-surface-variant font-bold leading-relaxed">
                  {selectedEntry.reflection.map((r: string, i: number) => (
                    <li key={i} className="flex gap-2 items-start">
                      <span className="h-4 w-4 bg-primary-container text-white text-[9px] rounded-full flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 【祈禱回應】 */}
              <div className="p-4 bg-[#d8e8c4]/30 border border-[#acbc9a]/30 rounded-2xl space-y-1.5">
                <span className="flex items-center gap-1 text-[10px] font-extrabold tracking-[0.2em] text-primary">
                  <Icon name="favorite" className="text-xs" />
                  【祈禱回應】
                </span>
                <p className="text-xs text-primary-container font-bold leading-relaxed italic">{selectedEntry.prayer}</p>
              </div>
            </div>

            {/* Footer action bar */}
            <div className="absolute bottom-0 inset-x-0 bg-white/95 border-t border-[#efe9dd] px-5 py-3 flex items-center justify-between shrink-0">
              <span className="text-[9px] font-extrabold text-outline">建立日期: {selectedEntry.dateAdded}</span>
              <button
                onClick={() => {
                  setCompletedIds((prev) =>
                    prev.includes(selectedEntry.id) ? prev.filter((id) => id !== selectedEntry.id) : [...prev, selectedEntry.id],
                  );
                  setSelectedEntry(null);
                }}
                className={`px-5 py-1.5 text-[10px] font-bold rounded-full transition ${
                  completedIds.includes(selectedEntry.id)
                    ? 'bg-green-50 border border-green-200 text-green-700'
                    : 'bg-primary text-white'
                }`}
              >
                {completedIds.includes(selectedEntry.id) ? '已完成 ✓' : '已完成靈修'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// 4. Lesson Preview (Previewing dynamic card composition: Headers, script reveals, reflection worksheets)
interface LessonPreviewProps {
  lessonId: string;
}

export const LessonPreview: React.FC<LessonPreviewProps> = ({ lessonId }) => {
  const { lessonRoutes } = useAppContent();
  const activeLesson = lessonRoutes.find((r) => r.id === lessonId);

  if (!activeLesson) {
    return (
      <div className="p-8 text-center text-xs font-bold text-on-surface-variant">
        正在載入或未選擇課程
      </div>
    );
  }

  return (
    <div className="w-full bg-surface text-on-surface pb-32 font-sans select-none">
      {/* Page header mock */}
      <div className="sticky top-0 z-20 flex items-center justify-between border-b border-outline-variant/30 bg-white/95 px-4 py-3">
        <div className="flex items-center gap-2 text-primary">
          <Icon name="arrow_back" className="text-lg cursor-pointer" />
          <h2 className="font-headline text-sm font-black leading-tight">
            {activeLesson.title}
          </h2>
        </div>
        <span className="text-[10px] font-bold text-secondary font-mono bg-surface-container px-2 py-0.5 rounded">
          {activeLesson.id.replace('lesson-', '')}
        </span>
      </div>

      {/* Cards list */}
      <div className="px-4 py-6 space-y-6 flex flex-col items-center">
        {activeLesson.modules.map((mod: StudyModule) => {
          const cardTheme = mod.visual?.accent || 'surface';
          const cardStyle = getCardStyle(cardTheme);
          const sizeClass = mod.visual?.imageStyle || 'max-w-2xl';
          const heightClass = mod.visual?.eyebrow || 'min-h-auto';

          return (
            <section
              key={mod.id}
              className={`w-full ${sizeClass} ${heightClass} ${cardStyle} relative border-outline-variant/30`}
            >
              {cardTheme === 'primary' && (
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,223,160,0.15),_transparent_35%)] pointer-events-none" />
              )}

              {/* Title display */}
              {mod.title && mod.kind !== 'extension-card' && mod.kind !== 'appendix' && (
                <div
                  className={`flex items-center gap-2 mb-3.5 ${
                    cardTheme === 'primary' ? 'text-secondary-fixed-dim' : 'text-secondary'
                  }`}
                >
                  {mod.kind === 'reflection-prompt' && (
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-secondary-fixed text-[10px] font-extrabold text-on-secondary-fixed">
                      {(mod as any).number || 'Q'}
                    </span>
                  )}
                  <h3
                    className={`font-headline text-base font-bold leading-snug ${
                      cardTheme === 'primary' ? 'text-white' : 'text-primary'
                    }`}
                  >
                    {mod.title}
                  </h3>
                </div>
              )}

              {/* Kind based content rendering */}
              {mod.kind === 'content-section' && (
                <div className="space-y-3">
                  {mod.body && (
                    <p
                      className={`text-xs leading-6 whitespace-pre-wrap ${
                        cardTheme === 'primary' ? 'text-on-primary-container' : 'text-on-surface-variant'
                      }`}
                    >
                      {mod.body}
                    </p>
                  )}
                  {mod.scriptures && mod.scriptures.length > 0 && (
                    <div className="mt-3.5 space-y-2">
                      {mod.scriptures.map((sc, sIdx) => (
                        <ScriptureToggle key={sIdx} scripture={sc} />
                      ))}
                    </div>
                  )}
                </div>
              )}

              {mod.kind === 'reflection-prompt' && (
                <div className="space-y-3 text-on-surface">
                  <p className="text-xs font-semibold leading-5 text-on-surface">
                    {(mod as any).prompt}
                  </p>
                  {(mod as any).scriptures && (mod as any).scriptures.length > 0 && (
                    <div className="space-y-2">
                      {(mod as any).scriptures.map((sc: ScriptureReference, sIdx: number) => (
                        <ScriptureToggle key={sIdx} scripture={sc} />
                      ))}
                    </div>
                  )}
                  <div className="mt-3">
                    <textarea
                      disabled
                      rows={2}
                      className="w-full resize-none rounded-xl border border-outline-variant bg-surface-container-low/50 p-2.5 text-xs text-on-surface-variant outline-none"
                      placeholder="在這裡輸入你的答案... (預覽模式不可輸入)"
                    />
                    <span className="mt-1 block text-right text-[9px] font-extrabold text-on-surface-variant/40">
                      已自動儲存
                    </span>
                  </div>
                </div>
              )}

              {mod.kind === 'summary-card' && (
                <div className="space-y-3">
                  {(mod as any).body && (
                    <p
                      className={`text-xs leading-6 whitespace-pre-wrap ${
                        cardTheme === 'primary' ? 'text-on-primary-container' : 'text-on-surface-variant'
                      }`}
                    >
                      {(mod as any).body}
                    </p>
                  )}
                  {(mod as any).points && (mod as any).points.length > 0 && (
                    <ul className="space-y-2 mt-3 text-xs">
                      {(mod as any).points.map((pt: string, pIdx: number) => (
                        <li key={pIdx} className="flex items-start gap-2 text-on-surface-variant leading-relaxed">
                          <Icon name="check_circle" className="text-secondary text-sm shrink-0 mt-0.5" />
                          <span>{pt}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}

              {mod.kind === 'scripture-reveal' && (
                <div className="space-y-3">
                  {mod.title && (
                    <h3 className={`font-headline text-base font-bold ${cardTheme === 'primary' ? 'text-white' : 'text-primary'}`}>
                      {mod.title}
                    </h3>
                  )}
                  {mod.scriptures && mod.scriptures.length > 0 && (
                    <div className="mt-3.5 space-y-2">
                      {mod.scriptures.map((sc, sIdx) => (
                        <ScriptureToggle key={sIdx} scripture={sc} />
                      ))}
                    </div>
                  )}
                </div>
              )}

              {mod.kind === 'interactive-visual' && (
                <div className="space-y-3 text-on-surface">
                  {mod.title && (
                    <h3 className={`font-headline text-base font-bold ${cardTheme === 'primary' ? 'text-white' : 'text-primary'}`}>
                      {mod.title}
                    </h3>
                  )}
                  {mod.description && (
                    <p className={`text-xs leading-6 ${cardTheme === 'primary' ? 'text-on-primary-container' : 'text-on-surface-variant'}`}>
                      {mod.description}
                    </p>
                  )}
                  <div className="rounded-[1.5rem] border border-outline-variant/60 bg-surface-container-low p-5 flex flex-col items-center justify-center min-h-[140px] text-center shadow-inner relative overflow-hidden">
                    <div className="absolute inset-0 bg-radial-gradient(circle_at_center, rgba(121,89,0,0.03), transparent 70%) pointer-events-none" />
                    <span className="text-[9px] font-bold text-secondary uppercase bg-white px-2 py-0.5 rounded border border-outline-variant/40 font-mono mb-4 z-10">
                      互動圖表: {mod.visualKind}
                    </span>
                    <div className="flex gap-3 items-center justify-center flex-wrap z-10">
                      {(mod as any).labels?.map((lbl: any, lIdx: number) => (
                        <div key={lIdx} className="bg-white border border-outline px-3.5 py-1.5 rounded-full text-xs font-bold text-primary shadow-sm flex flex-col">
                          <span>{lbl.label}</span>
                          {lbl.description && <span className="text-[9px] font-medium text-secondary tracking-wider uppercase mt-0.5">{lbl.description}</span>}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {mod.kind === 'prayer' && (
                <p
                  className={`font-headline text-xs font-bold leading-6 ${
                    cardTheme === 'primary' ? 'text-white' : 'text-primary'
                  }`}
                >
                  {mod.body}
                </p>
              )}

              {mod.kind === 'appendix' && (
                <div className="text-on-surface">
                  <div className="flex items-center gap-2 text-secondary">
                    <Icon name="article" className="text-lg" />
                    <span className="text-[9px] font-extrabold uppercase tracking-wider">
                      附件
                    </span>
                  </div>
                  <h4 className="mt-2 font-headline text-base font-bold text-primary">
                    {mod.title || '附件標題'}
                  </h4>
                  {mod.body && (
                    <p className="mt-2 text-xs leading-5 text-on-surface-variant">
                      {mod.body}
                    </p>
                  )}
                  <button
                    type="button"
                    className="mt-3 flex items-center gap-1.5 rounded-full bg-secondary px-4 py-2 text-[10px] font-extrabold text-white"
                  >
                    查看附件
                    <Icon name="open_in_full" className="text-[12px]" />
                  </button>
                </div>
              )}

              {mod.kind === 'extension-card' && (
                <div className="text-on-surface">
                  <div className="flex items-center gap-2 text-secondary">
                    <Icon name="extension" className="text-lg" />
                    <span className="text-[9px] font-extrabold uppercase tracking-wider">
                      延伸學習
                    </span>
                  </div>
                  <h4 className="mt-2 font-headline text-base font-bold text-primary">
                    {mod.title}
                  </h4>
                  {(mod as any).description && (
                    <p className="mt-1 text-[10px] leading-4 text-on-surface-variant">
                      {(mod as any).description}
                    </p>
                  )}
                  <button
                    type="button"
                    className="mt-3.5 flex items-center gap-1.5 rounded-full bg-secondary px-4 py-2 text-[10px] font-extrabold text-white"
                  >
                    開始延伸學習
                    <Icon name="arrow_forward" className="text-[12px]" />
                  </button>
                </div>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
};
