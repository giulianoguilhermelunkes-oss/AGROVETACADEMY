import React from 'react';
import { GraduationCap, LogOut } from 'lucide-react';
import { User as UserType } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activeCourse?: string;
  onNavigate: (path: string) => void;
  currentUser: UserType;
  onLogout: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, activeCourse, onNavigate, currentUser, onLogout }) => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNavigate('/')}>
            <div className="bg-emerald-600 p-1.5 rounded-lg">
              <GraduationCap className="text-white w-6 h-6" />
            </div>
            <span className="font-bold text-xl text-slate-800 tracking-tight">AgroVet<span className="text-emerald-600">Academy</span></span>
          </div>

          <div className="hidden md:flex items-center space-x-6 text-sm font-medium text-slate-600">
            <button onClick={() => onNavigate('/')} className="hover:text-emerald-600 transition-colors">Início</button>
            <div className="h-4 w-px bg-slate-200"></div>
            <button onClick={() => onNavigate('/course/agronomia')} className={`hover:text-emerald-600 transition-colors ${activeCourse === 'agronomia' ? 'text-emerald-600 font-bold' : ''}`}>Agronomia</button>
            <button onClick={() => onNavigate('/course/zootecnia')} className={`hover:text-amber-600 transition-colors ${activeCourse === 'zootecnia' ? 'text-amber-600 font-bold' : ''}`}>Zootecnia</button>
            <button onClick={() => onNavigate('/course/veterinaria')} className={`hover:text-sky-600 transition-colors ${activeCourse === 'veterinaria' ? 'text-sky-600 font-bold' : ''}`}>Veterinária</button>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
               <div className="text-right hidden sm:block">
                  <p className="text-xs font-bold text-slate-800">{currentUser.name}</p>
                  <p className="text-[10px] uppercase tracking-wider text-slate-500">
                    {currentUser.role === 'student' ? 'Aluno' : `Prof. ${currentUser.specialization}`}
                  </p>
               </div>
               <div className={`w-9 h-9 rounded-full ${currentUser.avatarColor} flex items-center justify-center text-white font-bold shadow-sm`}>
                  {currentUser.name.charAt(0).toUpperCase()}
               </div>
               <button onClick={onLogout} className="p-2 text-slate-400 hover:text-red-600 transition-colors" title="Sair">
                 <LogOut className="w-5 h-5" />
               </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-white font-bold mb-4">AgroVet Academy</h3>
            <p className="text-sm leading-relaxed">Sua faculdade digital completa para Ciências Agrárias. Conteúdo revisado, didático e integrado.</p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Cursos</h4>
            <ul className="space-y-2 text-sm">
              <li><button onClick={() => onNavigate('/course/agronomia')}>Agronomia</button></li>
              <li><button onClick={() => onNavigate('/course/zootecnia')}>Zootecnia</button></li>
              <li><button onClick={() => onNavigate('/course/veterinaria')}>Medicina Veterinária</button></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Suporte</h4>
            <ul className="space-y-2 text-sm">
              <li>Central de Ajuda</li>
              <li>Reportar Erro</li>
              <li>Política de Privacidade</li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
};
