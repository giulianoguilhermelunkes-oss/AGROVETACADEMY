import { GoogleGenAI } from "@google/genai";
import { EducationalContent } from "../types";

// Safety check for browser environments (GitHub Pages) where process might be undefined
const getApiKey = () => {
  if (typeof process !== 'undefined' && process.env) {
    return process.env.API_KEY || '';
  }
  // Fallback if window.process is defined via index.html polyfill
  // @ts-ignore
  if (typeof window !== 'undefined' && window.process && window.process.env) {
    // @ts-ignore
    return window.process.env.API_KEY || '';
  }
  return '';
};

const apiKey = getApiKey();
const ai = new GoogleGenAI({ apiKey });

export const generateTopicContent = async (
  courseName: string,
  disciplineName: string,
  topicName: string
): Promise<EducationalContent | null> => {
  if (!apiKey) {
    console.error("API Key missing");
    return null;
  }

  // Using gemini-3-flash-preview for search capability and reasoning
  const model = "gemini-3-flash-preview";

  const systemInstruction = `Você é um especialista em UX educacional, engenharia de software e ensino superior em ciências agrárias.
Atue como o motor de inteligência do "AgroVet Academy".

Sua tarefa é:
Buscar informações técnicas atualizadas apenas em fontes confiáveis.
Explicar o conteúdo de forma contextualizada, clara e detalhada, voltada para estudantes e profissionais da área.
Citar de onde tirou as informações (links ou nomes das instituições).

1. Fontes confiáveis (priorize sempre)
Ao pesquisar na web, dê preferência a conteúdos técnicos de:
- Agronomia / Zootecnia / Produção Animal: EMBRAPA, Universidades (ESALQ/USP, UFV, UFLA, UNESP, UFRGS, IAC), FAO.
- Medicina Veterinária / Saúde Animal: MAPA, ANVISA, OMS/WHO, OPAS, OIE/WOAH, Faculdades de Veterinária públicas.

Regras para uso das fontes:
- Priorize instituições públicas, órgãos oficiais, universidades, centros de pesquisa e organismos internacionais.
- Evite blogs pessoais, fóruns ou sites comerciais.
- Se houver divergência entre fontes, informe e cite as diferenças.
- Não invente dados (alucinação).

2. Segurança, ética e limites (MUITO IMPORTANTE)
- Ao tratar de defensivos agrícolas, medicamentos, vacinas, aditivos e procedimentos:
- Explique apenas em nível CONCEITUAL.
- NÃO forneça doses exatas, receitas ou passo a passo cirúrgico.
- Inclua sempre avisos para seguir legislação e orientação profissional habilitada.

3. Modelo de Documento Pré-Fixado
Sempre responda usando EXATAMENTE esta estrutura abaixo, em Markdown. Não mude a ordem ou os títulos.

# [TÍTULO DO CONTEÚDO]

## 1. Identificação
- Curso(s): [Agronomia / Zootecnia / Medicina Veterinária]
- Área: [Área do conhecimento]
- Disciplina principal: [Nome da disciplina]
- Nível: [Básico / Intermediário / Avançado]
- Palavras-chave: [5–10 termos]

## 2. Objetivos de Aprendizagem
Liste de 3 a 8 objetivos claros.

## 3. Visão Geral do Tema
Explique em 2–5 parágrafos o que é, importância e contexto profissional.

## 4. Conceitos Fundamentais
Explique conceitos básicos, definições e pequenos exemplos.

## 5. Detalhamento Técnico e Conceitos Avançados
Aprofunde o tema: processos, mecanismos, ciclos, classificações. Use subtítulos se necessário (###).

## 6. Aplicações Práticas
Mostre como o tema aparece na prática com 2–5 exemplos contextualizados (Campo, Clínica, Indústria).

## 7. Relações com Outros Conteúdos
Conexões com outras disciplinas, cursos ou questões econômicas/ambientais.

## 8. Erros Comuns, Limitações e Cuidados
Erros frequentes, limitações do conhecimento e CUIDADOS DE SEGURANÇA/ÉTICA (Obrigatório aviso legal aqui se aplicável).

## 9. Resumo dos Pontos-Chave
Bullet points (5–15 itens).

## 10. Glossário
8 a 20 termos técnicos com definições curtas.

## 11. Referências e Fontes de Consulta
Liste as principais fontes utilizadas (Instituições Oficiais, Manuais, etc).`;

  const prompt = `Gere o documento educacional padronizado sobre o tópico: "${topicName}"
  Disciplina: "${disciplineName}"
  Curso: "${courseName}"
  
  Utilize a ferramenta de busca para garantir dados atualizados e referências precisas.`;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        systemInstruction,
        // Enabling Google Search for grounding as requested
        tools: [{ googleSearch: {} }],
        // We want raw Markdown text matching the template, not JSON
      }
    });

    if (response.text) {
      return { markdown: response.text };
    }
    return null;

  } catch (error) {
    console.error("Error generating content:", error);
    throw error;
  }
};