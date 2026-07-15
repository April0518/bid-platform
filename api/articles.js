const { seedArticles } = require('./data');

// In-memory article store (persists while serverless function is warm)
let articles = [...seedArticles];

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const { pathname } = new URL(req.url, `http://${req.headers.host}`);
  const pathParts = pathname.replace('/api/articles', '').split('/').filter(Boolean);

  try {
    // GET /api/articles/filters/options
    if (req.method === 'GET' && pathParts[0] === 'filters') {
      const sources = [...new Set(articles.map(a => a.source))];
      const categories = [...new Set(articles.map(a => a.category))];
      return res.json({ status: 'ok', data: { sources, categories } });
    }

    // GET /api/articles (with filters)
    if (req.method === 'GET' && !pathParts[0]) {
      const keyword = req.query.keyword || '';
      const category = req.query.category || '';
      const source = req.query.source || '';
      const startDate = req.query.startDate || '';
      const endDate = req.query.endDate || '';
      const page = parseInt(req.query.page) || 1;
      const pageSize = parseInt(req.query.pageSize) || 10;

      let filtered = [...articles];
      if (keyword) { const kw = keyword.toLowerCase(); filtered = filtered.filter(a => a.title.toLowerCase().includes(kw) || a.keywords.some(k => k.toLowerCase().includes(kw))); }
      if (category) filtered = filtered.filter(a => a.category === category);
      if (source) filtered = filtered.filter(a => a.source === source);
      if (startDate) filtered = filtered.filter(a => a.publishDate >= startDate);
      if (endDate) filtered = filtered.filter(a => a.publishDate <= endDate);

      const total = filtered.length;
      const totalPages = Math.ceil(total / pageSize);
      const items = filtered.slice((page - 1) * pageSize, page * pageSize);

      return res.json({ status: 'ok', data: { items, pagination: { page, pageSize, total, totalPages } } });
    }

    // GET /api/articles/:id
    if (req.method === 'GET' && pathParts[0]) {
      const article = articles.find(a => a.id === pathParts[0]);
      if (!article) return res.status(404).json({ status: 'error', message: '文章不存在' });
      return res.json({ status: 'ok', data: article });
    }

    // POST /api/articles
    if (req.method === 'POST') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const now = new Date().toISOString();
      const article = {
        id: `art_${Date.now()}`,
        title: body.title || '未命名',
        source: body.source || '手动添加',
        url: body.url || '',
        publishDate: body.publishDate || now.split('T')[0],
        summary: body.summary || '',
        content: body.content || '',
        keywords: body.keywords || [],
        category: body.category || '其他',
        createdAt: now,
      };
      articles.unshift(article);
      return res.status(201).json({ status: 'ok', data: article });
    }

    // DELETE /api/articles/:id
    if (req.method === 'DELETE' && pathParts[0]) {
      const idx = articles.findIndex(a => a.id === pathParts[0]);
      if (idx === -1) return res.status(404).json({ status: 'error', message: '文章不存在' });
      articles.splice(idx, 1);
      return res.json({ status: 'ok', message: '删除成功' });
    }

    return res.status(404).json({ status: 'error', message: 'Not found' });
  } catch (err) {
    return res.status(500).json({ status: 'error', message: err.message });
  }
};
