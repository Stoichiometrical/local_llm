
import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import {
  Loader2,
  Send,
  RefreshCw,
  Settings,
  ChevronDown,
  Sparkles,
  Trash2,
  Plus,
  Copy,
  Check,
  MessageSquare,
  SidebarOpen,
  SidebarClose,
  Menu,
  X,
  ThumbsUp,
  ThumbsDown,
  Share,
  Moon,
  Sun,
  Bot,
  User
} from 'lucide-react';

// CodeBlock component for fenced code blocks
const CodeBlock = ({ language, value }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative rounded-lg overflow-hidden my-3 shadow-lg border border-gray-700 bg-gray-900 group">
      <div className="flex items-center justify-between px-4 py-2 bg-gray-800 text-xs text-gray-300 font-mono">
        <span className="uppercase tracking-wider font-medium">{language || 'text'}</span>
        <button
          onClick={copyToClipboard}
          className="hover:text-white transition-colors flex items-center gap-1 py-1 px-2 rounded hover:bg-gray-700"
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
          <span>{copied ? 'Copied!' : 'Copy'}</span>
        </button>
      </div>
      <pre className="p-4 overflow-x-auto text-sm text-gray-200 font-mono">
        <code>{value}</code>
      </pre>
    </div>
  );
};

const SuggestionIcon = ({ size = 24, color = 'currentColor' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    fill="none"
    viewBox="0 0 24 24"
    stroke={color}
    strokeWidth={1.5}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9 18h6" />
    <path d="M10 22h4" />
    <path d="M12 2a7 7 0 0 0-4 12.7V17a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-2.3A7 7 0 0 0 12 2z" />
  </svg>
);

// RenderedCodeBlock chooses inline vs block
const RenderedCodeBlock = ({ inline, className = '', children, ...props }) => {
  const match = /language-(\w+)/.exec(className);
  if (inline || !match) {
    return (
      <code className="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-sm font-mono" {...props}>
        {children}
      </code>
    );
  }
  const value = String(children).replace(/\n$/, '');
  return <CodeBlock language={match[1]} value={value} />;
};

// MarkdownRenderer with GFM and raw HTML support
function MarkdownRenderer({ text }) {
  return (
    <ReactMarkdown
      children={text}
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeRaw]}
      skipHtml={false}
      components={{
        code: RenderedCodeBlock,
        p: ({ children }) => <p className="mb-4 leading-relaxed">{children}</p>,
        h1: ({ children }) => <h1 className="text-2xl font-bold mt-6 mb-4">{children}</h1>,
        h2: ({ children }) => <h2 className="text-xl font-bold mt-5 mb-3">{children}</h2>,
        h3: ({ children }) => <h3 className="text-lg font-semibold mt-4 mb-2">{children}</h3>,
        ul: ({ children }) => <ul className="list-disc pl-6 mb-4 space-y-1">{children}</ul>,
        ol: ({ children }) => <ol className="list-decimal pl-6 mb-4 space-y-1">{children}</ol>,
        li: ({ children }) => <li className="mb-1">{children}</li>,
        blockquote: ({ children }) => (
          <blockquote className="border-l-4 border-gray-300 dark:border-gray-600 pl-4 italic my-4 text-gray-700 dark:text-gray-300">
            {children}
          </blockquote>
        ),
        a: ({ href, children }) => (
          <a href={href} className="text-blue-600 dark:text-blue-400 hover:underline break-all" target="_blank" rel="noopener noreferrer">
            {children}
          </a>
        ),
        img: ({ src, alt }) => (
          <img src={src} alt={alt} className="max-w-full my-4 rounded-lg border border-gray-200 dark:border-gray-700" />
        ),
        table: ({ children }) => (
          <div className="overflow-x-auto my-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">{children}</table>
          </div>
        ),
        thead: ({ children }) => <thead className="bg-gray-100 dark:bg-gray-800">{children}</thead>,
        tbody: ({ children }) => <tbody className="divide-y divide-gray-200 dark:divide-gray-700">{children}</tbody>,
        tr: ({ children }) => <tr>{children}</tr>,
        th: ({ children }) => <th className="px-4 py-2 text-left font-medium">{children}</th>,
        td: ({ children }) => <td className="px-4 py-2">{children}</td>
      }}
    />
  );
}

// SuggestionChip
const SuggestionChip = ({ text, onClick }) => (
  <button onClick={onClick} className="px-3 py-1.5 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-sm transition-colors">
    {text}
  </button>
);

// Message component
const Message = ({ message, onReaction }) => {
  const isAI = message.sender !== 'user';
  return (
    <div className={`group relative flex mb-6 ${isAI ? 'justify-start' : 'justify-end'}`}>
      <div className={`flex items-start max-w-3xl ${isAI ? 'mr-auto' : 'ml-auto'}`}>
        <div className={`hidden sm:flex flex-shrink-0 w-8 h-8 rounded-full mr-3 items-center justify-center ${
          isAI ? 'bg-violet-600 text-white' : 'bg-emerald-600 text-white'
        }`}> {isAI ? <Bot size={16}/> : <User size={16}/>} </div>
        <div className={`relative px-4 py-3 rounded-xl shadow ${
          isAI ? 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200' : 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white'
        }`}>
          {message.sender==='user'
            ? <div className="whitespace-pre-wrap">{message.text}</div>
            : <div className="markdown-content prose dark:prose-invert prose-sm sm:prose-base max-w-none">
                <MarkdownRenderer text={message.text} />
              </div>
          }
          <div className={`absolute bottom-0 ${isAI?'right-0':'left-0'} opacity-0 group-hover:opacity-100 transition-opacity translate-y-full mb-2 flex space-x-1`}>
            <div className="bg-white dark:bg-gray-700 shadow-lg rounded-full px-2 py-1 flex space-x-1">
              {isAI && (
                <>
                  <button onClick={()=>onReaction(message.id,'like')} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-full"><ThumbsUp size={14}/></button>
                  <button onClick={()=>onReaction(message.id,'dislike')} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-full"><ThumbsDown size={14}/></button>
                  <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-full"><Copy size={14}/></button>
                </>
              )}
              <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-full"><Share size={14}/></button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Chat Interface
export default function MasterChatInterface() {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [models, setModels] = useState([]);
  const [selectedModel, setSelectedModel] = useState('');
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [apiEndpoint, setApiEndpoint] = useState('http://localhost:5000');
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [autoScrollEnabled, setAutoScrollEnabled] = useState(true);

  const textareaRef = useRef(null);
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  // Fetch chats and return data
  const fetchChats = async () => {
    try {
      const res = await fetch(`${apiEndpoint}/chats`);
      const data = await res.json();
      setChats(data);
      if (data.length && !selectedChat) {
        setSelectedChat(data[0].id);
      }
      return data;
    } catch (err) {
      console.error('Error fetching chats:', err);
      return [];
    }
  };

  // Create a new chat
  const createChat = async () => {
    try {
      await fetch(`${apiEndpoint}/chats`, { method: 'POST' });
      const data = await fetchChats();
      if (isMobile) setSidebarOpen(false);
      return data;
    } catch (err) {
      console.error('Error creating chat:', err);
      return [];
    }
  };

  // Delete a chat
  const deleteChat = async (chatId, event) => {
    if (event) event.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this chat?')) return;
    try {
      await fetch(`${apiEndpoint}/chats/${chatId}`, { method: 'DELETE' });
      if (chatId === selectedChat) {
        setSelectedChat(null);
        setMessages([]);
      }
      await fetchChats();
    } catch (err) {
      console.error('Error deleting chat:', err);
    }
  };

  // Fetch messages for selected chat
  const fetchMessages = async (chatId) => {
    if (!chatId) return;
    try {
      const res = await fetch(`${apiEndpoint}/chats/${chatId}/messages`);
      setMessages(await res.json());
    } catch (err) {
      console.error('Error fetching messages:', err);
    }
  };

  // Handle message reactions
  const handleMessageReaction = (messageId, reactionType) => {
    console.log(`Message ${messageId} received a ${reactionType} reaction`);
  };

  // Load models once
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${apiEndpoint}/models`);
        const json = await res.json();
        setModels(json.models || []);
        if (json.models?.length) setSelectedModel(json.models[0]);
      } catch (e) {
        console.error('Error loading models:', e);
      }
    })();
  }, [apiEndpoint]);

  // On mount: fetch chats once, then create one if empty
  useEffect(() => {
    (async () => {
      const initial = await fetchChats();
      if (initial.length === 0) {
        await createChat();
      }
    })();
  }, []);

  // When selected chat changes
  useEffect(() => {
    fetchMessages(selectedChat);
    if (isMobile) setSidebarOpen(false);
  }, [selectedChat]);

  // Auto-scroll when messages update
  useEffect(() => {
    if (autoScrollEnabled && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, loading, autoScrollEnabled]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [input]);

  // Responsive sidebar
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) setSidebarOpen(false);
    };
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  // Scroll handling
  useEffect(() => {
    const handleScroll = () => {
      if (!chatContainerRef.current) return;
      const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
      setAutoScrollEnabled(scrollHeight - scrollTop - clientHeight < 50);
    };
    const container = chatContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, []);

  // Send message
  const sendMessage = async () => {
    if (!input.trim() || !selectedChat) return;
    setLoading(true);
    setMessages(prev => [...prev, { id: `temp-${Date.now()}`, sender: 'user', text: input, timestamp: new Date().toISOString() }]);
    try {
      const res = await fetch(`${apiEndpoint}/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: selectedModel, prompt: input, chat_id: selectedChat })
      });
      if (!res.ok) throw new Error(`Status ${res.status}`);
      await fetchMessages(selectedChat);
      await fetchChats();
    } catch (err) {
      console.error('Error sending message:', err);
      setMessages(prev => [
  ...prev,
  {
    id: `err-${Date.now()}`,
    sender: 'system',
    text: '⚠️ Error: Could not send message.',
    timestamp: new Date().toISOString()
  }
]);

    }
    setInput('');
    setLoading(false);
  };

  // Clear conversation
  const clearConversation = async () => {
    if (!selectedChat || !window.confirm('Clear this conversation?')) return;
    try {
      await fetch(`${apiEndpoint}/chats/${selectedChat}/messages`, { method: 'DELETE' });
      setMessages([]);
    } catch (err) {
      console.error('Error clearing:', err);
    }
  };

  // Handle Enter key
  const handleKeyDown = e => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  // Filtered chats
  const filteredChats = chats.filter(c => c.title.toLowerCase().includes(searchQuery.toLowerCase()));

  // Empty state
  const renderEmptyState = () => (
    <div className="flex flex-col items-center justify-center h-full p-6 text-center">
      <div className="w-16 h-16 mb-6 rounded-full bg-violet-100 dark:bg-violet-900 flex items-center justify-center">
        <MessageSquare size={24} className="text-violet-600 dark:text-violet-300" />
      </div>
      <h3 className="text-xl font-bold mb-2">Start a new conversation</h3>
      <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md">
        MASTER is ready to help with questions, creative tasks, coding, and more.
      </p>
      <div className="flex flex-wrap gap-3 justify-center max-w-md">
        <SuggestionChip text="Explain quantum computing" onClick={() => setInput('Explain quantum computing in simple terms')} />
        <SuggestionChip text="Write a poem" onClick={() => setInput('Write a short poem about technology and nature')} />
        <SuggestionChip text="Help with coding" onClick={() => setInput('Help me write a function to calculate Fibonacci sequence in JavaScript')} />
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors">
      {isMobile && sidebarOpen && <div className="fixed inset-0 bg-black/50 z-20" onClick={() => setSidebarOpen(false)} />}
      <aside className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} ${isMobile ? 'fixed z-30 h-full' : 'relative'} w-72 bg-white dark:bg-gray-800 shadow-lg flex flex-col transition-transform`}>
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sparkles size={20} className="text-violet-600" />
            <h1 className="text-lg font-bold">MASTER</h1>
          </div>
          {isMobile && <button onClick={() => setSidebarOpen(false)} className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"><X size={20}/></button>}
        </div>
        <div className="p-3"><button onClick={createChat} className="w-full flex items-center justify-center space-x-2 py-2 px-4 bg-violet-600 hover:bg-violet-700 text-white rounded-lg"><Plus size={16}/><span>New Chat</span></button></div>
        <div className="px-3 pb-2">
          <div className="relative">
            <input type="text" placeholder="Search conversations..." value={searchQuery} onChange={e=>setSearchQuery(e.target.value)} className="w-full py-2 pl-8 pr-4 rounded-lg bg-gray-100 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-violet-500" />
            <div className="absolute left-2.5 top-2.5 text-gray-500"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"></svg></div>
          </div>
        </div>
        <ul className="flex-1 overflow-y-auto pt-2 px-2">
          {filteredChats.length===0&&searchQuery&&<li className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">No chats found</li>}
          {filteredChats.map(chat=> (
            <li key={chat.id} onClick={()=>setSelectedChat(chat.id)} className={`flex justify-between items-center px-3 py-2.5 rounded-lg cursor-pointer mb-1 transition-colors ${chat.id===selectedChat?'bg-violet-100 dark:bg-violet-900/40 text-violet-900 dark:text-violet-100':'hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
              <div className="flex items-center space-x-3 truncate"><SuggestionIcon size={16} className={chat.id===selectedChat?'text-violet-600 dark:text-violet-400':''}/><span className="truncate">{chat.title}</span></div>
              <button onClick={e=>deleteChat(chat.id,e)} className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 opacity-0 group-hover:opacity-100"><Trash2 size={14}/></button>
            </li>
          ))}
        </ul>
        <div className="border-t border-gray-200 dark:border-gray-700 p-3">
          <button onClick={()=>setDarkMode(!darkMode)} className="flex items-center space-x-2 w-full px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"><Moon size={16}/><span>{darkMode?'Light Mode':'Dark Mode'}</span></button>
          <button onClick={()=>setShowSettings(!showSettings)} className="flex items-center space-x-2 w-full px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"><Settings size={16}/><span>Settings</span></button>
        </div>
      </aside>
      <div className="flex flex-col flex-1 max-h-screen overflow-hidden">
        <header className="flex items-center justify-between h-16 px-4 sm:px-6 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm z-10">
          <div className="flex items-center">{isMobile?<button onClick={()=>setSidebarOpen(true)}className="p-2 mr-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"><Menu size={20}/></button>:<button onClick={()=>setSidebarOpen(!sidebarOpen)}className="p-2 mr-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">{sidebarOpen?<SidebarClose size={20}/>:<SidebarOpen size={20}/>}</button>}<div className="hidden sm:flex items-center space-x-1"><span className="font-medium">Model:</span><select value={selectedModel}onChange={e=>setSelectedModel(e.target.value)}className="bg-transparent border border-gray-300 dark:border-gray-600 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500">{models.map(m=><option key={m} value={m}>{m}</option>)}</select></div></div><div className="flex items-center space-x-2"><button onClick={clearConversation}disabled={!selectedChat||messages.length===0}className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"><RefreshCw size={18}/></button></div>
        </header>
        {showSettings&&<div className="p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700"><div className="flex justify-between items-center mb-4"><h2 className="font-semibold text-lg">Settings</h2><button onClick={()=>setShowSettings(false)}className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"><X size={18}/></button></div><div className="space-y-4"><div><label className="block mb-1 font-medium">API Endpoint:</label><input type="text"value={apiEndpoint}onChange={e=>setApiEndpoint(e.target.value)}className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-violet-500"/></div><div className="sm:hidden"><label className="block mb-1 font-medium">Model:</label><select value={selectedModel}onChange={e=>setSelectedModel(e.target.value)}className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-violet-500">{models.map(m=><option key={m} value={m}>{m}</option>)}</select></div></div></div>}
        <div ref={chatContainerRef} className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 bg-gray-50 dark:bg-gray-900">
          {messages.length===0?renderEmptyState():<div className="max-w-3xl mx-auto">{messages.map(msg=><Message key={msg.id}message={msg}onReaction={handleMessageReaction}/>)}<div ref={messagesEndRef}/>{!autoScrollEnabled&&messages.length>0&&<button onClick={()=>{messagesEndRef.current?.scrollIntoView({behavior:'smooth'});setAutoScrollEnabled(true);}}className="fixed bottom-24 right-6 bg-violet-600 text-white p-2 rounded-full shadow-lg hover:bg-violet-700"><ChevronDown size={20}/></button>}</div>}
        </div>
        <div className="px-4 sm:px-6 py-3 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-lg">
          <div className="max-w-3xl mx-auto"><div className="flex items-end space-x-2"><div className="flex-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1"><textarea ref={textareaRef}rows={1}value={input}onChange={e=>setInput(e.target.value)}onKeyDown={handleKeyDown}placeholder="Type your message..."className="w-full bg-transparent border-none focus:outline-none resize-none max-h-48 py-2 px-3 text-gray-900 dark:text-gray-100"disabled={loading}/></div><button onClick={sendMessage}disabled={!input.trim()||loading}className={`p-2 rounded-full ${loading||!input.trim()?'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400':'bg-violet-600 hover:bg-violet-700 text-white'}transition-colors`}>{loading?<Loader2 size={20}className="animate-spin"/>:<Send size={20}/>}</button></div><div className="mt-2 text-xs text-gray-500 dark:text-gray-400 text-center">MASTER may produce inaccurate information. Please verify important details.</div></div>
        </div>
      </div>
    </div>
  );
}



// import React, { useState, useEffect, useRef, useCallback } from 'react';
// import {
//   Loader2, Send, RefreshCw, Settings, ChevronDown,
//   Sparkles, Trash2, Plus, Copy, Check, MessageSquare,
//   SidebarOpen, SidebarClose, Menu, X, ThumbsUp, ThumbsDown,
//   Share, Save, Bookmark, AlertTriangle, Bot, User, Download,
//   Moon, Sun
// } from 'lucide-react';
//
// // CodeBlock component for syntax highlighting
// const CodeBlock = ({ language, value }) => {
//   const [copied, setCopied] = useState(false);
//
//   const copyToClipboard = () => {
//     navigator.clipboard.writeText(value);
//     setCopied(true);
//     setTimeout(() => setCopied(false), 2000);
//   };
//
//   return (
//     <div className="relative rounded-lg overflow-hidden my-3 shadow-lg border border-gray-700 bg-gray-900 group">
//       <div className="flex items-center justify-between px-4 py-2 bg-gray-800 text-xs text-gray-300 font-mono">
//         <span className="uppercase tracking-wider font-medium">{language || 'text'}</span>
//         <button
//           onClick={copyToClipboard}
//           className="hover:text-white transition-colors flex items-center gap-1 py-1 px-2 rounded hover:bg-gray-700"
//         >
//           {copied ? <Check size={14} /> : <Copy size={14} />}
//           <span>{copied ? 'Copied!' : 'Copy'}</span>
//         </button>
//       </div>
//       <pre className="p-4 overflow-x-auto text-sm text-gray-200 font-mono">
//         <code>{value}</code>
//       </pre>
//     </div>
//   );
// };
//
// // Wrapper to decide between inline <code> and CodeBlock
// const RenderedCodeBlock = ({ inline, className = '', children, ...props }) => {
//   const match = /language-(\w+)/.exec(className);
//   if (inline || !match) {
//     return (
//       <code className="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-sm font-mono" {...props}>
//         {children}
//       </code>
//     );
//   }
//   const value = String(children).replace(/\n$/, '');
//   return <CodeBlock language={match[1]} value={value} />;
// };
//
// // Message component
// const Message = ({ message, onReaction }) => {
//   const isAI = message.sender !== 'user';
//
//   const MarkdownComponents = {
//     code: RenderedCodeBlock,
//     p: ({ children }) => <p className="mb-4 leading-relaxed">{children}</p>,
//     h1: ({ children }) => <h1 className="text-2xl font-bold mt-6 mb-4">{children}</h1>,
//     h2: ({ children }) => <h2 className="text-xl font-bold mt-5 mb-3">{children}</h2>,
//     h3: ({ children }) => <h3 className="text-lg font-semibold mt-4 mb-2">{children}</h3>,
//     ul: ({ children }) => <ul className="list-disc pl-6 mb-4 space-y-1">{children}</ul>,
//     ol: ({ children }) => <ol className="list-decimal pl-6 mb-4 space-y-1">{children}</ol>,
//     li: ({ children }) => <li className="mb-1">{children}</li>,
//     blockquote: ({ children }) => (
//       <blockquote className="border-l-4 border-gray-300 dark:border-gray-600 pl-4 italic my-4 text-gray-700 dark:text-gray-300">{children}</blockquote>
//     ),
//     a: ({ href, children }) => (
//       <a href={href} className="text-blue-600 dark:text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer">
//         {children}
//       </a>
//     ),
//     table: ({ children }) => (
//       <div className="overflow-x-auto my-4">
//         <table className="min-w-full border border-gray-300 dark:border-gray-700">
//           {children}
//         </table>
//       </div>
//     ),
//     thead: ({ children }) => <thead className="bg-gray-100 dark:bg-gray-800">{children}</thead>,
//     tbody: ({ children }) => <tbody>{children}</tbody>,
//     tr: ({ children }) => <tr>{children}</tr>,
//     th: ({ children }) => <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-left">{children}</th>,
//     td: ({ children }) => <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">{children}</td>,
//   };
//
//   return (
//     <div className={`group relative flex mb-6 ${isAI ? 'justify-start' : 'justify-end'}`}>
//       <div className={`flex items-start max-w-3xl ${isAI ? 'mr-auto' : 'ml-auto'}`}>
//         <div className={`hidden sm:flex flex-shrink-0 w-8 h-8 rounded-full mr-3 items-center justify-center ${
//           isAI ? 'bg-violet-600 text-white' : 'bg-emerald-600 text-white'
//         }`}>
//           {isAI ? <Bot size={16} /> : <User size={16} />}
//         </div>
//
//         <div className={`relative px-4 py-3 rounded-xl shadow ${
//           isAI
//             ? 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200'
//             : 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white'
//         }`}>
//           {message.sender === 'user' ? (
//             <div className="whitespace-pre-wrap">{message.text}</div>
//           ) : (
//             <div className="markdown-content prose dark:prose-invert prose-sm sm:prose-base max-w-none">
//               <ReactMarkdown components={MarkdownComponents}>
//                 {message.text}
//               </ReactMarkdown>
//             </div>
//           )}
//
//           {/* Message actions toolbar - appears on hover */}
//           <div className={`absolute bottom-0 ${isAI ? 'right-0' : 'left-0'} opacity-0 group-hover:opacity-100 transition-opacity translate-y-full mb-2 flex space-x-1`}>
//             <div className="bg-white dark:bg-gray-700 shadow-lg rounded-full px-2 py-1 flex space-x-1">
//               {isAI && (
//                 <>
//                   <button onClick={() => onReaction(message.id, 'like')} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-full">
//                     <ThumbsUp size={14} />
//                   </button>
//                   <button onClick={() => onReaction(message.id, 'dislike')} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-full">
//                     <ThumbsDown size={14} />
//                   </button>
//                   <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-full">
//                     <Copy size={14} />
//                   </button>
//                 </>
//               )}
//               <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-full">
//                 <Share size={14} />
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };
//
// // Custom hook for local storage
// const useLocalStorage = (key, initialValue) => {
//   const [storedValue, setStoredValue] = useState(() => {
//     try {
//       const item = window.localStorage.getItem(key);
//       return item ? JSON.parse(item) : initialValue;
//     } catch (error) {
//       console.error(error);
//       return initialValue;
//     }
//   });
//
//   const setValue = (value) => {
//     try {
//       const valueToStore = value instanceof Function ? value(storedValue) : value;
//       setStoredValue(valueToStore);
//       window.localStorage.setItem(key, JSON.stringify(valueToStore));
//     } catch (error) {
//       console.error(error);
//     }
//   };
//
//   return [storedValue, setValue];
// };
//
// // Main component
// export default function MasterChatInterface3() {
//   // State
//   const [chats, setChats] = useState([]);
//   const [selectedChat, setSelectedChat] = useState(null);
//   const [messages, setMessages] = useState([]);
//   const [models, setModels] = useState([]);
//   const [selectedModel, setSelectedModel] = useState('');
//   const [input, setInput] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [showSettings, setShowSettings] = useState(false);
//   const [apiEndpoint, setApiEndpoint] = useState('http://localhost:5000');
//   const [darkMode, setDarkMode] = useLocalStorage('masterai-dark-mode', false);
//   const [sidebarOpen, setSidebarOpen] = useState(true);
//   const [isMobile, setIsMobile] = useState(false);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [autoScrollEnabled, setAutoScrollEnabled] = useState(true);
//
//   // Refs
//   const textareaRef = useRef(null);
//   const messagesEndRef = useRef(null);
//   const chatContainerRef = useRef(null);
//
//   // Check if mobile
//   useEffect(() => {
//     const checkIfMobile = () => {
//       setIsMobile(window.innerWidth < 768);
//       if (window.innerWidth < 768) {
//         setSidebarOpen(false);
//       }
//     };
//
//     checkIfMobile();
//     window.addEventListener('resize', checkIfMobile);
//
//     return () => {
//       window.removeEventListener('resize', checkIfMobile);
//     };
//   }, []);
//
//   // Set dark mode class on body
//   useEffect(() => {
//     if (darkMode) {
//       document.documentElement.classList.add('dark');
//     } else {
//       document.documentElement.classList.remove('dark');
//     }
//   }, [darkMode]);
//
//   // Fetch all chats
//   const fetchChats = async () => {
//     try {
//       const res = await fetch(`${apiEndpoint}/chats`);
//       const data = await res.json();
//       setChats(data);
//       if (data.length && !selectedChat) {
//         setSelectedChat(data[0].id);
//       }
//     } catch (err) {
//       console.error('Error fetching chats:', err);
//     }
//   };
//
//   // Create a new chat
//   const createChat = async () => {
//     try {
//       await fetch(`${apiEndpoint}/chats`, { method: 'POST' });
//       await fetchChats();
//       // On mobile, close sidebar after creating a new chat
//       if (isMobile) {
//         setSidebarOpen(false);
//       }
//     } catch (err) {
//       console.error('Error creating chat:', err);
//     }
//   };
//
//   // Delete a chat
//   const deleteChat = async (chatId, event) => {
//     if (event) event.stopPropagation();
//     if (!window.confirm('Are you sure you want to delete this chat?')) return;
//
//     try {
//       await fetch(`${apiEndpoint}/chats/${chatId}`, { method: 'DELETE' });
//       if (chatId === selectedChat) {
//         setSelectedChat(null);
//         setMessages([]);
//       }
//       await fetchChats();
//     } catch (err) {
//       console.error('Error deleting chat:', err);
//     }
//   };
//
//   // Fetch messages for the selected chat
//   const fetchMessages = async (chatId) => {
//     if (!chatId) return;
//
//     try {
//       const res = await fetch(`${apiEndpoint}/chats/${chatId}/messages`);
//       setMessages(await res.json());
//     } catch (err) {
//       console.error('Error fetching messages:', err);
//     }
//   };
//
//   // Handle message reactions
//   const handleMessageReaction = (messageId, reactionType) => {
//     console.log(`Message ${messageId} received a ${reactionType} reaction`);
//     // Implement API call to save reaction if needed
//   };
//
//   // Load models once
//   useEffect(() => {
//     (async () => {
//       try {
//         const res = await fetch(`${apiEndpoint}/models`);
//         const json = await res.json();
//         setModels(json.models || []);
//         if (json.models?.length) setSelectedModel(json.models[0]);
//       } catch (e) {
//         console.error('Error loading models:', e);
//       }
//     })();
//   }, [apiEndpoint]);
//
//   // On mount: fetch chats
//   useEffect(() => {
//     fetchChats();
//   }, []);
//
//   // If no chats exist, auto-create one
//   // useEffect(() => {
//   //   if (chats.length === 0) {
//   //     createChat();
//   //   }
//   // }, [chats]);
//
//      // ————— Mount effect: fetch once, then auto-create exactly one if empty —————
//   useEffect(() => {
//     (async () => {
//       const initial = await fetchChats();
//       if (initial.length === 0) {
//         await createChat();
//       }
//     })();
//   }, []);  // <-- run only once on mount
//
//   // When selectedChat changes
//   useEffect(() => {
//     fetchMessages(selectedChat);
//     if (isMobile) {
//       setSidebarOpen(false);
//     }
//   }, [selectedChat]);
//
//   // Auto-scroll when messages update if enabled
//   useEffect(() => {
//     if (autoScrollEnabled && messagesEndRef.current) {
//       messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
//     }
//   }, [messages, loading, autoScrollEnabled]);
//
//   // Auto-resize textarea
//   useEffect(() => {
//     if (textareaRef.current) {
//       textareaRef.current.style.height = 'auto';
//       textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
//     }
//   }, [input]);
//
//   // Chat container scroll handling
//   useEffect(() => {
//     const handleScroll = () => {
//       if (!chatContainerRef.current) return;
//
//       const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
//       const isAtBottom = scrollHeight - scrollTop - clientHeight < 50;
//       setAutoScrollEnabled(isAtBottom);
//     };
//
//     const container = chatContainerRef.current;
//     if (container) {
//       container.addEventListener('scroll', handleScroll);
//       return () => container.removeEventListener('scroll', handleScroll);
//     }
//   }, []);
//
//   // Send message
//   const sendMessage = async () => {
//     if (!input.trim() || !selectedChat) {
//       return;
//     }
//
//     setLoading(true);
//     // Optimistically add the user message to UI immediately
//     const userMessage = {
//       id: `temp-${Date.now()}`,
//       sender: 'user',
//       text: input,
//       timestamp: new Date().toISOString()
//     };
//     setMessages(prev => [...prev, userMessage]);
//
//     try {
//       const res = await fetch(`${apiEndpoint}/generate`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           model: selectedModel,
//           prompt: input,
//           chat_id: selectedChat
//         })
//       });
//
//       if (!res.ok) {
//         throw new Error(`API returned status: ${res.status}`);
//       }
//
//       const data = await res.json();
//       // Refresh messages to get the formatted response from the server
//       await fetchMessages(selectedChat);
//       // Refresh chat list in case the title changed
//       await fetchChats();
//     } catch (err) {
//       console.error('Error sending message:', err);
//       // Show user-friendly error message
//       setMessages(prev => [...prev, {
//         id: `error-${Date.now()}`,
//         sender: 'system',
//         text: '⚠️ Error: Could not send message. Please check your connection or API endpoint.',
//         timestamp: new Date().toISOString()
//       }]);
//     }
//
//     setInput('');
//     setLoading(false);
//   };
//
//   // Clear conversation
//   const clearConversation = async () => {
//     if (!selectedChat) return;
//     if (!window.confirm('Are you sure you want to clear this conversation?')) return;
//
//     try {
//       await fetch(`${apiEndpoint}/chats/${selectedChat}/messages`, { method: 'DELETE' });
//       setMessages([]);
//     } catch (err) {
//       console.error('Error clearing conversation:', err);
//     }
//   };
//
//   // Handle Enter key
//   const handleKeyDown = (e) => {
//     if (e.key === 'Enter' && !e.shiftKey) {
//       e.preventDefault();
//       sendMessage();
//     }
//   };
//
//   // Filter chats based on search query
//   const filteredChats = chats.filter(chat =>
//     chat.title.toLowerCase().includes(searchQuery.toLowerCase())
//   );
//
//   // Render function for empty state
//   const renderEmptyState = () => (
//     <div className="flex flex-col items-center justify-center h-full text-center p-6">
//       <div className="w-16 h-16 mb-6 rounded-full bg-violet-100 dark:bg-violet-900 flex items-center justify-center">
//         <MessageSquare size={24} className="text-violet-600 dark:text-violet-300" />
//       </div>
//       <h3 className="text-xl font-bold mb-2">Start a new conversation</h3>
//       <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md">
//         MASTER is ready to help with questions, creative tasks, coding, and more.
//       </p>
//       <div className="flex flex-wrap gap-3 justify-center max-w-md">
//         <SuggestionChip text="Explain quantum computing" onClick={() => setInput("Explain quantum computing in simple terms")} />
//         <SuggestionChip text="Write a poem" onClick={() => setInput("Write a short poem about technology and nature")} />
//         <SuggestionChip text="Help with coding" onClick={() => setInput("Help me write a function to calculate Fibonacci sequence in JavaScript")} />
//       </div>
//     </div>
//   );
//
//   return (
//     <div className={`flex h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200`}>
//       {/* Sidebar overlay for mobile */}
//       {isMobile && sidebarOpen && (
//         <div
//           className="fixed inset-0 bg-black/50 z-20"
//           onClick={() => setSidebarOpen(false)}
//         />
//       )}
//
//       {/* Sidebar */}
//       <aside
//         className={`${
//           sidebarOpen ? 'translate-x-0' : '-translate-x-full'
//         } ${
//           isMobile ? 'fixed z-30 h-full' : 'relative'
//         } w-72 bg-white dark:bg-gray-800 shadow-lg flex flex-col transition-transform duration-300 ease-in-out`}
//       >
//         <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
//           <div className="flex items-center space-x-2">
//             <Sparkles size={20} className="text-violet-600" />
//             <h1 className="text-lg font-bold">MASTER</h1>
//           </div>
//           {isMobile && (
//             <button
//               onClick={() => setSidebarOpen(false)}
//               className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
//             >
//               <X size={20} />
//             </button>
//           )}
//         </div>
//
//         <div className="p-3">
//           <button
//             onClick={createChat}
//             className="w-full flex items-center justify-center space-x-2 py-2 px-4 bg-violet-600 hover:bg-violet-700 text-white rounded-lg transition-colors"
//           >
//             <Plus size={16} /> <span>New Chat</span>
//           </button>
//         </div>
//
//         <div className="px-3 pb-2">
//           <div className="relative">
//             <input
//               type="text"
//               placeholder="Search conversations..."
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               className="w-full py-2 pl-8 pr-4 rounded-lg bg-gray-100 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-violet-500"
//             />
//             <div className="absolute left-2.5 top-2.5 text-gray-500">
//               <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                 <circle cx="11" cy="11" r="8"></circle>
//                 <path d="m21 21-4.3-4.3"></path>
//               </svg>
//             </div>
//           </div>
//         </div>
//
//         <ul className="flex-1 overflow-y-auto pt-2 px-2">
//           {filteredChats.length === 0 && searchQuery && (
//             <li className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">
//               No chats found
//             </li>
//           )}
//
//           {filteredChats.map((chat) => (
//             <li
//               key={chat.id}
//               className={`flex justify-between items-center px-3 py-2.5 rounded-lg cursor-pointer mb-1 transition-colors group ${
//                 chat.id === selectedChat
//                   ? 'bg-violet-100 dark:bg-violet-900/40 text-violet-900 dark:text-violet-100'
//                   : 'hover:bg-gray-100 dark:hover:bg-gray-700'
//               }`}
//               onClick={() => setSelectedChat(chat.id)}
//             >
//               <div className="flex items-center space-x-3 truncate">
//                 <MessageSquare size={16} className={chat.id === selectedChat ? 'text-violet-600 dark:text-violet-400' : ''} />
//                 <span className="truncate">{chat.title}</span>
//               </div>
//               <button
//                 className={`p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 opacity-0 group-hover:opacity-100 transition-opacity ${
//                   chat.id === selectedChat ? 'opacity-100' : ''
//                 }`}
//                 onClick={(e) => deleteChat(chat.id, e)}
//               >
//                 <Trash2 size={14} className="text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400" />
//               </button>
//             </li>
//           ))}
//         </ul>
//
//         <div className="border-t border-gray-200 dark:border-gray-700 p-3">
//           <button
//             onClick={() => setDarkMode(!darkMode)}
//             className="flex items-center space-x-2 w-full px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
//           >
//             {darkMode ? <Sun size={16} /> : <Moon size={16} />}
//             <span>{darkMode ? 'Light mode' : 'Dark mode'}</span>
//           </button>
//
//           <button
//             onClick={() => setShowSettings(!showSettings)}
//             className="flex items-center space-x-2 w-full px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
//           >
//             <Settings size={16} />
//             <span>Settings</span>
//           </button>
//         </div>
//       </aside>
//
//       {/* Main area */}
//       <div className="flex flex-col flex-1 max-h-screen overflow-hidden">
//         {/* Header */}
//         <header className="flex items-center justify-between h-16 px-4 sm:px-6 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm z-10">
//           <div className="flex items-center">
//             {/* Mobile sidebar toggle */}
//             {isMobile && (
//               <button
//                 onClick={() => setSidebarOpen(true)}
//                 className="p-2 mr-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
//               >
//                 <Menu size={20} />
//               </button>
//             )}
//
//             {/* Desktop sidebar toggle */}
//             {!isMobile && (
//               <button
//                 onClick={() => setSidebarOpen(!sidebarOpen)}
//                 className="p-2 mr-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
//               >
//                 {sidebarOpen ? <SidebarClose size={20} /> : <SidebarOpen size={20} />}
//               </button>
//             )}
//
//             <div className="flex items-center space-x-3">
//               <div className="hidden sm:flex items-center space-x-1">
//                 <span className="font-medium">Model:</span>
//                 <select
//                   className="bg-transparent border border-gray-300 dark:border-gray-600 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
//                   value={selectedModel}
//                   onChange={(e) => setSelectedModel(e.target.value)}
//                 >
//                   {models.map((m) => (
//                     <option key={m} value={m}>
//                       {m}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//             </div>
//           </div>
//
//           <div className="flex items-center space-x-2">
//             <button
//               onClick={clearConversation}
//               disabled={!selectedChat || messages.length === 0}
//               className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 transition-opacity"
//               title="Clear conversation"
//             >
//               <RefreshCw size={18} />
//             </button>
//           </div>
//         </header>
//
//         {/* Settings Panel */}
//         {showSettings && (
//           <div className="p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="font-semibold text-lg">Settings</h2>
//               <button
//                 onClick={() => setShowSettings(false)}
//                 className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
//               >
//                 <X size={18} />
//               </button>
//             </div>
//
//             <div className="space-y-4">
//               <div>
//                 <label className="block mb-1 font-medium">API Endpoint:</label>
//                 <input
//                   type="text"
//                   value={apiEndpoint}
//                   onChange={(e) => setApiEndpoint(e.target.value)}
//                   className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-violet-500"
//                 />
//               </div>
//
//               {/* Mobile-only model selector */}
//               <div className="sm:hidden">
//                 <label className="block mb-1 font-medium">Model:</label>
//                 <select
//                   className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-violet-500"
//                   value={selectedModel}
//                   onChange={(e) => setSelectedModel(e.target.value)}
//                 >
//                   {models.map((m) => (
//                     <option key={m} value={m}>
//                       {m}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//             </div>
//           </div>
//         )}
//
//         {/* Messages */}
//         <div
//           ref={chatContainerRef}
//           className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 bg-gray-50 dark:bg-gray-900"
//         >
//           {messages.length === 0 ? (
//             renderEmptyState()
//           ) : (
//             <div className="max-w-3xl mx-auto">
//               {messages.map((msg) => (
//                 <Message
//                   key={msg.id}
//                   message={msg}
//                   onReaction={handleMessageReaction}
//                 />
//               ))}
//               <div ref={messagesEndRef} />
//
//               {/* Auto-scroll indicator */}
//               {!autoScrollEnabled && messages.length > 0 && (
//                 <button
//                   onClick={() => {
//                     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//                     setAutoScrollEnabled(true);
//                   }}
//                   className="fixed bottom-24 right-6 bg-violet-600 text-white p-2 rounded-full shadow-lg hover:bg-violet-700 transition-colors"
//                 >
//                   <ChevronDown size={20} />
//                 </button>
//               )}-
//             </div>
//           )}
//         </div>
//
//         {/* Input & Send */}
//         <div className="px-4 sm:px-6 py-3 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-lg">
//           <div className="max-w-3xl mx-auto">
//             <div className="flex items-end space-x-2">
//               <div className="flex-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
//                 <textarea
//                   ref={textareaRef}
//                   rows={1}
//                   value={input}
//                   onChange={(e) => setInput(e.target.value)}
//                                    onKeyDown={handleKeyDown}
//                   placeholder="Type your message..."
//                   className="w-full bg-transparent border-none focus:outline-none resize-none max-h-48 py-2 px-3 text-gray-900 dark:text-gray-100"
//                   disabled={loading}
//                 />
//               </div>
//               <button
//                 onClick={sendMessage}
//                 disabled={!input.trim() || loading}
//                 className={`p-2 rounded-full ${
//                   loading || !input.trim()
//                     ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400'
//                     : 'bg-violet-600 hover:bg-violet-700 text-white'
//                 } transition-colors`}
//               >
//                 {loading ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
//               </button>
//             </div>
//
//             <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 text-center">
//               MASTER may produce inaccurate information. Consider verifying important information.
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };
//
// // Suggestion chip component
// const SuggestionChip = ({ text, onClick }) => (
//   <button
//     onClick={onClick}
//     className="px-3 py-1.5 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-sm transition-colors"
//   >
//     {text}
//   </button>
// );
//
// // ReactMarkdown component (needs to be imported)
// const ReactMarkdown = ({ children, components }) => {
//   // This is a simplified placeholder - in a real app you'd use the actual react-markdown package
//   return <div>{children}</div>;
// };
//
//

