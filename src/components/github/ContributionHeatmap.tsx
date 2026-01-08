import { useMemo } from 'react';
import type { ContributionDay, GitHubStats } from '../../lib/github';

const CELL_SIZE = 12;
const CELL_GAP = 3;
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function getColorForLevel(level: number): string {
  const colors = [
    'rgba(255, 255, 255, 0.05)', // 0 - no contributions
    'rgba(0, 255, 247, 0.2)',    // 1 - low
    'rgba(0, 255, 247, 0.4)',    // 2 - medium
    'rgba(0, 255, 247, 0.6)',    // 3 - high
    'rgba(0, 255, 247, 0.9)',    // 4 - very high
  ];
  return colors[level] || colors[0];
}

interface TooltipProps {
  day: ContributionDay;
  x: number;
  y: number;
}

function Tooltip({ day, x, y }: TooltipProps) {
  const date = new Date(day.date);
  const formattedDate = date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div
      className="absolute z-50 pointer-events-none"
      style={{
        left: x,
        top: y - 40,
        transform: 'translateX(-50%)',
      }}
    >
      <div className="bg-night-700 text-white text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap">
        <span className="font-medium">{day.count} contributions</span>
        <span className="text-gray-400 ml-1">on {formattedDate}</span>
      </div>
    </div>
  );
}

interface ContributionHeatmapProps {
  data: GitHubStats;
}

export default function ContributionHeatmap({ data }: ContributionHeatmapProps) {

  // Calculate month labels positions
  const monthLabels = useMemo(() => {
    const labels: { month: string; x: number }[] = [];
    let currentMonth = -1;

    data.weeks.forEach((week, weekIndex) => {
      const firstDay = new Date(week.days[0].date);
      const month = firstDay.getMonth();

      if (month !== currentMonth) {
        currentMonth = month;
        labels.push({
          month: MONTHS[month],
          x: weekIndex * (CELL_SIZE + CELL_GAP) + 30,
        });
      }
    });

    return labels;
  }, [data]);

  return (
    <div className="w-full overflow-x-auto pb-4">
      <div className="min-w-[800px]">
        {/* Header with total */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-neon-cyan" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            <span className="text-white font-medium">
              {data.totalContributions.toLocaleString()} contributions in the last year
            </span>
          </div>
          <a
            href="https://github.com/leoashcraft"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-gray-400 hover:text-neon-cyan transition-colors"
          >
            View on GitHub →
          </a>
        </div>

        {/* Month labels */}
        <div className="relative h-4 mb-1">
          {monthLabels.map((label, i) => (
            <span
              key={i}
              className="absolute text-xs text-gray-500"
              style={{ left: label.x }}
            >
              {label.month}
            </span>
          ))}
        </div>

        {/* Grid */}
        <div className="flex">
          {/* Day labels */}
          <div className="flex flex-col justify-around mr-2" style={{ height: 7 * (CELL_SIZE + CELL_GAP) }}>
            {DAYS.filter((_, i) => i % 2 === 1).map((day) => (
              <span key={day} className="text-xs text-gray-500 leading-none">
                {day}
              </span>
            ))}
          </div>

          {/* Contribution grid */}
          <div className="flex gap-[3px]" role="grid" aria-label="GitHub contribution heatmap">
            {data.weeks.map((week, weekIndex) => (
              <div key={weekIndex} className="flex flex-col gap-[3px]" role="row">
                {week.days.map((day, dayIndex) => (
                  <div
                    key={`${weekIndex}-${dayIndex}`}
                    className="rounded-sm transition-all duration-200 hover:ring-2 hover:ring-white/30 cursor-pointer"
                    style={{
                      width: CELL_SIZE,
                      height: CELL_SIZE,
                      backgroundColor: getColorForLevel(day.level),
                    }}
                    title={`${day.count} contributions on ${day.date}`}
                    role="gridcell"
                    aria-label={`${day.count} contributions on ${day.date}`}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-end gap-2 mt-4">
          <span className="text-xs text-gray-500">Less</span>
          {[0, 1, 2, 3, 4].map((level) => (
            <div
              key={level}
              className="rounded-sm"
              style={{
                width: CELL_SIZE,
                height: CELL_SIZE,
                backgroundColor: getColorForLevel(level),
              }}
            />
          ))}
          <span className="text-xs text-gray-500">More</span>
        </div>
      </div>
    </div>
  );
}
