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
  Activity 
} from 'lucide-react';

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

const Card = ({ children, className = '', onClick }) => (
  <div onClick={onClick} className={`bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/60 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_-4px_rgba(249,115,22,0.15)] hover:border-orange-200/80 transition-all duration-300 cursor-pointer overflow-hidden relative group ${className}`}>
    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-400 to-red-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    {children}
  </div>
);

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

// --- 预置数据 ---
const INITIAL_TOPICS = [
  {
    id: '1',
    title: '新《公司法》关于股东出资责任的认定',
    description: '新法对于董监高的忠实义务和勤勉义务有了更细致的规定，在实务中我们应该如何理解这一变化？对于小股东权益保护有哪些具体影响？',
    authorId: 'demo-user',
    likes: 12,
    eggs: 2,
    comments: [
      { id: 'c1', text: '这个变动确实很大，建议重点关注第五十三条。', authorName: '法务老张', createdAt: Date.now() - 86400000 }
    ],
    createdAt: Date.now() - 100000000
  },
  {
    id: '2',
    title: 'AI 时代，我们还需要学习编程吗？',
    description: '现在的 AI 工具越来越强大，像 Cursor、Windsurf 这样的工具让不懂代码的人也能写程序。那么，深入学习编程语言是否还有必要？',
    authorId: 'demo-user',
    likes: 45,
    eggs: 5,
    comments: [
      { id: 'c2', text: '我觉得逻辑思维比语法更重要。', authorName: 'CyberPunk', createdAt: Date.now() - 3600000 }
    ],
    createdAt: Date.now() - 50000000
  }
];

// --- 主程序 ---

export default function YouAreNeededApp() {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState(null);
  
  // 表单状态
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newComment, setNewComment] = useState('');
  const [commentAuthor, setCommentAuthor] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // 初始化加载数据（从本地存储读取）
  useEffect(() => {
    const loadData = () => {
      const savedTopics = localStorage.getItem('salon_topics');
      if (savedTopics) {
        setTopics(JSON.parse(savedTopics));
      } else {
        setTopics(INITIAL_TOPICS);
        localStorage.setItem('salon_topics', JSON.stringify(INITIAL_TOPICS));
      }
      setLoading(false);
    };
    // 模拟网络延迟，让加载动画显示一会
    setTimeout(loadData, 800);
  }, []);

  // 保存数据到本地的辅助函数
  const saveToLocal = (newTopics) => {
    setTopics(newTopics);
    localStorage.setItem('salon_topics', JSON.stringify(newTopics));
  };

  // 添加议题
  const handleAddTopic = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    setSubmitting(true);
    
    // 模拟网络请求
    setTimeout(() => {
      const newTopic = {
        id: crypto.randomUUID(),
        title: newTitle,
        description: newDesc,
        authorId: 'local-user',
        likes: 0,
        eggs: 0,
        comments: [],
        createdAt: Date.now()
      };
      
      const newTopics = [newTopic, ...topics];
      saveToLocal(newTopics);
      
      setNewTitle('');
      setNewDesc('');
      setIsAddModalOpen(false);
      setSubmitting(false);
    }, 500);
  };

  // 点赞/扔鸡蛋
  const handleInteraction = (e, topicId, type) => {
    e.stopPropagation();
    const newTopics = topics.map(t => {
      if (t.id === topicId) {
        return { ...t, [type]: (t[type] || 0) + 1 };
      }
      return t;
    });
    
    saveToLocal(newTopics);
    
    // 如果当前正在查看详情，也要同步更新详情数据
    if (selectedTopic && selectedTopic.id === topicId) {
      setSelectedTopic(prev => ({
        ...prev,
        [type]: (prev[type] || 0) + 1
      }));
    }
  };

  // 添加评论
  const handleAddComment = (e) => {
    e.preventDefault();
    if (!newComment.trim() || !commentAuthor.trim() || !selectedTopic) return;

    const commentData = {
      id: crypto.randomUUID(),
      text: newComment,
      authorName: commentAuthor.trim(),
      authorId: 'local-user',
      createdAt: Date.now()
    };

    const newTopics = topics.map(t => {
      if (t.id === selectedTopic.id) {
        return { 
          ...t, 
          comments: [...(t.comments || []), commentData] 
        };
      }
      return t;
    });

    saveToLocal(newTopics);
    
    // 更新当前选中的议题视图
    setSelectedTopic(prev => ({
      ...prev,
      comments: [...(prev.comments || []), commentData]
    }));
    
    setNewComment('');
  };

  const openTopicDetail = (topic) => {
    setSelectedTopic(topic);
    setNewComment('');
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'Just now';
    const date = new Date(timestamp);
    return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  // --- 渲染界面 ---

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-orange-100 selection:text-orange-900 pb-20 relative overflow-hidden">
      
      {/* Tech Background Decoration */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0">
        <div className="absolute -top-[20%] -right-[10%] w-[50%] h-[50%] bg-orange-200/20 rounded-full blur-[100px]" />
        <div className="absolute top-[40%] -left-[10%] w-[40%] h-[40%] bg-blue-100/20 rounded-full blur-[100px]" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 supports-[backdrop-filter]:bg-white/60">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative group cursor-default">
              <div className="absolute inset-0 bg-orange-400 blur-md opacity-20 group-hover:opacity-40 transition-opacity rounded-xl"></div>
              <div className="relative w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-orange-500/20 group-hover:scale-105 transition-transform duration-300">
                <Puzzle size={22} fill="currentColor" className="text-white/90" />
              </div>
            </div>
            
            <div className="flex flex-col justify-center h-full pt-0.5">
              <h1 className="text-lg font-black text-slate-800 leading-none tracking-tight font-sans flex items-baseline">
                YOU<span className="text-orange-600">ARE</span>NEEDED
              </h1>
              <div className="flex items-center gap-1.5 mt-0.5">
                 <span className="h-[1px] w-3 bg-gradient-to-r from-orange-400 to-transparent"></span>
                 <p className="text-[10px] text-slate-500 font-bold tracking-[0.2em] uppercase leading-none">你被需要 · SALON</p>
              </div>
            </div>
          </div>
          
          <Button onClick={() => setIsAddModalOpen(true)} className="hidden sm:flex" variant="primary">
            <Plus size={18} strokeWidth={2.5} />
            <span>发起议题</span>
          </Button>
          
          <button onClick={() => setIsAddModalOpen(true)} className="sm:hidden w-9 h-9 flex items-center justify-center text-orange-600 bg-orange-50 rounded-full">
            <Plus size={24} />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 py-8 relative z-10">
        <div className="mb-10 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-slate-200 shadow-sm text-xs font-medium text-slate-500 mb-2 animate-in fade-in zoom-in duration-500">
            <Activity size={12} className="text-orange-500 animate-pulse" />
            <span>实时思想同步网络</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-800 tracking-tight">
            你的观点 <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-600">至关重要</span>
          </h2>
          <p className="text-slate-500 max-w-xl mx-auto text-lg leading-relaxed">
            在这里抛出疑惑，分享洞见。每一次<span className="text-orange-600 font-medium"> 互动 </span>都是一次思维升级。
          </p>
        </div>

        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-48 bg-white/50 rounded-2xl border border-slate-100"></div>
            ))}
          </div>
        )}

        {!loading && topics.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center bg-white/50 backdrop-blur-sm rounded-3xl border border-dashed border-slate-300 mx-4">
            <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mb-4">
              <MessageCircle size={32} className="text-orange-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-800">暂无议题</h3>
            <p className="text-slate-500 mt-2 mb-6">做第一个发起讨论的人吧！</p>
            <Button onClick={() => setIsAddModalOpen(true)}>发起第一个议题</Button>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pb-24">
          {topics.map(topic => (
            <Card key={topic.id} onClick={() => openTopicDetail(topic)} className="flex flex-col h-full hover:-translate-y-1">
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-start justify-between mb-3">
                  <span className="inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold tracking-wide uppercase bg-orange-50 text-orange-600 border border-orange-100">Topic</span>
                  <span className="text-xs text-slate-400 flex items-center gap-1 font-mono">
                    <Clock size={12} />
                    {formatDate(topic.createdAt)}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-3 leading-snug line-clamp-2 group-hover:text-orange-600 transition-colors">{topic.title}</h3>
                <p className="text-slate-500 text-sm line-clamp-3 mb-6 flex-1 leading-relaxed">{topic.description || "暂无详细描述..."}</p>
                <div className="flex items-center justify-between pt-4 border-t border-slate-100/50">
                  <div className="flex gap-1">
                     <div className="flex items-center text-slate-400 text-xs font-medium bg-slate-50 px-2 py-1 rounded-lg">
                       <MessageSquare size={14} className="mr-1.5" />
                       {topic.comments?.length || 0}
                     </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={(e) => handleInteraction(e, topic.id, 'likes')} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-orange-50 text-slate-600 hover:text-orange-600 transition-colors text-xs font-bold group/btn active:scale-95">
                      <ThumbsUp size={14} className="group-active/btn:scale-125 transition-transform" />
                      <span>{topic.likes || 0}</span>
                    </button>
                    <button onClick={(e) => handleInteraction(e, topic.id, 'eggs')} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors text-xs font-bold group/btn active:scale-95" title="扔个鸡蛋表达异议">
                      <Egg size={14} className="group-active/btn:rotate-12 transition-transform" />
                      <span>{topic.eggs || 0}</span>
                    </button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </main>

      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="发起新议题">
        <form onSubmit={handleAddTopic} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">议题标题 <span className="text-orange-500">*</span></label>
            <input type="text" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="例如：AI 时代对教育的挑战" className="w-full px-4 py-3.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all outline-none text-slate-800 placeholder:text-slate-400 text-base" maxLength={60} required />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">详细描述 / 背景</label>
            <textarea value={newDesc} onChange={(e) => setNewDesc(e.target.value)} placeholder="请补充背景信息..." className="w-full px-4 py-3.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all outline-none text-slate-800 placeholder:text-slate-400 min-h-[140px] resize-none text-base" />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={() => setIsAddModalOpen(false)}>取消</Button>
            <Button type="submit" disabled={submitting || !newTitle.trim()}>{submitting ? '发布中...' : '立即发布'}</Button>
          </div>
        </form>
      </Modal>

      {selectedTopic && (
        <Modal isOpen={!!selectedTopic} onClose={() => setSelectedTopic(null)} title="议题详情">
          <div className="space-y-8">
            <div>
              <div className="flex items-center gap-2 mb-3 text-sm text-slate-500 font-mono">
                 <span className="bg-orange-100 text-orange-700 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">Topic</span>
                 <span>{formatDate(selectedTopic.createdAt)}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-5 leading-tight">{selectedTopic.title}</h2>
              <div className="bg-slate-50/80 p-6 rounded-2xl text-slate-700 leading-relaxed whitespace-pre-wrap text-base border border-slate-100/50 shadow-inner">
                {selectedTopic.description || "暂无描述。"}
              </div>
              <div className="flex gap-3 mt-6">
                <Button variant="outline" className="flex-1 !rounded-xl !py-3 !border-slate-200 hover:!border-orange-300 hover:!text-orange-600 hover:shadow-md hover:shadow-orange-500/10 transition-all" onClick={(e) => handleInteraction(e, selectedTopic.id, 'likes')}>
                  <ThumbsUp size={18} /><span>赞同 ({selectedTopic.likes})</span>
                </Button>
                <Button variant="outline" className="flex-1 !rounded-xl !py-3 !border-slate-200 hover:!border-slate-300 hover:!text-slate-600 hover:!bg-slate-50 transition-all" onClick={(e) => handleInteraction(e, selectedTopic.id, 'eggs')}>
                  <Egg size={18} /><span>扔鸡蛋 ({selectedTopic.eggs})</span>
                </Button>
              </div>
            </div>
            <div className="border-t border-slate-100 my-2"></div>
            <div>
              <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                讨论区 <span className="bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full text-xs font-mono">{selectedTopic.comments?.length || 0}</span>
              </h3>
              <div className="space-y-4 mb-20 sm:mb-6 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {(!selectedTopic.comments || selectedTopic.comments.length === 0) ? (
                  <div className="text-center py-8 text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">暂无评论，来发表第一个观点吧！</div>
                ) : (
                  [...selectedTopic.comments].reverse().map((comment, idx) => (
                    <div key={idx} className="bg-white border border-slate-100 p-4 rounded-xl shadow-sm">
                      <p className="text-slate-700 text-sm leading-relaxed mb-2">{comment.text}</p>
                      <div className="flex justify-between items-center text-xs text-slate-400">
                        <div className="flex items-center gap-1.5 font-medium text-slate-500">
                          <User size={12} className="text-orange-400" /><span className="text-slate-600">{comment.authorName || "匿名成员"}</span>
                        </div>
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
                        <User size={16} className="absolute left-3 top-3.5 text-slate-400" />
                        <input type="text" value={commentAuthor} onChange={(e) => setCommentAuthor(e.target.value)} placeholder="署名" maxLength={15} className="w-full pl-9 pr-3 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-orange-400 focus:bg-white focus:ring-2 focus:ring-orange-100 transition-all text-sm" required />
                    </div>
                    <div className="flex-1 relative">
                        <input type="text" value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder="发表看法..." className="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-orange-400 focus:bg-white focus:ring-2 focus:ring-orange-100 transition-all text-sm" required />
                        <button type="submit" disabled={!newComment.trim() || !commentAuthor.trim()} className="absolute right-1.5 top-1.5 p-1.5 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all">
                        <Send size={16} />
                        </button>
                    </div>
                    </div>
                </form>
              </div>
            </div>
          </div>
        </Modal>
      )}

      <div className="fixed bottom-8 right-6 sm:hidden z-30">
        <button onClick={() => setIsAddModalOpen(true)} className="w-14 h-14 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-full shadow-lg shadow-orange-500/40 flex items-center justify-center active:scale-90 transition-transform border border-white/20">
          <Plus size={28} />
        </button>
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
