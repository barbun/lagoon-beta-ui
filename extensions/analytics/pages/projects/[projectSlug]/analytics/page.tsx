'use client';

import { useParams } from 'next/navigation';

export default function ProjectAnalytics() {
  const { projectSlug } = useParams<{ projectSlug: string }>();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Project Analytics</h1>
      <p className="text-gray-600 dark:text-gray-400">
        Analytics for project: <strong>{projectSlug}</strong>
      </p>
      <div className="mt-4 p-4 border rounded-lg">
        <p>This page was injected by the analytics extension.</p>
      </div>
    </div>
  );
}
