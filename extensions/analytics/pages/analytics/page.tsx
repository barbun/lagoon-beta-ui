'use client';

import { ExtensionRouteGuard } from '@/components/extensions/ExtensionRouteGuard';
import { StatCard, ChartCard } from '@/components/extensions/analytics';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const deploymentTrends = [
  { month: 'Jul', deployments: 145, successful: 138, failed: 7 },
  { month: 'Aug', deployments: 162, successful: 155, failed: 7 },
  { month: 'Sep', deployments: 178, successful: 168, failed: 10 },
  { month: 'Oct', deployments: 195, successful: 187, failed: 8 },
  { month: 'Nov', deployments: 210, successful: 201, failed: 9 },
  { month: 'Dec', deployments: 189, successful: 182, failed: 7 },
  { month: 'Jan', deployments: 224, successful: 216, failed: 8 },
];

const projectDeployments = [
  { name: 'acme-main', deployments: 89 },
  { name: 'agency-portal', deployments: 67 },
  { name: 'citizen-services', deployments: 54 },
  { name: 'internal-tools', deployments: 42 },
  { name: 'data-platform', deployments: 38 },
];

const environmentBreakdown = [
  { name: 'Production', value: 45, color: '#00a0af' },
  { name: 'Staging', value: 30, color: '#1c2b4a' },
  { name: 'Development', value: 25, color: '#e74c6e' },
];

const statusBreakdown = [
  { name: 'Successful', value: 92, color: '#10b981' },
  { name: 'Failed', value: 5, color: '#ef4444' },
  { name: 'In Progress', value: 3, color: '#f59e0b' },
];

export default function AnalyticsDashboard() {
  return (
    <ExtensionRouteGuard route="analytics">
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Platform Analytics</h1>
          <p className="text-muted-foreground mt-1">
            Overview of deployment activity across all projects
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Deployments"
            value="1,303"
            subtitle="Last 7 months"
            trend="+12.4%"
          />
          <StatCard
            title="Success Rate"
            value="96.2%"
            subtitle="Avg. across all projects"
            trend="+2.1%"
          />
          <StatCard
            title="Active Projects"
            value="47"
            subtitle="With deployments this month"
          />
          <StatCard
            title="Avg. Build Time"
            value="4m 23s"
            subtitle="Down from 5m 12s"
            trend="-15%"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartCard title="Deployment Trends">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={deploymentTrends}>
                <defs>
                  <linearGradient id="colorSuccess" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00a0af" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#00a0af" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorFailed" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#e74c6e" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#e74c6e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
                <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
                <YAxis stroke="#6b7280" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#fff',
                  }}
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="successful"
                  stroke="#00a0af"
                  fill="url(#colorSuccess)"
                  strokeWidth={2}
                  name="Successful"
                />
                <Area
                  type="monotone"
                  dataKey="failed"
                  stroke="#e74c6e"
                  fill="url(#colorFailed)"
                  strokeWidth={2}
                  name="Failed"
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Deployments by Project">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={projectDeployments} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
                <XAxis type="number" stroke="#6b7280" fontSize={12} />
                <YAxis dataKey="name" type="category" stroke="#6b7280" fontSize={12} width={120} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#fff',
                  }}
                />
                <Bar dataKey="deployments" fill="#00a0af" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ChartCard title="By Environment">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={environmentBreakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {environmentBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#fff',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Deployment Status">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={statusBreakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {statusBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#fff',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      </div>
    </ExtensionRouteGuard>
  );
}
