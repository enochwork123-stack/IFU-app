import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContent } from '../context/ContentContext';
import { Icon } from '../components/Icon';
import type { StudyModule, JourneyStep, HomeCard, ScriptureReference } from '../types/content';
import { assetPath } from '../utils/assets';

type TabType = 'general' | 'home-cards' | 'journey-steps' | 'lessons' | 'media';

export const AdminDashboardScreen: React.FC = () => {
  const navigate = useNavigate();
  const {
    homeCards,
    discipleshipSteps,
    lessonRoutes,
    customScreenTexts,
    updateHomeCards,
    updateDiscipleshipSteps,
    updateGospelSections,
    updateLessonRoutes,
    updateCustomText,
    updateCustomTexts,
    addCardToLesson,
    updateCardInLesson,
    deleteCardFromLesson,
    reorderCardsInLesson,
    resetToDefaults,
    exportConfig,
    importConfig,
  } = useAppContent();

  // Authentication State
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // UI Navigation State
  const [activeTab, setActiveTab] = useState<TabType>('general');
  const [selectedLessonId, setSelectedLessonId] = useState<string>(lessonRoutes[0]?.id || '');
  const [editingModuleId, setEditingModuleId] = useState<string | null>(null);

  // Import JSON Modal/State
  const [showImportArea, setShowImportArea] = useState(false);
  const [importJsonText, setImportJsonText] = useState('');
  const [importStatus, setImportStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Mock Upload State
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadedImagePreview, setUploadedImagePreview] = useState<string | null>(null);
  const [mediaList, setMediaList] = useState<Array<{ name: string; url: string }>>([
    { name: 'creation-source.png', url: assetPath('assets/creation-source.png') },
    { name: 'creation-free-will.png', url: assetPath('assets/creation-free-will.png') },
    { name: 'creation-relationship.png', url: assetPath('assets/creation-relationship.png') },
  ]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin123') {
      setIsAuthorized(true);
      setLoginError('');
    } else {
      setLoginError('密碼錯誤，請重試！');
    }
  };

  const handleBypass = () => {
    setIsAuthorized(true);
  };

  const handleImport = () => {
    if (!importJsonText.trim()) return;
    const success = importConfig(importJsonText);
    if (success) {
      setImportStatus({ type: 'success', message: '配置導入成功！頁面將自動更新。' });
      setTimeout(() => {
        setShowImportArea(false);
        setImportJsonText('');
        setImportStatus(null);
      }, 1500);
    } else {
      setImportStatus({ type: 'error', message: '導入失敗，請確保 JSON 格式正確且欄位完整。' });
    }
  };

  const handleFileUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadSuccess(false);

    // Mock upload delay
    setTimeout(() => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setUploadedImagePreview(base64String);
        setUploading(false);
        setUploadSuccess(true);
        
        // Add to media manager list
        setMediaList(prev => [
          { name: file.name, url: base64String },
          ...prev
        ]);
        
        // Auto-clear success state after 2 seconds
        setTimeout(() => setUploadSuccess(false), 2000);
      };
      reader.readAsDataURL(file);
    }, 1200);
  };

  if (!isAuthorized) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface px-4 py-12">
        <div className="w-full max-w-md overflow-hidden rounded-[2.5rem] bg-surface-container-lowest p-8 shadow-[0_28px_72px_rgba(40,53,28,0.14)] border border-outline-variant/60">
          <div className="text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/8 text-primary">
              <Icon name="admin_panel_settings" className="text-3xl" />
            </div>
            <h1 className="mt-5 font-headline text-2xl font-black text-primary">
              IFU 管理後台登錄
            </h1>
            <p className="mt-2 text-sm text-on-surface-variant">
              請輸入管理員密碼以進行網站內容變更。
            </p>
          </div>

          <form onSubmit={handleLogin} className="mt-8 space-y-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-[0.16em] text-secondary">
                密碼
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="請輸入密碼 (預設為 admin123)"
                className="mt-2 w-full rounded-[1.2rem] border border-outline-variant bg-surface-container-low/60 p-4 text-base text-on-surface outline-none transition focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10"
                required
              />
              {loginError && (
                <p className="mt-2 text-xs font-bold text-red-600">{loginError}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full rounded-full bg-primary py-4 text-sm font-extrabold tracking-[0.16em] text-white shadow-[0_12px_24px_rgba(40,53,28,0.2)] hover:brightness-105 active:scale-98 transition"
            >
              進入管理系統
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={handleBypass}
              className="text-xs font-extrabold tracking-[0.12em] text-secondary hover:underline cursor-pointer"
            >
              開發人員快速通道 (免密碼)
            </button>
          </div>
        </div>
      </div>
    );
  }

  const activeLesson = lessonRoutes.find((r) => r.id === selectedLessonId);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-surface">
      {/* Sidebar */}
      <aside className="flex w-72 flex-col border-r border-outline-variant/60 bg-surface-container-lowest">
        <div className="flex h-20 items-center justify-between border-b border-outline-variant/40 px-6">
          <div className="flex items-center gap-3">
            <Icon name="design_services" className="text-[22px] text-primary" />
            <span className="font-headline text-lg font-black tracking-tight text-primary">
              IFU 內容管理
            </span>
          </div>
          <span className="rounded-full bg-secondary-fixed/55 px-2 py-0.5 text-[10px] font-bold text-on-secondary-fixed">
            測試版
          </span>
        </div>

        <nav className="flex-1 space-y-1.5 p-4">
          <button
            onClick={() => setActiveTab('general')}
            className={`flex w-full items-center gap-3.5 rounded-[1.2rem] px-4 py-3 text-sm font-bold transition-all ${
              activeTab === 'general'
                ? 'bg-primary text-white shadow-[0_8px_20px_rgba(40,53,28,0.15)]'
                : 'text-on-surface-variant hover:bg-surface-container-low'
            }`}
          >
            <Icon name="settings" className="text-xl" />
            一般設定 & 標題
          </button>

          <button
            onClick={() => setActiveTab('home-cards')}
            className={`flex w-full items-center gap-3.5 rounded-[1.2rem] px-4 py-3 text-sm font-bold transition-all ${
              activeTab === 'home-cards'
                ? 'bg-primary text-white shadow-[0_8px_20px_rgba(40,53,28,0.15)]'
                : 'text-on-surface-variant hover:bg-surface-container-low'
            }`}
          >
            <Icon name="home" className="text-xl" />
            首頁入口卡片
          </button>

          <button
            onClick={() => setActiveTab('journey-steps')}
            className={`flex w-full items-center gap-3.5 rounded-[1.2rem] px-4 py-3 text-sm font-bold transition-all ${
              activeTab === 'journey-steps'
                ? 'bg-primary text-white shadow-[0_8px_20px_rgba(40,53,28,0.15)]'
                : 'text-on-surface-variant hover:bg-surface-container-low'
            }`}
          >
            <Icon name="route" className="text-xl" />
            培育生命路徑
          </button>

          <button
            onClick={() => setActiveTab('lessons')}
            className={`flex w-full items-center gap-3.5 rounded-[1.2rem] px-4 py-3 text-sm font-bold transition-all ${
              activeTab === 'lessons'
                ? 'bg-primary text-white shadow-[0_8px_20px_rgba(40,53,28,0.15)]'
                : 'text-on-surface-variant hover:bg-surface-container-low'
            }`}
          >
            <Icon name="auto_stories" className="text-xl" />
            課程頁面 & 卡片
          </button>

          <button
            onClick={() => setActiveTab('media')}
            className={`flex w-full items-center gap-3.5 rounded-[1.2rem] px-4 py-3 text-sm font-bold transition-all ${
              activeTab === 'media'
                ? 'bg-primary text-white shadow-[0_8px_20px_rgba(40,53,28,0.15)]'
                : 'text-on-surface-variant hover:bg-surface-container-low'
            }`}
          >
            <Icon name="photo_library" className="text-xl" />
            相片與媒體庫
          </button>
        </nav>

        {/* Action buttons at footer of sidebar */}
        <div className="border-t border-outline-variant/40 p-4 space-y-2.5">
          <button
            onClick={exportConfig}
            className="flex w-full items-center justify-center gap-2 rounded-full border border-primary/40 py-2.5 text-xs font-bold text-primary hover:bg-primary/5 active:scale-98 transition"
          >
            <Icon name="download" className="text-base" />
            導出 JSON 配置文件
          </button>
          
          <button
            onClick={() => {
              setImportStatus(null);
              setShowImportArea(true);
            }}
            className="flex w-full items-center justify-center gap-2 rounded-full border border-outline-variant py-2.5 text-xs font-bold text-on-surface-variant hover:bg-surface-container transition"
          >
            <Icon name="upload" className="text-base" />
            導入 JSON 配置文件
          </button>

          <button
            onClick={() => {
              if (window.confirm('確定要清除所有更改並恢復為默認配置嗎？')) {
                resetToDefaults();
                alert('已恢復為預設值！');
              }
            }}
            className="flex w-full items-center justify-center gap-2 rounded-full border border-red-200 py-2.5 text-xs font-bold text-red-600 hover:bg-red-50 transition"
          >
            <Icon name="restart_alt" className="text-base animate-spin-reverse" />
            重置為默認數據
          </button>

          <button
            onClick={() => navigate('/')}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-secondary py-3 text-xs font-extrabold tracking-widest text-white hover:brightness-105 active:scale-98 transition shadow-[0_8px_16px_rgba(121,89,0,0.15)]"
          >
            <Icon name="arrow_back" className="text-sm" />
            返回前台網站
          </button>
        </div>
      </aside>

      {/* Main Panel */}
      <main className="flex-1 overflow-y-auto bg-surface-container-lowest/40 px-10 py-8">
        {/* Topbar of main panel */}
        <div className="mb-8 flex items-center justify-between border-b border-outline-variant/40 pb-5">
          <div>
            <h2 className="font-headline text-3xl font-black text-primary">
              {activeTab === 'general' && '一般設定 & 標題'}
              {activeTab === 'home-cards' && '首頁入口卡片管理'}
              {activeTab === 'journey-steps' && '培育生命路徑管理 (12個靈修培育步驟)'}
              {activeTab === 'lessons' && '課程頁面 & 內容卡片'}
              {activeTab === 'media' && '相片與媒體庫'}
            </h2>
            <p className="mt-1 text-sm text-on-surface-variant">
              {activeTab === 'general' && '修改網站全域的標題、副標題和腳本引導文字。'}
              {activeTab === 'home-cards' && '管理首頁顯示的三大主要培育路徑入口卡片。'}
              {activeTab === 'journey-steps' && '調整12個靈修課程的順序、圖示、名稱與解鎖狀態。'}
              {activeTab === 'lessons' && '編輯特定課程的內文、卡片視覺顏色樣式、大小尺寸以及添加/刪除卡片。'}
              {activeTab === 'media' && '在此上傳相片，系統會自動生成臨時 Base64 以供網站即時展示。'}
            </p>
          </div>
          
          <div className="flex items-center gap-2 rounded-full bg-green-50 border border-green-200 px-4 py-2 text-xs font-bold text-green-700">
            <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            本地存儲已啟用 (隔離保護中)
          </div>
        </div>

        {/* Tab Contents */}
        {activeTab === 'general' && (
          <div className="max-w-2xl space-y-6">
            <div className="rounded-[1.8rem] bg-surface-container-low p-6 shadow-sm border border-outline-variant/40">
              <h3 className="font-headline text-lg font-black text-primary mb-5">首頁設定</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-secondary uppercase tracking-widest">網站主標題</label>
                  <input
                    type="text"
                    value={customScreenTexts['home:hero-title'] || ''}
                    onChange={(e) => updateCustomText('home:hero-title', e.target.value)}
                    className="mt-2 w-full rounded-[1rem] border border-outline-variant bg-white p-3 text-base text-on-surface outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-secondary uppercase tracking-widest">網站副標題</label>
                  <input
                    type="text"
                    value={customScreenTexts['home:hero-subtitle'] || ''}
                    onChange={(e) => updateCustomText('home:hero-subtitle', e.target.value)}
                    className="mt-2 w-full rounded-[1rem] border border-outline-variant bg-white p-3 text-base text-on-surface outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-secondary uppercase tracking-widest">頁尾描述</label>
                  <input
                    type="text"
                    value={customScreenTexts['home:footer-text'] || ''}
                    onChange={(e) => updateCustomText('home:footer-text', e.target.value)}
                    className="mt-2 w-full rounded-[1rem] border border-outline-variant bg-white p-3 text-base text-on-surface outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                  />
                </div>
              </div>
            </div>

            <div className="rounded-[1.8rem] bg-surface-container-low p-6 shadow-sm border border-outline-variant/40">
              <h3 className="font-headline text-lg font-black text-primary mb-5">路徑總覽頁設定</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-secondary uppercase tracking-widest">路徑頁標題</label>
                  <input
                    type="text"
                    value={customScreenTexts['journey:title'] || ''}
                    onChange={(e) => updateCustomText('journey:title', e.target.value)}
                    className="mt-2 w-full rounded-[1rem] border border-outline-variant bg-white p-3 text-base text-on-surface outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-secondary uppercase tracking-widest">路徑頁副標題</label>
                  <input
                    type="text"
                    value={customScreenTexts['journey:subtitle'] || ''}
                    onChange={(e) => updateCustomText('journey:subtitle', e.target.value)}
                    className="mt-2 w-full rounded-[1rem] border border-outline-variant bg-white p-3 text-base text-on-surface outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'home-cards' && (
          <div className="grid gap-6 md:grid-cols-2">
            {homeCards.map((card, idx) => (
              <div key={card.id} className="rounded-[1.8rem] bg-surface-container-low p-6 shadow-sm border border-outline-variant/40 space-y-4">
                <div className="flex items-center justify-between border-b border-outline-variant/30 pb-3">
                  <span className="font-headline text-lg font-black text-primary">入口卡片 #{idx + 1}</span>
                  <span className="text-xs text-on-surface-variant font-mono">{card.id}</span>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-secondary">卡片名稱</label>
                    <input
                      type="text"
                      value={card.title}
                      onChange={(e) => {
                        const newCards = [...homeCards];
                        newCards[idx] = { ...card, title: e.target.value };
                        updateHomeCards(newCards);
                      }}
                      className="mt-1.5 w-full rounded-[0.8rem] border border-outline-variant bg-white p-2.5 text-sm outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-secondary">描述文字</label>
                    <textarea
                      value={card.description}
                      rows={2}
                      onChange={(e) => {
                        const newCards = [...homeCards];
                        newCards[idx] = { ...card, description: e.target.value };
                        updateHomeCards(newCards);
                      }}
                      className="mt-1.5 w-full rounded-[0.8rem] border border-outline-variant bg-white p-2.5 text-sm outline-none focus:border-primary"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-secondary">配色主題 (Accent)</label>
                      <select
                        value={card.accent}
                        onChange={(e) => {
                          const newCards = [...homeCards];
                          newCards[idx] = { ...card, accent: e.target.value as any };
                          updateHomeCards(newCards);
                        }}
                        className="mt-1.5 w-full rounded-[0.8rem] border border-outline-variant bg-white p-2.5 text-sm outline-none focus:border-primary"
                      >
                        <option value="primary">Primary (綠色)</option>
                        <option value="secondary">Secondary (黃褐色)</option>
                        <option value="surface">Surface (灰白色)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-secondary">圖示類型 (Material Icon)</label>
                      <input
                        type="text"
                        value={card.icon}
                        onChange={(e) => {
                          const newCards = [...homeCards];
                          newCards[idx] = { ...card, icon: e.target.value };
                          updateHomeCards(newCards);
                        }}
                        className="mt-1.5 w-full rounded-[0.8rem] border border-outline-variant bg-white p-2.5 text-sm outline-none focus:border-primary"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'journey-steps' && (
          <div className="space-y-4">
            <div className="rounded-[1.5rem] bg-surface-container-low p-4 text-xs font-bold text-on-surface-variant flex items-center gap-2">
              <Icon name="info" className="text-secondary text-sm" />
              提示：可編輯步驟資訊，或透過「向上/向下」微調靈修課程培育流程順序。
            </div>
            <div className="overflow-hidden rounded-[1.8rem] border border-outline-variant/50 bg-surface-container-low shadow-sm">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container text-xs font-bold uppercase tracking-widest text-secondary border-b border-outline-variant/50">
                    <th className="px-6 py-4 w-16 text-center">順序</th>
                    <th className="px-6 py-4 w-32">步驟ID & 圖示</th>
                    <th className="px-6 py-4">標題 (中文 / 英文)</th>
                    <th className="px-6 py-4">簡短介紹</th>
                    <th className="px-6 py-4 w-36">鎖定狀態</th>
                    <th className="px-6 py-4 w-40 text-center">順序操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/30">
                  {discipleshipSteps
                    .sort((a, b) => a.order - b.order)
                    .map((step, idx) => (
                      <tr key={step.id} className="hover:bg-white/40 transition">
                        <td className="px-6 py-4 font-headline text-lg font-black text-center text-primary">
                          {step.order}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col gap-1.5">
                            <span className="text-[10px] font-bold text-on-surface-variant font-mono bg-surface-container-high px-1.5 py-0.5 rounded w-max">
                              {step.id}
                            </span>
                            <div className="flex items-center gap-1">
                              <span className="text-xs text-secondary font-bold">圖示:</span>
                              <input
                                type="text"
                                value={step.icon}
                                onChange={(e) => {
                                  const nextSteps = discipleshipSteps.map(s => s.id === step.id ? { ...s, icon: e.target.value } : s);
                                  updateDiscipleshipSteps(nextSteps);
                                }}
                                className="w-20 border border-outline-variant/80 bg-white px-1.5 py-0.5 rounded text-xs outline-none"
                              />
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col gap-2">
                            <input
                              type="text"
                              value={step.title}
                              onChange={(e) => {
                                const nextSteps = discipleshipSteps.map(s => s.id === step.id ? { ...s, title: e.target.value } : s);
                                updateDiscipleshipSteps(nextSteps);
                              }}
                              className="border border-outline-variant/80 bg-white px-2 py-1 rounded text-sm font-bold text-primary outline-none"
                            />
                            <input
                              type="text"
                              value={step.subtitle}
                              onChange={(e) => {
                                const nextSteps = discipleshipSteps.map(s => s.id === step.id ? { ...s, subtitle: e.target.value } : s);
                                updateDiscipleshipSteps(nextSteps);
                              }}
                              className="border border-outline-variant/80 bg-white px-2 py-1 rounded text-xs text-on-surface-variant outline-none"
                            />
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <textarea
                            value={step.description}
                            rows={2}
                            onChange={(e) => {
                              const nextSteps = discipleshipSteps.map(s => s.id === step.id ? { ...s, description: e.target.value } : s);
                              updateDiscipleshipSteps(nextSteps);
                            }}
                            className="w-full border border-outline-variant/80 bg-white px-2 py-1 rounded text-xs text-on-surface-variant outline-none resize-none"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <select
                            value={step.status}
                            onChange={(e) => {
                              const nextSteps = discipleshipSteps.map(s => s.id === step.id ? { ...s, status: e.target.value as any } : s);
                              updateDiscipleshipSteps(nextSteps);
                            }}
                            className="w-full border border-outline-variant/80 bg-white p-1 rounded text-xs outline-none font-bold"
                          >
                            <option value="active">Active (當前進行)</option>
                            <option value="available">Available (已解鎖)</option>
                            <option value="locked">Locked (未解鎖)</option>
                            <option value="complete">Complete (已完成)</option>
                          </select>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              disabled={idx === 0}
                              onClick={() => {
                                const nextSteps = [...discipleshipSteps];
                                const currentStep = nextSteps[idx]!;
                                const prevStep = nextSteps[idx - 1]!;
                                currentStep.order = idx;
                                prevStep.order = idx + 1;
                                updateDiscipleshipSteps(nextSteps);
                              }}
                              className="flex h-8 w-8 items-center justify-center rounded-full bg-white border border-outline-variant hover:bg-surface-container shadow-sm disabled:opacity-40 disabled:pointer-events-none transition cursor-pointer"
                            >
                              <Icon name="arrow_upward" className="text-sm" />
                            </button>
                            <button
                              disabled={idx === discipleshipSteps.length - 1}
                              onClick={() => {
                                const nextSteps = [...discipleshipSteps];
                                const currentStep = nextSteps[idx]!;
                                const nextStep = nextSteps[idx + 1]!;
                                currentStep.order = idx + 2;
                                nextStep.order = idx + 1;
                                updateDiscipleshipSteps(nextSteps);
                              }}
                              className="flex h-8 w-8 items-center justify-center rounded-full bg-white border border-outline-variant hover:bg-surface-container shadow-sm disabled:opacity-40 disabled:pointer-events-none transition cursor-pointer"
                            >
                              <Icon name="arrow_downward" className="text-sm" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'lessons' && (
          <div className="flex gap-8 items-start">
            {/* Left selector sidebar inside Tab */}
            <div className="w-64 shrink-0 rounded-[1.8rem] bg-surface-container-low p-4 border border-outline-variant/40 space-y-3">
              <h4 className="px-2 text-xs font-bold text-secondary uppercase tracking-widest">選擇靈修章節</h4>
              <div className="space-y-1">
                {lessonRoutes.map((route) => (
                  <button
                    key={route.id}
                    onClick={() => {
                      setSelectedLessonId(route.id);
                      setEditingModuleId(null);
                    }}
                    className={`w-full flex items-center justify-between rounded-[0.8rem] px-3 py-2.5 text-left text-xs font-bold transition ${
                      selectedLessonId === route.id
                        ? 'bg-secondary text-white shadow-sm'
                        : 'text-on-surface-variant hover:bg-surface-container'
                    }`}
                  >
                    <span>{route.title}</span>
                    <span className="text-[9px] opacity-70 font-mono">{route.id}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Editing Pane */}
            <div className="flex-1 space-y-6">
              {activeLesson ? (
                <>
                  <div className="rounded-[1.8rem] bg-surface-container-low p-6 border border-outline-variant/40 shadow-sm space-y-4">
                    <div className="flex items-center justify-between border-b border-outline-variant/30 pb-3">
                      <h3 className="font-headline text-lg font-black text-primary">
                        頁面基本資訊: {activeLesson.title}
                      </h3>
                      <span className="text-xs text-secondary font-mono bg-surface-container-high px-2 py-0.5 rounded">
                        路徑: {activeLesson.route}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-secondary">標題</label>
                        <input
                          type="text"
                          value={activeLesson.title}
                          onChange={(e) => {
                            const nextRoutes = lessonRoutes.map(r => r.id === activeLesson.id ? { ...r, title: e.target.value } : r);
                            updateLessonRoutes(nextRoutes);
                          }}
                          className="mt-1.5 w-full rounded-[0.8rem] border border-outline-variant bg-white p-2.5 text-sm outline-none focus:border-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-secondary">英文副標題</label>
                        <input
                          type="text"
                          value={activeLesson.subtitle || ''}
                          onChange={(e) => {
                            const nextRoutes = lessonRoutes.map(r => r.id === activeLesson.id ? { ...r, subtitle: e.target.value } : r);
                            updateLessonRoutes(nextRoutes);
                          }}
                          className="mt-1.5 w-full rounded-[0.8rem] border border-outline-variant bg-white p-2.5 text-sm outline-none focus:border-primary"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Modules list (Cards List) */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-headline text-lg font-black text-primary">內容卡片排序與編輯</h3>
                      
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            const newId = `new-card-${Date.now()}`;
                            const newModule: StudyModule = {
                              id: newId,
                              kind: 'content-section',
                              title: '新內容標題',
                              body: '在此輸入卡片內文...',
                              visual: {
                                accent: 'surface', // White background default
                                surface: 'elevated',
                              }
                            };
                            addCardToLesson(activeLesson.id, activeLesson.modules.length, newModule);
                            setEditingModuleId(newId);
                          }}
                          className="flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-xs font-bold text-white shadow-sm hover:brightness-105 active:scale-95 cursor-pointer"
                        >
                          <Icon name="add" className="text-sm" />
                          添加 Body Card (白底)
                        </button>

                        <button
                          onClick={() => {
                            const newId = `new-card-${Date.now()}`;
                            const newModule: StudyModule = {
                              id: newId,
                              kind: 'summary-card',
                              title: '新標題',
                              body: '在此輸入卡片內文...',
                              visual: {
                                accent: 'primary', // Green background default
                                surface: 'elevated',
                              }
                            };
                            addCardToLesson(activeLesson.id, activeLesson.modules.length, newModule);
                            setEditingModuleId(newId);
                          }}
                          className="flex items-center gap-1.5 rounded-full bg-secondary px-4 py-2 text-xs font-bold text-white shadow-sm hover:brightness-105 active:scale-95 cursor-pointer"
                        >
                          <Icon name="add" className="text-sm" />
                          添加 Header Card (綠底)
                        </button>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {activeLesson.modules.map((mod, idx) => {
                        const isEditing = editingModuleId === mod.id;
                        const cardTheme = mod.visual?.accent || 'surface'; // default surface = white
                        
                        return (
                          <div
                            key={mod.id}
                            className={`rounded-[2rem] border transition shadow-sm ${
                              isEditing ? 'border-primary ring-2 ring-primary/5 bg-surface-container-low' : 'border-outline-variant/40 bg-surface-container-low/75'
                            }`}
                          >
                            {/* Card Header bar */}
                            <div className="flex items-center justify-between p-5 border-b border-outline-variant/20">
                              <div className="flex items-center gap-3">
                                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-surface-container-high text-xs font-bold text-secondary border border-outline-variant/50">
                                  {idx + 1}
                                </span>
                                <div>
                                  <span className="font-headline font-black text-sm text-primary">
                                    {mod.title || '(無標題卡片)'}
                                  </span>
                                  <div className="flex items-center gap-2 mt-0.5">
                                    <span className="text-[10px] font-bold text-secondary uppercase bg-white px-2 py-0.5 rounded border border-outline-variant/40 font-mono">
                                      {mod.kind}
                                    </span>
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                                      cardTheme === 'primary' ? 'bg-green-100 text-green-800' :
                                      cardTheme === 'secondary' ? 'bg-amber-100 text-amber-800' :
                                      cardTheme === 'surface' ? 'bg-gray-100 text-gray-800' : 'bg-transparent text-primary'
                                    }`}>
                                      主題: {
                                        cardTheme === 'primary' ? 'Header Card (綠底)' :
                                        cardTheme === 'secondary' ? 'Ochre Card (黃褐底)' :
                                        cardTheme === 'surface' ? 'Body Card (白底)' : '透明/Appendix Card'
                                      }
                                    </span>
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => setEditingModuleId(isEditing ? null : mod.id)}
                                  className="flex h-8 items-center gap-1 px-3 rounded-full border border-outline-variant bg-white text-xs font-bold text-on-surface hover:bg-surface-container cursor-pointer transition"
                                >
                                  <Icon name={isEditing ? 'done' : 'edit'} className="text-sm text-primary" />
                                  {isEditing ? '完成' : '編輯'}
                                </button>

                                <button
                                  disabled={idx === 0}
                                  onClick={() => reorderCardsInLesson(activeLesson.id, idx, idx - 1)}
                                  className="flex h-8 w-8 items-center justify-center rounded-full border border-outline-variant bg-white hover:bg-surface-container disabled:opacity-40 cursor-pointer transition"
                                  title="移上"
                                >
                                  <Icon name="arrow_upward" className="text-xs" />
                                </button>

                                <button
                                  disabled={idx === activeLesson.modules.length - 1}
                                  onClick={() => reorderCardsInLesson(activeLesson.id, idx, idx + 1)}
                                  className="flex h-8 w-8 items-center justify-center rounded-full border border-outline-variant bg-white hover:bg-surface-container disabled:opacity-40 cursor-pointer transition"
                                  title="移下"
                                >
                                  <Icon name="arrow_downward" className="text-xs" />
                                </button>

                                <button
                                  onClick={() => {
                                    if (window.confirm('確定要刪除這張內容卡片嗎？')) {
                                      deleteCardFromLesson(activeLesson.id, mod.id);
                                    }
                                  }}
                                  className="flex h-8 w-8 items-center justify-center rounded-full border border-red-200 bg-white text-red-600 hover:bg-red-50 cursor-pointer transition"
                                  title="刪除"
                                >
                                  <Icon name="delete" className="text-sm" />
                                </button>
                              </div>
                            </div>

                            {/* Card Edit Fields */}
                            {isEditing && (
                              <div className="p-6 space-y-4 bg-white/70 rounded-b-[2rem] border-t border-outline-variant/20">
                                <div className="grid grid-cols-3 gap-4">
                                  <div>
                                    <label className="block text-xs font-bold text-secondary">卡片類型樣式</label>
                                    <select
                                      value={mod.visual?.accent || 'surface'}
                                      onChange={(e) => {
                                        updateCardInLesson(activeLesson.id, mod.id, {
                                          visual: {
                                            ...mod.visual,
                                            accent: e.target.value as any,
                                          }
                                        });
                                      }}
                                      className="mt-1.5 w-full rounded-[0.8rem] border border-outline-variant bg-white p-2.5 text-xs outline-none"
                                    >
                                      <option value="surface">Body Card (白底卡片)</option>
                                      <option value="primary">Header Card (綠底黃字)</option>
                                      <option value="secondary">Ochre Card (黃底白字)</option>
                                      <option value="tertiary">Appendix Card (透明框線卡片)</option>
                                    </select>
                                  </div>

                                  <div>
                                    <label className="block text-xs font-bold text-secondary">寬度限制 (Width)</label>
                                    <select
                                      value={mod.visual?.imageStyle || 'max-w-2xl'}
                                      onChange={(e) => {
                                        updateCardInLesson(activeLesson.id, mod.id, {
                                          visual: {
                                            ...mod.visual,
                                            imageStyle: e.target.value,
                                          }
                                        });
                                      }}
                                      className="mt-1.5 w-full rounded-[0.8rem] border border-outline-variant bg-white p-2.5 text-xs outline-none"
                                    >
                                      <option value="max-w-xl">精簡型 (max-w-xl)</option>
                                      <option value="max-w-2xl">標準型 (max-w-2xl)</option>
                                      <option value="max-w-4xl">寬型 (max-w-4xl)</option>
                                      <option value="max-w-full">滿版型 (max-w-full)</option>
                                    </select>
                                  </div>

                                  <div>
                                    <label className="block text-xs font-bold text-secondary">最小高度 (Height)</label>
                                    <select
                                      value={mod.visual?.eyebrow || 'min-h-auto'}
                                      onChange={(e) => {
                                        updateCardInLesson(activeLesson.id, mod.id, {
                                          visual: {
                                            ...mod.visual,
                                            eyebrow: e.target.value,
                                          }
                                        });
                                      }}
                                      className="mt-1.5 w-full rounded-[0.8rem] border border-outline-variant bg-white p-2.5 text-xs outline-none"
                                    >
                                      <option value="min-h-auto">自適應高度 (Auto)</option>
                                      <option value="min-h-[120px]">矮卡片 (120px)</option>
                                      <option value="min-h-[220px]">中卡片 (220px)</option>
                                      <option value="min-h-[350px]">高卡片 (350px)</option>
                                    </select>
                                  </div>
                                </div>

                                <div>
                                  <label className="block text-xs font-bold text-secondary">卡片標題</label>
                                  <input
                                    type="text"
                                    value={mod.title || ''}
                                    onChange={(e) => updateCardInLesson(activeLesson.id, mod.id, { title: e.target.value })}
                                    className="mt-1.5 w-full rounded-[0.8rem] border border-outline-variant bg-white p-2.5 text-xs outline-none"
                                  />
                                </div>

                                {mod.kind === 'reflection-prompt' && (
                                  <>
                                    <div>
                                      <label className="block text-xs font-bold text-secondary">討論問題題目 (Prompt)</label>
                                      <textarea
                                        value={(mod as any).prompt || ''}
                                        rows={3}
                                        onChange={(e) => updateCardInLesson(activeLesson.id, mod.id, { prompt: e.target.value } as any)}
                                        className="mt-1.5 w-full rounded-[0.8rem] border border-outline-variant bg-white p-2.5 text-xs outline-none resize-y"
                                      />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <label className="block text-xs font-bold text-secondary">問題編號</label>
                                        <input
                                          type="text"
                                          value={(mod as any).number || ''}
                                          onChange={(e) => updateCardInLesson(activeLesson.id, mod.id, { number: e.target.value } as any)}
                                          className="mt-1.5 w-full rounded-[0.8rem] border border-outline-variant bg-white p-2.5 text-xs outline-none"
                                        />
                                      </div>
                                      <div>
                                        <label className="block text-xs font-bold text-secondary">本地存儲 Key (唯一識別)</label>
                                        <input
                                          type="text"
                                          value={(mod as any).storageKey || ''}
                                          onChange={(e) => updateCardInLesson(activeLesson.id, mod.id, { storageKey: e.target.value } as any)}
                                          className="mt-1.5 w-full rounded-[0.8rem] border border-outline-variant bg-white p-2.5 text-xs outline-none"
                                        />
                                      </div>
                                    </div>
                                  </>
                                )}

                                {(mod.kind === 'summary-card' || mod.kind === 'content-section' || mod.kind === 'prayer') && (
                                  <div>
                                    <label className="block text-xs font-bold text-secondary">內文主要內容 (Body Text)</label>
                                    <textarea
                                      value={(mod as any).body || ''}
                                      rows={5}
                                      onChange={(e) => updateCardInLesson(activeLesson.id, mod.id, { body: e.target.value } as any)}
                                      className="mt-1.5 w-full rounded-[0.8rem] border border-outline-variant bg-white p-2.5 text-xs outline-none resize-y font-sans leading-relaxed"
                                    />
                                  </div>
                                )}

                                {/* Scripture sub-editor */}
                                {('scriptures' in mod) && (
                                  <div className="rounded-[1.2rem] bg-surface-container-low p-4 border border-outline-variant/30 space-y-3">
                                    <div className="flex justify-between items-center">
                                      <label className="block text-xs font-bold text-secondary">卡片關聯經文 (Scriptures)</label>
                                      <button
                                        type="button"
                                        onClick={() => {
                                          const prevScriptures = (mod as any).scriptures || [];
                                          const newScripture: ScriptureReference = {
                                            reference: '經文出處 (例如 約翰福音 3:16)',
                                            chinese: '經文中文內容...',
                                            english: 'English verse text...',
                                            book: '書卷簡稱',
                                          };
                                          updateCardInLesson(activeLesson.id, mod.id, {
                                            scriptures: [...prevScriptures, newScripture]
                                          } as any);
                                        }}
                                        className="flex items-center gap-1 text-[10px] font-bold text-primary hover:underline cursor-pointer"
                                      >
                                        <Icon name="add" className="text-xs" />
                                        添加經文
                                      </button>
                                    </div>
                                    
                                    {((mod as any).scriptures || []).map((scripture: ScriptureReference, sIdx: number) => (
                                      <div key={sIdx} className="p-3 bg-white rounded-lg border border-outline-variant/40 space-y-2 relative">
                                        <button
                                          type="button"
                                          onClick={() => {
                                            const prevScriptures = [...((mod as any).scriptures || [])];
                                            prevScriptures.splice(sIdx, 1);
                                            updateCardInLesson(activeLesson.id, mod.id, {
                                              scriptures: prevScriptures
                                            } as any);
                                          }}
                                          className="absolute top-2 right-2 text-red-500 hover:text-red-700 cursor-pointer"
                                          title="移除經文"
                                        >
                                          <Icon name="close" className="text-sm font-black" />
                                        </button>
                                        <div className="grid grid-cols-2 gap-2">
                                          <input
                                            type="text"
                                            value={scripture.reference || ''}
                                            onChange={(e) => {
                                              const prevScriptures = [...((mod as any).scriptures || [])];
                                              prevScriptures[sIdx] = { ...scripture, reference: e.target.value };
                                              updateCardInLesson(activeLesson.id, mod.id, { scriptures: prevScriptures } as any);
                                            }}
                                            placeholder="經文出處"
                                            className="w-full border border-outline-variant/60 bg-white p-1 text-xs rounded outline-none"
                                          />
                                          <input
                                            type="text"
                                            value={scripture.book || ''}
                                            onChange={(e) => {
                                              const prevScriptures = [...((mod as any).scriptures || [])];
                                              prevScriptures[sIdx] = { ...scripture, book: e.target.value };
                                              updateCardInLesson(activeLesson.id, mod.id, { scriptures: prevScriptures } as any);
                                            }}
                                            placeholder="書卷名稱 (例如 約翰福音)"
                                            className="w-full border border-outline-variant/60 bg-white p-1 text-xs rounded outline-none"
                                          />
                                        </div>
                                        <textarea
                                          value={scripture.chinese || ''}
                                          rows={2}
                                          onChange={(e) => {
                                            const prevScriptures = [...((mod as any).scriptures || [])];
                                            prevScriptures[sIdx] = { ...scripture, chinese: e.target.value };
                                            updateCardInLesson(activeLesson.id, mod.id, { scriptures: prevScriptures } as any);
                                          }}
                                          placeholder="中文經文內容"
                                          className="w-full border border-outline-variant/60 bg-white p-1.5 text-xs rounded outline-none resize-y"
                                        />
                                        <textarea
                                          value={scripture.english || ''}
                                          rows={2}
                                          onChange={(e) => {
                                            const prevScriptures = [...((mod as any).scriptures || [])];
                                            prevScriptures[sIdx] = { ...scripture, english: e.target.value };
                                            updateCardInLesson(activeLesson.id, mod.id, { scriptures: prevScriptures } as any);
                                          }}
                                          placeholder="英文經文內容 (選填)"
                                          className="w-full border border-outline-variant/60 bg-white p-1.5 text-xs rounded outline-none resize-y"
                                        />
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </>
              ) : (
                <div className="rounded-[2rem] border border-dashed border-outline-variant bg-surface-container-low p-12 text-center text-on-surface-variant font-bold">
                  查無此靈修章節。
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'media' && (
          <div className="space-y-8 max-w-4xl">
            <div className="rounded-[2rem] bg-surface-container-low p-8 border border-outline-variant/50 shadow-sm space-y-6">
              <h3 className="font-headline text-xl font-black text-primary">上傳相片 & 本地圖片預覽</h3>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                由於目前尚未配置 Supabase 雲端存儲，系統在此提供一個相片上傳 Mock 容器。
                上傳的相片會通過 Base64 dataURL 臨時緩存於您瀏覽器的本地儲存庫中，方便您在網頁直接預覽。
              </p>

              {/* Upload area */}
              <div
                onClick={handleFileUploadClick}
                className={`border-2 border-dashed rounded-[2rem] p-10 text-center flex flex-col items-center justify-center cursor-pointer transition ${
                  uploading ? 'border-primary/50 bg-primary/5' : 'border-outline-variant hover:border-primary/60 hover:bg-surface-container-high/40'
                }`}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />
                {uploading ? (
                  <div className="space-y-3">
                    <Icon name="hourglass_empty" className="text-4xl text-primary animate-spin" />
                    <p className="text-xs font-bold text-primary animate-pulse">正在轉碼並上傳至本地快取中...</p>
                  </div>
                ) : uploadSuccess ? (
                  <div className="space-y-3">
                    <Icon name="check_circle" className="text-4xl text-green-600 animate-bounce" />
                    <p className="text-xs font-bold text-green-600">上傳成功！</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <Icon name="cloud_upload" className="text-4xl text-secondary" />
                    <p className="text-sm font-bold text-primary">點擊或拖曳圖片至此區域</p>
                    <p className="text-xs text-on-surface-variant">支援 JPG, PNG, GIF。限 2MB 以內以確保儲存空間。</p>
                  </div>
                )}
              </div>

              {/* Uploaded Preview */}
              {uploadedImagePreview && (
                <div className="p-4 bg-white rounded-[1.5rem] border border-outline-variant/50 space-y-3">
                  <h4 className="text-xs font-bold text-secondary uppercase tracking-wider">最近上傳的圖片本地預覽</h4>
                  <div className="flex gap-4 items-start">
                    <img
                      src={uploadedImagePreview}
                      alt="uploaded preview"
                      className="h-28 w-28 object-cover rounded-xl border border-outline-variant/40"
                    />
                    <div className="flex-1 space-y-2">
                      <p className="text-xs font-bold text-primary font-mono select-all break-all bg-surface-container-low p-2.5 rounded-lg border border-outline-variant/30 max-h-16 overflow-y-auto">
                        {uploadedImagePreview.substring(0, 100)}... (Base64 代碼已生成)
                      </p>
                      <span className="inline-block rounded-full bg-green-100 px-3 py-1 text-[10px] font-bold text-green-800">
                        可用於 Creation 頁面或其他插圖路徑
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Media list */}
            <div className="space-y-4">
              <h3 className="font-headline text-lg font-black text-primary">當前快取庫中圖片列表</h3>
              <div className="grid grid-cols-4 gap-4">
                {mediaList.map((item, idx) => (
                  <div key={idx} className="rounded-2xl border border-outline-variant/40 bg-surface-container-low overflow-hidden shadow-sm hover:scale-102 transition">
                    <div className="h-32 bg-gray-100 flex items-center justify-center relative">
                      <img
                        src={item.url}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="p-3 bg-white border-t border-outline-variant/30">
                      <p className="text-xs font-bold text-primary truncate" title={item.name}>
                        {item.name}
                      </p>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(item.url);
                          alert('圖片 URL / Base64 已複製到剪貼簿！');
                        }}
                        className="mt-2 text-[10px] font-bold text-secondary hover:underline cursor-pointer flex items-center gap-1"
                      >
                        <Icon name="content_copy" className="text-xs" />
                        複製圖片連結
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* JSON Import Area Modal */}
      {showImportArea && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-6 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-[2.5rem] bg-surface p-8 shadow-[0_28px_80px_rgba(20,25,18,0.28)] border border-outline-variant/60">
            <div className="flex items-center justify-between border-b border-outline-variant/30 pb-4 mb-5">
              <h3 className="font-headline text-xl font-black text-primary flex items-center gap-2">
                <Icon name="upload" className="text-secondary" />
                導入 JSON 數據覆蓋
              </h3>
              <button
                onClick={() => {
                  setShowImportArea(false);
                  setImportJsonText('');
                  setImportStatus(null);
                }}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-container hover:bg-surface-container-high transition cursor-pointer"
              >
                <Icon name="close" className="text-sm font-black" />
              </button>
            </div>

            <p className="text-xs text-on-surface-variant leading-relaxed mb-4">
              請在下方粘貼您之前導出的 `ifu_content_config.json` 文件內容。這將完全覆蓋當前網站的所有靈修與首頁配置。
            </p>

            <textarea
              value={importJsonText}
              onChange={(e) => setImportJsonText(e.target.value)}
              placeholder='在此貼入 JSON 配置... (例如: { "homeCards": [...], "discipleshipSteps": [...] })'
              rows={10}
              className="w-full rounded-[1.2rem] border border-outline-variant bg-surface-container-low p-4 text-xs font-mono text-on-surface outline-none focus:border-primary focus:bg-white resize-y"
            />

            {importStatus && (
              <div className={`mt-3 p-3 rounded-xl text-xs font-bold ${
                importStatus.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
              }`}>
                {importStatus.message}
              </div>
            )}

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowImportArea(false);
                  setImportJsonText('');
                  setImportStatus(null);
                }}
                className="rounded-full border border-outline-variant px-5 py-2.5 text-xs font-bold hover:bg-surface-container transition cursor-pointer"
              >
                取消
              </button>
              <button
                onClick={handleImport}
                className="rounded-full bg-primary px-6 py-2.5 text-xs font-bold text-white hover:brightness-105 transition cursor-pointer shadow-sm"
              >
                確定導入
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboardScreen;
