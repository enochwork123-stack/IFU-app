import React, { useState, useEffect, useMemo } from 'react';
import { PageHeader } from '../components/PageHeader';
import { Icon } from '../components/Icon';
import { quietTimeEntries } from '../data/quietTimeData';
import { QuietTimeEntry } from '../types/quietTime';

export const LibraryScreen: React.FC = () => {
  // Navigation / View modes
  const [viewMode, setViewMode] = useState<'directory' | 'deck'>('directory');

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBook, setSelectedBook] = useState<string>('all');
  const [selectedTopic, setSelectedTopic] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'starred'>('newest');
  const [starredOnly, setStarredOnly] = useState(false);
  const [filtersExpanded, setFiltersExpanded] = useState(false);

  // Detail Modal state
  const [selectedEntry, setSelectedEntry] = useState<QuietTimeEntry | null>(null);

  // Starred quiet times state (persistent in localStorage)
  const [starredIds, setStarredIds] = useState<string[]>([]);

  // Random deck draw state
  const [deckCard, setDeckCard] = useState<QuietTimeEntry | null>(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [drawnIds, setDrawnIds] = useState<string[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);

  // Load starred items on mount
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem('ifu:starred-quiet-times');
      if (saved) {
        setStarredIds(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Error loading starred quiet times', e);
    }
  }, []);

  // Save starred items when state changes
  const toggleStar = (id: string, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    const updated = starredIds.includes(id)
      ? starredIds.filter((item) => item !== id)
      : [...starredIds, id];
    setStarredIds(updated);
    try {
      window.localStorage.setItem('ifu:starred-quiet-times', JSON.stringify(updated));
    } catch (err) {
      console.error('Error saving starred quiet times', err);
    }
  };

  // Extract all unique books and topics for filters
  const allBooks = useMemo(() => {
    const books = quietTimeEntries.map((entry) => entry.book);
    return Array.from(new Set(books));
  }, []);

  const allTopics = useMemo(() => {
    const topics = quietTimeEntries.flatMap((entry) => entry.topics);
    return Array.from(new Set(topics));
  }, []);

  // Directory filter & sort logic
  const filteredEntries = useMemo(() => {
    let result = [...quietTimeEntries];

    // Filter by search query
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (entry) =>
          entry.title.toLowerCase().includes(q) ||
          entry.book.toLowerCase().includes(q) ||
          entry.passage.toLowerCase().includes(q) ||
          entry.scriptureText.toLowerCase().includes(q) ||
          entry.content.some((para) => para.toLowerCase().includes(q)) ||
          entry.topics.some((topic) => topic.toLowerCase().includes(q))
      );
    }

    // Filter by book
    if (selectedBook !== 'all') {
      result = result.filter((entry) => entry.book === selectedBook);
    }

    // Filter by topic
    if (selectedTopic !== 'all') {
      result = result.filter((entry) => entry.topics.includes(selectedTopic));
    }

    // Filter by starred only
    if (starredOnly) {
      result = result.filter((entry) => starredIds.includes(entry.id));
    }

    // Sorting
    result.sort((a, b) => {
      const dateA = new Date(a.dateAdded).getTime();
      const dateB = new Date(b.dateAdded).getTime();

      if (sortBy === 'newest') {
        return dateB - dateA;
      } else if (sortBy === 'oldest') {
        return dateA - dateB;
      } else if (sortBy === 'starred') {
        const aStarred = starredIds.includes(a.id) ? 1 : 0;
        const bStarred = starredIds.includes(b.id) ? 1 : 0;
        if (aStarred !== bStarred) {
          return bStarred - aStarred; // Starred first
        }
        return dateB - dateA; // Then newest first
      }
      return 0;
    });

    return result;
  }, [searchQuery, selectedBook, selectedTopic, sortBy, starredOnly, starredIds]);

  // Deck Mode: Draw a random card
  const handleDrawCard = () => {
    setIsDrawing(true);
    setIsFlipped(false);

    // Filter out cards already drawn in this cycle
    let availablePool = quietTimeEntries.filter((entry) => !drawnIds.includes(entry.id));

    // If all cards drawn, reset cycle
    if (availablePool.length === 0) {
      availablePool = [...quietTimeEntries];
      // Keep only the current card as drawn to avoid immediate duplication
      const nextDrawnIds = deckCard ? [deckCard.id] : [];
      setDrawnIds(nextDrawnIds);
      availablePool = availablePool.filter((entry) => entry.id !== deckCard?.id);
    }

    // Pick random index
    if (availablePool.length > 0) {
      const randomIndex = Math.floor(Math.random() * availablePool.length);
      const chosen = availablePool[randomIndex] as QuietTimeEntry;

      // Delay setting card to let slide-out finish if there was a previous card
      setTimeout(() => {
        setDeckCard(chosen);
        setDrawnIds((prev) => [...prev, chosen.id]);
        setIsDrawing(false);
      }, 400);
    } else {
      setIsDrawing(false);
    }
  };

  // Reset deck state
  const resetDeck = () => {
    setDeckCard(null);
    setIsFlipped(false);
    setDrawnIds([]);
  };

  return (
    <>
      {/* Scope CSS for 3D card flips */}
      <style dangerouslySetInnerHTML={{ __html: `
        .perspective-1000 {
          perspective: 1000px;
        }
        .preserve-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
        .scale-up-pop {
          animation: pop 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) both;
        }
        @keyframes pop {
          0% { transform: scale(0.9); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
      ` }} />

      <PageHeader title="自修學習" backTo={undefined} action={undefined} />

      {/* Tabs Menu Bar */}
      <div className="sticky top-[4.35rem] z-40 bg-[#fbf9f5] px-6 py-4 flex justify-center border-b border-[#efe9dd]">
        <div className="flex bg-[#efeee9] rounded-full p-1 w-full max-w-md border border-[#c5c8bd]/30">
          <button
            onClick={() => setViewMode('directory')}
            className={`flex-1 py-2 px-4 rounded-full text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              viewMode === 'directory'
                ? 'bg-primary text-white shadow-sm'
                : 'text-on-surface-variant hover:text-primary'
            }`}
          >
            <Icon name="collections_bookmark" className="text-sm" />
            靈修目錄
          </button>
          <button
            onClick={() => {
              setViewMode('deck');
              if (!deckCard) handleDrawCard();
            }}
            className={`flex-1 py-2 px-4 rounded-full text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              viewMode === 'deck'
                ? 'bg-primary text-white shadow-sm'
                : 'text-on-surface-variant hover:text-primary'
            }`}
          >
            <Icon name="style" className="text-sm" />
            靈修抽卡
          </button>
        </div>
      </div>

      <main className="w-full px-6 pb-28 pt-6">
        {/* DIRECTORY BROWSER MODE */}
        {viewMode === 'directory' && (
          <div className="space-y-6">
            {/* Search and Sort controls */}
            <div className="bg-white rounded-[1.5rem] border border-[#c5c8bd]/30 p-5 shadow-sm space-y-4">
              {/* Search Bar & Toggle Row */}
              <div className="flex gap-2.5">
                <div className="relative flex-1">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-outline">
                    <Icon name="search" className="text-[20px]" />
                  </span>
                  <input
                    type="text"
                    placeholder="搜尋題目、經文或主題關鍵字..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-10 py-3 rounded-2xl border border-outline-variant bg-surface-container-low/55 text-sm text-on-surface outline-none transition focus:border-secondary focus:bg-white focus:ring-4 focus:ring-secondary/10"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-outline hover:text-primary"
                    >
                      <Icon name="cancel" className="text-[18px]" />
                    </button>
                  )}
                </div>

                <button
                  onClick={() => setFiltersExpanded(!filtersExpanded)}
                  className={`flex items-center justify-center h-[46px] w-[46px] rounded-2xl border transition-all active:scale-95 cursor-pointer ${
                    filtersExpanded
                      ? 'bg-primary text-white border-primary shadow-sm'
                      : 'bg-surface-container-low/55 text-on-surface-variant border-outline-variant/40 hover:bg-surface-container-low'
                  }`}
                  title="進階篩選與排序"
                >
                  <Icon name={filtersExpanded ? 'expand_less' : 'filter_list'} className="text-[20px]" />
                </button>
              </div>

              {/* Active Filter Chips */}
              {(selectedBook !== 'all' || selectedTopic !== 'all' || starredOnly) && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {selectedBook !== 'all' && (
                    <span className="inline-flex items-center gap-1 bg-[#ffdfa0]/40 text-[#795900] text-[11px] font-extrabold px-3 py-1 rounded-full border border-[#ffdfa0]/80">
                      書卷: {selectedBook}
                      <button
                        onClick={() => setSelectedBook('all')}
                        className="hover:text-primary transition active:scale-90 ml-0.5 flex items-center"
                        title="清除此篩選"
                      >
                        <Icon name="close" className="text-xs font-black" />
                      </button>
                    </span>
                  )}
                  {selectedTopic !== 'all' && (
                    <span className="inline-flex items-center gap-1 bg-surface-container-low text-on-surface-variant text-[11px] font-extrabold px-3 py-1 rounded-full border border-[#c5c8bd]/30">
                      主題: {selectedTopic}
                      <button
                        onClick={() => setSelectedTopic('all')}
                        className="hover:text-primary transition active:scale-90 ml-0.5 flex items-center"
                        title="清除此篩選"
                      >
                        <Icon name="close" className="text-xs font-black" />
                      </button>
                    </span>
                  )}
                  {starredOnly && (
                    <span className="inline-flex items-center gap-1 bg-[#ffdfa0]/50 text-secondary text-[11px] font-extrabold px-3 py-1 rounded-full border border-[#ffdfa0]/80">
                      僅顯示收藏
                      <button
                        onClick={() => setStarredOnly(false)}
                        className="hover:text-primary transition active:scale-90 ml-0.5 flex items-center"
                        title="清除此篩選"
                      >
                        <Icon name="close" className="text-xs font-black" />
                      </button>
                    </span>
                  )}
                  <button
                    onClick={() => {
                      setSelectedBook('all');
                      setSelectedTopic('all');
                      setStarredOnly(false);
                    }}
                    className="text-[10px] font-extrabold text-[#795900] hover:text-[#28351c] underline cursor-pointer ml-1 self-center"
                  >
                    清除全部
                  </button>
                </div>
              )}

              {/* Collapsible advanced filters area */}
              {filtersExpanded && (
                <div className="pt-4 border-t border-[#efe9dd] space-y-4 animate-slide-down">
                  {/* Filtering Pills lists */}
                  <div className="space-y-3">
                    {/* Book filter */}
                    <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                      <span className="text-[11px] font-extrabold tracking-wider text-outline shrink-0 uppercase">
                        書卷:
                      </span>
                      <button
                        onClick={() => setSelectedBook('all')}
                        className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                          selectedBook === 'all'
                            ? 'bg-primary-container text-white'
                            : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
                        }`}
                      >
                        全部
                      </button>
                      {allBooks.map((book) => (
                        <button
                          key={book}
                          onClick={() => setSelectedBook(book)}
                          className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                            selectedBook === book
                              ? 'bg-primary-container text-white'
                              : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
                          }`}
                        >
                          {book}
                        </button>
                      ))}
                    </div>

                    {/* Topic filter */}
                    <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                      <span className="text-[11px] font-extrabold tracking-wider text-outline shrink-0 uppercase">
                        主題:
                      </span>
                      <button
                        onClick={() => setSelectedTopic('all')}
                        className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                          selectedTopic === 'all'
                            ? 'bg-primary-container text-white'
                            : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
                        }`}
                      >
                        全部
                      </button>
                      {allTopics.map((topic) => (
                        <button
                          key={topic}
                          onClick={() => setSelectedTopic(topic)}
                          className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                            selectedTopic === topic
                              ? 'bg-primary-container text-white'
                              : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
                          }`}
                        >
                          {topic}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Sorting and Starred Only Toggle */}
                  <div className="pt-3 border-t border-[#efe9dd] flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-extrabold text-outline">排序:</span>
                      <select
                        value={sortBy}
                        onChange={(e: any) => setSortBy(e.target.value)}
                        className="bg-transparent border-none text-xs font-bold text-primary focus:ring-0 outline-none cursor-pointer"
                      >
                        <option value="newest">最新上架</option>
                        <option value="oldest">由舊到新</option>
                        <option value="starred">已收藏優先</option>
                      </select>
                    </div>

                    <button
                      onClick={() => setStarredOnly(!starredOnly)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-bold transition-all cursor-pointer ${
                        starredOnly
                          ? 'border-[#ffc641] bg-secondary-fixed/30 text-secondary'
                          : 'border-outline-variant text-on-surface-variant hover:bg-surface-container-low'
                      }`}
                    >
                      <Icon
                        name={starredOnly ? 'star' : 'star_border'}
                        className={`text-sm ${starredOnly ? 'text-secondary fill-current' : ''}`}
                      />
                      僅顯示收藏
                    </button>
                  </div>
                </div>
              )}

              {/* Result Count and Star Status Feedback */}
              <div className="pt-2 border-t border-[#efe9dd]/50 flex justify-between items-center text-[11px] font-extrabold text-outline tracking-wider">
                <span>
                  共找到 {filteredEntries.length} 篇靈修材料
                </span>
                {starredIds.length > 0 && (
                  <span>
                    已收藏 {starredIds.length} 篇
                  </span>
                )}
              </div>
            </div>

            {/* Devotional Cards Grid */}
            {filteredEntries.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredEntries.map((entry) => {
                  const isStarred = starredIds.includes(entry.id);
                  return (
                    <div
                      key={entry.id}
                      onClick={() => setSelectedEntry(entry)}
                      className="bg-white border border-[#c5c8bd]/30 rounded-[1.65rem] p-5 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 active:scale-[0.99] cursor-pointer flex flex-col justify-between"
                    >
                      <div>
                        {/* Book & Passage citation header */}
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-extrabold tracking-widest text-secondary uppercase bg-[#ffdfa0]/50 px-2 py-0.5 rounded-full">
                            {entry.book} {entry.passage}
                          </span>
                          
                          {/* Star toggle button */}
                          <button
                            onClick={(e) => toggleStar(entry.id, e)}
                            className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-surface-container-low text-secondary active:scale-95 transition-transform"
                            aria-label={isStarred ? '取消收藏' : '加入收藏'}
                          >
                            <Icon
                              name={isStarred ? 'star' : 'star_border'}
                              className={`text-[20px] ${isStarred ? 'fill-current text-[#795900]' : 'text-outline'}`}
                            />
                          </button>
                        </div>

                        {/* Title */}
                        <h3 className="mt-3 font-headline text-lg font-bold text-primary">
                          {entry.title}
                        </h3>

                        {/* Snippet */}
                        <p className="mt-2 text-xs text-on-surface-variant line-clamp-2 leading-relaxed">
                          {entry.content[0]}
                        </p>
                      </div>

                      {/* Topic Tags */}
                      <div className="mt-4 pt-3 border-t border-[#efe9dd]/60 flex flex-wrap gap-1.5">
                        {entry.topics.map((topic) => (
                          <span
                            key={topic}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedTopic(topic);
                            }}
                            className="text-[9px] font-extrabold tracking-wider bg-surface-container-low hover:bg-surface-container text-on-surface-variant/80 px-2 py-0.5 rounded-full uppercase transition"
                          >
                            #{topic}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-white rounded-[1.5rem] border border-[#c5c8bd]/30 p-12 text-center shadow-sm">
                <span className="material-symbols-outlined text-[48px] text-outline/30">
                  find_in_page
                </span>
                <h3 className="mt-4 font-headline text-base font-bold text-primary">
                  沒有找到符合條件的靈修材料
                </h3>
                <p className="mt-2 text-xs text-on-surface-variant">
                  請嘗試修改搜尋詞，或清除分類篩選條件。
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedBook('all');
                    setSelectedTopic('all');
                    setStarredOnly(false);
                  }}
                  className="mt-6 inline-flex items-center gap-1.5 px-4 py-2 bg-primary hover:bg-[#3e4c31] text-white text-xs font-bold rounded-full transition cursor-pointer"
                >
                  重設所有篩選
                </button>
              </div>
            )}
          </div>
        )}

        {/* RANDOM DECK DRAW MODE */}
        {viewMode === 'deck' && (
          <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-8 py-4">
            {/* Main Interactive Deck */}
            <div className="relative w-full max-w-[320px] aspect-[3/4] perspective-1000">
              {deckCard ? (
                /* Card Element wrapper for 3D flip */
                <div
                  onClick={() => {
                    if (!isDrawing) setIsFlipped(!isFlipped);
                  }}
                  className={`absolute inset-0 cursor-pointer preserve-3d transition-transform duration-700 select-none ${isDrawing ? 'scale-95 opacity-50' : 'scale-up-pop'}`}
                  style={{ transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
                >
                  {/* CARD BACK SIDE */}
                  <div 
                    className="absolute inset-0 w-full h-full rounded-[2rem] bg-gradient-to-br from-[#28351c] to-[#3e4c31] border-4 border-[#efe9dd] shadow-[0_16px_36px_rgba(40,53,28,0.18)] flex flex-col items-center justify-between p-6 backface-hidden"
                    style={{ 
                      transform: 'rotateY(0deg)',
                      pointerEvents: isFlipped ? 'none' : 'auto'
                    }}
                  >
                    <div className="w-10 h-10 rounded-full border border-[#efe9dd]/30 flex items-center justify-center text-[#ffdfa0]/60">
                      <Icon name="auto_stories" className="text-xl" />
                    </div>

                    <div className="flex flex-col items-center text-center space-y-3">
                      <div className="text-2xl font-bold tracking-widest text-[#ffdfa0] font-headline">
                        每日靈修卡
                      </div>
                      <div className="text-[10px] text-[#efe9dd]/50 tracking-[0.2em]">
                        IFU DISCIPLESHIP
                      </div>
                    </div>

                    <div className="text-[10px] text-[#ffdfa0]/70 flex items-center gap-1 font-bold animate-pulse">
                      <Icon name="touch_app" className="text-xs" />
                      點擊翻面讀經
                    </div>
                  </div>

                  {/* CARD FRONT SIDE */}
                  <div 
                    className="absolute inset-0 w-full h-full rounded-[2rem] bg-[#fbf9f5] border border-[#c5c8bd]/30 shadow-[0_16px_36px_rgba(40,53,28,0.12)] p-6 flex flex-col justify-between backface-hidden"
                    style={{ 
                      transform: 'rotateY(180deg)',
                      pointerEvents: isFlipped ? 'auto' : 'none'
                    }}
                  >
                    <div className="flex flex-col flex-1 justify-between">
                      <div>
                        {/* Book & Star citation */}
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-extrabold tracking-widest text-secondary bg-[#ffdfa0]/50 px-2 py-0.5 rounded-full">
                            {deckCard.book} {deckCard.passage}
                          </span>

                          <button
                            onClick={(e) => toggleStar(deckCard.id, e)}
                            className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-surface-container-low text-secondary active:scale-95 transition-transform"
                            aria-label={starredIds.includes(deckCard.id) ? '取消收藏' : '加入收藏'}
                          >
                            <Icon
                              name={starredIds.includes(deckCard.id) ? 'star' : 'star_border'}
                              className={`text-[20px] ${
                                starredIds.includes(deckCard.id) ? 'fill-current text-[#795900]' : 'text-outline'
                              }`}
                            />
                          </button>
                        </div>

                        {/* Title */}
                        <h2 className="mt-4 font-headline text-xl font-bold text-primary">
                          {deckCard.title}
                        </h2>

                        {/* Scripture extract */}
                        <div className="mt-4 p-3 bg-surface-container-low/70 border-l-2 border-[#795900] rounded-r-xl">
                          <p className="text-xs font-headline text-primary/90 italic leading-relaxed line-clamp-4">
                            {deckCard.scriptureText}
                          </p>
                        </div>
                      </div>

                      {/* Small action hints */}
                      <div className="mt-4 text-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedEntry(deckCard);
                          }}
                          className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-primary hover:bg-[#3e4c31] text-white text-xs font-bold rounded-full shadow-sm active:scale-95 transition"
                        >
                          <Icon name="menu_book" className="text-xs" />
                          閱讀整篇靈修
                        </button>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="mt-4 pt-3 border-t border-[#efe9dd] flex justify-between items-center">
                      <span className="text-[9px] font-extrabold text-outline tracking-wider uppercase">
                        已抽過: {drawnIds.length}/{quietTimeEntries.length}
                      </span>
                      <span className="text-[9px] text-[#795900] font-bold flex items-center gap-0.5">
                        點擊卡面收起
                        <Icon name="flip_to_back" className="text-[10px]" />
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                /* Empty card deck slot */
                <div className="w-full h-full rounded-[2rem] border-2 border-dashed border-outline-variant flex flex-col items-center justify-center p-6 text-center text-outline">
                  <Icon name="style" className="text-[48px] text-outline/30" />
                  <p className="mt-4 text-xs font-bold text-primary">靈修卡片庫已空</p>
                  <button
                    onClick={resetDeck}
                    className="mt-4 px-4 py-2 bg-primary-container text-white text-xs font-bold rounded-full hover:bg-primary"
                  >
                    重置卡片組
                  </button>
                </div>
              )}
            </div>

            {/* Deck control action buttons */}
            <div className="flex items-center gap-4">
              {drawnIds.length > 0 && (
                <button
                  onClick={resetDeck}
                  className="px-4 py-2 border border-outline-variant hover:bg-surface-container-low text-on-surface-variant text-xs font-bold rounded-full transition cursor-pointer"
                  disabled={isDrawing}
                >
                  洗牌 / 重置
                </button>
              )}
              <button
                onClick={handleDrawCard}
                className="px-6 py-2.5 bg-secondary hover:bg-[#ffc641] text-on-secondary-fixed text-xs font-extrabold rounded-full shadow-[0_4px_12px_rgba(121,89,0,0.15)] flex items-center gap-1.5 active:scale-95 transition cursor-pointer"
                disabled={isDrawing}
              >
                <Icon name="casino" className="text-sm" />
                {deckCard ? '抽下一張' : '開始抽靈修卡'}
              </button>
            </div>
          </div>
        )}
      </main>

      {/* EXPANDED DEVOTIONAL DETAIL BOTTOM SHEET / OVERLAY DIALOG */}
      {selectedEntry && (
        <div className="absolute inset-x-0 bottom-0 top-[4.35rem] z-50 flex items-center justify-center bg-black/60 backdrop-blur-md transition-opacity p-4">
          {/* Modal Backdrop closer */}
          <div className="absolute inset-0" onClick={() => setSelectedEntry(null)} />

          {/* Modal Card Box */}
          <div className="relative w-full max-w-2xl bg-[#fbf9f5] border border-[#c5c8bd]/30 rounded-[2rem] shadow-[0_16px_48px_rgba(40,53,28,0.24)] flex flex-col max-h-[85%] overflow-hidden animate-scale-up">
            {/* Top spacing */}
            <div className="h-5 shrink-0" />

            {/* Content viewport */}
            <div className="overflow-y-auto px-6 pb-24 space-y-6 flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-extrabold tracking-widest text-secondary bg-[#ffdfa0]/50 px-2 py-0.5 rounded-full">
                    {selectedEntry.book} {selectedEntry.passage}
                  </span>
                  <h2 className="mt-2 font-headline text-2xl font-bold text-primary">
                    {selectedEntry.title}
                  </h2>
                </div>

                <div className="flex gap-2">
                  {/* Star Toggle */}
                  <button
                    onClick={() => toggleStar(selectedEntry.id)}
                    className="h-10 w-10 flex items-center justify-center rounded-full bg-surface-container text-secondary hover:bg-surface-container-high transition"
                    aria-label={starredIds.includes(selectedEntry.id) ? '取消收藏' : '加入收藏'}
                  >
                    <Icon
                      name={starredIds.includes(selectedEntry.id) ? 'star' : 'star_border'}
                      className={`text-xl ${
                        starredIds.includes(selectedEntry.id) ? 'fill-current text-[#795900]' : 'text-outline'
                      }`}
                    />
                  </button>
                  {/* Close button */}
                  <button
                    onClick={() => setSelectedEntry(null)}
                    className="h-10 w-10 flex items-center justify-center rounded-full bg-surface-container text-on-surface-variant hover:bg-surface-container-high transition"
                    aria-label="關閉"
                  >
                    <Icon name="close" className="text-xl" />
                  </button>
                </div>
              </div>

              {/* SECTION 1: Scripture quoting */}
              <div className="p-5 bg-surface-container-low border-l-4 border-secondary rounded-r-2xl space-y-2">
                <span className="block font-body text-[10px] font-extrabold tracking-[0.2em] text-secondary">
                  【經文】
                </span>
                <p className="font-headline text-[1.1rem] leading-8 text-primary font-bold">
                  {selectedEntry.scriptureText}
                </p>
              </div>

              {/* SECTION 2: Commentary content */}
              <div className="space-y-4">
                <span className="block font-body text-[10px] font-extrabold tracking-[0.2em] text-outline uppercase">
                  【靈修分享】
                </span>
                <div className="space-y-4 text-sm leading-7 text-on-surface-variant font-medium">
                  {selectedEntry.content.map((paragraph, index) => (
                    <p key={index} className="text-justify">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>

              {/* SECTION 3: Reflection questions */}
              <div className="p-5 bg-white border border-[#c5c8bd]/30 rounded-2xl space-y-3 shadow-sm">
                <span className="flex items-center gap-1.5 font-body text-[10px] font-extrabold tracking-[0.2em] text-primary">
                  <Icon name="help" className="text-xs text-secondary" />
                  【默想應用】
                </span>
                <ul className="space-y-2.5 text-xs text-on-surface-variant font-bold leading-relaxed">
                  {selectedEntry.reflection.map((ref, i) => (
                    <li key={i} className="flex gap-2 items-start">
                      <span className="h-4 w-4 bg-primary-container text-white text-[9px] rounded-full flex items-center justify-center shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      <span className="flex-1">{ref}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* SECTION 4: Short prayer suggestion */}
              <div className="p-5 bg-[#d8e8c4]/30 border border-[#acbc9a]/30 rounded-2xl space-y-2.5">
                <span className="flex items-center gap-1.5 font-body text-[10px] font-extrabold tracking-[0.2em] text-primary">
                  <Icon name="favorite" className="text-xs text-[#28351c]" />
                  【祈禱回應】
                </span>
                <p className="text-xs text-primary-container font-bold leading-relaxed italic">
                  {selectedEntry.prayer}
                </p>
              </div>
            </div>

            {/* Bottom Actions footer bar */}
            <div className="absolute bottom-0 inset-x-0 bg-white/95 border-t border-[#efe9dd] px-6 py-4 flex items-center justify-between shrink-0">
              <span className="text-[10px] font-extrabold text-outline">
                建立日期: {selectedEntry.dateAdded}
              </span>
              <button
                onClick={() => setSelectedEntry(null)}
                className="px-6 py-2 bg-primary hover:bg-[#3e4c31] text-white text-xs font-bold rounded-full transition active:scale-95 cursor-pointer"
              >
                已完成靈修
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LibraryScreen;
