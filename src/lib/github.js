const GITHUB_API = "https://api.github.com";
const cache = new Map();
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes

async function githubFetch(url) {
  const cached = cache.get(url);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }

  const headers = { Accept: "application/vnd.github+json" };
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  const res = await fetch(url, { headers, next: { revalidate: 600 } });
  if (!res.ok) return null;

  const data = await res.json();
  cache.set(url, { data, timestamp: Date.now() });
  return data;
}

export async function getGitHubProfile(username) {
  if (!username) return null;
  const clean = username.replace(/^@/, "").trim();
  if (!clean) return null;

  try {
    const profile = await githubFetch(`${GITHUB_API}/users/${clean}`);
    if (!profile) return null;

    const [repos, events] = await Promise.all([
      githubFetch(`${GITHUB_API}/users/${clean}/repos?sort=updated&per_page=20&type=owner`),
      githubFetch(`${GITHUB_API}/users/${clean}/events/public?per_page=30`),
    ]);

    // Calculate top languages
    const langCount = {};
    (repos || []).forEach((repo) => {
      if (repo.language) {
        langCount[repo.language] = (langCount[repo.language] || 0) + 1;
      }
    });
    const topLanguages = Object.entries(langCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([name, count]) => ({ name, count }));

    // Sort repos by stars
    const topRepos = (repos || [])
      .filter((r) => !r.fork)
      .sort((a, b) => b.stargazers_count - a.stargazers_count)
      .slice(0, 6)
      .map((r) => ({
        name: r.name,
        description: r.description,
        language: r.language,
        stars: r.stargazers_count,
        forks: r.forks_count,
        url: r.html_url,
        updatedAt: r.updated_at,
      }));

    // Recent activity from events
    const recentActivity = (events || []).slice(0, 10).map((e) => ({
      type: e.type,
      repo: e.repo?.name,
      createdAt: e.created_at,
    }));

    return {
      login: profile.login,
      name: profile.name,
      avatar: profile.avatar_url,
      bio: profile.bio,
      company: profile.company,
      location: profile.location,
      blog: profile.blog,
      publicRepos: profile.public_repos,
      followers: profile.followers,
      following: profile.following,
      createdAt: profile.created_at,
      htmlUrl: profile.html_url,
      topRepos,
      topLanguages,
      recentActivity,
    };
  } catch {
    return null;
  }
}
