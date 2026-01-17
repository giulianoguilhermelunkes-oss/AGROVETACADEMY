import { Course } from './types';

// Generic topics to populate disciplines
const standardTopics = [
  { id: 'conceitos', name: 'Conceitos e Definições' },
  { id: 'historico', name: 'Histórico e Importância' },
  { id: 'anatomia-fisiologia', name: 'Aspectos Morfofisiológicos' },
  { id: 'processos', name: 'Processos e Mecanismos' },
  { id: 'manejo', name: 'Manejo e Práticas' },
  { id: 'tecnologias', name: 'Tecnologias Aplicadas' },
  { id: 'estudo-caso', name: 'Estudos de Caso' },
  { id: 'legislacao', name: 'Legislação e Ética' }
];

export const COURSES: Course[] = [
  {
    id: 'agronomia',
    name: 'Agronomia',
    description: 'Ciência e tecnologia na produção vegetal, manejo do solo e engenharia rural.',
    color: 'emerald',
    areas: [
      {
        id: 'ciclo-basico',
        name: 'Ciclo Básico',
        disciplines: [
          { id: 'botanica', name: 'Botânica Geral e Sistemática', level: 'Básico', topics: standardTopics },
          { id: 'bioquimica', name: 'Bioquímica', level: 'Básico', topics: standardTopics },
          { id: 'genetica', name: 'Genética', level: 'Básico', topics: standardTopics },
          { id: 'estatistica', name: 'Estatística e Experimentação', level: 'Básico', topics: standardTopics }
        ]
      },
      {
        id: 'solo',
        name: 'Ciência do Solo',
        disciplines: [
          { id: 'microbiologia-solo', name: 'Microbiologia do Solo', level: 'Intermediário', topics: standardTopics },
          { id: 'genesesolo', name: 'Gênese e Classificação de Solos', level: 'Intermediário', topics: standardTopics },
          { id: 'fertilidade', name: 'Fertilidade e Adubação', level: 'Intermediário', topics: standardTopics },
          { id: 'manejo-conservacao', name: 'Manejo e Conservação do Solo', level: 'Avançado', topics: standardTopics }
        ]
      },
      {
        id: 'fitotecnia',
        name: 'Produção Vegetal',
        disciplines: [
          { id: 'fisiologia-veg', name: 'Fisiologia Vegetal', level: 'Intermediário', topics: standardTopics },
          { id: 'grandes-culturas', name: 'Grandes Culturas (Soja, Milho, Trigo)', level: 'Avançado', topics: standardTopics },
          { id: 'fruticultura', name: 'Fruticultura', level: 'Avançado', topics: standardTopics },
          { id: 'olericultura', name: 'Olericultura', level: 'Avançado', topics: standardTopics },
          { id: 'sementes', name: 'Tecnologia de Sementes', level: 'Avançado', topics: standardTopics }
        ]
      },
      {
        id: 'protecao',
        name: 'Proteção de Plantas',
        disciplines: [
          { id: 'fitopatologia', name: 'Fitopatologia', level: 'Intermediário', topics: standardTopics },
          { id: 'entomologia', name: 'Entomologia Agrícola', level: 'Intermediário', topics: standardTopics },
          { id: 'plantas-daninhas', name: 'Plantas Daninhas e Matologia', level: 'Intermediário', topics: standardTopics },
          { id: 'mip', name: 'Manejo Integrado de Pragas (MIP)', level: 'Avançado', topics: standardTopics }
        ]
      },
      {
        id: 'eng-rural',
        name: 'Engenharia Rural',
        disciplines: [
          { id: 'mecanizacao', name: 'Máquinas e Mecanização', level: 'Intermediário', topics: standardTopics },
          { id: 'topografia', name: 'Topografia e Geoprocessamento', level: 'Intermediário', topics: standardTopics },
          { id: 'irrigacao', name: 'Irrigação e Drenagem', level: 'Avançado', topics: standardTopics }
        ]
      },
      {
        id: 'economia',
        name: 'Economia e Gestão',
        disciplines: [
          { id: 'extensao', name: 'Extensão Rural', level: 'Intermediário', topics: standardTopics },
          { id: 'admin-rural', name: 'Administração Rural', level: 'Avançado', topics: standardTopics }
        ]
      }
    ]
  },
  {
    id: 'zootecnia',
    name: 'Zootecnia',
    description: 'Produção animal, nutrição, melhoramento genético e bem-estar.',
    color: 'amber',
    areas: [
      {
        id: 'basico-zoo',
        name: 'Ciclo Básico',
        disciplines: [
          { id: 'anatomia-animal', name: 'Anatomia Animal', level: 'Básico', topics: standardTopics },
          { id: 'fisiologia-animal', name: 'Fisiologia Animal', level: 'Básico', topics: standardTopics },
          { id: 'genetica-animal', name: 'Genética', level: 'Básico', topics: standardTopics },
          { id: 'bioquimica-zoo', name: 'Bioquímica', level: 'Básico', topics: standardTopics }
        ]
      },
      {
        id: 'nutricao',
        name: 'Nutrição e Alimentação',
        disciplines: [
          { id: 'nutricao-basica', name: 'Nutrição Animal Básica', level: 'Intermediário', topics: standardTopics },
          { id: 'bromatologia', name: 'Avaliação de Alimentos', level: 'Intermediário', topics: standardTopics },
          { id: 'forragicultura', name: 'Forragicultura e Pastagens', level: 'Intermediário', topics: standardTopics },
          { id: 'ruminantes-nutri', name: 'Nutrição de Ruminantes', level: 'Avançado', topics: standardTopics },
          { id: 'monogastricos-nutri', name: 'Nutrição de Monogástricos', level: 'Avançado', topics: standardTopics }
        ]
      },
      {
        id: 'producao',
        name: 'Sistemas de Produção',
        disciplines: [
          { id: 'bovino-corte', name: 'Bovinocultura de Corte', level: 'Avançado', topics: standardTopics },
          { id: 'bovino-leite', name: 'Bovinocultura de Leite', level: 'Avançado', topics: standardTopics },
          { id: 'avicultura', name: 'Avicultura', level: 'Avançado', topics: standardTopics },
          { id: 'suinocultura', name: 'Suinocultura', level: 'Avançado', topics: standardTopics },
          { id: 'piscicultura', name: 'Piscicultura', level: 'Avançado', topics: standardTopics }
        ]
      },
      {
        id: 'reproducao',
        name: 'Reprodução e Melhoramento',
        disciplines: [
          { id: 'reproducao-animal', name: 'Reprodução Animal', level: 'Intermediário', topics: standardTopics },
          { id: 'biotec-repro', name: 'Biotecnologia da Reprodução', level: 'Avançado', topics: standardTopics },
          { id: 'melhoramento', name: 'Melhoramento Genético Animal', level: 'Avançado', topics: standardTopics }
        ]
      },
      {
        id: 'tecnologia',
        name: 'Tecnologia de Produtos',
        disciplines: [
          { id: 'qualidade-carne', name: 'Qualidade de Carne', level: 'Intermediário', topics: standardTopics },
          { id: 'qualidade-leite', name: 'Qualidade do Leite', level: 'Intermediário', topics: standardTopics }
        ]
      }
    ]
  },
  {
    id: 'veterinaria',
    name: 'Medicina Veterinária',
    description: 'Saúde animal, clínica médica e cirúrgica, e saúde pública.',
    color: 'sky',
    areas: [
      {
        id: 'basico-vet',
        name: 'Ciclo Básico',
        disciplines: [
          { id: 'anatomia-vet', name: 'Anatomia Veterinária', level: 'Básico', topics: standardTopics },
          { id: 'fisiologia-vet', name: 'Fisiologia Veterinária', level: 'Básico', topics: standardTopics },
          { id: 'histologia', name: 'Histologia e Embriologia', level: 'Básico', topics: standardTopics },
          { id: 'imunologia', name: 'Imunologia', level: 'Intermediário', topics: standardTopics },
          { id: 'farmacologia', name: 'Farmacologia Veterinária', level: 'Intermediário', topics: standardTopics }
        ]
      },
      {
        id: 'patologia',
        name: 'Patologia e Diagnóstico',
        disciplines: [
          { id: 'patologia-geral', name: 'Patologia Geral', level: 'Intermediário', topics: standardTopics },
          { id: 'patologia-clinica', name: 'Patologia Clínica', level: 'Intermediário', topics: standardTopics },
          { id: 'diagnostico-imagem', name: 'Diagnóstico por Imagem', level: 'Intermediário', topics: standardTopics },
          { id: 'parasitologia', name: 'Parasitologia Veterinária', level: 'Intermediário', topics: standardTopics },
          { id: 'microbiologia-vet', name: 'Microbiologia Veterinária', level: 'Intermediário', topics: standardTopics }
        ]
      },
      {
        id: 'clinica',
        name: 'Clínica e Cirurgia',
        disciplines: [
          { id: 'semiologia', name: 'Semiologia', level: 'Intermediário', topics: standardTopics },
          { id: 'clinica-pequenos', name: 'Clínica de Pequenos Animais', level: 'Avançado', topics: standardTopics },
          { id: 'clinica-grandes', name: 'Clínica de Grandes Animais', level: 'Avançado', topics: standardTopics },
          { id: 'cirurgia', name: 'Técnica Cirúrgica e Anestesiologia', level: 'Avançado', topics: standardTopics },
          { id: 'obstetricia', name: 'Obstetrícia e Reprodução', level: 'Avançado', topics: standardTopics }
        ]
      },
      {
        id: 'saude-publica',
        name: 'Saúde Pública e Inspeção',
        disciplines: [
          { id: 'zoonoses', name: 'Zoonoses e Saúde Pública', level: 'Intermediário', topics: standardTopics },
          { id: 'epidemiologia', name: 'Epidemiologia Veterinária', level: 'Intermediário', topics: standardTopics },
          { id: 'inspecao', name: 'Inspeção de Produtos de Origem Animal', level: 'Avançado', topics: standardTopics }
        ]
      }
    ]
  }
];
