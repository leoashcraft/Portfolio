// GitHub API utilities
const GITHUB_USERNAME = 'leoashcraft';

export interface GitHubRepo {
  name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  updated_at: string;
  topics: string[];
}

export interface ContributionDay {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

export interface ContributionWeek {
  days: ContributionDay[];
}

export interface GitHubStats {
  totalContributions: number;
  weeks: ContributionWeek[];
}

// Specific repos to display
const FEATURED_REPOS = [
  'Portfolio',
  'Dawn-of-the-Devs',
  'Now-Then-Begin',
];

// Fetch public repos (no token needed for public data)
export async function getPublicRepos(): Promise<GitHubRepo[]> {
  try {
    // Fetch each specific repo
    const repoPromises = FEATURED_REPOS.map(repoName =>
      fetch(`https://api.github.com/repos/${GITHUB_USERNAME}/${repoName}`, {
        headers: {
          Accept: 'application/vnd.github.v3+json',
        },
      }).then(res => {
        if (!res.ok) throw new Error(`Failed to fetch ${repoName}`);
        return res.json();
      }).catch(err => {
        console.error(`Failed to fetch repo ${repoName}:`, err);
        return null;
      })
    );

    const repos = await Promise.all(repoPromises);
    // Filter out any failed fetches
    return repos.filter((repo): repo is GitHubRepo => repo !== null);
  } catch (error) {
    console.error('Failed to fetch GitHub repos:', error);
    return [];
  }
}

// Fetch user profile stats
export async function getGitHubProfile() {
  try {
    const response = await fetch(
      `https://api.github.com/users/${GITHUB_USERNAME}`,
      {
        headers: {
          Accept: 'application/vnd.github.v3+json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error('Failed to fetch GitHub profile:', error);
    return null;
  }
}

// Fetch real contribution data from GitHub GraphQL API
export async function fetchContributionData(token?: string): Promise<GitHubStats> {
  const githubToken = token || import.meta.env.GITHUB_TOKEN;

  if (!githubToken) {
    console.warn('No GitHub token available, using generated data');
    return generateContributionData();
  }

  const query = `
    query($username: String!) {
      user(login: $username) {
        contributionsCollection {
          contributionCalendar {
            totalContributions
            weeks {
              contributionDays {
                date
                contributionCount
                contributionLevel
              }
            }
          }
        }
      }
    }
  `;

  try {
    const response = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${githubToken}`,
      },
      body: JSON.stringify({
        query,
        variables: { username: GITHUB_USERNAME },
      }),
    });

    if (!response.ok) {
      throw new Error(`GitHub GraphQL API error: ${response.status}`);
    }

    const data = await response.json();

    if (data.errors) {
      console.error('GraphQL errors:', data.errors);
      return generateContributionData();
    }

    const calendar = data.data.user.contributionsCollection.contributionCalendar;

    // Map contribution levels to our format
    const levelMap: Record<string, 0 | 1 | 2 | 3 | 4> = {
      NONE: 0,
      FIRST_QUARTILE: 1,
      SECOND_QUARTILE: 2,
      THIRD_QUARTILE: 3,
      FOURTH_QUARTILE: 4,
    };

    const weeks: ContributionWeek[] = calendar.weeks.map((week: { contributionDays: { date: string; contributionCount: number; contributionLevel: string }[] }) => ({
      days: week.contributionDays.map((day: { date: string; contributionCount: number; contributionLevel: string }) => ({
        date: day.date,
        count: day.contributionCount,
        level: levelMap[day.contributionLevel] ?? 0,
      })),
    }));

    return {
      totalContributions: calendar.totalContributions,
      weeks,
    };
  } catch (error) {
    console.error('Failed to fetch GitHub contributions:', error);
    return generateContributionData();
  }
}

// Generate mock contribution data (fallback when no token available)
export function generateContributionData(): GitHubStats {
  const weeks: ContributionWeek[] = [];
  const today = new Date();
  let totalContributions = 0;

  // Generate 52 weeks of data
  for (let w = 51; w >= 0; w--) {
    const days: ContributionDay[] = [];

    for (let d = 0; d < 7; d++) {
      const date = new Date(today);
      date.setDate(date.getDate() - (w * 7 + (6 - d)));

      // Generate realistic-looking contribution counts
      // More activity on weekdays, occasional spikes
      const isWeekend = d === 0 || d === 6;
      const baseChance = isWeekend ? 0.3 : 0.6;
      const hasContribution = Math.random() < baseChance;

      let count = 0;
      let level: 0 | 1 | 2 | 3 | 4 = 0;

      if (hasContribution) {
        // Weighted random for contribution count
        const rand = Math.random();
        if (rand < 0.5) {
          count = Math.floor(Math.random() * 3) + 1; // 1-3
          level = 1;
        } else if (rand < 0.8) {
          count = Math.floor(Math.random() * 5) + 4; // 4-8
          level = 2;
        } else if (rand < 0.95) {
          count = Math.floor(Math.random() * 7) + 9; // 9-15
          level = 3;
        } else {
          count = Math.floor(Math.random() * 10) + 16; // 16-25
          level = 4;
        }
        totalContributions += count;
      }

      days.push({
        date: date.toISOString(),
        count,
        level,
      });
    }

    weeks.push({ days });
  }

  return { totalContributions, weeks };
}

// Language colors for repo display
export const languageColors: Record<string, string> = {
  TypeScript: '#3178c6',
  JavaScript: '#f1e05a',
  Python: '#3572A5',
  PHP: '#4F5D95',
  HTML: '#e34c26',
  CSS: '#563d7c',
  Shell: '#89e051',
  Rust: '#dea584',
  Go: '#00ADD8',
  Java: '#b07219',
  Ruby: '#701516',
  Vue: '#41b883',
  Svelte: '#ff3e00',
};
