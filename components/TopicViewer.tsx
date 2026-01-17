import React, { useEffect, useState } from 'react';
import { EducationalContent } from '../types';
import { generateTopicContent } from '../services/geminiService';
import { AlertTriangle, Sparkles, Printer, Share2, CheckCircle, Circle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface TopicViewerProps {
  courseName: string;
  disciplineName: string;
  topicName: string;
  topicId: string;
  disciplineId: string;
  isCompleted: boolean;
  onToggleComplete: () => void;
  onBack: () => void;
}

export const TopicViewer: React.FC<TopicViewerProps> = ({ 
  courseName, 
  disciplineName, 
  topicName, 
  topicId,
  disciplineId,
  isCompleted,
  onToggleComplete,
  onBack 
}) => {
  const [content, setContent] = useState<EducationalContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContent = async () => {
      setLoading(true);
      setError(null);
      try {
        // Safe check for API Key existence in browser environment
        const hasKey = (typeof process !== 'undefined' && process.env?.API_KEY) || 
                       // @ts-ignore
                       (typeof window !== 'undefined' && window.process?.env?.API_KEY);

        if (!hasKey) {
          throw new Error("API_KEY environment variable is missing.");
        }
        
        const data = await generateTopicContent(courseName, disciplineName, topicName);
        if (data) {
          setContent(data);
        } else {
          setError("Não foi possível gerar o conteúdo. Tente novamente.");
        }
      } catch (err) {
        setError("Erro ao conectar com o serviço de IA. Verifique sua chave de API.");
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [courseName, disciplineName, topicName]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4 text-center">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-slate-200 rounded w-3/4 mx-auto"></div>
          <div className="h-4 bg-slate-200 rounded w-1/2 mx-auto"></div>
          
          <div className="flex flex-col items-center justify-center my-12 gap-4">
            <div className="relative">
               <div className="absolute inset-0 bg-emerald-500 blur-xl opacity-20 rounded-full animate-pulse"></div>
               <Sparkles className="w-12 h-12 text-emerald-600 animate-spin relative z-10" />
            </div>
            <p className="text-slate-600 font-medium text-lg">Consultando fontes oficiais (Embrapa, Universidades, FAO...)</p>
            <p className="text-slate-400 text-sm">Gerando documento padronizado...</p>
          </div>

          <div className="space-y-4 max-w-2xl mx-auto opacity-50">
            <div className="h-4 bg-slate-200 rounded"></div>
            <div className="h-4 bg-slate-200 rounded"></div>
            <div className="h-4 bg-slate-200 rounded w-5/6"></div>
            <div className="h-4 bg-slate-200 rounded w-4/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !content) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4 text-center">
        <div className="bg-red-50 text-red-700 p-8 rounded-2xl border border-red-100 shadow-sm">
          <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-red-500" />
          <h3 className="text-xl font-bold mb-2">Erro ao carregar documento</h3>
          <p className="mb-6 opacity-80">{error}</p>
          <button onClick={onBack} className="px-6 py-2.5 bg-white border border-red-200 rounded-lg hover:bg-red-50 text-red-700 font-medium transition-colors shadow-sm">
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto animate-fade-in pb-20 px-4 md:px-0">
      {/* Navigation & Tools */}
      <div className="flex justify-between items-center mb-8 sticky top-20 bg-slate-50/90 backdrop-blur-sm py-4 z-40 border-b border-slate-200/50">
        <button onClick={onBack} className="text-sm font-medium text-slate-500 hover:text-emerald-700 flex items-center gap-2 transition-colors px-3 py-2 rounded-lg hover:bg-white">
          ← Voltar para {disciplineName}
        </button>
        
        <div className="flex items-center gap-4">
          <button 
             onClick={onToggleComplete}
             className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all font-medium border shadow-sm ${
               isCompleted 
                 ? 'bg-green-50 border-green-200 text-green-700' 
                 : 'bg-white border-slate-200 text-slate-600 hover:border-emerald-500 hover:text-emerald-600'
             }`}
          >
             {isCompleted ? <CheckCircle className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
             {isCompleted ? 'Concluído' : 'Marcar como Concluído'}
          </button>

          <div className="h-6 w-px bg-slate-200"></div>

          <button className="p-2 text-slate-400 hover:text-slate-700 hover:bg-white rounded-lg transition-colors" title="Imprimir" onClick={() => window.print()}>
            <Printer className="w-5 h-5" />
          </button>
          <button className="p-2 text-slate-400 hover:text-slate-700 hover:bg-white rounded-lg transition-colors" title="Compartilhar">
            <Share2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Document Container */}
      <article className="bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-slate-200">
        <div className="prose prose-slate prose-lg max-w-none 
          prose-headings:font-bold prose-headings:text-slate-800 
          prose-h1:text-4xl prose-h1:text-emerald-900 prose-h1:border-b prose-h1:pb-4 prose-h1:mb-8
          prose-h2:text-2xl prose-h2:text-slate-700 prose-h2:mt-12 prose-h2:mb-6 prose-h2:flex prose-h2:items-center prose-h2:gap-2
          prose-p:text-slate-600 prose-p:leading-relaxed
          prose-li:text-slate-600
          prose-strong:text-slate-900
          prose-blockquote:bg-amber-50 prose-blockquote:border-amber-300 prose-blockquote:text-amber-800 prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:rounded-r-lg prose-blockquote:not-italic
          prose-a:text-emerald-600 prose-a:no-underline hover:prose-a:underline
        ">
          <ReactMarkdown
             components={{
                h2: ({node, ...props}) => <h2 className="border-l-4 border-emerald-500 pl-4" {...props} />,
                table: ({node, ...props}) => <div className="overflow-x-auto my-8 border border-slate-200 rounded-lg"><table className="w-full text-sm text-left" {...props} /></div>,
                thead: ({node, ...props}) => <thead className="bg-slate-50 border-b border-slate-200" {...props} />,
                th: ({node, ...props}) => <th className="px-6 py-3 font-semibold text-slate-700" {...props} />,
                td: ({node, ...props}) => <td className="px-6 py-4 border-b border-slate-100 text-slate-600" {...props} />,
             }}
          >
            {content.markdown}
          </ReactMarkdown>
        </div>
      </article>

      {/* Footer Navigation */}
      <div className="max-w-2xl mx-auto mt-12 flex justify-center">
         <button 
           onClick={onToggleComplete}
           className={`w-full py-4 rounded-xl font-bold text-lg transition-all shadow-md flex items-center justify-center gap-3 ${
             isCompleted 
               ? 'bg-slate-100 text-slate-500 hover:bg-slate-200'
               : 'bg-emerald-600 text-white hover:bg-emerald-700 hover:shadow-lg hover:-translate-y-1'
           }`}
         >
           {isCompleted ? 'Desmarcar Conclusão' : 'Concluir Tópico e Salvar Progresso'}
         </button>
      </div>

    </div>
  );
};