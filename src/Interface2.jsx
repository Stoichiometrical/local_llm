// import React, { useState, useEffect, useRef } from 'react';
// import {
//   Loader2,
//   Send,
//   RefreshCw,
//   Settings,
//   ChevronDown,
//   Sparkles,
//   Trash2,
//   Plus
// } from 'lucide-react';
// import ReactMarkdown from 'react-markdown';
//
// // Code block component with syntax highlighting
// const CodeBlock = ({ language, value }) => {
//   const [copied, setCopied] = useState(false);
//   const copyToClipboard = () => {
//     navigator.clipboard.writeText(value);
//     setCopied(true);
//     setTimeout(() => setCopied(false), 2000);
//   };
//
//   return (
//     <div className="relative rounded-lg overflow-hidden my-2 shadow-lg bg-gray-900">
//       <div className="flex items-center justify-between px-4 py-1 bg-gray-800 text-xs text-gray-400">
//         <span className="uppercase tracking-wider">{language || 'text'}</span>
//         <button onClick={copyToClipboard} className="hover:text-white transition-colors">
//           {copied ? 'Copied!' : 'Copy'}
//         </button>
//       </div>
//       <pre className="p-4 overflow-x-auto text-sm text-gray-200">
//         <code>{value}</code>
//       </pre>
//     </div>
//   );
// };
//
// // Custom Markdown components
// const MarkdownComponents = {
//   code: ({ node, inline, className, children, ...props }) => {
//     const match = /language-(\w+)/.exec(className || '');
//     if (!inline && match) {
//       return <CodeBlock language={match[1]} value={String(children).replace(/\n$/, '')} />;
//     }
//     return (
//       <code className="bg-white/50 dark:bg-gray-800 px-1 py-0.5 rounded text-sm" {...props}>
//         {children}
//       </code>
//     );
//   },
//   p: ({ children }) => <p className="mb-4">{children}</p>,
//   h1: ({ children }) => <h1 className="text-3xl font-extrabold mt-6 mb-4 text-white">{children}</h1>,
//   h2: ({ children }) => <h2 className="text-2xl font-bold mt-5 mb-3 text-white">{children}</h2>,
//   h3: ({ children }) => <h3 className="text-xl font-bold mt-4 mb-2 text-white">{children}</h3>,
//   ul: ({ children }) => <ul className="list-disc pl-6 mb-4 text-white">{children}</ul>,
//   ol: ({ children }) => <ol className="list-decimal pl-6 mb-4 text-white">{children}</ol>,
//   blockquote: ({ children }) => (
//     <blockquote className="border-l-4 border-white/50 pl-4 italic my-4 text-white">{children}</blockquote>
//   ),
//   a: ({ href, children }) => (
//     <a href={href} className="underline" target="_blank" rel="noopener noreferrer">
//       {children}
//     </a>
//   ),
// };
//
//
// // Default quick suggestions
// const defaultSuggestions = [
//   'Explain quantum computing in simple terms',
//   'Write a poem about the future of AI',
//   'Generate a creative story about a world where robots and humans coexist',
//   'Give me 5 unique ideas for a sci-fi novel'
// ];
//
// export default function MasterChatInterface2() {
//   // — UI state
//   const [chats, setChats] = useState([]);
//   const [selectedChat, setSelectedChat] = useState(null);
//   const [messages, setMessages] = useState([]);
//   const [models, setModels] = useState([]);
//   const [selectedModel, setSelectedModel] = useState('');
//   const [input, setInput] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [showSettings, setShowSettings] = useState(false);
//
//   const [apiEndpoint, setApiEndpoint] = useState('http://localhost:5000');
//   const [darkMode, setDarkMode] = useState(false);
//
//   const textareaRef = useRef(null);
//   const messagesEndRef = useRef(null);
//
//   // — Fetch chat list
//   const fetchChats = async () => {
//     const res = await fetch(`${apiEndpoint}/chats`);
//     const data = await res.json();
//     setChats(data);
//     if (!selectedChat && data.length) {
//       setSelectedChat(data[0].id);
//     }
//   };
//
//   // — Create new chat
//   const createChat = async () => {
//     const res = await fetch(`${apiEndpoint}/chats`, { method: 'POST' });
//     if (res.ok) {
//       await fetchChats();
//     }
//   };
//
//   // — Delete chat
//   const deleteChat = async (chatId) => {
//     if (!window.confirm('Delete this chat?')) return;
//     await fetch(`${apiEndpoint}/chats/${chatId}`, { method: 'DELETE' });
//     if (chatId === selectedChat) {
//       setSelectedChat(null);
//       setMessages([]);
//     }
//     await fetchChats();
//   };
//
//   // — Fetch messages for the selected chat
//   const fetchMessages = async (chatId) => {
//     if (!chatId) return;
//     const res = await fetch(`${apiEndpoint}/chats/${chatId}/messages`);
//     setMessages(await res.json());
//   };
//
//   // — Fetch models once
//   useEffect(() => {
//     (async () => {
//       try {
//         const res = await fetch(`${apiEndpoint}/models`);
//         const json = await res.json();
//         setModels(json.models || []);
//         if (json.models?.length) setSelectedModel(json.models[0]);
//       } catch (e) {
//         console.error(e);
//       }
//     })();
//   }, [apiEndpoint]);
//
//   // — On mount: load chats
//   useEffect(() => {
//     fetchChats();
//   }, []);
//
//   // — When selectedChat changes
//   useEffect(() => {
//     fetchMessages(selectedChat);
//   }, [selectedChat]);
//
//   // — Auto-scroll
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   }, [messages, loading]);
//
//   // — Auto-resize textarea
//   useEffect(() => {
//     if (textareaRef.current) {
//       textareaRef.current.style.height = 'auto';
//       textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
//     }
//   }, [input]);
//
//   // — Send a new message
//   const sendMessage = async () => {
//     if (!input.trim() || !selectedChat) return;
//     setLoading(true);
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
//       const data = await res.json();
//       if (data.response) {
//         // reload entire thread
//         await fetchMessages(selectedChat);
//       } else {
//         console.error(data);
//       }
//     } catch (err) {
//       console.error(err);
//     }
//     setInput('');
//     setLoading(false);
//   };
//
//   // — Clear messages in current chat
//   const clearConversation = async () => {
//     if (!selectedChat) return;
//     if (!window.confirm('Clear this conversation?')) return;
//     await fetch(`${apiEndpoint}/chats/${selectedChat}/messages`, {
//       method: 'DELETE'
//     });
//     setMessages([]);
//   };
//
//   // — Handle Enter key
//   const handleKeyDown = (e) => {
//     if (e.key === 'Enter' && !e.shiftKey) {
//       e.preventDefault();
//       sendMessage();
//     }
//   };
//
//   return (
//     <div className={`flex h-screen ${darkMode ? 'dark bg-gray-900 text-white' : ''}`}>
//       {/* Sidebar */}
//       <aside className="w-64 bg-gray-800 text-white p-4 flex-shrink-0">
//         <button
//           onClick={createChat}
//           className="w-full mb-4 flex items-center justify-center space-x-2 py-2 bg-green-500 rounded hover:bg-green-600"
//         >
//           <Plus size={16} /> <span>New Chat</span>
//         </button>
//         <ul className="space-y-2 overflow-y-auto">
//           {chats.map((c) => (
//             <li
//               key={c.id}
//               className={`flex justify-between items-center px-3 py-2 rounded cursor-pointer ${
//                 c.id === selectedChat ? 'bg-gray-600' : 'hover:bg-gray-700'
//               }`}
//               onClick={() => setSelectedChat(c.id)}
//             >
//               <span className="truncate">
//                 Chat #{c.id}
//               </span>
//               <Trash2
//                 size={14}
//                 className="text-red-400 hover:text-red-600"
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   deleteChat(c.id);
//                 }}
//               />
//             </li>
//           ))}
//         </ul>
//       </aside>
//
//       {/* Main area */}
//       <div className="flex flex-col flex-1">
//         {/* Header */}
//         <header className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-indigo-500 to-pink-500">
//           <div className="flex items-center space-x-3">
//             <Sparkles size={32} className="animate-pulse" />
//             <h1 className="text-2xl font-extrabold">MASTER</h1>
//             <span className="opacity-80">Your AI Companion</span>
//           </div>
//           <div className="flex items-center space-x-2">
//             <div className="hidden md:flex items-center bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 space-x-2">
//               <span>Model:</span>
//               <select
//                 className="bg-transparent focus:outline-none text-white"
//                 value={selectedModel}
//                 onChange={(e) => setSelectedModel(e.target.value)}
//               >
//                 {models.map((m) => (
//                   <option key={m} value={m} className="text-black">
//                     {m}
//                   </option>
//                 ))}
//               </select>
//             </div>
//             <button onClick={clearConversation} className="p-2 rounded-full bg-white/20 hover:bg-white/30">
//               <RefreshCw size={20} />
//             </button>
//             <button onClick={() => setShowSettings(!showSettings)} className="p-2 rounded-full bg-white/20 hover:bg-white/30">
//               <Settings size={20} />
//             </button>
//           </div>
//         </header>
//
//         {/* Settings Panel */}
//         {showSettings && (
//           <div className="p-4 bg-white/20 backdrop-blur-sm space-y-4 text-black">
//             <div className="flex justify-between items-center">
//               <h2 className="font-semibold">Settings</h2>
//               <button onClick={() => setShowSettings(false)}>
//                 <ChevronDown />
//               </button>
//             </div>
//             <div className="flex items-center space-x-4">
//               <label className="flex items-center space-x-2">
//                 <input
//                   type="checkbox"
//                   checked={darkMode}
//                   onChange={() => setDarkMode(!darkMode)}
//                 />
//                 <span>Dark Mode</span>
//               </label>
//               <div className="flex-1">
//                 <label className="block mb-1">API Endpoint:</label>
//                 <input
//                   type="text"
//                   value={apiEndpoint}
//                   onChange={(e) => setApiEndpoint(e.target.value)}
//                   className="w-full p-2 rounded bg-gray-100"
//                 />
//               </div>
//             </div>
//           </div>
//         )}
//
//         {/* Message list */}
//         <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 bg-white/20 backdrop-blur-sm">
//           {messages.length === 0 && (
//             <div className="text-center opacity-80">
//               <p className="text-xl">No messages yet</p>
//             </div>
//           )}
//           {messages.map((msg) => (
//             <div
//               key={msg.id}
//               className={`max-w-3xl ${msg.sender === 'user' ? 'ml-auto' : 'mr-auto'}`}
//             >
//               <div
//                 className={`p-4 rounded-2xl shadow-lg transform transition hover:scale-[1.02] ${
//                   msg.sender === 'user'
//                     ? 'bg-gradient-to-tr from-green-400 to-blue-500 text-white'
//                     : 'bg-gradient-to-tr from-pink-500 to-purple-600 text-white'
//                 }`}
//               >
//                 {msg.sender === 'user' ? (
//                   <div className="whitespace-pre-wrap">{msg.text}</div>
//                 ) : (
//                   <ReactMarkdown components={MarkdownComponents}>
//                     {msg.text}
//                   </ReactMarkdown>
//                 )}
//               </div>
//             </div>
//           ))}
//           {loading && (
//             <div className="flex items-center space-x-2 animate-pulse">
//               <Loader2 size={18} className="animate-spin" />
//               <span>Thinking...</span>
//             </div>
//           )}
//           <div ref={messagesEndRef} />
//         </div>
//
//         {/* Input */}
//         <div className="p-4 bg-white/30 backdrop-blur-sm flex items-end space-x-2">
//           <textarea
//             ref={textareaRef}
//             rows={1}
//             value={input}
//             onChange={(e) => setInput(e.target.value)}
//             onKeyDown={handleKeyDown}
//             placeholder="Type a message..."
//             className="flex-1 p-4 rounded-xl resize-none"
//             style={{ maxHeight: '200px' }}
//           />
//           <button
//             onClick={sendMessage}
//             disabled={loading || !input.trim()}
//             className="p-3 bg-green-400 rounded-full shadow-lg disabled:opacity-50 hover:scale-105 transition"
//           >
//             <Send size={24} className="text-white" />
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }


import React, { useState, useEffect, useRef } from 'react';
import {
  Loader2,
  Send,
  RefreshCw,
  Settings,
  ChevronDown,
  Sparkles,
  Trash2,
  Plus
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';

// CodeBlock for fenced code
const CodeBlock = ({ language, value }) => {
  const [copied, setCopied] = useState(false);
  const copyToClipboard = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="relative rounded-lg overflow-hidden my-2 shadow-lg bg-gray-900">
      <div className="flex items-center justify-between px-4 py-1 bg-gray-800 text-xs text-gray-400">
        <span className="uppercase tracking-wider">{language || 'text'}</span>
        <button onClick={copyToClipboard} className="hover:text-white transition-colors">
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <pre className="p-4 overflow-x-auto text-sm text-gray-200">
        <code>{value}</code>
      </pre>
    </div>
  );
};

// Wrapper to decide between inline <code> and CodeBlock
const RenderedCodeBlock = ({ inline, className = '', children, ...props }) => {
  const match = /language-(\w+)/.exec(className);
  if (inline || !match) {
    return (
      <code className="bg-white/50 dark:bg-gray-800 px-1 py-0.5 rounded text-sm" {...props}>
        {children}
      </code>
    );
  }
  const value = String(children).replace(/\n$/, '');
  return <CodeBlock language={match[1]} value={value} />;
};

const MarkdownComponents = {
  code: RenderedCodeBlock,
  p: ({ children }) => <p className="mb-4">{children}</p>,
  h1: ({ children }) => <h1 className="text-3xl font-extrabold mt-6 mb-4 text-white">{children}</h1>,
  h2: ({ children }) => <h2 className="text-2xl font-bold mt-5 mb-3 text-white">{children}</h2>,
  h3: ({ children }) => <h3 className="text-xl font-bold mt-4 mb-2 text-white">{children}</h3>,
  ul: ({ children }) => <ul className="list-disc pl-6 mb-4 text-white">{children}</ul>,
  ol: ({ children }) => <ol className="list-decimal pl-6 mb-4 text-white">{children}</ol>,
  blockquote: ({ children }) => (
    <blockquote className="border-l-4 border-white/50 pl-4 italic my-4 text-white">{children}</blockquote>
  ),
  a: ({ href, children }) => (
    <a href={href} className="underline" target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  ),
};

export default function MasterChatInterface3() {
  // — State
  const [chats, setChats]               = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages]         = useState([]);
  const [models, setModels]             = useState([]);
  const [selectedModel, setSelectedModel] = useState('');
  const [input, setInput]               = useState('');
  const [loading, setLoading]           = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [apiEndpoint, setApiEndpoint]   = useState('http://localhost:5000');
  const [darkMode, setDarkMode]         = useState(false);

  // — Refs
  const textareaRef    = useRef(null);
  const messagesEndRef = useRef(null);

  // — Fetch all chats
  const fetchChats = async () => {
    try {
      const res  = await fetch(`${apiEndpoint}/chats`);
      const data = await res.json();
      setChats(data);
      if (data.length && !selectedChat) {
        setSelectedChat(data[0].id);
      }
    } catch (err) {
      console.error('fetchChats error:', err);
    }
  };

  // — Create a new chat
  const createChat = async () => {
    try {
      await fetch(`${apiEndpoint}/chats`, { method: 'POST' });
      await fetchChats();
    } catch (err) {
      console.error('createChat error:', err);
    }
  };

  // — Delete a chat
  const deleteChat = async (chatId) => {
    if (!window.confirm('Delete this chat?')) return;
    try {
      await fetch(`${apiEndpoint}/chats/${chatId}`, { method: 'DELETE' });
      if (chatId === selectedChat) {
        setSelectedChat(null);
        setMessages([]);
      }
      await fetchChats();
    } catch (err) {
      console.error('deleteChat error:', err);
    }
  };

  // — Fetch messages for the selected chat
  const fetchMessages = async (chatId) => {
    if (!chatId) return;
    try {
      const res = await fetch(`${apiEndpoint}/chats/${chatId}/messages`);
      setMessages(await res.json());
    } catch (err) {
      console.error('fetchMessages error:', err);
    }
  };

  // — Load models once
  useEffect(() => {
    (async () => {
      try {
        const res  = await fetch(`${apiEndpoint}/models`);
        const json = await res.json();
        setModels(json.models || []);
        if (json.models?.length) setSelectedModel(json.models[0]);
      } catch (e) {
        console.error('load models error:', e);
      }
    })();
  }, [apiEndpoint]);

  // — On mount: fetch chats
  useEffect(() => {
    fetchChats();
  }, []);

  // — If no chats exist, auto-create one
  useEffect(() => {
    if (chats.length === 0) {
      createChat();
    }
  }, [chats]);

  // — When selectedChat changes
  useEffect(() => {
    fetchMessages(selectedChat);
  }, [selectedChat]);

  // — Auto-scroll when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // — Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  // — Send message (via /generate)
  const sendMessage = async () => {
    console.log('🔷 sendMessage:', { selectedChat, input });
    if (!input.trim()) {
      return alert('Please type a message first.');
    }
    if (!selectedChat) {
      return alert('No chat selected.');
    }

    setLoading(true);
    try {
      const res = await fetch(`${apiEndpoint}/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model:   selectedModel,
          prompt:  input,
          chat_id: selectedChat
        })
      });
      const data = await res.json();
      console.log('🔹 generate response:', data);
      await fetchMessages(selectedChat);
      await fetchChats(); // in case title changed
    } catch (err) {
      console.error('sendMessage error:', err);
      alert('Error sending message. See console.');
    }
    setInput('');
    setLoading(false);
  };

  // — Clear conversation
  const clearConversation = async () => {
    if (!selectedChat) return;
    if (!window.confirm('Clear this conversation?')) return;
    try {
      await fetch(`${apiEndpoint}/chats/${selectedChat}/messages`, { method: 'DELETE' });
      setMessages([]);
    } catch (err) {
      console.error('clearConversation error:', err);
    }
  };

  // — Handle Enter key
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className={`flex h-screen ${darkMode ? 'dark bg-gray-900 text-white' : ''}`}>
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white p-4">
        <button
          onClick={createChat}
          className="w-full mb-4 flex items-center justify-center space-x-2 py-2 bg-green-500 rounded hover:bg-green-600"
        >
          <Plus size={16} /> <span>New Chat</span>
        </button>
        <ul className="space-y-2 overflow-y-auto">
          {chats.map((c) => (
            <li
              key={c.id}
              className={`flex justify-between items-center px-3 py-2 rounded cursor-pointer ${
                c.id === selectedChat ? 'bg-gray-600' : 'hover:bg-gray-700'
              }`}
              onClick={() => setSelectedChat(c.id)}
            >
              <span className="truncate">{c.title}</span>
              <Trash2
                size={14}
                className="text-red-400 hover:text-red-600"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteChat(c.id);
                }}
              />
            </li>
          ))}
        </ul>
      </aside>

      {/* Main area */}
      <div className="flex flex-col flex-1">
        {/* Header */}
        <header className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-indigo-500 to-pink-500">
          <div className="flex items-center space-x-3">
            <Sparkles size={32} className="animate-pulse" />
            <h1 className="text-2xl font-extrabold">MASTER</h1>
            <span className="opacity-80">Your AI Companion</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="hidden md:flex items-center bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 space-x-2">
              <span>Model:</span>
              <select
                className="bg-transparent focus:outline-none text-white"
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
              >
                {models.map((m) => (
                  <option key={m} value={m} className="text-black">
                    {m}
                  </option>
                ))}
              </select>
            </div>
            <button onClick={clearConversation} className="p-2 rounded-full bg-white/20 hover:bg-white/30">
              <RefreshCw size={20} />
            </button>
            <button onClick={() => setShowSettings(!showSettings)} className="p-2 rounded-full bg-white/20 hover:bg-white/30">
              <Settings size={20} />
            </button>
          </div>
        </header>

        {/* Settings Panel */}
        {showSettings && (
          <div className="p-4 bg-white/20 backdrop-blur-sm space-y-4 text-black">
            <div className="flex justify-between items-center">
              <h2 className="font-semibold">Settings</h2>
              <button onClick={() => setShowSettings(false)}>
                <ChevronDown />
              </button>
            </div>
            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-2">
                <input type="checkbox" checked={darkMode} onChange={() => setDarkMode(!darkMode)} />
                <span>Dark Mode</span>
              </label>
              <div className="flex-1">
                <label className="block mb-1">API Endpoint:</label>
                <input
                  type="text"
                  value={apiEndpoint}
                  onChange={(e) => setApiEndpoint(e.target.value)}
                  className="w-full p-2 rounded bg-gray-100"
                />
              </div>
            </div>
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 bg-white/20 backdrop-blur-sm">
          {messages.length === 0 ? (
            <div className="text-center opacity-80">
              <p className="text-xl">No messages yet</p>
            </div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`max-w-3xl ${msg.sender === 'user' ? 'ml-auto' : 'mr-auto'}`}
              >
                <div
                  className={`p-4 rounded-2xl shadow-lg transform transition hover:scale-[1.02] ${
                    msg.sender === 'user'
                      ? 'bg-gradient-to-tr from-green-400 to-blue-500 text-white'
                      : 'bg-gradient-to-tr from-pink-500 to-purple-600 text-white'
                  }`}
                >
                  {msg.sender === 'user' ? (
                    <div className="whitespace-pre-wrap">{msg.text}</div>
                  ) : (
                    <ReactMarkdown components={MarkdownComponents}>
                      {msg.text}
                    </ReactMarkdown>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Input & Send */}
        <div className="p-4 bg-white/30 backdrop-blur-sm flex items-end space-x-2">
          <textarea
            ref={textareaRef}
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            className="flex-1 p-4 rounded-xl resize-none"
            style={{ maxHeight: '200px' }}
          />
          <button
            onClick={sendMessage}
            disabled={loading || !input.trim() || !selectedChat}
            className="p-3 rounded-full shadow-lg disabled:opacity-50 hover:scale-105 transition bg-green-400 flex items-center justify-center"
          >
            {loading ? <Loader2 size={24} className="animate-spin text-white"/> : <Send size={24} className="text-white"/>}
          </button>
        </div>
      </div>
    </div>
  );
}


