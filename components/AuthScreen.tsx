import React, { useState, useEffect } from 'react';
import { User, UserRole, ProfessorSpecialization } from '../types';
import { storageService, getUserColor } from '../services/storageService';
import { GraduationCap, UserPlus, LogIn, AlertCircle, Trash2, PlusCircle, Shield, User as UserIcon } from 'lucide-react';

interface AuthScreenProps {
  onLogin: (user: User) => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onLogin }) => {
  const [view, setView] = useState<'switcher' | 'form'>('form');
  const [existingUsers, setExistingUsers] = useState<User[]>([]);
  
  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>('student');
  const [specialization, setSpecialization] = useState<ProfessorSpecialization>('agronomia');
  const [error, setError] = useState('');

  // Load existing users on mount and subscribe to changes
  useEffect(() => {
    const updateUsers = () => {
      const users = storageService.getUsers();
      setExistingUsers(users);
      
      // Auto-switch view based on data presence
      if (users.length > 0 && view === 'form' && !isRegistering) {
        setView('switcher');
      } else if (users.length === 0) {
        setView('form');
      }
    };

    updateUsers(); // Initial check
    const unsubscribe = storageService.subscribe(updateUsers);

    return () => unsubscribe();
  }, [view, isRegistering]); // Dependencies ensure logic runs correctly on state change

  const handleQuickLogin = (user: User) => {
    storageService.login(user.email);
    onLogin(user);
  };

  const handleDeleteUser = (e: React.MouseEvent, userId: string) => {
    e.stopPropagation(); // Prevent triggering login
    if (window.confirm('Tem certeza que deseja remover este usuário deste dispositivo?')) {
      // 1. Delete from storage
      storageService.deleteUser(userId);
      
      // 2. Force immediate UI update (Optimistic update)
      const updatedList = existingUsers.filter(u => u.id !== userId);
      setExistingUsers(updatedList);
      
      if (updatedList.length === 0) {
        setView('form');
      }
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const user = storageService.login(email);
    if (user) {
      onLogin(user);
    } else {
      setError('Usuário não encontrado. Verifique o e-mail ou cadastre-se.');
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) {
      setError('Preencha todos os campos.');
      return;
    }

    const users = storageService.getUsers();
    if (users.find(u => u.email === email)) {
      setError('Este e-mail já está cadastrado.');
      return;
    }

    const newUser: User = {
      id: crypto.randomUUID(),
      name,
      email,
      role,
      avatarColor: getUserColor(role, specialization),
      completedTopics: [], // Initialize progress as empty
      ...(role === 'student' && { 
        studentCode: Math.random().toString(36).substring(2, 8).toUpperCase() 
      }),
      ...(role === 'professor' && { specialization })
    };

    storageService.saveUser(newUser);
    storageService.login(newUser.email);
    onLogin(newUser);
  };

  // --- VIEW: USER SWITCHER (QUICK LOGIN) ---
  if (view === 'switcher') {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col animate-fade-in">
           <div className="bg-slate-900 p-8 text-center">
             <h1 className="text-2xl font-bold text-white mb-2">AgroVet Academy</h1>
             <p className="text-slate-400">Quem está acessando?</p>
           </div>
           
           <div className="p-8">
             <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 mb-8">
               {existingUsers.map(user => (
                 <div key={user.id} className="relative group">
                   <button 
                     onClick={() => handleQuickLogin(user)}
                     className="w-full flex flex-col items-center gap-3 p-4 rounded-xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-200"
                   >
                     <div className={`w-20 h-20 rounded-full ${user.avatarColor} flex items-center justify-center text-white text-2xl font-bold shadow-lg group-hover:scale-105 transition-transform relative`}>
                        {user.name.charAt(0).toUpperCase()}
                        {user.role === 'professor' && (
                          <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 shadow-sm">
                             <Shield className="w-5 h-5 text-indigo-600" />
                          </div>
                        )}
                     </div>
                     <div className="text-center">
                       <p className="font-bold text-slate-800 truncate w-full max-w-[120px]">{user.name}</p>
                       <p className="text-xs text-slate-500">{user.role === 'student' ? 'Aluno' : 'Professor'}</p>
                     </div>
                   </button>
                   <button 
                      onClick={(e) => handleDeleteUser(e, user.id)}
                      className="absolute top-2 right-2 p-2 bg-white shadow-sm border border-slate-100 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-all z-20 cursor-pointer"
                      title="Remover conta"
                   >
                      <Trash2 className="w-4 h-4" />
                   </button>
                 </div>
               ))}

               {/* Add New User Button in Grid */}
               <button 
                 onClick={() => setView('form')}
                 className="flex flex-col items-center justify-center gap-3 p-4 rounded-xl border-2 border-dashed border-slate-200 hover:border-slate-400 hover:bg-slate-50 transition-all text-slate-400 hover:text-slate-600"
               >
                 <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center">
                    <PlusCircle className="w-8 h-8" />
                 </div>
                 <span className="font-medium text-sm">Adicionar Conta</span>
               </button>
             </div>
           </div>
        </div>
      </div>
    );
  }

  // --- VIEW: LOGIN / REGISTER FORM ---
  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col animate-fade-in">
        {/* Header */}
        <div className="bg-slate-900 p-8 text-center relative">
          {existingUsers.length > 0 && (
             <button 
               onClick={() => setView('switcher')}
               className="absolute top-4 left-4 text-slate-400 hover:text-white text-xs flex items-center gap-1 transition-colors"
             >
               ← Voltar
             </button>
          )}
          <div className="flex justify-center mb-4">
            <div className="bg-emerald-600 p-3 rounded-xl">
              <GraduationCap className="text-white w-8 h-8" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">AgroVet Academy</h1>
          <p className="text-slate-400 text-sm">Portal Acadêmico Integrado</p>
        </div>

        {/* Form */}
        <div className="p-8">
          <div className="flex gap-4 mb-8 border-b border-slate-100 pb-4">
            <button 
              onClick={() => { setIsRegistering(false); setError(''); }}
              className={`flex-1 pb-2 text-sm font-semibold transition-colors ${!isRegistering ? 'text-emerald-600 border-b-2 border-emerald-600' : 'text-slate-400'}`}
            >
              Entrar
            </button>
            <button 
              onClick={() => { setIsRegistering(true); setError(''); }}
              className={`flex-1 pb-2 text-sm font-semibold transition-colors ${isRegistering ? 'text-emerald-600 border-b-2 border-emerald-600' : 'text-slate-400'}`}
            >
              Criar Conta
            </button>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-4 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}

          <form onSubmit={isRegistering ? handleRegisterSubmit : handleLoginSubmit} className="space-y-4">
            {isRegistering && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nome Completo</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                  placeholder="Seu nome"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">E-mail</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                placeholder="seu@email.com"
              />
            </div>

            {isRegistering && (
              <div className="space-y-4 pt-2">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Sou:</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setRole('student')}
                      className={`p-3 rounded-lg border text-sm font-medium transition-all ${role === 'student' ? 'bg-slate-100 border-slate-400 text-slate-800' : 'bg-white border-slate-200 text-slate-500'}`}
                    >
                      Aluno
                    </button>
                    <button
                      type="button"
                      onClick={() => setRole('professor')}
                      className={`p-3 rounded-lg border text-sm font-medium transition-all ${role === 'professor' ? 'bg-indigo-50 border-indigo-300 text-indigo-700' : 'bg-white border-slate-200 text-slate-500'}`}
                    >
                      Professor
                    </button>
                  </div>
                </div>

                {role === 'professor' && (
                  <div className="animate-fade-in">
                    <label className="block text-sm font-medium text-slate-700 mb-2">Área de Atuação:</label>
                    <select 
                      value={specialization}
                      onChange={(e) => setSpecialization(e.target.value as ProfessorSpecialization)}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    >
                      <option value="agronomia">Agronomia (Verde)</option>
                      <option value="zootecnia">Zootecnia (Âmbar)</option>
                      <option value="veterinaria">Medicina Veterinária (Azul)</option>
                    </select>
                  </div>
                )}

                {role === 'student' && (
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs text-slate-500">
                    <p>Ao se cadastrar como aluno, seu perfil será <span className="font-bold text-slate-600">Cinza</span> e um código de identificação será gerado automaticamente.</p>
                  </div>
                )}
              </div>
            )}

            <button 
              type="submit" 
              className="w-full bg-slate-900 text-white py-3 rounded-lg font-bold hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 mt-6"
            >
              {isRegistering ? <UserPlus className="w-5 h-5" /> : <LogIn className="w-5 h-5" />}
              {isRegistering ? 'Cadastrar e Entrar' : 'Acessar Portal'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
