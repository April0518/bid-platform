const { seedArticles, seedReports, generateSeedReports } = require('./data');

let articles = [...seedArticles];
let reports = [...seedReports];

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const { pathname } = new URL(req.url, `http://${req.headers.host}`);
  const pathParts = pathname.replace('/api/reports', '').split('/').filter(Boolean);

  try {
    // GET /api/reports
    if (req.method === 'GET' && !pathParts[0]) {
      const type = req.query.type || '';
      let filtered = [...reports];
      if (type) filtered = filtered.filter(r => r.type === type);
      filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      return res.json({ status: 'ok', data: { items: filtered } });
    }

    // GET /api/reports/:id
    if (req.method === 'GET' && pathParts[0]) {
      const report = reports.find(r => r.id === pathParts[0]);
      if (!report) return res.status(404).json({ status: 'error', message: '报告不存在' });
      return res.json({ status: 'ok', data: report });
    }

    // POST /api/reports/generate
    if (req.method === 'POST') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const { type, date } = body;
      if (!['daily', 'weekly', 'monthly'].includes(type)) {
        return res.status(400).json({ status: 'error', message: '无效的报告类型' });
      }
      const now = date ? new Date(date) : new Date();
      let start, end;
      if (type === 'daily') {
        start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        end = new Date(start); end.setHours(23, 59, 59, 999);
      } else if (type === 'weekly') {
        const day = now.getDay();
        start = new Date(now); start.setDate(now.getDate() - ((day + 6) % 7)); start.setHours(0, 0, 0, 0);
        end = new Date(start); end.setDate(start.getDate() + 6); end.setHours(23, 59, 59, 999);
      } else {
        start = new Date(now.getFullYear(), now.getMonth(), 1);
        end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
      }
      const sStr = start.toISOString().split('T')[0];
      const eStr = end.toISOString().split('T')[0];
      const periodArticles = articles.filter(a => a.publishDate >= sStr && a.publishDate <= eStr);
      const kwMap = new Map();
      periodArticles.forEach(a => a.keywords.forEach(k => kwMap.set(k, (kwMap.get(k) || 0) + 1)));
      const keywords = Array.from(kwMap.entries()).sort((a, b) => b[1] - a[1]).slice(0, 15).map(([w, c]) => ({ word: w, count: c }));
      const catMap = new Map();
      periodArticles.forEach(a => catMap.set(a.category, (catMap.get(a.category) || 0) + 1));
      const categoryStats = Array.from(catMap.entries()).map(([c, n]) => ({ category: c, count: n }));
      const typeLabel = { daily: '日报', weekly: '周报', monthly: '月报' }[type];
      const summary = `本期（${sStr} 至 ${eStr}）共收录招投标信息 ${periodArticles.length} 条，涉及 ${categoryStats.length} 个类别。`;
      const report = {
        id: `rpt_${type}_${sStr}`,
        type, title: `招投标信息${typeLabel}（${sStr} ~ ${eStr}）`,
        periodStart: sStr, periodEnd: eStr,
        articleCount: periodArticles.length, summary,
        articles: periodArticles.map(a => ({ id: a.id, title: a.title, source: a.source, publishDate: a.publishDate, category: a.category })),
        keywords, categoryStats, createdAt: new Date().toISOString(),
      };
      const existingIdx = reports.findIndex(r => r.type === type && r.periodStart === sStr);
      if (existingIdx >= 0) reports[existingIdx] = report;
      else reports.unshift(report);
      return res.status(201).json({ status: 'ok', data: report });
    }

    return res.status(404).json({ status: 'error', message: 'Not found' });
  } catch (err) {
    return res.status(500).json({ status: 'error', message: err.message });
  }
};
