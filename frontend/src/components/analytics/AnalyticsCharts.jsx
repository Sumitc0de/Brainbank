import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

const S_COLORS = { backlog: '#71717a', queued: '#22d3ee', building: '#8b5cf6', completed: '#34d399' };
const P_COLORS = { High: '#8b5cf6', Medium: '#22d3ee', Low: '#71717a' };

const Tip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="px-3.5 py-2.5 rounded-xl bg-surface-3/90 backdrop-blur-md border border-edge text-[11px] shadow-elevated">
      <p className="text-fg-2 uppercase font-black tracking-wider text-[9px] mb-1">{payload[0]?.payload?.name || 'Metric'}</p>
      <p className="text-fg font-extrabold flex items-center gap-1.5">
        <span className="w-2 h-2 rounded-full" style={{ background: payload[0]?.payload?.color }} />
        <span>Quantity: {payload[0]?.value}</span>
      </p>
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
      {/* Donut Chart */}
      <motion.div 
        initial={{ opacity: 0, y: 12 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ delay: 0.1, duration: 0.5 }}
        className="p-6 rounded-2xl bg-surface-2/65 backdrop-blur-md border border-edge shadow-card flex flex-col justify-between"
      >
        <div>
          <h4 className="text-xs font-black uppercase tracking-wider text-fg mb-1">Status Distribution</h4>
          <p className="text-[10px] text-fg-3 mb-6">Visual breakdown of your startup status queue</p>
        </div>
        
        {hasStatus ? (
          <div className="flex items-center justify-around gap-6">
            <div className="relative flex items-center justify-center shrink-0">
              <ResponsiveContainer width={120} height={120}>
                <PieChart>
                  <Pie 
                    data={statusData} 
                    cx="50%" 
                    cy="50%" 
                    innerRadius={36} 
                    outerRadius={54}
                    dataKey="value" 
                    stroke="none"
                    paddingAngle={3}
                  >
                    {statusData.map((e, i) => <Cell key={i} fill={e.color} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              
              {/* Inner Stats Circle */}
              <div className="absolute text-center">
                <span className="text-[10px] font-bold text-fg-3 uppercase tracking-wider block leading-none">Total</span>
                <span className="text-lg font-black text-fg tracking-tight leading-none mt-0.5 block">
                  {statusData.reduce((acc, curr) => acc + curr.value, 0)}
                </span>
              </div>
            </div>

            <div className="flex-1 space-y-2 max-w-[160px]">
              {statusData.map((d) => (
                <div key={d.name} className="flex items-center justify-between text-xs px-2.5 py-1.5 rounded-lg hover:bg-surface-3/40 transition-colors">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0 shadow-sm" style={{ background: d.color }} />
                    <span className="text-fg-2 font-medium">{d.name}</span>
                  </div>
                  <span className="text-fg font-bold font-mono tabular-nums">{d.value}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-10 text-fg-4">
            <p className="text-xs">No status distribution details recorded yet</p>
          </div>
        )}
      </motion.div>

      {/* Bar Chart */}
      <motion.div 
        initial={{ opacity: 0, y: 12 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ delay: 0.15, duration: 0.5 }}
        className="p-6 rounded-2xl bg-surface-2/65 backdrop-blur-md border border-edge shadow-card flex flex-col justify-between"
      >
        <div>
          <h4 className="text-xs font-black uppercase tracking-wider text-fg mb-1">Priority Distribution</h4>
          <p className="text-[10px] text-fg-3 mb-6">Metrics divided by ICE priority bands</p>
        </div>

        {hasScore ? (
          <div className="flex flex-col justify-end h-[120px] pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={scoreData} margin={{ top: 0, right: 10, left: -20, bottom: 0 }}>
                <XAxis 
                  dataKey="name" 
                  tick={{ fill: 'var(--text-fg-3)', fontSize: 9, fontWeight: 700 }} 
                  axisLine={false} 
                  tickLine={false} 
                />
                <YAxis
                  tick={{ fill: 'var(--text-fg-3)', fontSize: 9 }}
                  axisLine={false}
                  tickLine={false}
                  allowDecimals={false}
                />
                <Tooltip content={<Tip />} cursor={{ fill: 'var(--surface-4)', opacity: 0.1 }} />
                <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={36}>
                  {scoreData.map((e, i) => (
                    <Cell key={i} fill={e.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-10 text-fg-4">
            <p className="text-xs">No priority breakdown data available yet</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
