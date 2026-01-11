import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  MessageSquare, 
  ThumbsUp, 
  Egg, 
  X, 
  Send, 
  MessageCircle, 
  Clock, 
  User, 
  Puzzle, 
  Activity,
  Share2,
  Check,
  ArrowUpRight,
  Database,
  Code,
  Copy,
  Globe
} from 'lucide-react';

// --- 核心数据配置区 (GitHub CMS) ---
// 如果您想更新公开网站的内容，请修改这个数组，然后推送到 GitHub。
// 使用页面左下角的 "< >" 按钮可以快速生成这里的 JSON 代码。
const STATIC_TOPICS = [
  {
    "id": "official-001",
    "title": "欢迎来到我的数字花园",
    "description": "这是一个静态部署在 GitHub 上的版本。\n\n大家看到的这个议题是写死在代码里的 (Hardcoded)。\n这种方式非常适合作为个人博客、公告板或者简单的思想展示。\n\n不需要数据库，不需要运维，只要会写代码，你就是上帝。",
    "authorId": "admin",
    "likes": 1024,
    "eggs": 0,
    "comments": [
      {
        "id": "c1",
        "text": "这个想法太酷了，数据和代码同源！",
        "authorName": "System",
        "authorId": "sys",
        "createdAt": 1715420000000
      }
    ],
    "createdAt": 1715410000000,
    "isStatic": true // 标记为静态数据
  }
];

// --- 组件部分 ---

const Button = ({ children, onClick, variant = 'primary', className = '', disabled = false }) => {
  const baseStyle = "px-5 py-2.5 rounded-xl font-medium transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 relative overflow-hidden min-h-[44px]";
  const variants = {
    primary: "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 border border-transparent",
    secondary: "bg-slate-100 text-slate-700 hover:bg-white hover:text-orange-600 border border-transparent hover:border-orange-200",
    ghost: "bg-transparent text-slate-500 hover:bg-slate-100 hover:text-orange-600",
    outline: "bg-white border border-slate-200 text-slate-600 hover:border-orange-300 hover:text-orange-600 shadow-sm"
  };
  return (
    <button onClick={onClick} className={`${baseStyle} ${variants[variant]} ${className}`} disabled={disabled}>
      {children}
    </button>
  );
};

const Card = ({ children, className = '', onClick, isStatic = false }) => (
  <div onClick={onClick} className={`backdrop-blur-sm rounded-2xl border shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_-4px_rgba(249,115,22,0.15)] hover:border-orange-200/80 transition-all duration-300 cursor-pointer overflow-hidden relative group flex flex-col h-full ${className} ${isStatic ? 'bg-white/90 border-slate-200/60' : 'bg-orange-50/50 border-orange-100/60'}`}>
    <div className={`absolute top-0 left-0 w-full h-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${isStatic ? 'bg-gradient-to-r from-slate-400 to-slate-600' : 'bg-gradient-to-r from-orange-400 to-red-500'}`} />
    {children}
  </div>
);

// 微信分享引导蒙层组件
const WeChatShareGuide = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] bg-slate-900/90 backdrop-blur-sm flex flex-col items-end p-8 animate-in fade-in duration-200" onClick={onClose}>
      <div className="text-white flex flex-col items-end gap-4 mr-2">
        <ArrowUpRight size={64} className="text-orange-500 animate-bounce" />
        <div className="text-right space-y-2">
          <h3 className="text-2xl font-bold text-white">点击右上角</h3>
          <p className="text-lg text-slate-300">选择“发送给朋友”<br/>或“分享到朋友圈”</p>
        </div>
      </div>
      <div className="mt-auto w-full text-center pb-10">
         <button className="px-6 py-2 border border-white/30 rounded-full text-white/60 text-sm">知道了</button>
      </div>
    </div>
  );
};

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center sm:p-6 p-0">
      <div className="absolute inset-0 bg-slate-900/30 backdrop-blur-md transition-opacity" onClick={onClose} />
      <div className="relative bg-white/95 backdrop-blur-xl w-full max-w-lg sm:rounded-3xl rounded-t-3xl shadow-2xl flex flex-col max-h-[90vh] sm:max-h-[85vh] animate-in fade-in zoom-in-95 slide-in-from-bottom-10 duration-300 mt-auto sm:mt-0 border border-white/20 ring-1 ring-black/5">
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <h3 className="text-xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
            <span className="w-1.5 h-5 bg-orange-500 rounded-full"></span>
            {title}
          </h3>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-orange-500 transition-colors">
            <X size={24} />
          </button>
        </div>
        <div className="p-6 overflow-y-auto custom-scrollbar">
          {children}
        </div>
      </div>
    </div>
  );
};

// --- 主程序 ---

export default function YouAreNeededApp() {
  // 本地数据初始化 (只存储用户的“私人笔记”)
  const [localTopics, setLocalTopics] = useState(() => {
    try {
      const saved = localStorage.getItem('yan_local_topics_v2');
      return saved ? JSON.parse(saved) : [];
    } catch (e) { return []; }
  });
  
  // 合并数据：静态数据 + 本地数据
  const [allTopics, setAllTopics] = useState([]);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false); // 管理员弹窗
  const [selectedTopic, setSelectedTopic] = useState(null);

  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newComment, setNewComment] = useState('');
  const [commentAuthor, setCommentAuthor] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // 分享相关状态
  const [showShareGuide, setShowShareGuide] = useState(false);
  const [showCopiedToast, setShowCopiedToast] = useState(false);
  const [isWeChat, setIsWeChat] = useState(false);

  // 1. 初始化检测与数据合并
  useEffect(() => {
    const ua = navigator.userAgent.toLowerCase();
    setIsWeChat(ua.includes('micromessenger'));
  }, []);

  useEffect(() => {
    // 将静态数据标记为 isStatic，并合并本地数据
    const staticWithFlag = STATIC_TOPICS.map(t => ({...t, isStatic: true}));
    // 按照创建时间排序（最新的在前）
    const merged = [...localTopics, ...staticWithFlag].sort((a, b) => b.createdAt - a.createdAt);
    setAllTopics(merged);
  }, [localTopics]);

  // 2. 数据持久化
  useEffect(() => {
    localStorage.setItem('yan_local_topics_v2', JSON.stringify(localTopics));
    
    // 详情页数据同步
    if (selectedTopic) {
      const live = allTopics.find(t => t.id === selectedTopic.id);
      if (live) setSelectedTopic(live);
    }
  }, [localTopics, allTopics]); // 依赖 allTopics 确保静态数据更新也能刷新详情

  // Handler Functions
  
  const handleAddTopic = async (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    setSubmitting(true);
    await new Promise(r => setTimeout(r, 400));

    const newTopic = {
      id: crypto.randomUUID(),
      title: newTitle,
      description: newDesc,
      authorId: 'local-user',
      likes: 0,
      eggs: 0,
      comments: [],
      createdAt: Date.now(),
      isStatic: false // 标记为本地数据
    };

    setLocalTopics(prev => [newTopic, ...prev]);
    setNewTitle('');
    setNewDesc('');
    setIsAddModalOpen(false);
    setSubmitting(false);
  };

  const handleInteraction = (e, topicId, type) => {
    e.stopPropagation();
    // 检查是静态数据还是本地数据
    const targetIsStatic = STATIC_TOPICS.some(t => t.id === topicId);
    
    if (targetIsStatic) {
      // 如果是静态数据，我们只能在内存中临时更新它（刷新后重置）
      // 或者我们将这种互动“克隆”到本地存储中（实现起来较复杂，这里简化为只更新当前视图）
      alert("提示：这是GitHub上的静态内容，您的互动点赞仅在当前浏览器会话有效，刷新后会重置。");
      // 这里我们在 allTopics 视图层面做一个临时的更新，不存入 localStorage
      setAllTopics(prev => prev.map(t => t.id === topicId ? { ...t, [type]: (t[type] || 0) + 1 } : t));
    } else {
      // 本地数据，正常更新
      setLocalTopics(prev => prev.map(t => {
        if (t.id === topicId) {
          return { ...t, [type]: (t[type] || 0) + 1 };
        }
        return t;
      }));
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !commentAuthor.trim() || !selectedTopic) return;
    
    const commentData = {
      id: crypto.randomUUID(),
      text: newComment,
      authorName: commentAuthor.trim(),
      authorId: 'local-user',
      createdAt: Date.now()
    };
    
    if (selectedTopic.isStatic) {
        alert("提示：这是静态内容，您的评论仅保存在本地浏览器中，其他人看不到。");
        // 这里可以做一个 tricky 的处理：把静态话题的评论存储到 localStorage 的一个特殊字段里
        // 为了演示简单，我们暂时只在内存更新
        setAllTopics(prev => prev.map(t => t.id === selectedTopic.id ? { ...t, comments: [...(t.comments || []), commentData] } : t));
    } else {
        setLocalTopics(prev => prev.map(t => {
          if (t.id === selectedTopic.id) {
            return { ...t, comments: [...(t.comments || []), commentData] };
          }
          return t;
        }));
    }

    setNewComment('');
  };

  const handleShare = () => {
    if (isWeChat) {
      setShowShareGuide(true);
    } else {
      const url = window.location.href;
      navigator.clipboard.writeText(url).then(() => {
        setShowCopiedToast(true);
        setTimeout(() => setShowCopiedToast(false), 2000);
      }).catch(err => {
        alert("复制链接失败");
      });
    }
  };

  const openTopicDetail = (topic) => { setSelectedTopic(topic); setNewComment(''); };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'Just now';
    try {
        const ms = (typeof timestamp === 'object' && timestamp.seconds) ? timestamp.seconds * 1000 : timestamp;
        const date = new Date(ms);
        return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    } catch (e) { return 'Just now'; }
  };

  const handleClearLocalData = () => {
    if (confirm("确定要清空所有【本地私有】数据吗？\n（GitHub 上的静态数据不会被删除）")) {
      setLocalTopics([]);
      localStorage.removeItem('yan_local_topics_v2');
      setSelectedTopic(null);
    }
  };

  const copyStaticJson = () => {
    // 导出所有数据（包括刚刚在本地添加的），清洗掉 isStatic 标记，作为新的静态数据源
    const exportData = allTopics.map(({ isStatic, ...rest }) => rest);
    const jsonStr = JSON.stringify(exportData, null, 2);
    navigator.clipboard.writeText(jsonStr).then(() => {
      alert("JSON 已复制！\n\n请打开代码文件 `src/App.tsx`，\n找到 `const STATIC_TOPICS = [...]`，\n用粘贴的内容替换掉中括号里的内容，\n然后提交到 GitHub，网站就会更新了！");
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-orange-100 selection:text-orange-900 pb-20 relative overflow-hidden">
      <WeChatShareGuide isOpen={showShareGuide} onClose={() => setShowShareGuide(false)} />
      
      {showCopiedToast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[60] bg-slate-800/90 text-white px-4 py-2 rounded-full flex items-center gap-2 shadow-xl animate-in fade-in slide-in-from-top-4 backdrop-blur-md">
          <Check size={16} className="text-green-400" />
          <span className="text-sm font-medium">链接已复制</span>
        </div>
      )}

      {/* 背景装饰 */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0">
        <div className="absolute -top-[20%] -right-[10%] w-[50%] h-[50%] bg-orange-200/20 rounded-full blur-[100px]" />
        <div className="absolute top-[40%] -left-[10%] w-[40%] h-[40%] bg-blue-100/20 rounded-full blur-[100px]" />
      </div>

      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 supports-[backdrop-filter]:bg-white/60">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative group cursor-pointer">
              <div className="absolute inset-0 bg-orange-400 blur-md opacity-20 group-hover:opacity-40 transition-opacity rounded-xl"></div>
              <div className="relative w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-orange-500/20 group-hover:scale-105 transition-transform duration-300 overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white/20 to-transparent opacity-50"></div>
                <Puzzle size={22} fill="currentColor" className="text-white/95 relative z-10" />
              </div>
            </div>
            <div className="flex flex-col justify-center h-full pt-0.5">
              <h1 className="text-lg font-black text-slate-800 leading-none tracking-tight font-sans flex items-baseline">
                YOU<span className="text-orange-600">ARE</span>NEEDED
              </h1>
              <div className="flex items-center gap-1.5 mt-0.5">
                 <span className="h-[1px] w-3 bg-gradient-to-r from-orange-400 to-transparent"></span>
                 <p className="text-[10px] text-slate-500 font-bold tracking-[0.2em] uppercase leading-none">GitHub 静态版</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={handleShare}
              className="w-10 h-10 flex items-center justify-center text-slate-500 hover:text-orange-600 hover:bg-orange-50 rounded-full transition-colors"
              title="分享"
            >
              <Share2 size={20} />
            </button>
            <Button onClick={() => setIsAddModalOpen(true)} className="hidden sm:flex" variant="primary">
              <Plus size={18} strokeWidth={2.5} /><span>写点什么</span>
            </Button>
            <button onClick={() => setIsAddModalOpen(true)} className="sm:hidden w-9 h-9 flex items-center justify-center text-orange-600 bg-orange-50 rounded-full">
              <Plus size={24} />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8 relative z-10">
        <div className="mb-10 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-slate-200 shadow-sm text-xs font-medium text-slate-500 mb-2 animate-in fade-in zoom-in duration-500">
            <Globe size={12} className="text-orange-500" /><span>数据存续在 GitHub 代码中 · 公开可见</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-800 tracking-tight">
            你的观点 <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-600">至关重要</span>
          </h2>
          <p className="text-slate-500 max-w-xl mx-auto text-lg leading-relaxed">
            此版本将数据保存在代码仓库中。通过 Zeabur 自动部署，您的思想将永久存续在互联网上。
          </p>
        </div>

        {allTopics.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center bg-white/50 backdrop-blur-sm rounded-3xl border border-dashed border-slate-300 mx-4">
            <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mb-4"><MessageCircle size={32} className="text-orange-400" /></div>
            <h3 className="text-xl font-bold text-slate-800">暂无内容</h3>
            <p className="text-slate-500 mt-2 mb-6">代码里的 `STATIC_TOPICS` 数组是空的。</p>
            <Button onClick={() => setIsAddModalOpen(true)}>写第一条笔记</Button>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pb-24">
          {allTopics.map(topic => (
            <Card key={topic.id} onClick={() => openTopicDetail(topic)} isStatic={topic.isStatic}>
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-start justify-between mb-3">
                  {topic.isStatic ? (
                    <span className="inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold tracking-wide uppercase bg-slate-100 text-slate-600 border border-slate-200">
                      <Database size={10} className="mr-1"/> 公开 (GitHub)
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold tracking-wide uppercase bg-orange-50 text-orange-600 border border-orange-100">
                      <User size={10} className="mr-1"/> 私有 (本地)
                    </span>
                  )}
                  <span className="text-xs text-slate-400 flex items-center gap-1 font-mono"><Clock size={12} />{formatDate(topic.createdAt)}</span>
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-3 leading-snug line-clamp-2 group-hover:text-orange-600 transition-colors">{topic.title}</h3>
                <p className="text-slate-500 text-sm line-clamp-3 mb-6 flex-1 leading-relaxed">{topic.description || "暂无详细描述..."}</p>
                <div className="flex items-center justify-between pt-4 border-t border-slate-100/50">
                  <div className="flex gap-1">
                     <div className="flex items-center text-slate-400 text-xs font-medium bg-slate-50 px-2 py-1 rounded-lg"><MessageSquare size={14} className="mr-1.5" />{topic.comments?.length || 0}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 text-slate-600 text-xs font-bold"><ThumbsUp size={14} /><span>{topic.likes || 0}</span></span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
        
        {/* 底部工具栏 */}
        <div className="fixed bottom-6 left-6 z-30">
            <button 
                onClick={() => setIsAdminModalOpen(true)}
                className="w-10 h-10 bg-slate-800 text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
                title="开发者工具：生成 JSON"
            >
                <Code size={18} />
            </button>
        </div>
      </main>

      {/* 管理员弹窗 */}
      <Modal isOpen={isAdminModalOpen} onClose={() => setIsAdminModalOpen(false)} title="更新公开数据">
        <div className="space-y-4">
            <div className="bg-orange-50 p-4 rounded-xl border border-orange-100 text-sm text-orange-800">
                <p className="font-bold mb-2 flex items-center gap-2"><Globe size={16}/> 如何让大家都能看到？</p>
                <ol className="list-decimal pl-4 space-y-1.5 opacity-90">
                    <li>在本地添加好您想要的议题。</li>
                    <li>点击下方 <strong>“复制 JSON”</strong> 按钮。</li>
                    <li>打开代码文件 <code>src/App.tsx</code>。</li>
                    <li>找到顶部的 <code>const STATIC_TOPICS = [...]</code>。</li>
                    <li>用复制的内容替换掉中括号里的内容。</li>
                    <li>提交代码 (git push)，Zeabur 会自动更新网站！</li>
                </ol>
            </div>
            <div className="flex justify-between gap-3 pt-2">
                <Button variant="ghost" onClick={handleClearLocalData} className="text-red-500 hover:text-red-600 hover:bg-red-50">清空本地私有数据</Button>
                <Button onClick={copyStaticJson}><Copy size={18}/> 复制 JSON 代码</Button>
            </div>
        </div>
      </Modal>

      {/* 发起议题弹窗 */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="记录想法">
        <form onSubmit={handleAddTopic} className="space-y-6">
          <div className="bg-slate-50 p-3 rounded-lg text-xs text-slate-500 border border-slate-200">
             注意：此处添加的内容默认是<strong>【本地私有】</strong>的。如果您想让它公开，请在添加后使用左下角的开发者工具导出 JSON 并更新代码。
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">标题 <span className="text-orange-500">*</span></label>
            <input type="text" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="例如：我的 2024 阅读书单" className="w-full px-4 py-3.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all outline-none text-slate-800 placeholder:text-slate-400 text-base" maxLength={60} required />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">内容</label>
            <textarea value={newDesc} onChange={(e) => setNewDesc(e.target.value)} placeholder="写下您的想法..." className="w-full px-4 py-3.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all outline-none text-slate-800 placeholder:text-slate-400 min-h-[140px] resize-none text-base" />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={() => setIsAddModalOpen(false)}>取消</Button>
            <Button type="submit" disabled={submitting || !newTitle.trim()}>保存</Button>
          </div>
        </form>
      </Modal>

      {/* 详情页 */}
      {selectedTopic && (
        <Modal isOpen={!!selectedTopic} onClose={() => setSelectedTopic(null)} title="详情">
          <div className="space-y-8">
            <div>
              <div className="flex items-center justify-between mb-3 text-sm text-slate-500 font-mono">
                 <div className="flex items-center gap-2">
                    {selectedTopic.isStatic ? (
                        <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border border-slate-200">GitHub Static</span>
                    ) : (
                        <span className="bg-orange-100 text-orange-700 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border border-orange-200">Local Private</span>
                    )}
                    <span>{formatDate(selectedTopic.createdAt)}</span>
                 </div>
                 <button onClick={handleShare} className="text-slate-400 hover:text-orange-600 transition-colors">
                    <Share2 size={18} />
                 </button>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-5 leading-tight">{selectedTopic.title}</h2>
              <div className="bg-slate-50/80 p-6 rounded-2xl text-slate-700 leading-relaxed whitespace-pre-wrap text-base border border-slate-100/50 shadow-inner">{selectedTopic.description || "暂无描述。"}</div>
              
              <div className="flex gap-3 mt-6">
                 <Button variant="outline" className="flex-1 !rounded-xl !py-3" onClick={(e) => handleInteraction(e, selectedTopic.id, 'likes')}>
                    <ThumbsUp size={18} /><span>赞 ({selectedTopic.likes || 0})</span>
                 </Button>
                 {/* 只有在非静态模式下，或者为了演示，我们才显示扔鸡蛋，静态模式下互动是暂时的 */}
                 <Button variant="outline" className="flex-1 !rounded-xl !py-3" onClick={(e) => handleInteraction(e, selectedTopic.id, 'eggs')}>
                    <Egg size={18} /><span>踩 ({selectedTopic.eggs || 0})</span>
                 </Button>
              </div>
            </div>
            <div className="border-t border-slate-100 my-2"></div>
            <div>
              <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">评论区 <span className="bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full text-xs font-mono">{selectedTopic.comments?.length || 0}</span></h3>
              <div className="space-y-4 mb-20 sm:mb-6 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {(!selectedTopic.comments || selectedTopic.comments.length === 0) ? (
                  <div className="text-center py-8 text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">暂无评论</div>
                ) : (
                  [...selectedTopic.comments].reverse().map((comment, idx) => (
                    <div key={idx} className="bg-white border border-slate-100 p-4 rounded-xl shadow-sm">
                      <p className="text-slate-700 text-sm leading-relaxed mb-2">{comment.text}</p>
                      <div className="flex justify-between items-center text-xs text-slate-400">
                        <div className="flex items-center gap-1.5 font-medium text-slate-500"><User size={12} className="text-orange-400" /><span className="text-slate-600">{comment.authorName || "访客"}</span></div>
                        <span className="font-mono scale-90">{formatDate(comment.createdAt)}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
              
              <div className="bg-white/80 backdrop-blur-md border-t border-slate-100 pt-4 -mx-6 px-6 sm:mx-0 sm:px-0 sm:border-0 sm:bg-transparent sm:pt-0 pb-safe sm:pb-0">
                <form onSubmit={handleAddComment} className="flex flex-col gap-3">
                    <div className="flex gap-2 items-start">
                    <div className="relative w-[35%] sm:w-[25%] shrink-0">
                        <User size={16} className="absolute left-3 top-3.5 text-slate-400" /><input type="text" value={commentAuthor} onChange={(e) => setCommentAuthor(e.target.value)} placeholder="署名" maxLength={15} className="w-full pl-9 pr-3 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-orange-400 focus:bg-white focus:ring-2 focus:ring-orange-100 transition-all text-sm" required />
                    </div>
                    <div className="flex-1 relative">
                        <input type="text" value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder={selectedTopic.isStatic ? "评论仅本地可见..." : "发表看法..."} className="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-orange-400 focus:bg-white focus:ring-2 focus:ring-orange-100 transition-all text-sm" required />
                        <button type="submit" disabled={!newComment.trim() || !commentAuthor.trim()} className="absolute right-1.5 top-1.5 p-1.5 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"><Send size={16} /></button>
                    </div>
                    </div>
                </form>
              </div>
            </div>
          </div>
        </Modal>
      )}

      <div className="fixed bottom-8 right-6 sm:hidden z-30">
        <button onClick={() => setIsAddModalOpen(true)} className="w-14 h-14 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-full shadow-lg shadow-orange-500/40 flex items-center justify-center active:scale-90 transition-transform border border-white/20"><Plus size={28} /></button>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #cbd5e1; border-radius: 20px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background-color: #f97316; }
        .pb-safe { padding-bottom: env(safe-area-inset-bottom); }
      `}</style>
    </div>
  );
}
