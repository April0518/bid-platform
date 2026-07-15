const { seedArticles } = require('./data');
let articles = [...seedArticles];

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  try {
    // GET /api/stats/overview
    if (req.url?.includes('/overview') || req.url === '/api/stats' || req.url === '/api/stats/') {
      const now = new Date();
      const todayStr = now.toISOString().split('T')[0];
      const dayOfWeek = now.getDay();
      const weekStart = new Date(now); weekStart.setDate(now.getDate() - ((dayOfWeek + 6) % 7));
      const monthStartStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`;

      const catMap = new Map();
      articles.forEach(a => catMap.set(a.category, (catMap.get(a.category) || 0) + 1));
      const srcMap = new Map();
      articles.forEach(a => srcMap.set(a.source, (srcMap.get(a.source) || 0) + 1));

      const data = {
        total: articles.length,
        todayCount: articles.filter(a => a.publishDate === todayStr).length,
        weekCount: articles.filter(a => a.publishDate >= weekStart.toISOString().split('T')[0]).length,
        monthCount: articles.filter(a => a.publishDate >= monthStartStr).length,
        categoryDistribution: Array.from(catMap.entries()).map(([c, n]) => ({ category: c, count: n })).sort((a, b) => b.count - a.count),
        sourceDistribution: Array.from(srcMap.entries()).map(([s, n]) => ({ source: s, count: n })).sort((a, b) => b.count - a.count),
      };

      if (req.url?.includes('/overview')) {
        return res.json({ status: 'ok', data });
      }
      return res.json({ status: 'ok', data });
    }

    // GET /api/stats/trend
    if (req.url?.includes('/trend')) {
      const monthMap = new Map();
      articles.forEach(a => { const m = a.publishDate.substring(0, 7); monthMap.set(m, (monthMap.get(m) || 0) + 1); });
      const trend = Array.from(monthMap.entries()).sort((a, b) => a[0].localeCompare(b[0])).map(([m, c]) => ({ month: m, count: c }));
      const kwMap = new Map();
      articles.forEach(a => a.keywords.forEach(k => kwMap.set(k, (kwMap.get(k) || 0) + 1)));
      const topKeywords = Array.from(kwMap.entries()).sort((a, b) => b[1] - a[1]).slice(0, 20).map(([w, c]) => ({ word: w, count: c }));
      return res.json({ status: 'ok', data: { trend, topKeywords } });
    }

    return res.status(404).json({ status: 'error', message: 'Not found' });
  } catch (err) {
    return res.status(500).json({ status: 'error', message: err.message });
  }
};
