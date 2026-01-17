import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { TopicViewer } from './components/TopicViewer';
import { COURSES } from './constants';
import { Course, User } from './types';
import { storageService } from './services/storageService';
import { CheckCircle } from 'lucide-react';

// Simple Hash Router Implementation
const useHashLocation = () => {
  const [loc, setLoc] = useState(window.location.hash.replace('#', '') || '/');
  useEffect(() => {
    const handler = () => setLoc(window.location.hash.replace('#', '') || '/');
    window.addEventListener('hashchange', handler);
    return () => window.removeEventListener('hashchange', handler);
  }, []);
  const navigate = (to: string) => { window.location.hash = to; };
  return { location: loc, navigate };
};

const GUEST_USER: User = {
  id: 'guest_user_v1',
  name: 'Estudante',
  email: 'estudante@agrovet.app',
  role: 'student',
  avatarColor: 'bg-emerald-600',
  completedTopics: [],
  studentCode: 'ALUNO'
};

export default function App() {
  const { location, navigate } = useHashLocation();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  
  // State for navigating deep structure
  const [selectedDisciplineId, setSelectedDisciplineId] = useState<string | null>(null);
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);
  const [selectedTopicName, setSelectedTopicName] = useState<string>('');
  
  // Initialize App with Auto-Login (Guest Mode)
  useEffect(() => {
    let user = storageService.getCurrentUser();
    
    // If no user exists in storage, create and save the default guest
    if (!user) {
      user = GUEST_USER;
      storageService.saveUser(user);
      storageService.login(user.email);
    }
    
    setCurrentUser(user);
  }, []);

  // Reset selection when changing main routes
  useEffect(() => {
    if (!location.includes('/discipline/')) {
        setSelectedDisciplineId(null);
        setSelectedTopicId(null);
    }
  }, [location]);

  // Routing Logic
  const getActiveCourse = (): Course | undefined => {
    if (location.startsWith('/course/agronomia')) return COURSES.find(c => c.id === 'agronomia');
    if (location.startsWith('/course/zootecnia')) return COURSES.find(c => c.id === 'zootecnia');
    if (location.startsWith('/course/veterinaria')) return COURSES.find(c => c.id === 'veterinaria');
    return undefined;
  };

  const activeCourse = getActiveCourse();
  const isHome = location === '/';

  const handleSelectDiscipline = (areaId: string, discId: string) => {
    setSelectedDisciplineId(discId);
    navigate(`${location}/discipline/${discId}`);
  };

  const handleSelectTopic = (topic: {id: string, name: string}) => {
      setSelectedTopicId(topic.id);
      setSelectedTopicName(topic.name);
  };

  const handleToggleTopic = () => {
    if (!currentUser || !selectedDisciplineId || !selectedTopicId) return;

    // Unique ID logic must match Dashboard
    const uniqueTopicId = `${selectedDisciplineId}-${selectedTopicId}`;
    let newCompleted = [...(currentUser.completedTopics || [])];
    
    if (newCompleted.includes(uniqueTopicId)) {
      newCompleted = newCompleted.filter(id => id !== uniqueTopicId);
    } else {
      newCompleted.push(uniqueTopicId);
    }

    const updatedUser = { ...currentUser, completedTopics: newCompleted };
    setCurrentUser(updatedUser);
    storageService.updateUser(updatedUser); // This saves to "Cloud" (localStorage) immediately
  };

  const getDisciplineDetails = () => {
    if (!activeCourse || !selectedDisciplineId) return null;
    for (const area of activeCourse.areas) {
        const disc = area.disciplines.find(d => d.id === selectedDisciplineId);
        if (disc) return disc;
    }
    return null;
  };

  const discipline = getDisciplineDetails();

  if (!currentUser) return null; // Wait for init

  return (
    <Layout activeCourse={activeCourse?.id} onNavigate={navigate} currentUser={currentUser}>
      
      {/* Home Page */}
      {isHome && (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-8 animate-fade-in">
          <h1 className="text-5xl font-extrabold text-slate-800 tracking-tight mb-4">
            Sua Faculdade Digital de<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-sky-600">
              Ciências Agrárias
            </span>
          </h1>
          <p className="text-xl text-slate-500 max-w-2xl">
            Bem-vindo ao portal de conhecimento integrado. Acesse conteúdos completos, didáticos e interativos.
          </p>
          <div className="grid md:grid-cols-3 gap-6 w-full max-w-4xl mt-8">
             <button onClick={() => navigate('/course/agronomia')} className="group p-8 rounded-2xl bg-white border border-emerald-100 shadow-lg hover:shadow-xl hover:border-emerald-300 transition-all text-left">
               <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                 <span className="text-2xl">🌱</span>
               </div>
               <h3 className="text-xl font-bold text-slate-800 mb-2">Agronomia</h3>
               <p className="text-sm text-slate-500">Produção vegetal, solos e engenharia rural.</p>
             </button>

             <button onClick={() => navigate('/course/zootecnia')} className="group p-8 rounded-2xl bg-white border border-amber-100 shadow-lg hover:shadow-xl hover:border-amber-300 transition-all text-left">
               <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                 <span className="text-2xl">🐄</span>
               </div>
               <h3 className="text-xl font-bold text-slate-800 mb-2">Zootecnia</h3>
               <p className="text-sm text-slate-500">Nutrição, produção e bem-estar animal.</p>
             </button>

             <button onClick={() => navigate('/course/veterinaria')} className="group p-8 rounded-2xl bg-white border border-sky-100 shadow-lg hover:shadow-xl hover:border-sky-300 transition-all text-left">
               <div className="w-12 h-12 bg-sky-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                 <span className="text-2xl">🩺</span>
               </div>
               <h3 className="text-xl font-bold text-slate-800 mb-2">Medicina Veterinária</h3>
               <p className="text-sm text-slate-500">Clínica, cirurgia e saúde pública.</p>
             </button>
          </div>
        </div>
      )}

      {/* Course Dashboard */}
      {activeCourse && !selectedDisciplineId && (
        <Dashboard 
           course={activeCourse} 
           onSelectDiscipline={handleSelectDiscipline} 
           completedTopics={currentUser.completedTopics || []}
        />
      )}

      {/* Discipline View (Topic List) */}
      {activeCourse && discipline && !selectedTopicId && (
        <div className="animate-fade-in max-w-4xl mx-auto">
          <button onClick={() => navigate(`/course/${activeCourse.id}`)} className="mb-6 text-sm text-slate-500 hover:text-slate-800 transition-colors">← Voltar para o Painel</button>
          
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 mb-8">
            <div className="flex items-center gap-4 mb-6">
               <div className={`p-3 rounded-xl ${
                 activeCourse.id === 'agronomia' ? 'bg-emerald-100 text-emerald-700' :
                 activeCourse.id === 'zootecnia' ? 'bg-amber-100 text-amber-700' :
                 'bg-sky-100 text-sky-700'
               }`}>
                 <span className="text-3xl font-bold">{discipline.name.charAt(0)}</span>
               </div>
               <div>
                 <h1 className="text-3xl font-bold text-slate-900">{discipline.name}</h1>
                 <span className="text-sm font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full">{discipline.level}</span>
               </div>
            </div>

            <p className="text-slate-600 mb-8 leading-relaxed">
              Esta disciplina aborda os conceitos fundamentais e aplicados de {discipline.name}. 
              Selecione um tópico abaixo para acessar o material didático completo gerado pela nossa IA especializada.
            </p>

            <div className="grid gap-4">
              {discipline.topics.map((topic, index) => {
                const uniqueTopicId = `${discipline.id}-${topic.id}`;
                const isDone = (currentUser.completedTopics || []).includes(uniqueTopicId);
                
                return (
                  <button 
                    key={topic.id}
                    onClick={() => handleSelectTopic(topic)}
                    className={`flex items-center justify-between p-4 rounded-xl transition-all group text-left border ${
                       isDone ? 'bg-green-50 border-green-200' : 'bg-slate-50 hover:bg-white hover:shadow-md border-slate-200'
                    }`}
                  >
                    <div className="flex items-center">
                      <div className={`w-8 h-8 rounded-full border flex items-center justify-center text-sm font-bold mr-4 transition-colors ${
                         isDone ? 'bg-green-100 border-green-300 text-green-700' : 'bg-white border-slate-200 text-slate-400 group-hover:border-slate-400 group-hover:text-slate-600'
                      }`}>
                        {isDone ? <CheckCircle className="w-5 h-5" /> : index + 1}
                      </div>
                      <span className={`font-medium text-lg ${isDone ? 'text-green-800' : 'text-slate-700 group-hover:text-slate-900'}`}>{topic.name}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Topic Content View (Gemini Integration) */}
      {activeCourse && discipline && selectedTopicId && (
        <TopicViewer 
          courseName={activeCourse.name}
          disciplineName={discipline.name}
          topicName={selectedTopicName}
          topicId={selectedTopicId}
          disciplineId={discipline.id}
          isCompleted={(currentUser.completedTopics || []).includes(`${discipline.id}-${selectedTopicId}`)}
          onToggleComplete={handleToggleTopic}
          onBack={() => {
            setSelectedTopicId(null);
            setSelectedTopicName('');
          }}
        />
      )}

    </Layout>
  );
}
