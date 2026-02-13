import { ReactNode } from 'react';

type ChartCardProps = {
  title: string;
  children: ReactNode;
};

export function ChartCard({ title, children }: ChartCardProps) {
  return (
    <div className="bg-card text-card-foreground rounded-xl p-6 shadow-sm border">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      {children}
    </div>
  );
}
