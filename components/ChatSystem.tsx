import React, { useState, useEffect, useRef } from 'react';
import { User, ChatMessage } from '../types';
import { storageService } from '../services/storageService';
import { Send, Users, MessageSquare, MicOff, Mic, Lock } from 'lucide-react';

interface ChatSystemProps {
  currentUser: User;
}

export const ChatSystem: React.FC<ChatSystemProps> = ({ currentUser }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [activeChat, setActiveChat] = useState<string | null>(null); // null = General, userId = DM
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Real-time Event Driven Updates
  useEffect(() => {
    const refreshData = () => {
      setUsers(storageService.getUsers());
      setMessages(storageService.getMessages());
    };
    
    // Initial fetch
    refreshData();

    // Subscribe to changes (replaces setInterval polling)
    const unsubscribe = storageService.subscribe(refreshData);
    
    return () => unsubscribe();
  }, []);

  // Auto-scroll logic (triggered when messages array changes)
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, activeChat]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    // Check mute status
    const me = storageService.getUsers().find(u => u.id === currentUser.id);
    if (me?.isMuted) {
      alert("Você foi silenciado por um professor e não pode enviar mensagens.");
      return;
    }

    const newMessage: ChatMessage = {
      id: crypto.randomUUID(),
      senderId: currentUser.id,
      senderName: currentUser.name,
      receiverId: activeChat || undefined,
      content: inputText,
      timestamp: Date.now()
    };

    storageService.saveMessage(newMessage); // This now triggers an event
    setInputText('');
  };

  const toggleMute = (targetUserId: string) => {
    if (currentUser.role !== 'professor') return;
    
    const targetUser = users.find(u => u.id === targetUserId);
    if (targetUser) {
      const updatedUser = { ...targetUser, isMuted: !targetUser.isMuted };
      storageService.updateUser(updatedUser); // This triggers an event
    }
  };

  // Filter messages for current view
  const displayMessages = messages.filter(msg => {
    if (activeChat === null) {
      // General chat: show messages with no receiver
      return !msg.receiverId;
    } else {
      // DM: show messages between me and activeChat user
      return (msg.senderId === currentUser.id && msg.receiverId === activeChat) ||
             (msg.senderId === activeChat && msg.receiverId === currentUser.id);
    }
  });

  const getActiveChatUser = () => users.find(u => u.id === activeChat);

  return (
    <div className="flex h-[calc(100vh-140px)] bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-fade-in">
      
      {/* Sidebar - Users List */}
      <div className="w-80 border-r border-slate-200 bg-slate-50 flex flex-col">
        <div className="p-4 border-b border-slate-200">
          <h3 className="font-bold text-slate-700 mb-4">Conversas</h3>
          <button 
            onClick={() => setActiveChat(null)}
            className={`w-full text-left p-3 rounded-xl flex items-center gap-3 transition-colors ${activeChat === null ? 'bg-white shadow-sm ring-1 ring-slate-200' : 'hover:bg-slate-100'}`}
          >
            <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-slate-800 text-sm">Chat Geral</p>
              <p className="text-xs text-slate-500">Todos os participantes</p>
            </div>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Mensagens Diretas</p>
          {users.filter(u => u.id !== currentUser.id).map(user => (
            <div key={user.id} className={`group relative flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-colors ${activeChat === user.id ? 'bg-white shadow-sm ring-1 ring-slate-200' : 'hover:bg-slate-100'}`}>
              
              <div onClick={() => setActiveChat(user.id)} className="flex items-center gap-3 flex-1">
                <div className={`w-10 h-10 rounded-full ${user.avatarColor} flex items-center justify-center text-white font-bold relative`}>
                  {user.name.charAt(0).toUpperCase()}
                  {user.role === 'professor' && (
                     <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5" title="Professor">
                        <div className="w-3 h-3 bg-yellow-400 rounded-full border border-white"></div>
                     </div>
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-1">
                     <p className="font-bold text-slate-800 text-sm">{user.name}</p>
                     {user.isMuted && <MicOff className="w-3 h-3 text-red-500" />}
                  </div>
                  <p className="text-xs text-slate-500 capitalize">{user.role === 'student' ? 'Aluno' : 'Professor'}</p>
                </div>
              </div>

              {/* Mute Button (Only for Professors -> Students) */}
              {currentUser.role === 'professor' && user.role === 'student' && (
                <button 
                  onClick={(e) => { e.stopPropagation(); toggleMute(user.id); }}
                  className={`p-2 rounded-full transition-colors ${user.isMuted ? 'bg-red-100 text-red-600' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-200'}`}
                  title={user.isMuted ? "Permitir falar" : "Silenciar aluno"}
                >
                  {user.isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </button>
              )}

            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-slate-50/50">
        {/* Chat Header */}
        <div className="p-4 bg-white border-b border-slate-200 flex items-center gap-3 shadow-sm z-10">
          {activeChat === null ? (
            <>
              <Users className="w-6 h-6 text-indigo-600" />
              <div>
                 <h2 className="font-bold text-slate-800">Chat Geral</h2>
                 <p className="text-xs text-slate-500">Espaço de interação coletiva</p>
              </div>
            </>
          ) : (
            <>
              <div className={`w-8 h-8 rounded-full ${getActiveChatUser()?.avatarColor} flex items-center justify-center text-white text-sm font-bold`}>
                 {getActiveChatUser()?.name.charAt(0)}
              </div>
              <div>
                 <h2 className="font-bold text-slate-800">{getActiveChatUser()?.name}</h2>
                 <p className="text-xs text-slate-500 flex items-center gap-1">
                    <Lock className="w-3 h-3" /> Conversa Privada
                 </p>
              </div>
            </>
          )}
        </div>

        {/* Messages List - Centralized Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-3xl mx-auto space-y-4">
            {displayMessages.length === 0 ? (
              <div className="h-64 flex flex-col items-center justify-center text-slate-400 opacity-50">
                <MessageSquare className="w-16 h-16 mb-4" />
                <p>Nenhuma mensagem ainda.</p>
              </div>
            ) : (
              displayMessages.map(msg => {
                 const isMe = msg.senderId === currentUser.id;
                 const sender = users.find(u => u.id === msg.senderId);
                 return (
                   <div key={msg.id} className={`flex gap-3 ${isMe ? 'flex-row-reverse' : ''}`}>
                      {!isMe && (
                        <div className={`w-8 h-8 rounded-full flex-shrink-0 ${sender?.avatarColor || 'bg-slate-300'} flex items-center justify-center text-white text-xs font-bold`}>
                          {sender?.name.charAt(0)}
                        </div>
                      )}
                      <div className={`max-w-[70%] rounded-2xl p-4 ${isMe ? 'bg-slate-800 text-white rounded-tr-none' : 'bg-white border border-slate-200 rounded-tl-none shadow-sm'}`}>
                        {!isMe && activeChat === null && <p className={`text-xs font-bold mb-1 ${sender?.role === 'professor' ? 'text-indigo-600' : 'text-slate-500'}`}>{msg.senderName}</p>}
                        <p className={`text-sm leading-relaxed ${isMe ? 'text-slate-100' : 'text-slate-700'}`}>{msg.content}</p>
                        <p className={`text-[10px] mt-2 text-right opacity-60`}>
                          {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </p>
                      </div>
                   </div>
                 );
              })
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-slate-200">
           <div className="max-w-3xl mx-auto">
             {currentUser.isMuted ? (
               <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-xl text-center text-sm font-medium flex items-center justify-center gap-2">
                  <MicOff className="w-4 h-4" />
                  Você foi silenciado e não pode enviar mensagens neste momento.
               </div>
             ) : (
               <form onSubmit={handleSendMessage} className="flex gap-2">
                 <input 
                   type="text" 
                   value={inputText}
                   onChange={(e) => setInputText(e.target.value)}
                   placeholder="Digite sua mensagem..."
                   className="flex-1 bg-slate-100 border-transparent focus:bg-white focus:border-indigo-500 focus:ring-0 rounded-xl px-4 py-3 transition-all"
                 />
                 <button 
                   type="submit" 
                   disabled={!inputText.trim()}
                   className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white p-3 rounded-xl transition-colors"
                 >
                   <Send className="w-5 h-5" />
                 </button>
               </form>
             )}
           </div>
        </div>
      </div>
    </div>
  );
};
