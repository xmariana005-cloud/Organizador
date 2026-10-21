import React, { useState } from 'react';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend
} from 'recharts';
import { 
  LayoutDashboard, GraduationCap, BookOpen, Scale, Award, 
  Calendar, ExternalLink, CheckCircle2, Circle, Clock, Target, 
  Plus, Edit, User, Mail, ChevronRight, BarChart2
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showAddStudyModal, setShowAddStudyModal] = useState(false);
  const [showAddQuestionModal, setShowAddQuestionModal] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState('all');

  // Dados do gráfico inicial
  const [studyData, setStudyData] = useState([
    { name: 'Faculdade', hours: 14, color: '#c084fc' },
    { name: 'TCC', hours: 8, color: '#a855f7' },
    { name: 'Concurso Público', hours: 18, color: '#9333ea' },
    { name: 'OAB 2ª Fase', hours: 22, color: '#e9d5ff' },
  ]);

  // Cronograma OAB 2ª Fase (Direito do Trabalho) extraído do PDF Gran
  const [oabSchedule, setOabSchedule] = useState([
    // Novembro/2026
    { id: 1, month: 'Nov', date: '16/11 - Seg', module: 'Módulo 1. Plano de Aprovação', title: '1 - Linha do Tempo na Fase de Conhecimento', type: 'Videoaula', done: true },
    { id: 2, month: 'Nov', date: '16/11 - Seg', module: 'Módulo 1. Plano de Aprovação', title: '2 - Linha do Tempo na Fase de Conhecimento II', type: 'Videoaula', done: true },
    { id: 3, month: 'Nov', date: '16/11 - Seg', module: 'Módulo 2. Mais Conteúdo', title: '1 - Verbas Rescisórias', type: 'Videoaula', done: false },
    { id: 4, month: 'Nov', date: '16/11 - Seg', module: 'Módulo 2. Mais Conteúdo', title: '2 - Verbas Rescisórias II', type: 'Videoaula', done: false },
    { id: 5, month: 'Nov', date: '18/11 - Qua', module: 'Módulo 1. Plano de Aprovação', title: '1 - Reclamação Trabalhista - Passo a Passo', type: 'Videoaula', done: false },
    { id: 6, month: 'Nov', date: '30/11 - Seg', module: 'Módulo 1. Plano de Aprovação', title: '1 - Contestação passo a passo - 1ª parte', type: 'Videoaula', done: false },
    { id: 7, month: 'Nov', date: '30/11 - Seg', module: 'Módulo 1. Plano de Aprovação', title: '2 - Contestação passo a passo - 2ª parte', type: 'Videoaula', done: false },
    
    // Dezembro/2026
    { id: 8, month: 'Dez', date: '02/12 - Qua', module: 'Módulo 1. Plano de Aprovação', title: '3 - Contestação passo a passo - 3ª parte', type: 'Videoaula', done: false },
    { id: 9, month: 'Dez', date: '04/12 - Sex', module: 'Módulo 2. Mais Conteúdo', title: '15 - Estabilidade Provisória', type: 'Videoaula', done: false },
    { id: 10, month: 'Dez', date: '10/12 - Qui', module: 'Módulo 1. Plano de Aprovação', title: '1 - Recurso Adesivo: Identificação e Estrutura', type: 'Videoaula', done: false },
    { id: 11, month: 'Dez', date: '17/12 - Qui', module: 'Módulo 1. Plano de Aprovação', title: '1 - Exercício de Impugnação à Sentença de Liquidação', type: 'Videoaula', done: false },
    
    // Janeiro/2027
    { id: 12, month: 'Jan', date: '05/01 - Ter', module: 'Módulo 1. Plano de Aprovação', title: '1 - Ações Possessórias - Passo a Passo', type: 'Videoaula', done: false },
    { id: 13, month: 'Jan', date: '05/01 - Ter', module: 'Módulo 1. Plano de Aprovação', title: '3 - Dissídio Coletivo - Teoria', type: 'Videoaula', done: false },
    { id: 14, month: 'Jan', date: '07/01 - Qui', module: 'Módulo 1. Plano de Aprovação', title: '1 - Ação Monitória e Embargos à Ação Monitória', type: 'Videoaula', done: false },
    { id: 15, month: 'Jan', date: '15/01 - Sex', module: 'Módulo 2. Mais Conteúdo', title: '40 - Mandado de Segurança e Tutelas de Urgência', type: 'Videoaula', done: false },
  ]);

  const toggleOabLesson = (id) => {
    setOabSchedule(prev => prev.map(item => {
      if (item.id === id) {
        const updatedDone = !item.done;
        // Atualizar também o gráfico inicial de horas da OAB
        setStudyData(data => data.map(d => d.name === 'OAB 2ª Fase' ? { ...d, hours: d.hours + (updatedDone ? 0.5 : -0.5) } : d));
        return { ...item, done: updatedDone };
      }
      return item;
    }));
  };

  const totalOabLessons = oabSchedule.length;
  const completedOabLessons = oabSchedule.filter(i => i.done).length;
  const oabProgress = Math.round((completedOabLessons / totalOabLessons) * 100);

  const filteredOabSchedule = selectedMonth === 'all' 
    ? oabSchedule 
    : oabSchedule.filter(item => item.month === selectedMonth);

  const totalHours = studyData.reduce((acc, curr) => acc + curr.hours, 0);

  return (
    <div className="flex h-screen bg-black text-gray-100 font-sans overflow-hidden">
      
      {/* BARRA LATERAL DE NAVEGAÇÃO (SIDEBAR) */}
      <aside className="w-64 bg-zinc-950 border-r border-zinc-800 flex flex-col justify-between">
        <div>
          {/* Topo / Logo */}
          <div className="p-6 border-b border-zinc-800 flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-purple-600 flex items-center justify-center font-bold text-black text-lg shadow-lg shadow-purple-500/20">
              ⚡
            </div>
            <div>
              <h1 className="font-bold text-white text-base leading-tight">Central de Estudos</h1>
              <p className="text-xs text-purple-400 font-medium">Modo Foco Operacional</p>
            </div>
          </div>

          {/* Menus de Navegação */}
          <nav className="p-4 space-y-1">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-purple-950/80 text-purple-300 border border-purple-800/50 shadow-inner'
                  : 'text-zinc-400 hover:bg-zinc-900 hover:text-white'
              }`}
            >
              <LayoutDashboard size={18} />
              <span>Início & Visão Geral</span>
            </button>

            <button
              onClick={() => setActiveTab('oab')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'oab'
                  ? 'bg-purple-950/80 text-purple-300 border border-purple-800/50 shadow-inner'
                  : 'text-zinc-400 hover:bg-zinc-900 hover:text-white'
              }`}
            >
              <Award size={18} />
              <div className="flex-1 text-left flex items-center justify-between">
                <span>OAB 2ª Fase</span>
                <span className="text-xs bg-purple-900 text-purple-200 px-2 py-0.5 rounded-full font-bold">{oabProgress}%</span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab('concurso')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'concurso'
                  ? 'bg-purple-950/80 text-purple-300 border border-purple-800/50 shadow-inner'
                  : 'text-zinc-400 hover:bg-zinc-900 hover:text-white'
              }`}
            >
              <Scale size={18} />
              <span>Concurso Público</span>
            </button>

            <button
              onClick={() => setActiveTab('faculdade')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'faculdade'
                  ? 'bg-purple-950/80 text-purple-300 border border-purple-800/50 shadow-inner'
                  : 'text-zinc-400 hover:bg-zinc-900 hover:text-white'
              }`}
            >
              <GraduationCap size={18} />
              <span>Faculdade & Prazos</span>
            </button>

            <button
              onClick={() => setActiveTab('tcc')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'tcc'
                  ? 'bg-purple-950/80 text-purple-300 border border-purple-800/50 shadow-inner'
                  : 'text-zinc-400 hover:bg-zinc-900 hover:text-white'
              }`}
            >
              <BookOpen size={18} />
              <span>TCC</span>
            </button>

            <button
              onClick={() => setActiveTab('agenda')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'agenda'
                  ? 'bg-purple-950/80 text-purple-300 border border-purple-800/50 shadow-inner'
                  : 'text-zinc-400 hover:bg-zinc-900 hover:text-white'
              }`}
            >
              <Calendar size={18} />
              <span>Agenda & Gmail</span>
            </button>
          </nav>
        </div>

        {/* Rodapé do Perfil */}
        <div className="p-4 border-t border-zinc-800">
          <div className="flex items-center space-x-3 px-2 py-2">
            <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-purple-400 border border-purple-500/30">
              <User size={16} />
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-xs font-semibold text-white truncate">Estudante de Direito</p>
              <p className="text-[10px] text-zinc-400 truncate">Foco: OAB + Concursos</p>
            </div>
          </div>
        </div>
      </aside>

      {/* ÁREA PRINCIPAL DE CONTEÚDO */}
      <main className="flex-1 flex flex-col bg-zinc-900 overflow-y-auto">
        
        {/* Cabeçalho Superior */}
        <header className="h-16 border-b border-zinc-800 px-8 flex items-center justify-between bg-zinc-950/50 backdrop-blur-md sticky top-0 z-10">
          <div>
            <h2 className="text-lg font-bold text-white capitalize">
              {activeTab === 'dashboard' && 'Visão Geral dos Estudos'}
              {activeTab === 'oab' && 'OAB 2ª Fase — Direito do Trabalho'}
              {activeTab === 'concurso' && 'Concurso Público'}
              {activeTab === 'faculdade' && 'Faculdade & Portais Acadêmicos'}
              {activeTab === 'tcc' && 'Desenvolvimento do TCC'}
              {activeTab === 'agenda' && 'Google Calendar & Comunicação'}
            </h2>
          </div>

          <div className="flex items-center space-x-3">
            <button 
              onClick={() => setShowAddStudyModal(true)}
              className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-xl text-xs font-semibold transition-all shadow-lg shadow-purple-600/20"
            >
              <Plus size={14} />
              <span>Registrar Estudo</span>
            </button>
          </div>
        </header>

        {/* CONTEÚDO PRINCIPAL (MUDANÇA DE ABAS) */}
        <div className="p-8 max-w-7xl mx-auto w-full space-y-8">
          
          {/* 1. TELA INICIAL / DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div className="space-y-8">
              
              {/* Card Destaque Central com Gráfico Donut */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Gráfico Donut Central */}
                <div className="lg:col-span-2 bg-zinc-950 border border-zinc-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-base font-bold text-white">Distribuição do Tempo de Estudo</h3>
                      <p className="text-xs text-zinc-400">Total acumulado: {totalHours} horas</p>
                    </div>
                    <span className="text-xs font-bold bg-purple-950 text-purple-300 border border-purple-800/50 px-3 py-1 rounded-full">
                      Média Diária: 4.2h
                    </span>
                  </div>

                  <div className="h-72 w-full flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={studyData}
                          cx="50%"
                          cy="50%"
                          innerRadius={70}
                          outerRadius={105}
                          paddingAngle={5}
                          dataKey="hours"
                        >
                          {studyData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} stroke="#000" strokeWidth={2} />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '12px', color: '#fff' }}
                        />
                        <Legend verticalAlign="bottom" height={36} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Métricas e Resumos Laterais */}
                <div className="space-y-4 flex flex-col justify-between">
                  <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-zinc-400">Progresso OAB 2ª Fase</span>
                      <Award size={16} className="text-purple-400" />
                    </div>
                    <p className="text-2xl font-bold text-white mt-2">{oabProgress}%</p>
                    <div className="w-full bg-zinc-800 h-2 rounded-full mt-3 overflow-hidden">
                      <div className="bg-purple-500 h-full transition-all duration-500" style={{ width: `${oabProgress}%` }}></div>
                    </div>
                    <p className="text-[10px] text-zinc-500 mt-2">{completedOabLessons} de {totalOabLessons} aulas concluídas do Gran</p>
                  </div>

                  <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-zinc-400">Taxa de Acerto em Questões</span>
                      <Target size={16} className="text-purple-400" />
                    </div>
                    <p className="text-2xl font-bold text-purple-400 mt-2">78.5%</p>
                    <p className="text-[10px] text-zinc-500 mt-1">240 questões resolvidas esta semana</p>
                  </div>

                  <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-zinc-400">Próxima Entrega / Prova</span>
                      <Clock size={16} className="text-purple-400" />
                    </div>
                    <p className="text-sm font-semibold text-white mt-2">Entrega Cap. 2 - TCC</p>
                    <p className="text-xs text-purple-400 font-medium">Em 4 dias</p>
                  </div>
                </div>
              </div>

              {/* Acesso Rápido aos Setores */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                  { title: 'OAB 2ª Fase', desc: 'Direito do Trabalho', icon: Award, tab: 'oab', color: 'border-purple-800/40' },
                  { title: 'Concurso Público', desc: 'Edital e Simulados', icon: Scale, tab: 'concurso', color: 'border-zinc-800' },
                  { title: 'Faculdade', desc: 'Brightspace & Jacad', icon: GraduationCap, tab: 'faculdade', color: 'border-zinc-800' },
                  { title: 'TCC', desc: 'Cronograma e Escrita', icon: BookOpen, tab: 'tcc', color: 'border-zinc-800' },
                ].map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveTab(item.tab)}
                    className={`bg-zinc-950 border ${item.color} hover:border-purple-600/50 p-5 rounded-2xl text-left transition-all group`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <item.icon size={20} className="text-purple-400 group-hover:scale-110 transition-transform" />
                      <ChevronRight size={16} className="text-zinc-600 group-hover:text-purple-400" />
                    </div>
                    <h4 className="text-sm font-bold text-white">{item.title}</h4>
                    <p className="text-xs text-zinc-400 mt-0.5">{item.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 2. OAB 2ª FASE (CRONOGRAMA DO GRAN) */}
          {activeTab === 'oab' && (
            <div className="space-y-6">
              
              {/* Banner Rápido */}
              <div className="bg-gradient-to-r from-purple-950/80 to-zinc-950 border border-purple-800/50 rounded-2xl p-6 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white">48º Exame de Ordem — Direito do Trabalho</h3>
                  <p className="text-xs text-purple-300 mt-1">Cronograma de Aulas extraído diretamente do Gran Cursos Online</p>
                </div>
                <a
                  href="https://www.grancursosonline.com.br/aluno/curso/s/2-fase-oab-48-exame-direito-do-trabalho"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-500 text-white text-xs px-4 py-2.5 rounded-xl font-semibold transition-all"
                >
                  <span>Abrir no Gran</span>
                  <ExternalLink size={14} />
                </a>
              </div>

              {/* Filtros por Mês */}
              <div className="flex items-center justify-between">
                <div className="flex space-x-2">
                  {[
                    { label: 'Todas as Aulas', value: 'all' },
                    { label: 'Novembro/2026', value: 'Nov' },
                    { label: 'Dezembro/2026', value: 'Dez' },
                    { label: 'Janeiro/2027', value: 'Jan' },
                  ].map((f) => (
                    <button
                      key={f.value}
                      onClick={() => setSelectedMonth(f.value)}
                      className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                        selectedMonth === f.value
                          ? 'bg-purple-600 text-white'
                          : 'bg-zinc-950 text-zinc-400 border border-zinc-800 hover:text-white'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-zinc-400 font-medium">Exibindo {filteredOabSchedule.length} aulas</p>
              </div>

              {/* Lista de Checklists das Aulas */}
              <div className="bg-zinc-950 border border-zinc-800 rounded-2xl divide-y divide-zinc-800/60 overflow-hidden">
                {filteredOabSchedule.map((lesson) => (
                  <div 
                    key={lesson.id}
                    onClick={() => toggleOabLesson(lesson.id)}
                    className="p-4 flex items-center justify-between hover:bg-zinc-900/50 cursor-pointer transition-all group"
                  >
                    <div className="flex items-center space-x-4">
                      {lesson.done ? (
                        <CheckCircle2 size={20} className="text-purple-400 flex-shrink-0" />
                      ) : (
                        <Circle size={20} className="text-zinc-600 group-hover:text-purple-400 flex-shrink-0" />
                      )}
                      <div>
                        <p className={`text-sm font-semibold ${lesson.done ? 'line-through text-zinc-500' : 'text-white'}`}>
                          {lesson.title}
                        </p>
                        <p className="text-[11px] text-zinc-400 mt-0.5">
                          <span className="text-purple-400 font-medium">{lesson.date}</span> • {lesson.module}
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] bg-zinc-900 border border-zinc-800 px-2.5 py-1 rounded-md text-zinc-400">
                      {lesson.type}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3. FACULDADE & PORTAIS */}
          {activeTab === 'faculdade' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Portal Brightspace */}
                <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-white text-base">UniDon Brightspace</h3>
                      <GraduationCap className="text-purple-400" size={20} />
                    </div>
                    <p className="text-xs text-zinc-400 mt-1">Acesse disciplinas, fóruns e entregas acadêmicas.</p>
                  </div>
                  <a
                    href="https://unidon.brightspace.com/d2l/home"
                    target="_blank"
                    rel="noreferrer"
                    className="w-full flex items-center justify-center space-x-2 bg-purple-600 hover:bg-purple-500 text-white text-xs py-3 rounded-xl font-semibold transition-all"
                  >
                    <span>Acessar Brightspace</span>
                    <ExternalLink size={14} />
                  </a>
                </div>

                {/* Portal JACAD */}
                <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-white text-base">Jacad Don Domenico</h3>
                      <Calendar className="text-purple-400" size={20} />
                    </div>
                    <p className="text-xs text-zinc-400 mt-1">Calendário acadêmico, faltas e boletim oficial.</p>
                  </div>
                  <a
                    href="https://dondomenico.jacad.com.br/calendario/visualiza/150"
                    target="_blank"
                    rel="noreferrer"
                    className="w-full flex items-center justify-center space-x-2 bg-zinc-800 hover:bg-zinc-700 text-white text-xs py-3 rounded-xl font-semibold transition-all"
                  >
                    <span>Abrir Calendário Jacad</span>
                    <ExternalLink size={14} />
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* 4. TCC */}
          {activeTab === 'tcc' && (
            <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 space-y-6">
              <div>
                <h3 className="text-base font-bold text-white">Acompanhamento do TCC</h3>
                <p className="text-xs text-zinc-400">Etapas de escrita e reuniões de orientação</p>
              </div>

              <div className="space-y-3">
                {[
                  { title: 'Introdução e Projeto de Pesquisa', status: 'Concluído', done: true },
                  { title: 'Capítulo 1: Fundamentação Teórica', status: 'Em Revisão', done: true },
                  { title: 'Capítulo 2: Análise Jurisprudencial', status: 'Em Escrita', done: false },
                  { title: 'Conclusão e Formatação ABNT', status: 'Pendente', done: false },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 bg-zinc-900 rounded-xl border border-zinc-800">
                    <div className="flex items-center space-x-3">
                      {item.done ? <CheckCircle2 size={18} className="text-purple-400" /> : <Circle size={18} className="text-zinc-600" />}
                      <span className="text-sm font-semibold text-white">{item.title}</span>
                    </div>
                    <span className="text-xs text-purple-400 font-medium">{item.status}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 5. AGENDA & GMAIL */}
          {activeTab === 'agenda' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-white">Google Agenda</h3>
                  <Calendar size={18} className="text-purple-400" />
                </div>
                <p className="text-xs text-zinc-400">Abra e sincronize os seus compromissos diretamente no Google.</p>
                <a
                  href="https://calendar.google.com"
                  target="_blank"
                  rel="noreferrer"
                  className="w-full flex items-center justify-center space-x-2 bg-purple-600 hover:bg-purple-500 text-white text-xs py-3 rounded-xl font-semibold transition-all"
                >
                  <span>Abrir Google Calendar</span>
                  <ExternalLink size={14} />
                </a>
              </div>

              <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-white">Gmail Operacional</h3>
                  <Mail size={18} className="text-purple-400" />
                </div>
                <p className="text-xs text-zinc-400">Verifique notificações e prazos recebidos por e-mail.</p>
                <a
                  href="https://mail.google.com"
                  target="_blank"
                  rel="noreferrer"
                  className="w-full flex items-center justify-center space-x-2 bg-zinc-800 hover:bg-zinc-700 text-white text-xs py-3 rounded-xl font-semibold transition-all"
                >
                  <span>Abrir Gmail</span>
                  <ExternalLink size={14} />
                </a>
              </div>

            </div>
          )}

        </div>
      </main>

      {/* MODAL DE REGISTRO RÁPIDO */}
      {showAddStudyModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 max-w-md w-full space-y-4">
            <h3 className="text-base font-bold text-white">Lançar Sessão de Estudo</h3>
            
            <div className="space-y-3">
              <div>
                <label className="text-xs text-zinc-400">Selecione o Setor</label>
                <select className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-sm text-white mt-1">
                  <option>OAB 2ª Fase</option>
                  <option>Concurso Público</option>
                  <option>Faculdade</option>
                  <option>TCC</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-zinc-400">Tempo Estudado (Horas)</label>
                <input 
                  type="number" 
                  placeholder="Ex: 2.5" 
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-sm text-white mt-1"
                />
              </div>
            </div>

            <div className="flex space-x-3 pt-2">
              <button 
                onClick={() => setShowAddStudyModal(false)}
                className="flex-1 bg-zinc-900 text-zinc-400 hover:text-white py-2.5 rounded-xl text-xs font-semibold"
              >
                Cancelar
              </button>
              <button 
                onClick={() => setShowAddStudyModal(false)}
                className="flex-1 bg-purple-600 hover:bg-purple-500 text-white py-2.5 rounded-xl text-xs font-semibold"
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
