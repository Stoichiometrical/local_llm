// import React, { useState, useEffect, useRef } from "react";
// import { Loader2, Send, RefreshCw, Settings, ChevronDown } from "lucide-react";
// import ReactMarkdown from 'react-markdown';
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
// // Code block component with syntax highlighting
// const CodeBlock = ({ language, value }) => {
//   return (
//     <div className="relative rounded-md bg-gray-900 my-2">
//       <div className="flex items-center justify-between px-4 py-1 bg-gray-800 rounded-t-md text-xs text-gray-400">
//         <span>{language || 'text'}</span>
//         <button
//           onClick={() => {
//             navigator.clipboard.writeText(value);
//             // Could add a toast notification here
//           }}
//           className="hover:text-white transition-colors"
//         >
//           Copy
//         </button>
//       </div>
//       <pre className="p-4 overflow-x-auto text-sm text-gray-300">
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
//     return !inline && match ? (
//       <CodeBlock language={match[1]} value={String(children).replace(/\n$/, '')} />
//     ) : (
//       <code className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-sm" {...props}>
//         {children}
//       </code>
//     );
//   },
//   p: ({ children }) => <p className="mb-4">{children}</p>,
//   h1: ({ children }) => <h1 className="text-2xl font-bold mt-6 mb-4">{children}</h1>,
//   h2: ({ children }) => <h2 className="text-xl font-bold mt-5 mb-3">{children}</h2>,
//   h3: ({ children }) => <h3 className="text-lg font-bold mt-4 mb-2">{children}</h3>,
//   ul: ({ children }) => <ul className="list-disc pl-6 mb-4">{children}</ul>,
//   ol: ({ children }) => <ol className="list-decimal pl-6 mb-4">{children}</ol>,
//   li: ({ children }) => <li className="mb-1">{children}</li>,
//   blockquote: ({ children }) => (
//     <blockquote className="border-l-4 border-gray-300 pl-4 italic my-4">{children}</blockquote>
//   ),
//   a: ({ href, children }) => (
//     <a href={href} className="text-blue-500 hover:underline" target="_blank" rel="noopener noreferrer">
//       {children}
//     </a>
//   ),
//   table: ({ children }) => (
//     <div className="overflow-x-auto my-4">
//       <table className="min-w-full divide-y divide-gray-300">{children}</table>
//     </div>
//   ),
//   thead: ({ children }) => <thead className="bg-gray-100">{children}</thead>,
//   tbody: ({ children }) => <tbody className="divide-y divide-gray-200">{children}</tbody>,
//   tr: ({ children }) => <tr>{children}</tr>,
//   th: ({ children }) => (
//     <th className="px-4 py-2 text-left text-sm font-semibold text-gray-900">{children}</th>
//   ),
//   td: ({ children }) => <td className="px-4 py-2 text-sm">{children}</td>,
// };
//
// export default function ChatInterface() {
//   // State
//   const [models, setModels] = useState([]);
//   const [selectedModel, setSelectedModel] = useState("");
//   const [messages, setMessages] = useLocalStorage("chat-messages", []);
//   const [input, setInput] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [showSettings, setShowSettings] = useState(false);
//   const [darkMode, setDarkMode] = useLocalStorage("dark-mode", false);
//   const [apiEndpoint, setApiEndpoint] = useLocalStorage(
//     "api-endpoint",
//     "http://localhost:5000"
//   );
//
//   // Refs
//   const messagesEndRef = useRef(null);
//   const textareaRef = useRef(null);
//   const conversationRef = useRef(null);
//
//   // Apply dark mode
//   useEffect(() => {
//     if (darkMode) {
//       document.documentElement.classList.add('dark');
//     } else {
//       document.documentElement.classList.remove('dark');
//     }
//   }, [darkMode]);
//
//   // Fetch available models on mount
//   useEffect(() => {
//     fetchModels();
//   }, [apiEndpoint]);
//
//   const fetchModels = async () => {
//     try {
//       const res = await fetch(`${apiEndpoint}/models`);
//       const data = await res.json();
//       setModels(data.models || []);
//       if (data.models && data.models.length) {
//         setSelectedModel(data.models[0]);
//       }
//     } catch (err) {
//       console.error("Failed to load models:", err);
//     }
//   };
//
//   // Auto-resize textarea as user types
//   useEffect(() => {
//     if (textareaRef.current) {
//       textareaRef.current.style.height = "auto";
//       textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
//     }
//   }, [input]);
//
//   // Scroll to bottom when messages update
//   useEffect(() => {
//     if (messagesEndRef.current) {
//       messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
//     }
//   }, [messages, loading]);
//
//   // Auto-focus input on mount
//   useEffect(() => {
//     if (textareaRef.current) {
//       textareaRef.current.focus();
//     }
//   }, []);
//
//   const sendMessage = async () => {
//     if (!input.trim()) return;
//
//     // Add user message
//     const userMessage = { id: Date.now(), sender: "user", text: input };
//     setMessages((prev) => [...prev, userMessage]);
//     const promptText = input;
//     setInput("");
//     setLoading(true);
//
//     try {
//       const res = await fetch(`${apiEndpoint}/generate`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ model: selectedModel, prompt: promptText }),
//       });
//
//       if (!res.ok) {
//         throw new Error(`API error: ${res.status}`);
//       }
//
//       const data = await res.json();
//       const botText = data.response || "(no response)";
//       setMessages((prev) => [...prev, { id: Date.now() + 1, sender: "bot", text: botText }]);
//     } catch (err) {
//       console.error(err);
//       setMessages((prev) => [
//         ...prev,
//         { id: Date.now() + 1, sender: "bot", text: `Error: ${err.message || "Failed to contact the API"}` },
//       ]);
//     }
//
//     setLoading(false);
//
//     // Reset textarea height
//     if (textareaRef.current) {
//       textareaRef.current.style.height = "auto";
//     }
//   };
//
//   const clearConversation = () => {
//     if (window.confirm("Are you sure you want to clear the conversation?")) {
//       setMessages([]);
//     }
//   };
//
//   const handleInputKeyDown = (e) => {
//     if (e.key === "Enter" && !e.shiftKey) {
//       e.preventDefault();
//       sendMessage();
//     }
//   };
//
//   return (
//     <div className={`flex flex-col h-screen transition-colors ${darkMode ? 'dark bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
//       {/* Header */}
//       <header className="border-b dark:border-gray-700 py-3 px-4 flex justify-between items-center">
//         <div className="flex items-center space-x-3">
//           <h1 className="text-lg font-bold">AI Chat</h1>
//           <div className="hidden md:flex items-center bg-gray-100 dark:bg-gray-800 rounded-md px-3 py-1 text-sm">
//             <span className="mr-2">Model:</span>
//             <select
//               className="bg-transparent focus:outline-none"
//               value={selectedModel}
//               onChange={(e) => setSelectedModel(e.target.value)}
//             >
//               {models.map((m) => (
//                 <option key={m} value={m} className="dark:bg-gray-800">
//                   {m}
//                 </option>
//               ))}
//             </select>
//           </div>
//         </div>
//
//         <div className="flex space-x-2">
//           <button
//             onClick={() => fetchModels()}
//             className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
//             title="Refresh models"
//           >
//             <RefreshCw size={18} />
//           </button>
//           <button
//             onClick={clearConversation}
//             className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
//             title="Clear conversation"
//           >
//             <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//               <path d="M3 6h18"></path>
//               <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
//               <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
//             </svg>
//           </button>
//           <button
//             onClick={() => setShowSettings(!showSettings)}
//             className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
//             title="Settings"
//           >
//             <Settings size={18} />
//           </button>
//         </div>
//       </header>
//
//       {/* Settings panel */}
//       {showSettings && (
//         <div className="border-b dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-800 space-y-4">
//           <div className="flex justify-between items-center">
//             <h2 className="font-medium">Settings</h2>
//             <button
//               onClick={() => setShowSettings(false)}
//               className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
//             >
//               <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                 <line x1="18" y1="6" x2="6" y2="18"></line>
//                 <line x1="6" y1="6" x2="18" y2="18"></line>
//               </svg>
//             </button>
//           </div>
//
//           <div className="grid md:grid-cols-2 gap-4">
//             <div>
//               <label className="flex items-center space-x-2 cursor-pointer">
//                 <input
//                   type="checkbox"
//                   checked={darkMode}
//                   onChange={() => setDarkMode(!darkMode)}
//                   className="rounded"
//                 />
//                 <span>Dark Mode</span>
//               </label>
//             </div>
//
//             <div>
//               <label className="block text-sm mb-1">API Endpoint:</label>
//               <input
//                 type="text"
//                 value={apiEndpoint}
//                 onChange={(e) => setApiEndpoint(e.target.value)}
//                 className="w-full p-2 border dark:border-gray-600 rounded dark:bg-gray-700"
//               />
//             </div>
//           </div>
//         </div>
//       )}
//
//       {/* Main content */}
//       <div className="flex-1 overflow-hidden flex flex-col">
//         {/* Mobile model selector */}
//         <div className="md:hidden border-b dark:border-gray-700 p-2">
//           <div className="flex items-center justify-between bg-gray-100 dark:bg-gray-800 rounded-md px-3 py-2">
//             <span className="text-sm">Model:</span>
//             <select
//               className="bg-transparent focus:outline-none p-1"
//               value={selectedModel}
//               onChange={(e) => setSelectedModel(e.target.value)}
//             >
//               {models.map((m) => (
//                 <option key={m} value={m} className="dark:bg-gray-800">
//                   {m}
//                 </option>
//               ))}
//             </select>
//           </div>
//         </div>
//
//         {/* Chat messages */}
//         <div
//           ref={conversationRef}
//           className="flex-1 overflow-y-auto px-4 py-6 space-y-6"
//         >
//           {messages.length === 0 && (
//             <div className="text-center text-gray-500 dark:text-gray-400 mt-8">
//               <div className="mb-3">
//                 <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
//                 </svg>
//               </div>
//               <p className="text-lg font-medium">How can I help you today?</p>
//               <p className="text-sm mt-2">Type a message to start the conversation</p>
//             </div>
//           )}
//
//           {messages.map((msg) => (
//             <div
//               key={msg.id}
//               className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
//             >
//               <div
//                 className={`px-4 py-3 rounded-lg max-w-3xl ${
//                   msg.sender === "user"
//                     ? "bg-blue-500 text-white"
//                     : "bg-gray-100 dark:bg-gray-800"
//                 }`}
//               >
//                 {msg.sender === "user" ? (
//                   <div className="whitespace-pre-wrap break-words">{msg.text}</div>
//                 ) : (
//                   <div className="prose dark:prose-invert prose-sm max-w-none">
//                     <ReactMarkdown components={MarkdownComponents}>
//                       {msg.text}
//                     </ReactMarkdown>
//                   </div>
//                 )}
//               </div>
//             </div>
//           ))}
//
//           {loading && (
//             <div className="flex justify-start">
//               <div className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-800 px-4 py-3 rounded-lg">
//                 <Loader2 size={18} className="animate-spin" />
//                 <span>Thinking...</span>
//               </div>
//             </div>
//           )}
//
//           <div ref={messagesEndRef} />
//         </div>
//
//         {/* Input area */}
//         <div className="border-t dark:border-gray-700 p-4">
//           <div className="max-w-4xl mx-auto flex">
//             <div className="relative flex-grow">
//               <textarea
//                 ref={textareaRef}
//                 className="w-full border dark:border-gray-700 rounded-lg pr-12 pl-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 resize-none"
//                 placeholder="Type a message..."
//                 rows={1}
//                 value={input}
//                 onChange={(e) => setInput(e.target.value)}
//                 onKeyDown={handleInputKeyDown}
//                 style={{ maxHeight: '200px' }}
//               />
//               <button
//                 className="absolute right-2 bottom-2 p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 disabled:opacity-50 bg-white dark:bg-gray-800 rounded-full"
//                 onClick={sendMessage}
//                 disabled={loading || !input.trim()}
//                 title="Send message"
//               >
//                 <Send size={20} />
//               </button>
//             </div>
//           </div>
//           <div className="text-xs text-center mt-2 text-gray-500 dark:text-gray-400">
//             Press Enter to send, Shift+Enter for new line
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


import React, { useState, useEffect, useRef } from 'react';
import { Loader2, Send, RefreshCw, Settings, ChevronDown, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

// Custom hook for local storage
const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue];
};

// Code block component with syntax highlighting
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

// Custom Markdown components
const MarkdownComponents = {
  code: ({ node, inline, className, children, ...props }) => {
    const match = /language-(\w+)/.exec(className || '');
    if (!inline && match) {
      return <CodeBlock language={match[1]} value={String(children).replace(/\n$/, '')} />;
    }
    return (
      <code className="bg-white/50 dark:bg-gray-800 px-1 py-0.5 rounded text-sm" {...props}>
        {children}
      </code>
    );
  },
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

// Default quick suggestions
const defaultSuggestions = [
  'Explain quantum computing in simple terms',
  'Write a poem about the future of AI',
  'Generate a creative story about a world where robots and humans coexist',
  'Give me 5 unique ideas for a sci-fi novel'
];

export default function MasterChatInterface() {
  // State
  const [models, setModels] = useState([]);
  const [selectedModel, setSelectedModel] = useState('');
  const [messages, setMessages] = useLocalStorage('master-messages', []);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [darkMode, setDarkMode] = useLocalStorage('dark-mode', false);
  const [apiEndpoint, setApiEndpoint] = useLocalStorage('api-endpoint', 'http://localhost:5000');
  const [suggestions] = useState(defaultSuggestions);

  // Refs
  const conversationRef = useRef(null);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  // Apply dark mode or vibrant theme
  useEffect(() => {
    if (darkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [darkMode]);

  // Fetch models
  useEffect(() => {
    async function fetchModels() {
      try {
        const res = await fetch(`${apiEndpoint}/models`);
        const data = await res.json();
        setModels(data.models || []);
        if (data.models?.length) setSelectedModel(data.models[0]);
      } catch (e) {
        console.error(e);
      }
    }
    fetchModels();
  }, [apiEndpoint]);

  // Auto-scroll
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, loading]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg = { id: Date.now(), sender: 'user', text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch(`${apiEndpoint}/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: selectedModel, prompt: input })
      });
      const data = await res.json();
      const botMsg = { id: Date.now() + 1, sender: 'bot', text: data.response || '...' };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, sender: 'bot', text: `Error: ${err.message}` }
      ]);
    }

    setLoading(false);
  };

  const clearConversation = () => {
    if (window.confirm('Clear conversation?')) setMessages([]);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const useSuggestion = (s) => {
    setInput(s);
    textareaRef.current?.focus();
  };

  return (
    <div className={`flex flex-col h-screen transition-colors ${
      darkMode ? 'dark bg-gray-900 text-white' : 'bg-gradient-to-br from-purple-600 to-blue-500 text-white'
    }`}>

      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-indigo-500 to-pink-500 shadow-lg">
        <div className="flex items-center space-x-3">
          <Sparkles size={32} className="animate-pulse" />
          <h1 className="text-2xl font-extrabold tracking-wider">MASTER</h1>
          <span className="text-sm opacity-80">Your AI Companion</span>
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
          <button onClick={clearConversation} className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition">
            <RefreshCw size={20} />
          </button>
          <button onClick={() => setShowSettings(!showSettings)} className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition">
            <Settings size={20} />
          </button>
        </div>
      </header>

      {/* Settings Panel */}
      {showSettings && (
        <div className="p-4 bg-white/20 backdrop-blur-sm space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="font-semibold">Settings</h2>
            <button onClick={() => setShowSettings(false)}><ChevronDown /></button>
          </div>
          <div className="flex flex-col md:flex-row gap-4">
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
                className="w-full p-2 rounded bg-gray-100 dark:bg-gray-800"
              />
            </div>
          </div>
        </div>
      )}

      {/* Main Chat Area */}
      <div className="flex-1 overflow-hidden flex flex-col">
        <div
          ref={conversationRef}
          className="flex-1 overflow-y-auto px-6 py-4 space-y-4 bg-white/20 backdrop-blur-sm"
        >
          {messages.length === 0 && (
            <div className="text-center opacity-80">
              <p className="text-xl">How can I help you today?</p>
              <p className="text-sm mt-1">Type a message to start</p>
            </div>
          )}

          {messages.map((msg) => (
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
                  <div className="whitespace-pre-wrap break-words">{msg.text}</div>
                ) : (
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    <ReactMarkdown components={MarkdownComponents}>
                      {msg.text}
                    </ReactMarkdown>
                  </div>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-2xl animate-pulse">
                <Loader2 size={18} className="animate-spin" />
                <span>Thinking...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input & Suggestions */}
        <div className="p-4 bg-white/30 backdrop-blur-sm">
          <div className="mb-2 flex flex-wrap gap-2">
            {suggestions.map((s, i) => (
              <button
                key={i}
                onClick={() => useSuggestion(s)}
                className="px-3 py-1 bg-white/20 text-white rounded-full hover:bg-white/40 transition"
              >
                {s}
              </button>
            ))}
          </div>
          <div className="flex items-end space-x-2">
            <textarea
              ref={textareaRef}
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
              className="flex-1 p-4 rounded-xl resize-none bg-white/80 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
              style={{ maxHeight: '200px' }}
            />
            <button
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              className="p-3 bg-green-400 hover:scale-105 transition rounded-full shadow-lg disabled:opacity-50"
            >
              <Send size={24} className="text-white" />
            </button>
          </div>
        </div>

        {/* Floating Clear Button */}
        <button
          onClick={clearConversation}
          className="fixed bottom-6 right-6 bg-white/20 backdrop-blur-sm p-3 rounded-full shadow-xl hover:bg-white/40 transition"
          title="Clear Conversation"
        >
          <RefreshCw size={24} className="text-white" />
        </button>
      </div>
    </div>
  );
}

