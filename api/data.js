// 重点关注分类
const CATEGORIES = ['碳排放', '绿色制造', '零碳园区', '温室气体', '零碳工厂'];

// 重点关注关键词
const KEYWORDS = ['碳足迹', '温室气体', '绿色工厂', '零碳园区', '零碳工厂', '碳排放', '碳中和', '碳达峰', '绿色制造', '碳交易', '碳核查', '节能减排'];

const SOURCES = ['中国政府采购网', '中国招标投标公共服务平台', 'XX省公共资源交易中心', 'XX市采购网'];

function seedArticles() {
  const articles = [];
  const today = new Date();
  const sampleTitles = [
    { t: (d) => `XX省${d}年度重点企业碳排放核查服务采购项目招标公告`, cat: '碳排放', kws: ['碳排放', '碳核查'] },
    { t: (d) => `XX市零碳产业园区总体规划编制项目公开招标`, cat: '零碳园区', kws: ['零碳园区'] },
    { t: (d) => `XX省${d}年绿色工厂评价技术服务项目竞争性磋商`, cat: '绿色制造', kws: ['绿色工厂', '绿色制造'] },
    { t: (d) => `XX市重点企业温室气体排放清单编制项目招标`, cat: '温室气体', kws: ['温室气体'] },
    { t: (d) => `XX经济技术开发区零碳工厂试点创建方案编制招标`, cat: '零碳工厂', kws: ['零碳工厂'] },
    { t: (d) => `XX集团产品碳足迹核算与认证服务采购项目招标`, cat: '碳排放', kws: ['碳足迹'] },
    { t: (d) => `XX省${d}年度碳达峰碳中和专项资金项目申报服务`, cat: '碳排放', kws: ['碳中和', '碳达峰'] },
    { t: (d) => `XX市近零碳园区建设实施方案编制服务采购公告`, cat: '零碳园区', kws: ['零碳园区'] },
    { t: (d) => `XX省${d}年度绿色制造名单申报辅导服务招标`, cat: '绿色制造', kws: ['绿色制造'] },
    { t: (d) => `XX市重点企业碳排放权交易服务采购项目招标`, cat: '碳排放', kws: ['碳排放', '碳交易'] },
    { t: (d) => `XX省${d}年度温室气体排放数据质量管理项目招标`, cat: '温室气体', kws: ['温室气体'] },
    { t: (d) => `XX市绿色工厂创建实施方案编制服务采购`, cat: '绿色制造', kws: ['绿色工厂'] },
    { t: (d) => `XX省${d}年度产品碳足迹标识认证试点项目招标`, cat: '碳排放', kws: ['碳足迹'] },
    { t: (d) => `XX零碳产业示范园区基础设施建设项目招标公告`, cat: '零碳园区', kws: ['零碳园区'] },
    { t: (d) => `XX公司零碳工厂技术改造项目设备采购招标`, cat: '零碳工厂', kws: ['零碳工厂'] },
    { t: (d) => `XX省${d}年节能减排技术服务政府采购项目`, cat: '碳排放', kws: ['碳排放', '节能减排'] },
    { t: (d) => `XX市碳排放达峰行动方案编制服务项目招标`, cat: '碳排放', kws: ['碳排放', '碳达峰'] },
    { t: (d) => `XX省${d}年度绿色供应链管理企业评价服务招标`, cat: '绿色制造', kws: ['绿色制造', '绿色供应链'] },
    { t: (d) => `XX市产业园区碳排放核算方法研究项目采购`, cat: '碳排放', kws: ['碳排放'] },
    { t: (d) => `XX省${d}年度碳资产管理咨询服务项目招标公告`, cat: '碳排放', kws: ['碳排放'] },
    { t: (d) => `XX市绿色低碳技术推广服务采购项目公开招标`, cat: '绿色制造', kws: ['绿色制造'] },
    { t: (d) => `XX零碳科创园区智慧能源管理系统建设项目招标`, cat: '零碳园区', kws: ['零碳园区'] },
    { t: (d) => `XX省重点行业碳足迹数据库建设服务项目招标`, cat: '碳排放', kws: ['碳足迹'] },
    { t: (d) => `XX市近零碳工厂评价指标体系研究服务采购`, cat: '零碳工厂', kws: ['零碳工厂'] },
    { t: (d) => `XX省${d}年度温室气体清单编制服务项目招标`, cat: '温室气体', kws: ['温室气体'] },
    { t: (d) => `XX市碳达峰试点园区建设实施方案编制招标`, cat: '零碳园区', kws: ['零碳园区', '碳达峰'] },
    { t: (d) => `XX省${d}年度绿色产品认证服务采购项目招标`, cat: '绿色制造', kws: ['绿色制造'] },
    { t: (d) => `XX公司碳排放管理体系建设项目服务采购招标`, cat: '碳排放', kws: ['碳排放'] },
    { t: (d) => `XX市零碳示范区建设规划编制项目公开招标`, cat: '零碳园区', kws: ['零碳园区'] },
    { t: (d) => `XX省${d}年度碳减排技术路径研究项目招标公告`, cat: '碳排放', kws: ['碳排放', '碳减排'] },
  ];

  for (let i = 0; i < sampleTitles.length; i++) {
    const daysAgo = Math.floor(Math.random() * 45);
    const d = new Date(today);
    d.setDate(d.getDate() - daysAgo);
    const pubDate = d.toISOString().split('T')[0];
    const year = d.getFullYear();
    const source = SOURCES[Math.floor(Math.random() * SOURCES.length)];
    const item = sampleTitles[i];
    
    articles.push({
      id: `art_seed_${i}`,
      title: item.t(year),
      source,
      url: '',
      publishDate: pubDate,
      summary: `${item.cat}相关招投标信息，发布日期：${pubDate}，来源：${source}`,
      content: `招标公告\n\n项目名称：${item.t(year)}\n\n项目概况\n根据《中华人民共和国招标投标法》及相关法律法规，现对该项目进行公开招标，欢迎符合条件的供应商参与投标。\n\n投标人资格要求\n1. 具有独立法人资格；\n2. 具有相关领域服务经验；\n3. 近三年内无重大违法记录。\n\n招标文件的获取\n请于公告发布之日起联系采购人获取招标文件。`,
      keywords: item.kws,
      category: item.cat,
      createdAt: d.toISOString(),
    });
  }
  return articles.sort((a, b) => new Date(b.publishDate) - new Date(a.publishDate));
}

function seedReports(articles) {
  const now = new Date();
  const today = now.toISOString().split('T')[0];
  const day = now.getDay();
  const weekStart = new Date(now); weekStart.setDate(now.getDate() - ((day + 6) % 7));
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  const weekEnd = new Date(weekStart); weekEnd.setDate(weekStart.getDate() + 6);
  return [
    mkReport(articles, 'daily', today, today, '日报'),
    mkReport(articles, 'weekly', weekStart.toISOString().split('T')[0], weekEnd.toISOString().split('T')[0], '周报'),
    mkReport(articles, 'monthly', monthStart.toISOString().split('T')[0], monthEnd.toISOString().split('T')[0], '月报'),
  ];
}

function mkReport(articles, type, start, end, label) {
  const pas = articles.filter(a => a.publishDate >= start && a.publishDate <= end);
  const kwMap = new Map(); pas.forEach(a => a.keywords.forEach(k => kwMap.set(k, (kwMap.get(k)||0)+1)));
  const keywords = Array.from(kwMap.entries()).sort((a,b)=>b[1]-a[1]).slice(0,15).map(([w,c])=>({word:w,count:c}));
  const catMap = new Map(); pas.forEach(a => catMap.set(a.category, (catMap.get(a.category)||0)+1));
  const catStats = Array.from(catMap.entries()).map(([c,n])=>({category:c,count:n}));
  return {
    id: `rpt_${type}_${start}`, type,
    title: `招投标信息${label}（${start} ~ ${end}）`,
    periodStart: start, periodEnd: end,
    articleCount: pas.length,
    summary: `本期（${start} 至 ${end}）共收录招投标信息 ${pas.length} 条，涉及 ${catStats.length} 个类别。${catStats.sort((a,b)=>b.count-a.count).slice(0,3).map(c=>`${c.category} ${c.count} 条`).join('、')}。`,
    articles: pas.map(a => ({id:a.id,title:a.title,source:a.source,publishDate:a.publishDate,category:a.category})),
    keywords, categoryStats: catStats,
    createdAt: new Date().toISOString(),
  };
}

module.exports = { seedArticles: seedArticles(), seedReports: seedReports(seedArticles()), CATEGORIES, KEYWORDS };
