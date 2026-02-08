import React, { useState, useEffect } from 'react';
import { PerTrendChart, ProblemSoundsChart } from './Charts';
import RecentActivity from './RecentActivity';
import { Zap, TrendingUp, AlertCircle } from 'lucide-react';
import { User, PracticeSession, ActivityItem } from '../types';
import { DataService } from '../services/storage';

interface DashboardViewProps {
  user: User;
}

const DashboardView: React.FC<DashboardViewProps> = ({ user }) => {
  const [activeTab, setActiveTab] = useState<'PER' | 'PROBLEM' | 'ACTIVITY'>('PER');
  const [perTrendData, setPerTrendData] = useState<{ date: string; per: number }[]>([]);
  const [problemSoundsData, setProblemSoundsData] = useState<{ name: string; value: number; fill: string }[]>([]);
  const [activityItems, setActivityItems] = useState<ActivityItem[]>([]);
  const [stats, setStats] = useState({ totalSessions: 0, phrasesMastered: 0 });
  const [avgAccuracy, setAvgAccuracy] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
        // Fetch data
        const sessions = await DataService.getUserHistory(user.id);

        // 1. Calculate PER Trend (Average PER per day)
        const perByDate: Record<string, { total: number; count: number }> = {};
        sessions.forEach(s => {
        const dateKey = s.displayDate;
        if (!perByDate[dateKey]) perByDate[dateKey] = { total: 0, count: 0 };
        perByDate[dateKey].total += s.per;
        perByDate[dateKey].count += 1;
        });

        const trend = Object.keys(perByDate).map(date => ({
        date,
        per: parseFloat((perByDate[date].total / perByDate[date].count).toFixed(2))
        })).reverse(); // Oldest first
        setPerTrendData(trend);

        // 2. Calculate Problem Sounds
        const badPhonemes: Record<string, number> = {};
        let totalBad = 0;
        sessions.forEach(s => {
        s.phonemes.forEach(p => {
            if (!p.isGood) {
            const sound = p.text.toLowerCase();
            badPhonemes[sound] = (badPhonemes[sound] || 0) + 1;
            totalBad++;
            }
        });
        });

        const problems = Object.keys(badPhonemes)
        .map(key => ({ name: key, count: badPhonemes[key] }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5)
        .map((item, index) => {
            const colors = ['#111827', '#374151', '#4B5563', '#6B7280', '#9CA3AF'];
            return {
            name: `"${item.name}"`,
            value: Math.round((item.count / totalBad) * 100) || 0,
            fill: colors[index % colors.length]
            };
        });
        setProblemSoundsData(problems);

        // 3. Activity Items
        const activities = sessions.slice(0, 10).map(s => ({
        id: s.id,
        date: s.displayDate,
        description: `Practiced: "${s.sentenceText.substring(0, 20)}..."`,
        scoreLabel: `Score: ${s.accuracy}%`
        }));
        setActivityItems(activities);

        // 4. General Stats
        setStats({
        totalSessions: sessions.length,
        phrasesMastered: sessions.filter(s => s.accuracy >= 90).length
        });
        
        setAvgAccuracy(
            sessions.length > 0 
                ? Math.round(sessions.reduce((acc, curr) => acc + curr.accuracy, 0) / sessions.length) 
                : 0
        );
    };
    
    fetchData();
  }, [user.id]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end mb-2">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Welcome back, {user.name}</h2>
          <p className="text-sm text-gray-500 mt-1">Here is your pronunciation progress</p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-teal-700 font-medium bg-teal-50 px-3 py-1 rounded-full">
           <Zap className="w-4 h-4" />
           <span>Level: {stats.phrasesMastered > 10 ? 'Intermediate' : 'Beginner'}</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg p-1 border border-gray-200 inline-flex w-full mb-4">
        <button
          onClick={() => setActiveTab('PER')}
          className={`flex-1 flex items-center justify-center py-2 text-sm font-medium rounded-md transition-all ${
            activeTab === 'PER' 
              ? 'bg-white shadow-sm text-teal-700 border border-gray-200' 
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
          }`}
        >
          <TrendingUp className="w-4 h-4 mr-2" />
          PER Trend
        </button>
        <button
          onClick={() => setActiveTab('PROBLEM')}
          className={`flex-1 flex items-center justify-center py-2 text-sm font-medium rounded-md transition-all ${
            activeTab === 'PROBLEM' 
              ? 'bg-white shadow-sm text-teal-700 border border-gray-200' 
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
          }`}
        >
          <AlertCircle className="w-4 h-4 mr-2" />
          Problem Sounds
        </button>
        <button
          onClick={() => setActiveTab('ACTIVITY')}
          className={`flex-1 flex items-center justify-center py-2 text-sm font-medium rounded-md transition-all ${
            activeTab === 'ACTIVITY' 
              ? 'bg-white shadow-sm text-teal-700 border border-gray-200' 
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
          }`}
        >
          Recent Activity
        </button>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 min-h-[400px]">
        {activeTab === 'PER' && (
          <div className="animate-fade-in">
             <div className="mb-6">
               <h3 className="text-lg font-bold text-gray-800 flex items-center">
                 <TrendingUp className="w-5 h-5 mr-2 text-teal-600" />
                 Phoneme Error Rate Over Time
               </h3>
               <p className="text-sm text-gray-500">Lower is better.</p>
             </div>
             <PerTrendChart data={perTrendData} />
          </div>
        )}

        {activeTab === 'PROBLEM' && (
          <div className="animate-fade-in">
             <div className="mb-6">
               <h3 className="text-lg font-bold text-gray-800 flex items-center">
                 <AlertCircle className="w-5 h-5 mr-2 text-teal-600" />
                 Problem Sounds
               </h3>
               <p className="text-sm text-gray-500">Sounds that contribute most to your error rate.</p>
             </div>
             
             <div className="flex flex-col md:flex-row items-center justify-center gap-8">
               <div className="w-full md:w-1/2">
                 <ProblemSoundsChart data={problemSoundsData} />
               </div>
               <div className="w-full md:w-1/2 space-y-4 pl-0 md:pl-8">
                  {problemSoundsData.length > 0 ? problemSoundsData.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full mr-3" style={{ backgroundColor: item.fill }}></div>
                        <span className="font-medium text-gray-700">{item.name} sound</span>
                      </div>
                      <span className="font-bold text-gray-900">{item.value}%</span>
                    </div>
                  )) : <p className="text-gray-500 italic">Practice more to identify problem sounds.</p>}
               </div>
             </div>
          </div>
        )}

        {activeTab === 'ACTIVITY' && (
           <div className="animate-fade-in">
             <div className="mb-6">
               <h3 className="text-lg font-bold text-gray-800">Recent Activity</h3>
             </div>
             <RecentActivity items={activityItems} />
           </div>
        )}
      </div>

      {/* Bottom Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="text-gray-500 text-xs font-bold uppercase mb-2">Total Sessions</div>
            <div className="text-3xl font-extrabold text-gray-800">{stats.totalSessions}</div>
         </div>
         <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="text-gray-500 text-xs font-bold uppercase mb-2">Phrases Mastered</div>
            <div className="text-3xl font-extrabold text-gray-800">{stats.phrasesMastered}</div>
            <div className="text-teal-600 text-xs font-medium mt-1">Accuracy &gt; 90%</div>
         </div>
         <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="text-gray-500 text-xs font-bold uppercase mb-2">Avg Accuracy</div>
            <div className="text-3xl font-extrabold text-teal-700">
              {avgAccuracy}%
            </div>
         </div>
      </div>
    </div>
  );
};

export default DashboardView;