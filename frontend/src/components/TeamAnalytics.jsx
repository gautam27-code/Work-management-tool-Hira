import { useEffect, useState } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, Legend } from "recharts";
import { apiGet } from "../services/api";

const COLORS = ['#3b82f6', '#f59e0b', '#ec4899', '#10b981'];

function TeamAnalytics({ teamId }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const result = await apiGet(`/analytics/team/${teamId}`);
        setData(result);
      } catch (err) {
        setError(err.message || "Failed to load analytics");
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, [teamId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-8 h-8 border-2 border-[#6366f1] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 p-4 bg-red-500/10 rounded-xl">{error}</div>;
  }

  if (!data) return null;

  const pieData = [
    { name: 'To Do', value: data.statusCounts.todo },
    { name: 'In Progress', value: data.statusCounts.in_progress },
    { name: 'Review', value: data.statusCounts.review },
    { name: 'Done', value: data.statusCounts.done }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Status Breakdown */}
        <div className="bg-[#1e293b] rounded-2xl border border-[#334155] p-6 shadow-xl">
          <h3 className="text-lg font-bold text-white mb-6">Task Status</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '0.5rem' }}
                  itemStyle={{ color: '#f1f5f9' }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Member Contributions */}
        <div className="bg-[#1e293b] rounded-2xl border border-[#334155] p-6 shadow-xl">
          <h3 className="text-lg font-bold text-white mb-6">Member Contributions (Completed)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.memberContributions} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} />
                <XAxis type="number" stroke="#94a3b8" />
                <YAxis dataKey="name" type="category" stroke="#94a3b8" width={100} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '0.5rem' }}
                  cursor={{ fill: '#334155', opacity: 0.4 }}
                />
                <Bar dataKey="completed" fill="#6366f1" radius={[0, 4, 4, 0]}>
                  {data.memberContributions.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={`url(#colorGradient${index % 3})`} />
                  ))}
                </Bar>
                
                <defs>
                  <linearGradient id="colorGradient0" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.8}/>
                  </linearGradient>
                  <linearGradient id="colorGradient1" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="5%" stopColor="#ec4899" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.8}/>
                  </linearGradient>
                  <linearGradient id="colorGradient2" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.8}/>
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TeamAnalytics;
