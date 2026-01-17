import React from 'react';
import { Course } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { BookOpen, CheckCircle, FileText } from 'lucide-react';

interface DashboardProps {
  course: Course;
  onSelectDiscipline: (areaId: string, disciplineId: string) => void;
  completedTopics: string[];
}

export const Dashboard: React.FC<DashboardProps> = ({ course, onSelectDiscipline, completedTopics }) => {
  // Calculate real progress based on user data
  const data = course.areas.map(area => {
    let areaTotal = 0;
    let areaCompleted = 0;

    area.disciplines.forEach(disc => {
      areaTotal += disc.topics.length;
      disc.topics.forEach(topic => {
         // Create a unique ID for checking (discId + topicId) to allow same generic topic IDs across disciplines
         // In constants, standardTopics use generic IDs. In a real DB these would be unique.
         // For this mockup, we check if the composite key is in the user's completed list
         const uniqueTopicId = `${disc.id}-${topic.id}`;
         if (completedTopics.includes(uniqueTopicId)) {
           areaCompleted++;
         }
      });
    });

    return {
      name: area.name.split(' ')[0], // Short name
      total: areaTotal,
      completed: areaCompleted,
      percentage: areaTotal > 0 ? Math.round((areaCompleted / areaTotal) * 100) : 0
    };
  });

  const themeColor = 
    course.id === 'agronomia' ? '#059669' : 
    course.id === 'zootecnia' ? '#d97706' : '#0284c7';

  const totalTopics = course.areas.reduce((acc, area) => {
    return acc + area.disciplines.reduce((dAcc, disc) => dAcc + disc.topics.length, 0);
  }, 0);

  const totalCompleted = data.reduce((acc, item) => acc + item.completed, 0);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Banner */}
      <div className={`rounded-3xl p-8 text-white shadow-xl bg-gradient-to-r ${
        course.id === 'agronomia' ? 'from-emerald-600 to-teal-500' :
        course.id === 'zootecnia' ? 'from-amber-500 to-orange-600' :
        'from-sky-600 to-blue-600'
      }`}>
        <h1 className="text-4xl font-bold mb-2">{course.name}</h1>
        <p className="opacity-90 text-lg max-w-2xl">{course.description}</p>
        
        <div className="flex gap-6 mt-8">
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 flex items-center gap-3">
            <BookOpen className="w-6 h-6" />
            <div>
              <p className="text-xs opacity-75">Disciplinas</p>
              <p className="font-bold text-xl">{course.areas.reduce((acc, a) => acc + a.disciplines.length, 0)}</p>
            </div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 flex items-center gap-3">
            <FileText className="w-6 h-6" />
            <div>
              <p className="text-xs opacity-75">Progresso Geral</p>
              <p className="font-bold text-xl">{totalCompleted} / {totalTopics}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Area: Discipline List */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-2xl font-bold text-slate-800">Currículo & Áreas</h2>
          
          {course.areas.map((area) => (
            <div key={area.id} className="bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-md transition-shadow">
              <h3 className="text-xl font-bold text-slate-700 mb-4 flex items-center gap-2">
                <span className={`w-2 h-8 rounded-full ${
                    course.id === 'agronomia' ? 'bg-emerald-500' :
                    course.id === 'zootecnia' ? 'bg-amber-500' :
                    'bg-sky-500'
                }`}></span>
                {area.name}
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                {area.disciplines.map((disc) => {
                  // Calculate discipline progress
                  const discTotal = disc.topics.length;
                  const discCompleted = disc.topics.filter(t => completedTopics.includes(`${disc.id}-${t.id}`)).length;
                  const isComplete = discCompleted === discTotal && discTotal > 0;

                  return (
                    <button 
                      key={disc.id}
                      onClick={() => onSelectDiscipline(area.id, disc.id)}
                      className="flex flex-col items-start p-4 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-100 transition-colors w-full text-left group"
                    >
                      <div className="flex justify-between w-full mb-2">
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                          disc.level === 'Básico' ? 'bg-green-100 text-green-700' :
                          disc.level === 'Intermediário' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {disc.level}
                        </span>
                        {isComplete && <CheckCircle className="w-4 h-4 text-green-500" />}
                      </div>
                      <span className="font-medium text-slate-700 group-hover:text-slate-900">{disc.name}</span>
                      <div className="w-full mt-2 flex items-center justify-between">
                         <span className="text-xs text-slate-500">{discCompleted}/{discTotal} tópicos</span>
                         <div className="w-20 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full transition-all duration-500 ${themeColor === '#059669' ? 'bg-emerald-500' : themeColor === '#d97706' ? 'bg-amber-500' : 'bg-sky-500'}`} 
                              style={{ width: `${(discCompleted / discTotal) * 100}%` }}
                            ></div>
                         </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Sidebar: Stats */}
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Meu Progresso por Área</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                  <XAxis type="number" hide domain={[0, 'dataMax']} />
                  <YAxis dataKey="name" type="category" width={80} tick={{fontSize: 12, fill: '#64748b'}} />
                  <Tooltip 
                    cursor={{fill: '#f1f5f9'}}
                    contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                    formatter={(value: number, name: string, props: any) => [`${value} tópicos`, 'Concluído']}
                  />
                  <Bar dataKey="completed" radius={[0, 4, 4, 0]} barSize={20}>
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={themeColor} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6">
            <h3 className="font-bold text-blue-900 mb-2">Dica do Dia</h3>
            <p className="text-sm text-blue-800">
              Revise os conceitos de Bioquímica antes de iniciar Fisiologia. A base molecular facilita o entendimento dos processos sistêmicos.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
