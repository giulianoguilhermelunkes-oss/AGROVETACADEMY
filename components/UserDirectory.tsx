import React, { useEffect, useState } from 'react';
import { User } from '../types';
import { storageService } from '../services/storageService';
import { Shield, User as UserIcon, Wifi } from 'lucide-react';

export const UserDirectory: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);

  // Real-time subscription to user changes
  useEffect(() => {
    const fetchUsers = () => {
      setUsers(storageService.getUsers());
    };

    fetchUsers(); // Initial load
    
    // Subscribe to updates (new registrations, deletions, etc)
    const unsubscribe = storageService.subscribe(fetchUsers);
    
    return () => unsubscribe();
  }, []);
  
  // Sort: Professors first, then students by name
  const sortedUsers = [...users].sort((a, b) => {
    if (a.role === 'professor' && b.role === 'student') return -1;
    if (a.role === 'student' && b.role === 'professor') return 1;
    return a.name.localeCompare(b.name);
  });

  return (
    <div className="animate-fade-in">
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold text-slate-800 mb-2">Diretório Acadêmico</h2>
          <p className="text-slate-500">Lista de alunos e professores conectados à rede AgroVet.</p>
        </div>
        <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full text-xs font-medium">
          <Wifi className="w-3 h-3 animate-pulse" />
          <span>Sessão em Tempo Real</span>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-semibold text-slate-600 text-sm">Usuário</th>
                <th className="px-6 py-4 font-semibold text-slate-600 text-sm">Função</th>
                <th className="px-6 py-4 font-semibold text-slate-600 text-sm">Identificação / Área</th>
                <th className="px-6 py-4 font-semibold text-slate-600 text-sm">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sortedUsers.length === 0 ? (
                 <tr>
                   <td colSpan={4} className="px-6 py-8 text-center text-slate-400">
                     Nenhum usuário encontrado no diretório.
                   </td>
                 </tr>
              ) : (
                sortedUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full ${user.avatarColor} flex items-center justify-center text-white font-bold shadow-sm`}>
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">{user.name}</p>
                          <p className="text-xs text-slate-400">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {user.role === 'professor' ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
                          <Shield className="w-3 h-3" />
                          Professor
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                          <UserIcon className="w-3 h-3" />
                          Aluno
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {user.role === 'student' ? (
                        <span className="font-mono text-slate-600 bg-slate-100 px-2 py-1 rounded text-xs border border-slate-200">
                          COD: {user.studentCode}
                        </span>
                      ) : (
                        <span className="capitalize text-sm text-slate-700">
                          {user.specialization}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                       <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                          <span className="text-xs text-slate-500">Conectado</span>
                       </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
