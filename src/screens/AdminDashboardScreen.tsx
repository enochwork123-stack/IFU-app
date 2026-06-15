import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContent } from '../context/ContentContext';
import { Icon } from '../components/Icon';
import type { StudyModule, ScriptureReference } from '../types/content';
import { assetPath } from '../utils/assets';
import { HomePreview, JourneyPreview, LessonPreview, QuietTimeLibraryPreview } from '../components/AdminPreview';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

type TabType = 'general' | 'home-cards' | 'journey-steps' | 'quiet-time-study' | 'lessons' | 'media' | 'members' | 'wishlist';

export const AdminDashboardScreen: React.FC = () => {
  const navigate = useNavigate();
  const {
    homeCards,
    discipleshipSteps,
    lessonRoutes,
    customScreenTexts,
    updateHomeCards,
    updateDiscipleshipSteps,
    updateLessonRoutes,
    quietTimeEntries,
    updateQuietTimeEntries,
    updateCustomText,
    addCardToLesson,
    updateCardInLesson,
    deleteCardFromLesson,
    reorderCardsInLesson,
    resetToDefaults,
    exportConfig,
    importConfig,
  } = useAppContent();

  // Authentication State
  const { isAdmin, user } = useAuth();
  const [isAuthorized, setIsAuthorized] = useState(isAdmin);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Members Management State
  const [admins, setAdmins] = useState<any[]>([]);
  const [whitelist, setWhitelist] = useState<any[]>([]);
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [submittingAdmin, setSubmittingAdmin] = useState(false);
  const [memberError, setMemberError] = useState('');
  const [loadingMembers, setLoadingMembers] = useState(false);

  useEffect(() => {
    if (isAdmin) {
      setIsAuthorized(true);
    }
  }, [isAdmin]);

  // UI Navigation State
  const [activeTab, setActiveTab] = useState<TabType>('general');
  const [selectedLessonId, setSelectedLessonId] = useState<string>(lessonRoutes[0]?.id || '');
  const [editingModuleId, setEditingModuleId] = useState<string | null>(null);
  const [adminSidebarOpen, setAdminSidebarOpen] = useState(true);
  const [lessonsSidebarOpen, setLessonsSidebarOpen] = useState(true);

  // Quiet Time Entries Editor State
  const [showQtForm, setShowQtForm] = useState(false);
  const [expandedQtId, setExpandedQtId] = useState<string | null>(null);
  interface QtFormData {
    id: string;
    title: string;
    book: string;
    passage: string;
    scriptureText: string;
    content: string[]; // stored as array, edited as multiline textarea
    reflection: string[];
    prayer: string;
    topics: string[];
    dateAdded: string;
  }
  const emptyQtForm: QtFormData = {
    id: '',
    title: '',
    book: '',
    passage: '',
    scriptureText: '',
    content: [''],
    reflection: [''],
    prayer: '',
    topics: [],
    dateAdded: new Date().toISOString().slice(0, 10),
  };
  const [qtFormData, setQtFormData] = useState<QtFormData>(emptyQtForm);

  // Real-time Preview State
  const [showPreview, setShowPreview] = useState(true);
  const isPreviewActive = showPreview && activeTab !== 'members' && activeTab !== 'wishlist';
  const [previewViewport, setPreviewViewport] = useState<'mobile' | 'desktop'>('mobile');

  // Import JSON Modal/State
  const [showImportArea, setShowImportArea] = useState(false);
  const [importJsonText, setImportJsonText] = useState('');
  const [importStatus, setImportStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Wishlist Feature Submission State
  interface Wish {
    id: string;
    title: string;
    description: string;
    completed: boolean;
    createdAt: string;
  }

  const [wishes, setWishes] = useState<Wish[]>(() => {
    const saved = localStorage.getItem('ifu:admin_wishes');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error parsing admin wishes:', e);
      }
    }
    return [];
  });
  const [wishTitle, setWishTitle] = useState('');
  const [wishDesc, setWishDesc] = useState('');
  const [submittingWish, setSubmittingWish] = useState(false);
  const [wishStatus, setWishStatus] = useState<{ type: 'success' | 'warning' | 'error'; message: string } | null>(null);
  const [showWishForm, setShowWishForm] = useState(false);

  useEffect(() => {
    localStorage.setItem('ifu:admin_wishes', JSON.stringify(wishes));
  }, [wishes]);

  const handleSubmitWish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!wishTitle.trim() || !wishDesc.trim()) return;

    const newWish: Wish = {
      id: Math.random().toString(36).substring(2, 9),
      title: wishTitle.trim(),
      description: wishDesc.trim(),
      completed: false,
      createdAt: new Date().toISOString(),
    };

    // Save locally first
    setWishes(prev => [newWish, ...prev]);
    setWishTitle('');
    setWishDesc('');
    setShowWishForm(false);

    try {
      setSubmittingWish(true);
      setWishStatus(null);
      
      const { data, error } = await supabase.functions.invoke('submit-wishlist', {
        body: { title: newWish.title, description: newWish.description }
      });

      if (error) throw error;
      if (data && data.error) throw new Error(data.error);

      setWishStatus({ type: 'success', message: '提交成功！新功能需求已發佈至 GitHub 專案。' });
    } catch (err: any) {
      console.error('Error submitting feature wish to GitHub:', err);
      setWishStatus({ 
        type: 'warning', 
        message: '已儲存於本地！但無法同步至 GitHub Issues：' + (err.message || '請確認已在 Supabase 後台設定 GITHUB_TOKEN Secret。') 
      });
    } finally {
      setSubmittingWish(false);
    }
  };

  const handleToggleWish = (id: string) => {
    setWishes(prev => prev.map(w => w.id === id ? { ...w, completed: !w.completed } : w));
  };

  const handleRemoveWish = (id: string) => {
    if (window.confirm('確定要刪除此功能提案嗎？')) {
      setWishes(prev => prev.filter(w => w.id !== id));
    }
  };

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

  const fetchAdminsAndWhitelist = async () => {
    try {
      setLoadingMembers(true);
      setMemberError('');
      
      // 1. Fetch registered admins
      let profilesData: any[] = [];
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('role', 'admin')
          .order('created_at', { ascending: false });

        if (error) throw error;
        profilesData = data || [];
      } catch (profilesError: any) {
        console.error('Error fetching profiles:', profilesError);
        setMemberError('無法取得已註冊管理員清單：' + (profilesError.message || '未知錯誤'));
      }

      // 2. Fetch whitelisted emails
      let whitelistData: any[] = [];
      try {
        const { data, error } = await supabase
          .from('admin_whitelist')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        whitelistData = data || [];
      } catch (whitelistError: any) {
        console.warn('Error fetching admin_whitelist (table may not exist yet):', whitelistError);
        // We append a helpful setup warning, but don't crash
        setMemberError(prev => 
          (prev ? prev + '\n' : '') + 
          'DatabaseWarning: 尚未建立 admin_whitelist 資料表。未註冊用戶將無法進行預先授權，請執行 Supabase SQL 設定。'
        );
      }

      setAdmins(profilesData);
      setWhitelist(whitelistData);
    } catch (err: any) {
      console.error('Unexpected error in fetchAdminsAndWhitelist:', err);
    } finally {
      setLoadingMembers(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'members') {
      fetchAdminsAndWhitelist();
    }
  }, [activeTab]);


  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    const emailToNormalize = newAdminEmail.trim().toLowerCase();
    if (!emailToNormalize) return;

    try {
      setSubmittingAdmin(true);
      setMemberError('');

      let whitelistSuccess = false;
      let whitelistDuplicate = false;
      try {
        // 1. Try to insert into whitelist
        const { error: whitelistError } = await supabase
          .from('admin_whitelist')
          .insert({ email: emailToNormalize });

        if (whitelistError) {
          if (whitelistError.code === '23505') {
            whitelistDuplicate = true;
          }
          throw whitelistError;
        }
        whitelistSuccess = true;
      } catch (whitelistError: any) {
        console.warn('Could not insert into admin_whitelist:', whitelistError);
        if (whitelistDuplicate) {
          throw new Error('此電子郵件已在管理員名單中！');
        }
        // Notify user about missing table, but attempt role update if registered
        setMemberError('警告：無法寫入 admin_whitelist（資料表可能尚未建立）。系統將嘗試直接為已註冊帳號進行升級。');
      }

      // 2. If the user is already registered in profiles, promote them to admin
      const { data: existingProfiles, error: checkError } = await supabase
        .from('profiles')
        .select('id, role')
        .eq('email', emailToNormalize);

      let promoteSuccess = false;
      if (!checkError && existingProfiles && existingProfiles.length > 0) {
        for (const p of existingProfiles) {
          if (p.role !== 'admin') {
            const { error: updateError } = await supabase
              .from('profiles')
              .update({ role: 'admin' })
              .eq('id', p.id);
            if (!updateError) promoteSuccess = true;
          } else {
            promoteSuccess = true;
          }
        }
      }

      if (whitelistSuccess || promoteSuccess) {
        setNewAdminEmail('');
        await fetchAdminsAndWhitelist();
        alert(promoteSuccess ? '成功將該註冊用戶設為管理員！' : '已成功加入管理員授權名單！');
      } else {
        throw new Error('新增失敗：該電子郵件尚未註冊，且資料庫尚未建立 admin_whitelist 資料表。');
      }
    } catch (err: any) {
      console.error('Error adding admin:', err);
      setMemberError(err.message || '新增管理員失敗');
    } finally {
      setSubmittingAdmin(false);
    }
  };

  const handleRemoveAdmin = async (email: string, memberId?: string) => {
    const defaultDevs = ['enochwork123@gmail.com', 'lawfelix2002@gmail.com'];
    if (defaultDevs.includes(email)) {
      alert('您不能移除系統預設的開發人員管理權限！');
      return;
    }
    if ((memberId && memberId === user?.id) || (user?.email && email.toLowerCase() === user.email.toLowerCase())) {
      alert('您不能移除自己的管理員權限！');
      return;
    }

    if (!confirm(`確定要移除管理員 ${email} 嗎？`)) {
      return;
    }

    try {
      setSubmittingAdmin(true);
      setMemberError('');

      // 1. Delete from whitelist
      const { error: whitelistError } = await supabase
        .from('admin_whitelist')
        .delete()
        .eq('email', email);

      if (whitelistError) {
        const isTableMissing = whitelistError.message && (
          whitelistError.message.includes('admin_whitelist') ||
          whitelistError.message.includes('schema cache') ||
          whitelistError.message.includes('relation')
        );
        if (!isTableMissing || !memberId) {
          throw whitelistError;
        }
        console.warn('admin_whitelist table missing during demotion, but profile demotion will be attempted.');
      }

      // 2. If registered, demote to member in profiles
      if (memberId) {
        const { error: profileError } = await supabase
          .from('profiles')
          .update({ role: 'member' })
          .eq('id', memberId);

        if (profileError) throw profileError;
      } else {
        const { data: registeredUsers } = await supabase
          .from('profiles')
          .select('id')
          .eq('email', email);

        if (registeredUsers && registeredUsers.length > 0) {
          for (const u of registeredUsers) {
            await supabase
              .from('profiles')
              .update({ role: 'member' })
              .eq('id', u.id);
          }
        }
      }

      await fetchAdminsAndWhitelist();
      alert('成功移除管理員權限！');
    } catch (err: any) {
      console.error('Error removing admin:', err);
      setMemberError(err.message || '移除管理員失敗');
    } finally {
      setSubmittingAdmin(false);
    }
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
      {/* Sidebar — collapsible */}
      <aside className={`flex flex-col border-r border-outline-variant/60 bg-surface-container-lowest transition-all duration-300 ${ adminSidebarOpen ? 'w-72' : 'w-16' } shrink-0`}>
        {/* Sidebar header */}
        <div className="flex h-20 items-center justify-between border-b border-outline-variant/40 px-3 shrink-0">
          {adminSidebarOpen && (
            <div className="flex items-center gap-3 min-w-0">
              <Icon name="design_services" className="text-[22px] text-primary shrink-0" />
              <span className="font-headline text-lg font-black tracking-tight text-primary truncate">
                IFU 內容管理
              </span>
            </div>
          )}
          <button
            onClick={() => setAdminSidebarOpen(!adminSidebarOpen)}
            title={adminSidebarOpen ? '收起側欄' : '展開側欄'}
            className="ml-auto flex h-9 w-9 shrink-0 items-center justify-center rounded-full hover:bg-surface-container transition cursor-pointer"
          >
            <Icon name={adminSidebarOpen ? 'chevron_left' : 'chevron_right'} className="text-xl text-secondary" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto overflow-x-hidden p-3">
          {/* Group 1: Web Page Content */}
          {adminSidebarOpen && (
            <p className="mb-1.5 mt-1 px-2 text-[9px] font-extrabold uppercase tracking-[0.18em] text-secondary/55">
              網頁內容管理
            </p>
          )}
          <div className="space-y-1.5">
            {([
              { tab: 'general',          icon: 'settings',     label: '一般設定 & 標題' },
              { tab: 'home-cards',       icon: 'home',         label: '首頁入口卡片' },
              { tab: 'journey-steps',    icon: 'route',        label: '培育生命路徑' },
              { tab: 'quiet-time-study', icon: 'wb_sunny',     label: '每日靈修研讀' },
              { tab: 'lessons',          icon: 'auto_stories', label: '課程頁面 & 卡片' },
            ] as const).map(({ tab, icon, label }) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                title={!adminSidebarOpen ? label : undefined}
                className={`flex w-full items-center rounded-[1.2rem] py-3 text-sm font-bold transition-all ${
                  adminSidebarOpen ? 'px-3 gap-3.5 justify-start' : 'px-0 justify-center'
                } ${
                  activeTab === tab
                    ? 'bg-primary text-white shadow-[0_8px_20px_rgba(40,53,28,0.15)]'
                    : 'text-on-surface-variant hover:bg-surface-container-low'
                }`}
              >
                <Icon name={icon} className="text-xl shrink-0" />
                {adminSidebarOpen && <span className="truncate">{label}</span>}
              </button>
            ))}
          </div>

          <div className="mx-1 my-3 h-px bg-outline-variant/30" />

          {/* Group 2: Platform Management */}
          {adminSidebarOpen && (
            <p className="mb-1.5 px-2 text-[9px] font-extrabold uppercase tracking-[0.18em] text-secondary/55">
              平台管理
            </p>
          )}
          <div className="space-y-1.5">
            {([
              { tab: 'media',    icon: 'photo_library', label: '相片與媒體庫' },
              { tab: 'members',  icon: 'group',         label: '成員與權限管理' },
              { tab: 'wishlist', icon: 'lightbulb',     label: '功能許願池' },
            ] as const).map(({ tab, icon, label }) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                title={!adminSidebarOpen ? label : undefined}
                className={`flex w-full items-center rounded-[1.2rem] py-3 text-sm font-bold transition-all ${
                  adminSidebarOpen ? 'px-3 gap-3.5 justify-start' : 'px-0 justify-center'
                } ${
                  activeTab === tab
                    ? 'bg-primary text-white shadow-[0_8px_20px_rgba(40,53,28,0.15)]'
                    : 'text-on-surface-variant hover:bg-surface-container-low'
                }`}
              >
                <Icon name={icon} className="text-xl shrink-0" />
                {adminSidebarOpen && <span className="truncate">{label}</span>}
              </button>
            ))}
          </div>
        </nav>

        {/* Action buttons at footer of sidebar */}
        <div className="border-t border-outline-variant/40 p-3 space-y-2">
          {adminSidebarOpen ? (
            <>
              <button
                onClick={exportConfig}
                className="flex w-full items-center justify-center gap-2 rounded-full border border-primary/40 py-2.5 text-xs font-bold text-primary hover:bg-primary/5 active:scale-98 transition"
              >
                <Icon name="download" className="text-base" />
                導出 JSON 配置文件
              </button>
              <button
                onClick={() => { setImportStatus(null); setShowImportArea(true); }}
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
                <Icon name="restart_alt" className="text-base" />
                重置為默認數據
              </button>
              <button
                onClick={() => navigate('/')}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-secondary py-3 text-xs font-extrabold tracking-widest text-white hover:brightness-105 active:scale-98 transition shadow-[0_8px_16px_rgba(121,89,0,0.15)]"
              >
                <Icon name="arrow_back" className="text-sm" />
                返回前台網站
              </button>
            </>
          ) : (
            /* Collapsed: icon-only action buttons */
            <>
              <button onClick={exportConfig} title="導出 JSON" className="flex w-full items-center justify-center rounded-full border border-primary/40 py-2 hover:bg-primary/5 transition cursor-pointer">
                <Icon name="download" className="text-base text-primary" />
              </button>
              <button onClick={() => { setImportStatus(null); setShowImportArea(true); }} title="導入 JSON" className="flex w-full items-center justify-center rounded-full border border-outline-variant py-2 hover:bg-surface-container transition cursor-pointer">
                <Icon name="upload" className="text-base text-on-surface-variant" />
              </button>
              <button onClick={() => { if (window.confirm('確定要清除所有更改並恢復為默認配置嗎？')) { resetToDefaults(); alert('已恢復為預設值！'); } }} title="重置為默認數據" className="flex w-full items-center justify-center rounded-full border border-red-200 py-2 hover:bg-red-50 transition cursor-pointer">
                <Icon name="restart_alt" className="text-base text-red-600" />
              </button>
              <button onClick={() => navigate('/')} title="返回前台網站" className="flex w-full items-center justify-center rounded-full bg-secondary py-2.5 hover:brightness-105 transition cursor-pointer">
                <Icon name="arrow_back" className="text-sm text-white" />
              </button>
            </>
          )}
        </div>
      </aside>

      {/* Main Panel */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden bg-surface-container-lowest/40">
        {/* Topbar of main panel */}
        <div className="px-10 py-5 shrink-0 border-b border-outline-variant/40 flex items-center justify-between bg-white/70 backdrop-blur-md">
          <div>
            <h2 className="font-headline text-2xl font-black text-primary leading-tight">
              {activeTab === 'general' && '一般設定 & 標題'}
              {activeTab === 'home-cards' && '首頁入口卡片管理'}
              {activeTab === 'journey-steps' && '培育生命路徑管理 (12個靈修培育步驟)'}
              {activeTab === 'quiet-time-study' && '每日靈修研讀設定'}
              {activeTab === 'lessons' && '課程頁面 & 內容卡片'}
              {activeTab === 'media' && '相片與媒體庫'}
              {activeTab === 'members' && '成員與權限管理'}
              {activeTab === 'wishlist' && '功能許願池 & 反饋'}
            </h2>
            <p className="mt-1 text-xs text-on-surface-variant">
              {activeTab === 'general' && '修改網站全域的標題、副標題和腳本引導文字。'}
              {activeTab === 'home-cards' && '管理首頁顯示的三大主要培育路徑入口卡片。'}
              {activeTab === 'journey-steps' && '調整12個靈修課程的順序、圖示、名稱與解鎖狀態。'}
              {activeTab === 'quiet-time-study' && '管理每日靈修卡片的新增、編輯與刪除。所有變更即時同步至自修學習頁面。'}
              {activeTab === 'lessons' && '編輯特定課程的內文、卡片視覺顏色樣式、大小尺寸以及添加/刪除卡片。'}
              {activeTab === 'media' && '在此上傳相片，系統會自動生成臨時 Base64 以供網站即時展示。'}
              {activeTab === 'members' && '查看註冊會員、調整權限等級、變更管理員身份。'}
              {activeTab === 'wishlist' && '提交您想要的新功能需求或反饋，系統將通過 Supabase Edge Function 同步至 GitHub Issues。'}
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Real-time Preview Toggle */}
            {activeTab !== 'members' && activeTab !== 'wishlist' && (
              <button
                onClick={() => setShowPreview(!showPreview)}
                className={`flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
                  showPreview
                    ? 'border-primary bg-primary/8 text-primary shadow-sm'
                    : 'border-outline-variant hover:bg-surface-container'
                }`}
              >
                <Icon name="chrome_reader_mode" className="text-base text-primary" />
                {showPreview ? '隱藏實時預覽' : '顯示實時預覽'}
              </button>
            )}

            <div className="flex items-center gap-2 rounded-full bg-green-50 border border-green-200 px-4 py-2 text-xs font-bold text-green-700">
              <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              本地存儲已啟用 (隔離保護中)
            </div>
          </div>
        </div>

        {/* Split pane content area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left panel: Form Editor */}
          <div className={`h-full overflow-y-auto px-10 py-8 ${isPreviewActive ? 'w-[50%]' : 'w-full'}`}>

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
          <div className="flex flex-col gap-6 max-w-2xl">
            <div className="flex justify-between items-center bg-surface-container-low p-4 rounded-[1.8rem] border border-outline-variant/40 shadow-sm">
              <span className="text-xs font-bold text-secondary uppercase tracking-widest">入口卡片列表</span>
              <button
                onClick={() => {
                  const newId = `home-card-${Date.now()}`;
                  const newCard = {
                    id: newId,
                    title: '新入口卡片',
                    description: '請輸入卡片描述...',
                    icon: 'explore',
                    route: '/journey',
                    accent: 'surface' as const,
                  };
                  updateHomeCards([...homeCards, newCard]);
                }}
                className="flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-xs font-bold text-white shadow-sm hover:brightness-105 active:scale-95 cursor-pointer"
              >
                <Icon name="add" className="text-xs" />
                添加入口卡片
              </button>
            </div>

            {homeCards.map((card, idx) => (
              <div key={card.id} className="rounded-[1.8rem] bg-surface-container-low p-6 shadow-sm border border-outline-variant/40 space-y-4">
                <div className="flex items-center justify-between border-b border-outline-variant/30 pb-3">
                  <div className="flex items-center gap-3">
                    <span className="font-headline text-lg font-black text-primary">入口卡片 #{idx + 1}</span>
                    <span className="text-xs text-on-surface-variant font-mono bg-white px-2 py-0.5 rounded border border-outline-variant/30">{card.id}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      disabled={idx === 0}
                      onClick={() => {
                        const nextCards = [...homeCards];
                        const temp = nextCards[idx];
                        if (temp) {
                          nextCards[idx] = nextCards[idx - 1]!;
                          nextCards[idx - 1] = temp;
                          updateHomeCards(nextCards);
                        }
                      }}
                      className="flex h-8 w-8 items-center justify-center rounded-full border border-outline-variant bg-white hover:bg-surface-container disabled:opacity-40 cursor-pointer transition"
                      title="移上"
                    >
                      <Icon name="arrow_upward" className="text-xs" />
                    </button>
                    <button
                      disabled={idx === homeCards.length - 1}
                      onClick={() => {
                        const nextCards = [...homeCards];
                        const temp = nextCards[idx];
                        if (temp) {
                          nextCards[idx] = nextCards[idx + 1]!;
                          nextCards[idx + 1] = temp;
                          updateHomeCards(nextCards);
                        }
                      }}
                      className="flex h-8 w-8 items-center justify-center rounded-full border border-outline-variant bg-white hover:bg-surface-container disabled:opacity-40 cursor-pointer transition"
                      title="移下"
                    >
                      <Icon name="arrow_downward" className="text-xs" />
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm('確定要刪除這張入口卡片嗎？')) {
                          updateHomeCards(homeCards.filter(c => c.id !== card.id));
                        }
                      }}
                      className="flex h-8 w-8 items-center justify-center rounded-full border border-red-200 bg-white text-red-600 hover:bg-red-50 cursor-pointer transition"
                      title="刪除"
                    >
                      <Icon name="delete" className="text-sm" />
                    </button>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
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
                      <label className="block text-xs font-bold text-secondary">路徑連結 (Route)</label>
                      <input
                        type="text"
                        value={card.route}
                        onChange={(e) => {
                          const newCards = [...homeCards];
                          newCards[idx] = { ...card, route: e.target.value };
                          updateHomeCards(newCards);
                        }}
                        className="mt-1.5 w-full rounded-[0.8rem] border border-outline-variant bg-white p-2.5 text-sm outline-none focus:border-primary"
                      />
                    </div>
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

        {activeTab === 'quiet-time-study' && (
          <div className="flex flex-col gap-6 max-w-2xl">
            {/* Header bar */}
            <div className="flex justify-between items-center bg-surface-container-low p-4 rounded-[1.8rem] border border-outline-variant/40 shadow-sm">
              <span className="text-xs font-bold text-secondary uppercase tracking-widest">
                每日靈修卡片 ({quietTimeEntries.length} 篇)
              </span>
              <button
                onClick={() => {
                  setQtFormData({ ...emptyQtForm, id: `qt-${Date.now()}` });
                  setShowQtForm(true);
                  setExpandedQtId(null);
                }}
                className="flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-xs font-bold text-white shadow-sm hover:brightness-105 active:scale-95 cursor-pointer"
              >
                <Icon name="add" className="text-xs" />
                新增靈修卡片
              </button>
            </div>

            {/* Add New Card Form */}
            {showQtForm && (
              <div className="rounded-[1.8rem] bg-white p-6 border-2 border-primary/20 shadow-md space-y-4">
                <div className="flex items-center justify-between border-b border-outline-variant/30 pb-3">
                  <h3 className="font-headline text-base font-black text-primary flex items-center gap-2">
                    <Icon name="add_circle" className="text-secondary text-base" />
                    新增每日靈修卡片
                  </h3>
                  <button
                    onClick={() => setShowQtForm(false)}
                    className="h-7 w-7 flex items-center justify-center rounded-full hover:bg-surface-container text-on-surface-variant transition cursor-pointer"
                  >
                    <Icon name="close" className="text-sm" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-secondary">靈修標題</label>
                    <input
                      type="text"
                      value={qtFormData.title}
                      onChange={(e) => setQtFormData({ ...qtFormData, title: e.target.value })}
                      placeholder="例如：活在基督裡"
                      className="mt-1.5 w-full rounded-[0.8rem] border border-outline-variant bg-surface-container-low p-2.5 text-sm outline-none focus:border-primary focus:bg-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-secondary">聖經書卷 (Book)</label>
                      <input
                        type="text"
                        value={qtFormData.book}
                        onChange={(e) => setQtFormData({ ...qtFormData, book: e.target.value })}
                        placeholder="例如：約翰福音"
                        className="mt-1.5 w-full rounded-[0.8rem] border border-outline-variant bg-surface-container-low p-2.5 text-sm outline-none focus:border-primary focus:bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-secondary">章節 (Passage)</label>
                      <input
                        type="text"
                        value={qtFormData.passage}
                        onChange={(e) => setQtFormData({ ...qtFormData, passage: e.target.value })}
                        placeholder="例如：15:4-5"
                        className="mt-1.5 w-full rounded-[0.8rem] border border-outline-variant bg-surface-container-low p-2.5 text-sm outline-none focus:border-primary focus:bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-secondary">
                      中文經文引文
                      <span className="ml-1.5 text-[10px] font-normal text-outline bg-[#ffdfa0]/40 px-1.5 py-0.5 rounded">【經文】</span>
                    </label>
                    <textarea
                      value={qtFormData.scriptureText}
                      rows={3}
                      onChange={(e) => setQtFormData({ ...qtFormData, scriptureText: e.target.value })}
                      placeholder="請輸入中文聖經引文..."
                      className="mt-1.5 w-full rounded-[0.8rem] border border-outline-variant bg-surface-container-low p-2.5 text-sm outline-none focus:border-primary focus:bg-white font-sans leading-relaxed resize-y"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-secondary">
                      靈修分享
                      <span className="ml-1.5 text-[10px] font-normal text-outline bg-surface-container px-1.5 py-0.5 rounded">【靈修分享】</span>
                      <span className="text-on-surface-variant font-normal ml-1">(每段落佔一行)</span>
                    </label>
                    <textarea
                      value={qtFormData.content.join('\n')}
                      rows={5}
                      onChange={(e) => setQtFormData({ ...qtFormData, content: e.target.value.split('\n') })}
                      placeholder="請輸入靈修分享內容，每個段落佔一行..."
                      className="mt-1.5 w-full rounded-[0.8rem] border border-outline-variant bg-surface-container-low p-2.5 text-sm outline-none focus:border-primary focus:bg-white font-sans leading-relaxed resize-y"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-secondary">
                      默想應用問題
                      <span className="ml-1.5 text-[10px] font-normal text-outline bg-surface-container px-1.5 py-0.5 rounded">【默想應用】</span>
                      <span className="text-on-surface-variant font-normal ml-1">(每題佔一行)</span>
                    </label>
                    <textarea
                      value={qtFormData.reflection.join('\n')}
                      rows={3}
                      onChange={(e) => setQtFormData({ ...qtFormData, reflection: e.target.value.split('\n') })}
                      placeholder="請輸入反思問題，每題佔一行..."
                      className="mt-1.5 w-full rounded-[0.8rem] border border-outline-variant bg-surface-container-low p-2.5 text-sm outline-none focus:border-primary focus:bg-white font-sans leading-relaxed resize-y"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-secondary">
                      祈禱回應
                      <span className="ml-1.5 text-[10px] font-normal text-outline bg-[#d8e8c4]/50 px-1.5 py-0.5 rounded">【祈禱回應】</span>
                    </label>
                    <textarea
                      value={qtFormData.prayer}
                      rows={3}
                      onChange={(e) => setQtFormData({ ...qtFormData, prayer: e.target.value })}
                      placeholder="請輸入禱告文..."
                      className="mt-1.5 w-full rounded-[0.8rem] border border-outline-variant bg-surface-container-low p-2.5 text-sm outline-none focus:border-primary focus:bg-white font-sans leading-relaxed resize-y"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-secondary">主題標籤 (以逗號分隔)</label>
                      <input
                        type="text"
                        value={qtFormData.topics.join(', ')}
                        onChange={(e) => setQtFormData({ ...qtFormData, topics: e.target.value.split(',').map(t => t.trim()).filter(Boolean) })}
                        placeholder="例如：信心, 禱告, 感恩"
                        className="mt-1.5 w-full rounded-[0.8rem] border border-outline-variant bg-surface-container-low p-2.5 text-sm outline-none focus:border-primary focus:bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-secondary">發佈日期</label>
                      <input
                        type="date"
                        value={qtFormData.dateAdded}
                        onChange={(e) => setQtFormData({ ...qtFormData, dateAdded: e.target.value })}
                        className="mt-1.5 w-full rounded-[0.8rem] border border-outline-variant bg-surface-container-low p-2.5 text-sm outline-none focus:border-primary focus:bg-white"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-2 border-t border-outline-variant/20">
                    <button
                      onClick={() => setShowQtForm(false)}
                      className="rounded-full border border-outline-variant px-5 py-2 text-xs font-bold text-on-surface-variant hover:bg-surface-container transition cursor-pointer"
                    >
                      取消
                    </button>
                    <button
                      onClick={() => {
                        if (!qtFormData.title.trim()) return;
                        const newEntry = {
                          id: qtFormData.id,
                          title: qtFormData.title.trim(),
                          book: qtFormData.book.trim(),
                          passage: qtFormData.passage.trim(),
                          scriptureText: qtFormData.scriptureText.trim(),
                          content: qtFormData.content.filter(p => p.trim()),
                          reflection: qtFormData.reflection.filter(r => r.trim()),
                          prayer: qtFormData.prayer.trim(),
                          topics: qtFormData.topics,
                          dateAdded: qtFormData.dateAdded,
                        };
                        updateQuietTimeEntries([newEntry, ...quietTimeEntries]);
                        setShowQtForm(false);
                      }}
                      className="rounded-full bg-primary px-6 py-2 text-xs font-bold text-white hover:brightness-105 transition cursor-pointer shadow-sm"
                    >
                      儲存並新增
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Empty state */}
            {quietTimeEntries.length === 0 && !showQtForm && (
              <div className="rounded-[1.8rem] border border-dashed border-outline-variant bg-surface-container-low p-12 text-center">
                <Icon name="wb_sunny" className="text-[48px] text-outline/30 mx-auto block" />
                <p className="mt-4 font-headline text-base font-bold text-primary">尚無每日靈修卡片</p>
                <p className="mt-2 text-xs text-on-surface-variant">點擊右上角「新增靈修卡片」開始新增。</p>
              </div>
            )}

            {/* Entries List */}
            <div className="space-y-3">
              {quietTimeEntries.map((entry, idx) => {
                const isExpanded = expandedQtId === entry.id;
                return (
                  <div
                    key={entry.id}
                    className={`rounded-[1.8rem] border transition shadow-sm ${
                      isExpanded
                        ? 'border-primary ring-2 ring-primary/5 bg-surface-container-low'
                        : 'border-outline-variant/40 bg-surface-container-low/75'
                    }`}
                  >
                    {/* Entry header row */}
                    <div className="flex items-center justify-between p-5">
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-surface-container-high text-xs font-bold text-secondary border border-outline-variant/50 shrink-0">
                          {idx + 1}
                        </span>
                        <div className="min-w-0">
                          <span className="inline-block text-[10px] font-extrabold tracking-widest text-secondary bg-[#ffdfa0]/50 px-2 py-0.5 rounded-full">
                            {entry.book} {entry.passage}
                          </span>
                          <p className="font-headline font-black text-sm text-primary mt-1 truncate">
                            {entry.title || '(無標題)'}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => setExpandedQtId(isExpanded ? null : entry.id)}
                          className="flex h-8 items-center gap-1 px-3 rounded-full border border-outline-variant bg-white text-xs font-bold text-on-surface hover:bg-surface-container cursor-pointer transition"
                        >
                          <Icon name={isExpanded ? 'done' : 'edit'} className="text-sm text-primary" />
                          {isExpanded ? '完成' : '編輯'}
                        </button>
                        <button
                          disabled={idx === 0}
                          onClick={() => {
                            const next = [...quietTimeEntries];
                            [next[idx], next[idx - 1]] = [next[idx - 1]!, next[idx]!];
                            updateQuietTimeEntries(next);
                          }}
                          className="flex h-8 w-8 items-center justify-center rounded-full border border-outline-variant bg-white hover:bg-surface-container disabled:opacity-40 cursor-pointer transition"
                          title="移上"
                        >
                          <Icon name="arrow_upward" className="text-xs" />
                        </button>
                        <button
                          disabled={idx === quietTimeEntries.length - 1}
                          onClick={() => {
                            const next = [...quietTimeEntries];
                            [next[idx], next[idx + 1]] = [next[idx + 1]!, next[idx]!];
                            updateQuietTimeEntries(next);
                          }}
                          className="flex h-8 w-8 items-center justify-center rounded-full border border-outline-variant bg-white hover:bg-surface-container disabled:opacity-40 cursor-pointer transition"
                          title="移下"
                        >
                          <Icon name="arrow_downward" className="text-xs" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm('確定要刪除這篇靈修卡片嗎？此操作將同步從自修學習頁面移除。')) {
                              updateQuietTimeEntries(quietTimeEntries.filter(e => e.id !== entry.id));
                              if (expandedQtId === entry.id) setExpandedQtId(null);
                            }
                          }}
                          className="flex h-8 w-8 items-center justify-center rounded-full border border-red-200 bg-white text-red-600 hover:bg-red-50 cursor-pointer transition"
                          title="刪除"
                        >
                          <Icon name="delete" className="text-sm" />
                        </button>
                      </div>
                    </div>

                    {/* Inline Edit Form */}
                    {isExpanded && (
                      <div className="px-6 pb-6 pt-2 space-y-4 bg-white/60 rounded-b-[1.8rem] border-t border-outline-variant/20">
                        <div>
                          <label className="block text-xs font-bold text-secondary">靈修標題</label>
                          <input
                            type="text"
                            value={entry.title}
                            onChange={(e) => {
                              const next = [...quietTimeEntries];
                              next[idx] = { ...entry, title: e.target.value };
                              updateQuietTimeEntries(next);
                            }}
                            className="mt-1.5 w-full rounded-[0.8rem] border border-outline-variant bg-white p-2.5 text-sm outline-none focus:border-primary"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-bold text-secondary">聖經書卷 (Book)</label>
                            <input
                              type="text"
                              value={entry.book}
                              onChange={(e) => {
                                const next = [...quietTimeEntries];
                                next[idx] = { ...entry, book: e.target.value };
                                updateQuietTimeEntries(next);
                              }}
                              className="mt-1.5 w-full rounded-[0.8rem] border border-outline-variant bg-white p-2.5 text-sm outline-none focus:border-primary"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-secondary">章節 (Passage)</label>
                            <input
                              type="text"
                              value={entry.passage}
                              onChange={(e) => {
                                const next = [...quietTimeEntries];
                                next[idx] = { ...entry, passage: e.target.value };
                                updateQuietTimeEntries(next);
                              }}
                              className="mt-1.5 w-full rounded-[0.8rem] border border-outline-variant bg-white p-2.5 text-sm outline-none focus:border-primary"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-secondary">
                            中文經文引文
                            <span className="ml-1.5 text-[10px] font-normal text-outline bg-[#ffdfa0]/40 px-1.5 py-0.5 rounded">【經文】</span>
                          </label>
                          <textarea
                            value={entry.scriptureText}
                            rows={3}
                            onChange={(e) => {
                              const next = [...quietTimeEntries];
                              next[idx] = { ...entry, scriptureText: e.target.value };
                              updateQuietTimeEntries(next);
                            }}
                            className="mt-1.5 w-full rounded-[0.8rem] border border-outline-variant bg-white p-2.5 text-sm outline-none focus:border-primary font-sans leading-relaxed resize-y"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-secondary">
                            靈修分享
                            <span className="ml-1.5 text-[10px] font-normal text-outline bg-surface-container px-1.5 py-0.5 rounded">【靈修分享】</span>
                            <span className="text-on-surface-variant font-normal ml-1">(每段落佔一行)</span>
                          </label>
                          <textarea
                            value={entry.content.join('\n')}
                            rows={5}
                            onChange={(e) => {
                              const next = [...quietTimeEntries];
                              next[idx] = { ...entry, content: e.target.value.split('\n') };
                              updateQuietTimeEntries(next);
                            }}
                            className="mt-1.5 w-full rounded-[0.8rem] border border-outline-variant bg-white p-2.5 text-sm outline-none focus:border-primary font-sans leading-relaxed resize-y"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-secondary">
                            默想應用問題
                            <span className="ml-1.5 text-[10px] font-normal text-outline bg-surface-container px-1.5 py-0.5 rounded">【默想應用】</span>
                            <span className="text-on-surface-variant font-normal ml-1">(每題佔一行)</span>
                          </label>
                          <textarea
                            value={entry.reflection.join('\n')}
                            rows={3}
                            onChange={(e) => {
                              const next = [...quietTimeEntries];
                              next[idx] = { ...entry, reflection: e.target.value.split('\n') };
                              updateQuietTimeEntries(next);
                            }}
                            className="mt-1.5 w-full rounded-[0.8rem] border border-outline-variant bg-white p-2.5 text-sm outline-none focus:border-primary font-sans leading-relaxed resize-y"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-secondary">
                            祈禱回應
                            <span className="ml-1.5 text-[10px] font-normal text-outline bg-[#d8e8c4]/50 px-1.5 py-0.5 rounded">【祈禱回應】</span>
                          </label>
                          <textarea
                            value={entry.prayer}
                            rows={3}
                            onChange={(e) => {
                              const next = [...quietTimeEntries];
                              next[idx] = { ...entry, prayer: e.target.value };
                              updateQuietTimeEntries(next);
                            }}
                            className="mt-1.5 w-full rounded-[0.8rem] border border-outline-variant bg-white p-2.5 text-sm outline-none focus:border-primary font-sans leading-relaxed resize-y"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-bold text-secondary">主題標籤 (以逗號分隔)</label>
                            <input
                              type="text"
                              value={entry.topics.join(', ')}
                              onChange={(e) => {
                                const next = [...quietTimeEntries];
                                next[idx] = { ...entry, topics: e.target.value.split(',').map(t => t.trim()).filter(Boolean) };
                                updateQuietTimeEntries(next);
                              }}
                              className="mt-1.5 w-full rounded-[0.8rem] border border-outline-variant bg-white p-2.5 text-sm outline-none focus:border-primary"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-secondary">發佈日期</label>
                            <input
                              type="date"
                              value={entry.dateAdded}
                              onChange={(e) => {
                                const next = [...quietTimeEntries];
                                next[idx] = { ...entry, dateAdded: e.target.value };
                                updateQuietTimeEntries(next);
                              }}
                              className="mt-1.5 w-full rounded-[0.8rem] border border-outline-variant bg-white p-2.5 text-sm outline-none focus:border-primary"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'lessons' && (
          <div className="flex gap-8 items-start w-full">
            {/* Left selector sidebar */}
            <div className={`shrink-0 rounded-[1.8rem] bg-surface-container-low p-4 border border-outline-variant/40 space-y-3 transition-all duration-300 ${lessonsSidebarOpen ? 'w-64' : 'w-16'}`}>
              <div className="flex items-center justify-between px-2">
                {lessonsSidebarOpen && (
                  <h4 className="text-xs font-bold text-secondary uppercase tracking-widest truncate">選擇靈修章節</h4>
                )}
                <button
                  onClick={() => setLessonsSidebarOpen(!lessonsSidebarOpen)}
                  title={lessonsSidebarOpen ? '收起靈修章節' : '展開靈修章節'}
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full hover:bg-surface-container-high transition cursor-pointer ${!lessonsSidebarOpen ? 'mx-auto' : ''}`}
                >
                  <Icon name={lessonsSidebarOpen ? 'chevron_left' : 'chevron_right'} className="text-sm text-secondary" />
                </button>
              </div>
              <div className="space-y-1">
                {lessonRoutes.map((route) => {
                  const isSelected = selectedLessonId === route.id;
                  const shortId = route.id.replace('lesson-', '');
                  const shortLabel = route.title.substring(0, 2);
                  return (
                    <button
                      key={route.id}
                      onClick={() => {
                        setSelectedLessonId(route.id);
                        setEditingModuleId(null);
                      }}
                      title={!lessonsSidebarOpen ? route.title : undefined}
                      className={`w-full flex items-center rounded-[0.8rem] transition ${
                        lessonsSidebarOpen 
                          ? 'justify-between px-3 py-2.5 text-left text-xs' 
                          : 'justify-center py-2.5 text-[10px]'
                      } font-bold ${
                        isSelected
                          ? 'bg-secondary text-white shadow-sm'
                          : 'text-on-surface-variant hover:bg-surface-container'
                      }`}
                    >
                      {lessonsSidebarOpen ? (
                        <>
                          <span className="truncate">{route.title}</span>
                          <span className="text-[9px] opacity-70 font-mono ml-1 shrink-0">{shortId}</span>
                        </>
                      ) : (
                        <span className="truncate">{shortLabel}</span>
                      )}
                    </button>
                  );
                })}
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

        {activeTab === 'members' && (
          <div className="space-y-8 max-w-4xl">
            {/* Database warning with copyable SQL if table is missing */}
            {memberError && (memberError.includes('admin_whitelist') || memberError.includes('DatabaseWarning')) && (
              <div className="rounded-[1.8rem] bg-amber-50 border border-amber-200 p-6 shadow-sm space-y-4">
                <div className="flex items-center gap-2 font-bold text-amber-800">
                  <Icon name="warning" className="text-xl" />
                  資料庫設定未完成 (Supabase Configuration Required)
                </div>
                <p className="text-xs text-amber-700 leading-relaxed">
                  您的 Supabase 資料庫中目前缺少 <code>admin_whitelist</code> 資料表。這會導致無法對未註冊用戶進行預先授權。
                  請在 <strong>Supabase Dashboard -&gt; SQL Editor</strong> 中執行以下 SQL 語句以完成設定：
                </p>
                <pre className="p-4 bg-slate-900 text-slate-100 rounded-xl font-mono text-[11px] overflow-x-auto whitespace-pre select-all">
{`CREATE TABLE IF NOT EXISTS public.admin_whitelist (
  email text PRIMARY KEY,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.admin_whitelist ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can read admin whitelist"
  ON public.admin_whitelist FOR SELECT
  USING (public.is_admin());

CREATE POLICY "Admins can insert into admin whitelist"
  ON public.admin_whitelist FOR INSERT
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can delete from admin whitelist"
  ON public.admin_whitelist FOR DELETE
  USING (public.is_admin());

INSERT INTO public.admin_whitelist (email)
VALUES ('enochwork123@gmail.com'), ('lawfelix2002@gmail.com')
ON CONFLICT (email) DO NOTHING;`}
                </pre>
              </div>
            )}

            {/* Add Admin form */}
            <div className="rounded-[2rem] bg-surface-container-low p-8 border border-outline-variant/50 shadow-sm space-y-6">
              <h3 className="font-headline text-xl font-black text-primary">新增管理員人員</h3>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                請輸入欲授權之電子郵件。若該用戶已註冊，系統會立即升級其權限；若尚未註冊，該電子郵件將加入授權名單，在其首次登入時自動升級為管理員。
              </p>

              {memberError && !(memberError.includes('admin_whitelist') || memberError.includes('DatabaseWarning')) && (
                <div className="rounded-xl bg-red-50 border border-red-200 p-4 text-xs font-bold text-red-600 animate-fade-in">
                  {memberError}
                </div>
              )}

              <form onSubmit={handleAddAdmin} className="flex gap-4 max-w-lg">
                <input
                  type="email"
                  required
                  placeholder="例如: disciple@example.com"
                  value={newAdminEmail}
                  onChange={(e) => setNewAdminEmail(e.target.value)}
                  className="flex-1 rounded-[1rem] border border-outline-variant bg-white p-3 text-sm text-on-surface outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                />
                <button
                  type="submit"
                  disabled={submittingAdmin}
                  className="rounded-full bg-primary px-6 py-3 text-xs font-extrabold tracking-wider text-white hover:brightness-105 active:scale-95 transition disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
                >
                  <Icon name="person_add" className="text-sm" />
                  授權並新增
                </button>
              </form>
            </div>

            {/* Registered Admins */}
            <div className="rounded-[2rem] bg-surface-container-low p-8 border border-outline-variant/50 shadow-sm space-y-6">
              <h3 className="font-headline text-xl font-black text-primary">系統管理員列表</h3>
              {loadingMembers ? (
                <div className="flex justify-center py-8">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-secondary border-t-transparent"></div>
                </div>
              ) : (
                <div className="overflow-x-auto rounded-2xl border border-outline-variant/40 bg-white">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-surface-container-low border-b border-outline-variant/30 text-xs font-extrabold uppercase tracking-wider text-secondary">
                        <th className="px-6 py-4">頭像</th>
                        <th className="px-6 py-4">顯示名稱</th>
                        <th className="px-6 py-4">電子郵件</th>
                        <th className="px-6 py-4">權限</th>
                        <th className="px-6 py-4 text-right">操作</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant/20 text-sm">
                      {admins.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="px-6 py-8 text-center text-on-surface-variant font-medium">
                            尚無已註冊的管理員
                          </td>
                        </tr>
                      ) : (
                        admins.map((member) => (
                          <tr key={member.id} className="hover:bg-surface-container-lowest transition-colors">
                            <td className="px-6 py-4">
                              {member.avatar_url ? (
                                <img
                                  src={member.avatar_url}
                                  alt={member.display_name || ''}
                                  className="h-9 w-9 rounded-full object-cover border border-outline-variant/40"
                                />
                              ) : (
                                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary/10 text-secondary">
                                  <Icon name="person" className="text-lg" />
                                </div>
                              )}
                            </td>
                            <td className="px-6 py-4 font-bold text-primary">
                              {member.display_name || '未設定名稱'}
                            </td>
                            <td className="px-6 py-4 text-on-surface-variant">
                              {member.email || 'Google 登錄用戶'}
                            </td>
                            <td className="px-6 py-4">
                              <span className="rounded-full px-2.5 py-0.5 text-[10px] font-bold tracking-wider uppercase border bg-red-50 border-red-200 text-red-600">
                                {member.role}
                              </span>
                            </td>
                             <td className="px-6 py-4 text-right">
                              <button
                                onClick={() => handleRemoveAdmin(member.email, member.id)}
                                disabled={member.id === user?.id || (user?.email && member.email?.toLowerCase() === user.email.toLowerCase()) || ['enochwork123@gmail.com', 'lawfelix2002@gmail.com'].includes(member.email)}
                                className={`rounded-xl px-4 py-2 text-xs font-bold tracking-wider transition cursor-pointer ${
                                  member.id === user?.id || (user?.email && member.email?.toLowerCase() === user.email.toLowerCase()) || ['enochwork123@gmail.com', 'lawfelix2002@gmail.com'].includes(member.email)
                                    ? 'bg-outline-variant/10 text-outline-variant cursor-not-allowed'
                                    : 'bg-red-50 text-red-600 hover:bg-red-100/60'
                                }`}
                              >
                                取消管理員
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Whitelisted but not yet registered admins */}
            {!loadingMembers && whitelist.filter(w => !admins.some(a => a.email && a.email.toLowerCase() === w.email.toLowerCase())).length > 0 && (
              <div className="rounded-[2rem] bg-surface-container-low p-8 border border-outline-variant/50 shadow-sm space-y-6">
                <h3 className="font-headline text-xl font-black text-primary">待註冊管理員授權名單</h3>
                <div className="overflow-x-auto rounded-2xl border border-outline-variant/40 bg-white">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-surface-container-low border-b border-outline-variant/30 text-xs font-extrabold uppercase tracking-wider text-secondary">
                        <th className="px-6 py-4">電子郵件</th>
                        <th className="px-6 py-4">授權時間</th>
                        <th className="px-6 py-4 text-right">操作</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant/20 text-sm">
                      {whitelist
                        .filter(w => !admins.some(a => a.email && a.email.toLowerCase() === w.email.toLowerCase()))
                        .map((item) => (
                          <tr key={item.email} className="hover:bg-surface-container-lowest transition-colors">
                            <td className="px-6 py-4 font-bold text-primary">
                              {item.email}
                            </td>
                            <td className="px-6 py-4 text-on-surface-variant">
                              {item.created_at ? new Date(item.created_at).toLocaleString('zh-TW') : '未知'}
                            </td>
                             <td className="px-6 py-4 text-right">
                              <button
                                onClick={() => handleRemoveAdmin(item.email)}
                                disabled={(user?.email && item.email.toLowerCase() === user.email.toLowerCase()) || ['enochwork123@gmail.com', 'lawfelix2002@gmail.com'].includes(item.email)}
                                className={`rounded-xl px-4 py-2 text-xs font-bold tracking-wider transition cursor-pointer ${
                                  (user?.email && item.email.toLowerCase() === user.email.toLowerCase()) || ['enochwork123@gmail.com', 'lawfelix2002@gmail.com'].includes(item.email)
                                    ? 'bg-outline-variant/10 text-outline-variant cursor-not-allowed'
                                    : 'bg-red-50 text-red-600 hover:bg-red-100/60'
                                }`}
                              >
                                取消授權
                              </button>
                            </td>
                          </tr>
                        ))
                      }
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'wishlist' && (
          <div className="space-y-6 max-w-4xl">
            {/* Header row with + New Issue button */}
            <div className="flex justify-between items-center pb-2">
              <div>
                <h2 className="font-headline text-2xl font-black text-primary flex items-center gap-2">
                  <Icon name="lightbulb" className="text-secondary text-2xl" />
                  功能許願池
                </h2>
                <p className="text-xs text-on-surface-variant mt-1">
                  管理員人員可以在此提交對系統的期待或新功能的想法。
                </p>
              </div>
              <button
                onClick={() => {
                  setShowWishForm(true);
                  setWishStatus(null);
                }}
                className="rounded-full bg-primary px-5 py-3 text-xs font-extrabold tracking-wider text-white shadow-md hover:brightness-105 active:scale-95 transition flex items-center gap-1.5 cursor-pointer"
              >
                <Icon name="add" className="text-sm font-black" />
                新增許願 (New Issue)
              </button>
            </div>

            {wishStatus && (
              <div className={`p-4 rounded-[1.2rem] text-xs font-bold border animate-fade-in flex items-start gap-2.5 ${
                wishStatus.type === 'success' 
                  ? 'bg-green-50 text-green-700 border-green-200' 
                  : wishStatus.type === 'warning'
                    ? 'bg-amber-50 text-amber-700 border-amber-200'
                    : 'bg-red-50 text-red-700 border-red-200'
              }`}>
                <Icon name={wishStatus.type === 'success' ? 'check_circle' : 'warning'} className="text-base shrink-0 mt-0.5" />
                <div>{wishStatus.message}</div>
              </div>
            )}

            {/* Submission Form Card (rendered conditionally) */}
            {showWishForm && (
              <div className="rounded-[1.8rem] bg-surface-container-low p-6 shadow-md border border-outline-variant/40 space-y-4 animate-slide-down">
                <div className="flex justify-between items-center border-b border-outline-variant/30 pb-3">
                  <h3 className="font-headline text-base font-black text-primary flex items-center gap-2">
                    <Icon name="edit" className="text-secondary" />
                    描述您的需求
                  </h3>
                  <button
                    type="button"
                    onClick={() => setShowWishForm(false)}
                    className="text-on-surface-variant hover:text-primary transition p-1"
                  >
                    <Icon name="close" className="text-lg" />
                  </button>
                </div>

                <form onSubmit={handleSubmitWish} className="space-y-4 pt-1">
                  <div>
                    <label className="block text-xs font-bold text-secondary uppercase tracking-wider">需求標題 (Title)</label>
                    <input
                      type="text"
                      required
                      placeholder="請輸入一個簡短的標題 (例如: 增加新課程進度重置功能)"
                      value={wishTitle}
                      onChange={(e) => setWishTitle(e.target.value)}
                      className="mt-1.5 w-full rounded-[0.8rem] border border-outline-variant bg-white p-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-secondary uppercase tracking-wider">需求詳細描述 (Description)</label>
                    <textarea
                      required
                      rows={5}
                      placeholder="請詳細說明此功能需求的背景、功能規格，或您想解決的問題..."
                      value={wishDesc}
                      onChange={(e) => setWishDesc(e.target.value)}
                      className="mt-1.5 w-full rounded-[0.8rem] border border-outline-variant bg-white p-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 font-sans leading-relaxed"
                    />
                  </div>

                  <div className="flex justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowWishForm(false)}
                      className="rounded-full border border-outline-variant px-5 py-2.5 text-xs font-bold text-on-surface-variant hover:bg-outline-variant/10 active:scale-95 transition cursor-pointer"
                    >
                      取消
                    </button>
                    <button
                      type="submit"
                      disabled={submittingWish}
                      className="rounded-full bg-primary px-6 py-2.5 text-xs font-extrabold tracking-widest text-white shadow-md hover:brightness-105 active:scale-98 transition disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
                    >
                      {submittingWish ? (
                        <>
                          <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          正在同步...
                        </>
                      ) : (
                        <>
                          <Icon name="send" className="text-xs" />
                          提交需求
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Wishes list container */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold tracking-wider uppercase text-secondary flex items-center gap-1.5">
                <Icon name="list" className="text-sm" />
                提案列表 ({wishes.length})
              </h3>

              {wishes.length === 0 ? (
                <div className="rounded-[1.8rem] bg-surface-container-low/55 p-12 text-center border border-dashed border-outline-variant/60">
                  <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-secondary/10 text-secondary mb-4">
                    <Icon name="lightbulb_outline" className="text-3xl" />
                  </div>
                  <h4 className="font-headline font-bold text-primary text-base">尚無功能需求</h4>
                  <p className="text-xs text-on-surface-variant mt-2 max-w-sm mx-auto leading-relaxed">
                    目前沒有任何已提交的功能提案。點擊右上角的「新增許願」來開始發起第一個提案吧！
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {wishes.map((wish) => (
                    <div
                      key={wish.id}
                      className={`rounded-[1.8rem] p-6 border transition-all duration-300 bg-surface-container-low shadow-sm flex items-start gap-4 ${
                        wish.completed
                          ? 'border-outline-variant/30 opacity-70 bg-surface-container-lowest/50'
                          : 'border-outline-variant/50 hover:shadow-md hover:border-primary/20'
                      }`}
                    >
                      {/* Checkbox button */}
                      <button
                        onClick={() => handleToggleWish(wish.id)}
                        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition cursor-pointer mt-0.5 ${
                          wish.completed
                            ? 'bg-green-600 border-green-600 text-white'
                            : 'border-outline-variant hover:border-primary text-transparent hover:text-primary/40'
                        }`}
                        title={wish.completed ? '標記為未完成' : '標記為已完成'}
                      >
                        <Icon name="check" className="text-sm font-black" />
                      </button>

                      {/* Content */}
                      <div className="flex-1 space-y-2 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                          <h4
                            className={`font-headline text-base font-black tracking-tight text-primary transition-all duration-300 break-words ${
                              wish.completed ? 'line-through text-on-surface-variant/75 font-normal' : ''
                            }`}
                          >
                            {wish.title}
                          </h4>
                          
                          {/* Status Badge */}
                          <span
                            className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold tracking-wider uppercase border shrink-0 ${
                              wish.completed
                                ? 'bg-green-50 border-green-200 text-green-700'
                                : 'bg-amber-50 border-amber-200 text-amber-700'
                            }`}
                          >
                            {wish.completed ? '已完成' : '處理中'}
                          </span>
                        </div>

                        <p
                          className={`text-xs text-on-surface-variant leading-relaxed whitespace-pre-wrap break-words transition-all duration-300 ${
                            wish.completed ? 'line-through text-on-surface-variant/45' : ''
                          }`}
                        >
                          {wish.description}
                        </p>

                        <div className="flex items-center gap-3 pt-2 text-[10px] font-bold text-outline uppercase tracking-wider">
                          <span className="flex items-center gap-1">
                            <Icon name="schedule" className="text-xs" />
                            {new Date(wish.createdAt).toLocaleString('zh-TW', {
                              year: 'numeric',
                              month: '2-digit',
                              day: '2-digit',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Icon name="person" className="text-xs" />
                            管理員
                          </span>
                        </div>
                      </div>

                      {/* Delete Action */}
                      <button
                        onClick={() => handleRemoveWish(wish.id)}
                        className="text-on-surface-variant/40 hover:text-red-600 transition p-1.5 rounded-lg hover:bg-red-50 shrink-0 self-start cursor-pointer"
                        title="刪除提案"
                      >
                        <Icon name="delete" className="text-lg" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        </div> {/* Left panel: Form Editor */}

        {/* Right panel: Real-time Live Preview */}
          {isPreviewActive && (
            <div className="w-[50%] h-full bg-surface-container-low/65 border-l border-outline-variant/40 flex flex-col overflow-hidden">
              {/* Toolbar */}
              <div className="bg-surface-container/70 px-6 py-3 border-b border-outline-variant/30 flex justify-between items-center shrink-0">
                <span className="text-xs font-extrabold text-secondary uppercase tracking-widest flex items-center gap-1.5">
                  <Icon name="visibility" className="text-sm" />
                  實時畫面預覽
                </span>
                
                <div className="flex bg-surface-container-high/80 rounded-full p-0.5 border border-outline-variant/20">
                  <button
                    onClick={() => setPreviewViewport('mobile')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-extrabold transition-all cursor-pointer ${
                      previewViewport === 'mobile' ? 'bg-primary text-white shadow-sm' : 'text-on-surface-variant hover:text-primary'
                    }`}
                  >
                    <Icon name="smartphone" className="text-xs" />
                    手機
                  </button>
                  <button
                    onClick={() => setPreviewViewport('desktop')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-extrabold transition-all cursor-pointer ${
                      previewViewport === 'desktop' ? 'bg-primary text-white shadow-sm' : 'text-on-surface-variant hover:text-primary'
                    }`}
                  >
                    <Icon name="desktop_windows" className="text-xs" />
                    桌面
                  </button>
                </div>
              </div>

              {/* Viewport Frame Container */}
              <div className="flex-1 overflow-y-auto p-6 flex justify-center items-start">
                <div className={
                  previewViewport === 'mobile' ? 'w-[375px] h-[720px] rounded-[2.5rem] border-[10px] border-slate-900 shadow-[0_24px_50px_rgba(0,0,0,0.15)] bg-surface overflow-hidden relative flex flex-col shrink-0' :
                  'w-full min-h-full bg-surface relative shadow-sm border border-outline-variant/20'
                }>
                  {previewViewport !== 'desktop' ? (
                    <div className="w-full h-full overflow-hidden flex flex-col">
                      {/* Mock Status Bar */}
                      <div className="h-6 bg-slate-950 text-white flex items-center justify-between px-6 text-[10px] select-none shrink-0 font-mono">
                        <span>12:00</span>
                        <div className="flex items-center gap-1.5">
                          <Icon name="wifi" className="text-[11px]" />
                          <Icon name="battery_full" className="text-[11px]" />
                        </div>
                      </div>
                      
                      {/* Inner Viewport Content */}
                      <div className="flex-1 overflow-y-auto scrollbar-none">
                        {activeTab === 'general' && <HomePreview />}
                        {activeTab === 'home-cards' && <HomePreview />}
                        {activeTab === 'journey-steps' && <JourneyPreview />}
                        {activeTab === 'quiet-time-study' && <QuietTimeLibraryPreview />}
                        {activeTab === 'lessons' && <LessonPreview lessonId={selectedLessonId} />}
                        {activeTab === 'media' && <HomePreview />}
                      </div>
                    </div>
                  ) : (
                    /* Desktop full-width content */
                    <div className="w-full h-full overflow-y-auto">
                      {activeTab === 'general' && <HomePreview />}
                      {activeTab === 'home-cards' && <HomePreview />}
                      {activeTab === 'journey-steps' && <JourneyPreview />}
                      {activeTab === 'quiet-time-study' && <QuietTimeLibraryPreview />}
                      {activeTab === 'lessons' && <LessonPreview lessonId={selectedLessonId} />}
                      {activeTab === 'media' && <HomePreview />}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
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
