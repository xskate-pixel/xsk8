import React, { useState, useMemo } from 'react';
import { 
  Users, 
  Trophy, 
  Zap, 
  Search, 
  ChevronRight, 
  Plus, 
  LayoutDashboard,
  User as UserIcon,
  CheckCircle2,
  Circle,
  TrendingUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Student, Trick, TrickLevel } from './types';
import { INITIAL_STUDENTS, TRICKS } from './constants';

const RadialProgress = ({ percentage, size = 120, strokeWidth = 8 }: { percentage: number, size?: number, strokeWidth?: number }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          className="text-white/5"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: "easeOut" }}
          strokeLinecap="round"
          className="text-x-red"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-mono font-bold leading-none">{Math.round(percentage)}%</span>
        <span className="text-[8px] uppercase text-x-silver tracking-widest mt-1">Status</span>
      </div>
    </div>
  );
};

export default function App() {
  const [students, setStudents] = useState<Student[]>(INITIAL_STUDENTS);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [view, setView] = useState<'dashboard' | 'ranking' | 'students'>('dashboard');
  const [searchTerm, setSearchTerm] = useState('');

  const selectedStudent = useMemo(() => 
    students.find(s => s.id === selectedStudentId), 
    [students, selectedStudentId]
  );

  const filteredStudents = useMemo(() => 
    students.filter(s => 
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      s.nickname?.toLowerCase().includes(searchTerm.toLowerCase())
    ), 
    [students, searchTerm]
  );

  const sortedRanking = useMemo(() => 
    [...students].sort((a, b) => b.points - a.points),
    [students]
  );

  const handleToggleTrick = (studentId: string, trickId: string) => {
    setStudents(prev => prev.map(student => {
      if (student.id !== studentId) return student;
      
      const hasTrick = student.tricks.find(t => t.trickId === trickId);
      let newTricks = [...student.tricks];
      
      if (hasTrick) {
        if (hasTrick.status === 'learning') {
          newTricks = newTricks.map(t => t.trickId === trickId ? { ...t, status: 'learned', dateLearned: new Date().toISOString() } : t);
        } else if (hasTrick.status === 'learned') {
          newTricks = newTricks.map(t => t.trickId === trickId ? { ...t, status: 'mastered' } : t);
        } else {
          newTricks = newTricks.filter(t => t.trickId !== trickId);
        }
      } else {
        newTricks.push({ trickId, status: 'learning' });
      }

      // Recalculate points based on tricks
      const newPoints = newTricks.reduce((acc, st) => {
        const trick = TRICKS.find(t => t.id === st.trickId);
        if (!trick) return acc;
        const multiplier = st.status === 'mastered' ? 2 : st.status === 'learned' ? 1.5 : 0.5;
        return acc + (trick.difficulty * 100 * multiplier);
      }, 0);

      // Determine level
      let newLevel = TrickLevel.BEGINNER;
      if (newPoints > 2000) newLevel = TrickLevel.PRO;
      else if (newPoints > 1500) newLevel = TrickLevel.ADVANCED;
      else if (newPoints > 800) newLevel = TrickLevel.INTERMEDIATE;

      return { ...student, tricks: newTricks, points: Math.round(newPoints), level: newLevel };
    }));
  };

  return (
    <div className="flex h-screen bg-[#0f1115] text-x-light overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/5 bg-[#16181d] flex flex-col">
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-x-red rounded flex items-center justify-center font-display text-2xl italic">X</div>
          <div>
            <h1 className="font-display text-xl tracking-tight leading-none">SKATE</h1>
            <p className="text-[10px] text-x-silver uppercase tracking-widest">Academy</p>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          <button 
            onClick={() => { setView('dashboard'); setSelectedStudentId(null); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${view === 'dashboard' ? 'bg-x-red text-white' : 'hover:bg-white/5 text-x-silver'}`}
          >
            <LayoutDashboard size={20} />
            <span className="font-medium">Dashboard</span>
          </button>
          <button 
            onClick={() => { setView('students'); setSelectedStudentId(null); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${view === 'students' ? 'bg-x-red text-white' : 'hover:bg-white/5 text-x-silver'}`}
          >
            <Users size={20} />
            <span className="font-medium">Alunos</span>
          </button>
          <button 
            onClick={() => { setView('ranking'); setSelectedStudentId(null); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${view === 'ranking' ? 'bg-x-red text-white' : 'hover:bg-white/5 text-x-silver'}`}
          >
            <Trophy size={20} />
            <span className="font-medium">Ranking</span>
          </button>
        </nav>

        <div className="p-6 border-t border-white/5">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
            <div className="w-8 h-8 rounded-full bg-x-silver/20 flex items-center justify-center">
              <UserIcon size={16} />
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold truncate">Admin</p>
              <p className="text-[10px] text-x-silver">Instrutor Chefe</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 border-bottom border-white/5 px-8 flex items-center justify-between bg-[#16181d]/50 backdrop-blur-md">
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-x-silver" size={16} />
            <input 
              type="text" 
              placeholder="Buscar aluno ou manobra..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-x-red/50 transition-colors"
            />
          </div>
          <button className="x-button flex items-center gap-2 text-sm">
            <Plus size={16} />
            Novo Aluno
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-8">
          <AnimatePresence mode="wait">
            {selectedStudent ? (
              <motion.div 
                key="profile"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="max-w-5xl mx-auto space-y-8"
              >
                <div className="flex items-start gap-8">
                  <div className="relative">
                    <img 
                      src={selectedStudent.photoUrl} 
                      alt={selectedStudent.name} 
                      className="w-48 h-48 rounded-2xl object-cover border-4 border-x-metal shadow-2xl"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute -bottom-4 -right-4 bg-x-red text-white w-12 h-12 rounded-full flex items-center justify-center font-display text-xl shadow-lg">
                      #{sortedRanking.findIndex(s => s.id === selectedStudent.id) + 1}
                    </div>
                  </div>
                  <div className="flex-1 pt-4">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-4 mb-2">
                          <h2 className="text-4xl font-display uppercase tracking-tight">{selectedStudent.name}</h2>
                          <span className={`x-badge ${
                            selectedStudent.level === TrickLevel.PRO ? 'bg-purple-500' :
                            selectedStudent.level === TrickLevel.ADVANCED ? 'bg-x-red' :
                            selectedStudent.level === TrickLevel.INTERMEDIATE ? 'bg-blue-500' : 'bg-green-500'
                          }`}>
                            {selectedStudent.level}
                          </span>
                        </div>
                        <p className="text-x-silver italic">"{selectedStudent.nickname}" • {selectedStudent.bio}</p>
                      </div>
                      <RadialProgress 
                        percentage={(selectedStudent.tricks.filter(t => t.status !== 'learning').length / TRICKS.length) * 100} 
                        size={100}
                      />
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4">
                      <div className="x-card p-4 flex flex-col items-center justify-center">
                        <span className="text-[10px] uppercase text-x-silver mb-1">Pontos</span>
                        <span className="text-2xl font-mono font-bold text-x-red">{selectedStudent.points}</span>
                      </div>
                      <div className="x-card p-4 flex flex-col items-center justify-center">
                        <span className="text-[10px] uppercase text-x-silver mb-1">Manobras</span>
                        <span className="text-2xl font-mono font-bold">{selectedStudent.tricks.filter(t => t.status !== 'learning').length}</span>
                      </div>
                      <div className="x-card p-4 flex flex-col items-center justify-center bg-x-red/5">
                        <span className="text-[10px] uppercase text-x-silver mb-1">Rank Global</span>
                        <span className="text-2xl font-mono font-bold">
                          #{sortedRanking.findIndex(s => s.id === selectedStudent.id) + 1}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h3 className="text-xl font-display uppercase flex items-center gap-2">
                      <Zap size={20} className="text-x-red" />
                      Arsenal de Manobras
                    </h3>
                    <div className="x-card divide-y divide-white/5">
                      {TRICKS.map(trick => {
                        const studentTrick = selectedStudent.tricks.find(t => t.trickId === trick.id);
                        return (
                          <div 
                            key={trick.id} 
                            className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors cursor-pointer"
                            onClick={() => handleToggleTrick(selectedStudent.id, trick.id)}
                          >
                            <div>
                              <p className="font-bold">{trick.name}</p>
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] text-x-silver uppercase">{trick.category}</span>
                                <div className="flex gap-0.5">
                                  {[...Array(5)].map((_, i) => (
                                    <div key={i} className={`w-1 h-1 rounded-full ${i < Math.ceil(trick.difficulty/2) ? 'bg-x-red' : 'bg-white/10'}`} />
                                  ))}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              {studentTrick?.status === 'mastered' ? (
                                <span className="text-[10px] font-bold text-purple-400 uppercase">Master</span>
                              ) : studentTrick?.status === 'learned' ? (
                                <span className="text-[10px] font-bold text-green-400 uppercase">Ok</span>
                              ) : studentTrick?.status === 'learning' ? (
                                <span className="text-[10px] font-bold text-yellow-400 uppercase">Treinando</span>
                              ) : null}
                              
                              {studentTrick?.status === 'mastered' ? (
                                <CheckCircle2 className="text-purple-400" size={20} />
                              ) : studentTrick?.status === 'learned' ? (
                                <CheckCircle2 className="text-green-400" size={20} />
                              ) : studentTrick?.status === 'learning' ? (
                                <TrendingUp className="text-yellow-400" size={20} />
                              ) : (
                                <Circle className="text-white/10" size={20} />
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-xl font-display uppercase flex items-center gap-2">
                      <TrendingUp size={20} className="text-x-red" />
                      Histórico Recente
                    </h3>
                    <div className="x-card p-6 min-h-[300px] flex flex-col items-center justify-center text-center text-x-silver">
                      <p className="text-sm italic">Acompanhamento de evolução e notas de treino aparecerão aqui.</p>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => setSelectedStudentId(null)}
                  className="text-x-silver hover:text-white flex items-center gap-2 text-sm transition-colors"
                >
                  <ChevronRight className="rotate-180" size={16} />
                  Voltar para lista
                </button>
              </motion.div>
            ) : view === 'dashboard' ? (
              <motion.div 
                key="dashboard"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-8"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="x-card p-6 bg-gradient-to-br from-x-red/20 to-transparent">
                    <Trophy className="text-x-red mb-4" size={32} />
                    <h3 className="text-2xl font-display uppercase">Top Skater</h3>
                    <p className="text-x-silver text-sm mb-4">Líder do ranking atual</p>
                    <div className="flex items-center gap-3">
                      <img src={sortedRanking[0].photoUrl} className="w-10 h-10 rounded-full object-cover" referrerPolicy="no-referrer" />
                      <div>
                        <p className="font-bold">{sortedRanking[0].name}</p>
                        <p className="text-xs text-x-red font-mono">{sortedRanking[0].points} pts</p>
                      </div>
                    </div>
                  </div>
                  <div className="x-card p-6">
                    <Users className="text-blue-400 mb-4" size={32} />
                    <h3 className="text-2xl font-display uppercase">Alunos</h3>
                    <p className="text-x-silver text-sm mb-4">Total matriculados</p>
                    <p className="text-4xl font-mono font-bold">{students.length}</p>
                  </div>
                  <div className="x-card p-6">
                    <Zap className="text-yellow-400 mb-4" size={32} />
                    <h3 className="text-2xl font-display uppercase">Manobras</h3>
                    <p className="text-x-silver text-sm mb-4">Total catalogadas</p>
                    <p className="text-4xl font-mono font-bold">{TRICKS.length}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h3 className="text-xl font-display uppercase">Ranking Rápido</h3>
                    <div className="x-card overflow-hidden">
                      {sortedRanking.slice(0, 5).map((student, idx) => (
                        <div 
                          key={student.id} 
                          className="p-4 flex items-center gap-4 hover:bg-white/5 transition-colors cursor-pointer border-b border-white/5 last:border-0"
                          onClick={() => setSelectedStudentId(student.id)}
                        >
                          <span className="font-mono font-bold text-x-silver w-4">{idx + 1}</span>
                          <img src={student.photoUrl} className="w-10 h-10 rounded-full object-cover" referrerPolicy="no-referrer" />
                          <div className="flex-1">
                            <p className="font-bold text-sm">{student.name}</p>
                            <p className="text-[10px] text-x-silver uppercase">{student.level}</p>
                          </div>
                          <p className="font-mono font-bold text-x-red">{student.points}</p>
                        </div>
                      ))}
                      <button 
                        onClick={() => setView('ranking')}
                        className="w-full p-3 text-xs text-x-silver hover:text-white transition-colors bg-white/5"
                      >
                        Ver ranking completo
                      </button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-xl font-display uppercase">Atividade Recente</h3>
                    <div className="x-card p-8 flex flex-col items-center justify-center text-center text-x-silver">
                      <TrendingUp size={48} className="opacity-10 mb-4" />
                      <p className="text-sm italic">Nenhuma atividade registrada hoje.</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : view === 'students' ? (
              <motion.div 
                key="students"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              >
                {filteredStudents.map(student => (
                  <motion.div 
                    key={student.id}
                    whileHover={{ y: -5 }}
                    className="x-card cursor-pointer group"
                    onClick={() => setSelectedStudentId(student.id)}
                  >
                    <div className="relative h-48 overflow-hidden">
                      <img 
                        src={student.photoUrl} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#16181d] to-transparent opacity-60" />
                      <div className="absolute bottom-4 left-4">
                        <span className={`x-badge ${
                          student.level === TrickLevel.PRO ? 'bg-purple-500' :
                          student.level === TrickLevel.ADVANCED ? 'bg-x-red' :
                          student.level === TrickLevel.INTERMEDIATE ? 'bg-blue-500' : 'bg-green-500'
                        }`}>
                          {student.level}
                        </span>
                      </div>
                    </div>
                    <div className="p-4">
                      <h4 className="font-display text-lg uppercase leading-tight">{student.name}</h4>
                      <p className="text-xs text-x-silver mb-3 italic">"{student.nickname}"</p>
                      <div className="flex items-center justify-between pt-3 border-t border-white/5">
                        <div className="flex flex-col">
                          <span className="text-[10px] text-x-silver uppercase">Pontos</span>
                          <span className="font-mono font-bold text-x-red">{student.points}</span>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className="text-[10px] text-x-silver uppercase">Manobras</span>
                          <span className="font-mono font-bold">{student.tricks.filter(t => t.status !== 'learning').length}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div 
                key="ranking"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="max-w-4xl mx-auto"
              >
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-3xl font-display uppercase tracking-tight">Ranking Interno</h2>
                  <div className="flex items-center gap-2 text-x-silver text-sm">
                    <Trophy size={16} />
                    <span>Temporada 2024</span>
                  </div>
                </div>

                <div className="x-card overflow-hidden">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-white/5 text-x-silver text-[10px] uppercase tracking-widest">
                        <th className="p-4 font-medium">Pos</th>
                        <th className="p-4 font-medium">Atleta</th>
                        <th className="p-4 font-medium">Nível</th>
                        <th className="p-4 font-medium">Manobras</th>
                        <th className="p-4 font-medium text-right">Pontuação</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {sortedRanking.map((student, idx) => (
                        <tr 
                          key={student.id} 
                          className="hover:bg-white/5 transition-colors cursor-pointer group"
                          onClick={() => setSelectedStudentId(student.id)}
                        >
                          <td className="p-4">
                            <span className={`font-mono font-bold text-lg ${
                              idx === 0 ? 'text-yellow-400' : 
                              idx === 1 ? 'text-x-silver' : 
                              idx === 2 ? 'text-orange-400' : 'text-white/20'
                            }`}>
                              {idx + 1}
                            </span>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <img src={student.photoUrl} className="w-10 h-10 rounded-full object-cover border border-white/10" referrerPolicy="no-referrer" />
                              <div>
                                <p className="font-bold group-hover:text-x-red transition-colors">{student.name}</p>
                                <p className="text-[10px] text-x-silver italic">"{student.nickname}"</p>
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <span className={`x-badge ${
                              student.level === TrickLevel.PRO ? 'bg-purple-500' :
                              student.level === TrickLevel.ADVANCED ? 'bg-x-red' :
                              student.level === TrickLevel.INTERMEDIATE ? 'bg-blue-500' : 'bg-green-500'
                            }`}>
                              {student.level}
                            </span>
                          </td>
                          <td className="p-4">
                            <span className="font-mono text-sm">{student.tricks.filter(t => t.status !== 'learning').length}</span>
                          </td>
                          <td className="p-4 text-right">
                            <span className="font-mono font-bold text-x-red text-lg">{student.points}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
