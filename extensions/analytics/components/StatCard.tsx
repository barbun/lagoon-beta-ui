type StatCardProps = {
  title: string;
  value: string;
  subtitle: string;
  trend?: string;
};

export function StatCard({ title, value, subtitle, trend }: StatCardProps) {
  return (
    <div className="bg-card text-card-foreground rounded-xl p-6 shadow-sm border">
      <p className="text-sm text-muted-foreground mb-1">{title}</p>
      <p className="text-3xl font-bold">{value}</p>
      <div className="flex items-center mt-2">
        <span className="text-sm text-muted-foreground">{subtitle}</span>
        {trend && (
          <span className={`ml-2 text-sm ${trend.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
            {trend}
          </span>
        )}
      </div>
    </div>
  );
}
