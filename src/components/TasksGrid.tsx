import React from 'react';

export function TasksGrid() {
  return (
    <div className="grid grid-cols-4 gap-6">
      <TaskSection title="Habits">
        <input
          type="text"
          placeholder="Enter habit"
          className="w-full border border-gray-200 rounded p-2 mb-4"
        />
        <TaskCard
          title="Go to gym"
          subtitle="Legendary priority"
          details={[
            "1 hit = showup",
            "2 min = 30minutes",
            "3 hits = 1hour",
            "4 hits = 2 hours"
          ]}
        />
      </TaskSection>

      <TaskSection title="Dailies">
        <input
          type="text"
          placeholder="Enter dailies"
          className="w-full border border-gray-200 rounded p-2 mb-4"
        />
        <TaskCard
          title="Go to gym"
          subtitle="Legendary priority"
          isCheckbox
        />
      </TaskSection>

      <TaskSection title="To do list">
        <input
          type="text"
          placeholder="Enter to-do list"
          className="w-full border border-gray-200 rounded p-2 mb-4"
        />
        <TaskCard
          title="Pay the bill"
          subtitle="Due in 10 days"
          isCheckbox
        />
      </TaskSection>

      <TaskSection title="Time blocking">
        <div className="h-[600px] border border-gray-200 rounded">
          {/* Time slots will go here */}
        </div>
      </TaskSection>
    </div>
  );
}

function TaskSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">{title}</h2>
      {children}
    </div>
  );
}

function TaskCard({ 
  title, 
  subtitle, 
  details,
  isCheckbox 
}: { 
  title: string; 
  subtitle: string; 
  details?: string[];
  isCheckbox?: boolean;
}) {
  return (
    <div className="border border-gray-200 rounded p-4">
      <div className="flex items-start gap-2">
        {isCheckbox && (
          <input type="checkbox" className="mt-1" />
        )}
        <div>
          <div className="font-medium">{title}</div>
          <div className="text-sm text-gray-600">{subtitle}</div>
          {details && (
            <ul className="mt-2 space-y-1 text-sm text-gray-600">
              {details.map((detail, index) => (
                <li key={index}>{detail}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}