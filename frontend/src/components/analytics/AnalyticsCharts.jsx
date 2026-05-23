import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, Tooltip } from 'recharts';

const S_COLORS = { backlog: '#71717a', queued: '#22d3ee', building: '#8b5cf6', completed: '#34d399' };
const P_COLORS = { High: '#8b5cf6', Medium: '#22d3ee', Low: '#71717a' };

const Tip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="px-3 py-2 rounded-lg bg-surface-3 border border-edge text-xs shadow-elevated">
      <p className="text-fg font-medium">{payload[0]?.name}: {payload[0]?.value}</p>
    </div>
  );
};

export default function AnalyticsCharts({ stats }) {
  if (!stats?.analytics) return null;
  const { statusBreakdown, scoreBands } = stats.analytics;

  const statusData = Object.entries(statusBreakdown || {}).map(([k, v]) => ({
    name: k[0].toUpperCase() + k.slice(1), value: v, color: S_COLORS[k] || '#71717a',
  }));
  const scoreData = Object.entries(scoreBands || {}).map(([k, v]) => ({
    name: k[0].toUpperCase() + k.slice(1), value: v, color: P_COLORS[k[0].toUpperCase() + k.slice(1)] || '#71717a',
  }));

  const hasStatus = statusData.some((d) => d.value > 0);
  const hasScore  = scoreData.some((d) => d.value > 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Donut */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="p-6 rounded-2xl bg-surface-2/60 backdrop-blur border border-edge">
        <h4 className="text-sm font-semibold text-fg mb-5">Status Distribution</h4>
        {hasStatus ? (
          <div className="flex items-center gap-6">
            <ResponsiveContainer width={110} height={110}>
              <PieChart><Pie data={statusData} cx="50%" cy="50%" innerRadius={32} outerRadius={50}
                dataKey="value" stroke="none">
                {statusData.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Pie></PieChart>
            </ResponsiveContainer>
            <div className="space-y-2.5">
              {statusData.map((d) => (
                <div key={d.name} className="flex items-center gap-2 text-xs">
                  <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ background: d.color }} />
                  <span className="text-fg-2">{d.name}</span>
                  <span className="text-fg font-medium ml-auto tabular-nums">{d.value}</span>
                </div>
              ))}
            </div>
          </div>
        ) : <p className="text-xs text-fg-4 text-center py-10">No data yet</p>}
      </motion.div>

      {/* Bar */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
        className="p-6 rounded-2xl bg-surface-2/60 backdrop-blur border border-edge">
        <h4 className="text-sm font-semibold text-fg mb-5">Priority Distribution</h4>
        {hasScore ? (
          <ResponsiveContainer width="100%" height={110}>
            <BarChart data={scoreData}>
              <XAxis dataKey="name" tick={{ fill: '#a1a1aa', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<Tip />} />
              <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                {scoreData.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : <p className="text-xs text-fg-4 text-center py-10">No data yet</p>}
      </motion.div>
    </div>
  );
}
