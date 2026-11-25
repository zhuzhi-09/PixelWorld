/* Pixel World 网页演示：纯前端复刻启动器当前的界面（侧栏导航版），数据大多是示例，不会真正下载或启动游戏。
   版本列表、版本动态、模组资源和服务器查询会尽量读取真实接口，失败时保留示例数据。 */
(function () {
  'use strict';
  var host = document.getElementById('pw-demo') || document.getElementById('pcl-demo');
  if (!host) return;
  try { start(host); } catch (e) {
    if (window.console) console.error(e);
    host.innerHTML = '<p class="pd-noscript">演示加载失败，请刷新页面重试。</p>';
  }

  function start(host) {
    var W = 1100, H = 700;
    var REPO = 'https://github.com/zhuzhi-09/PixelWorld';

    /* ---------- 示例数据 ---------- */
    var LOADERS = {
      fabric: { n: 'Fabric', c: '#c9b88f', fg: '#3b3226', a: 'F' },
      forge: { n: 'Forge', c: '#30475e', fg: '#fff', a: 'F' },
      neoforge: { n: 'NeoForge', c: '#d9732f', fg: '#fff', a: 'N' },
      quilt: { n: 'Quilt', c: '#8a4fb8', fg: '#fff', a: 'Q' },
      optifine: { n: 'OptiFine', c: '#b8322a', fg: '#fff', a: 'O' },
      cleanroom: { n: 'Cleanroom', c: '#3a7ca5', fg: '#fff', a: 'C' },
      labymod: { n: 'LabyMod', c: '#2153a8', fg: '#fff', a: 'L' },
      legacyfabric: { n: 'Legacy Fabric', c: '#9c8a63', fg: '#fff', a: 'LF' },
      liteloader: { n: 'LiteLoader', c: '#4b8fd6', fg: '#fff', a: 'Li' }
    };
    var LOADER_ORDER = [null, 'forge', 'neoforge', 'cleanroom', 'labymod', 'fabric', 'quilt', 'legacyfabric', 'liteloader'];
    var LOADER_HINT = {
      '': '纯净的 Minecraft', forge: '历史最久、模组最多的加载器', neoforge: '从 Forge 分出的社区版，1.20.1 起可用',
      cleanroom: '基于 Forge 的 1.12.2 现代化分支，需要 Java 21', labymod: '自带大量功能的整合客户端（LabyMod 4）',
      fabric: '轻量、更新快的模组加载器', quilt: '兼容大部分 Fabric 模组', legacyfabric: '为 1.13.2 及更早版本移植的 Fabric',
      liteloader: '1.12.2 及更早版本的轻量加载器'
    };
    var INST = [
      { id: '1.21.1-Fabric', mc: '1.21.1', ld: 'fabric', lv: 'fabric-loader-0.16.9-1.21.1', mods: 12, ago: '2 天前' },
      { id: '1.21.4', mc: '1.21.4', ld: null, mods: 0, ago: '5 天前' },
      { id: '1.20.1-Forge', mc: '1.20.1', ld: 'forge', lv: 'forge-47.3.0', mods: 86, ago: '上周' },
      { id: '1.21.1-NeoForge', mc: '1.21.1', ld: 'neoforge', lv: 'neoforge-21.1.172', mods: 34, ago: '2 周前' },
      { id: '1.12.2-OptiFine', mc: '1.12.2', ld: 'optifine', lv: 'OptiFine_HD_U_G5', mods: 0, ago: '还没玩过' }
    ];
    var WORLDS = [
      { n: '新的世界', i: 0, ago: '2 天前', c: '#6aa84f', sky: '#7fb3e6' },
      { n: '生存服务器备份', i: 2, ago: '4 天前', c: '#b5793b', sky: '#e0a45d' },
      { n: '红石实验室', i: 1, ago: '5 天前', c: '#b33a3a', sky: '#5d6b8a' },
      { n: '空岛生存', i: 0, ago: '6 天前', c: '#4c9ed9', sky: '#9fd0f2' },
      { n: '机械动力工厂', i: 3, ago: '2 周前', c: '#9c7b4a', sky: '#c4a77a' },
      { n: '樱花村庄', i: 1, ago: '3 周前', c: '#e58fb2', sky: '#f6c9dc' },
      { n: '下界要塞', i: 2, ago: '1 个月前', c: '#8e2b2b', sky: '#4a1f1f' },
      { n: '海底神殿', i: 0, ago: '2 个月前', c: '#2c8a8a', sky: '#1f5f7a' }
    ];
    var NEWS = [
      { k: '快照', id: '26.4-snapshot-7', d: '2026-11-03', t: '这是一条示例动态：新快照加入了一些方块与音乐唱片，调整了部分生物的行为，并修复了若干漏洞。', c: 'linear-gradient(180deg,#5b87c9 0 52%,#5e9c42 52% 60%,#7a5535 60%)' },
      { k: '正式版', id: '1.21.4', d: '2024-12-03', t: '这是一条示例动态：正式版更新带来了新的群系氛围与方块外观，并优化了游戏性能。', c: 'linear-gradient(180deg,#d8a35a 0 40%,#a4723b 40% 58%,#6b4a2f 58%)' },
      { k: '快照', id: '26.4-snapshot-6', d: '2026-10-27', t: '这是一条示例动态：上一个快照调整了部分合成配方，并改进了光照与渲染表现。', c: 'linear-gradient(180deg,#2d3552 0 45%,#3f6b4a 45% 62%,#4a3a2c 62%)' }
    ];
    var DL = {
      release: [['1.21.4', '2024-12-03'], ['1.21.3', '2024-10-23'], ['1.21.1', '2024-08-08'], ['1.20.6', '2024-04-29'], ['1.20.4', '2023-12-07'], ['1.20.1', '2023-06-12'], ['1.19.4', '2023-03-14'], ['1.18.2', '2022-02-28'], ['1.16.5', '2021-01-15'], ['1.12.2', '2017-09-18'], ['1.8.9', '2015-12-09'], ['1.7.10', '2014-06-26']],
      snapshot: [['26.4-snapshot-7', '2026-11-03'], ['26.4-snapshot-6', '2026-10-27'], ['26.4-snapshot-5', '2026-10-20']],
      old: [['b1.7.3', '2011-07-08'], ['a1.2.6', '2010-12-03'], ['c0.30_01c', '2009-12-22']],
      fool: [['25w14craftmine', '2025-04-01'], ['24w14potato', '2024-04-01'], ['23w13a_or_b', '2023-04-01'], ['20w14infinite', '2020-04-01']]
    };
    var LATEST = { release: '1.21.4', snapshot: '26.4-snapshot-7' };
    var RES_TABS = [['mods', '模组', 'mod'], ['modpacks', '整合包', 'modpack'], ['resourcePacks', '资源包', 'resourcepack'], ['shaders', '光影', 'shader'], ['datapacks', '数据包', 'datapack']];
    var RES = {
      mods: [['Sodium', '现代化的渲染引擎，大幅提升帧率', 2400], ['Lithium', '优化游戏逻辑与服务端性能', 1900], ['Iris Shaders', '兼容 OptiFine 光影包的光影加载器', 1600], ['Fabric API', 'Fabric 模组的基础库', 9000], ['Mod Menu', '在游戏里查看已安装的模组', 3000]],
      modpacks: [['Fabulously Optimized', '以性能优化为主的轻量整合包', 850], ['Simply Optimized', '精简的性能整合包', 120], ['Adventure Pack', '示例整合包：探索与冒险', 40]],
      resourcePacks: [['Faithful 32x', '保持原版风格的高清材质', 1200], ['Vanilla Tweaks', '原版风格的小改动合集', 500], ['Fresh Animations', '为生物添加更细腻的动画', 700]],
      shaders: [['Complementary Reimagined', '画面自然、性能友好的光影', 1100], ['BSL Shaders', '经典的高画质光影', 900], ['Photon', '示例光影：柔和的色调', 60]],
      datapacks: [['Terralith', '重塑地形与群系的数据包', 1500], ['Incendium', '重制下界的数据包', 600], ['Tectonic', '示例数据包：高耸的山脉', 300]]
    };
    var MODS = ['Sodium', 'Lithium', 'Iris Shaders', 'Fabric API', 'Mod Menu', 'Xaero 的小地图', 'JEI', 'Create 机械动力', 'AppleSkin', 'Jade', 'Farmer\'s Delight', 'Waystones'];

    var S = {
      page: 'home', sub: null, inst: 0, detail: 0, detailTab: 'overview',
      dlTab: 'versions', filt: 'release', vq: '', dlSel: null, ld: null, ldv: 0, of: false, iname: '',
      resQ: '', setSec: 'launch', toolSec: 'transfer', running: false,
      theme: 'system', seed: 'green', layout: 'min', bg: true, sw: {}, sel: {}, txt: {},
      accounts: [{ n: 'Steve', t: '正版' }, { n: 'Alex', t: '离线' }], acc: 0,
      tasks: [], ai: [], instQ: '', menu: null
    };

    /* ---------- 小工具 ---------- */
    function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
    function ic(n, cls) { return '<span class="ic' + (cls ? ' ' + cls : '') + '" aria-hidden="true">' + n + '</span>'; }
    function act(a, v, k) { return ' data-a="' + a + '"' + (v != null ? ' data-v="' + esc(v) + '"' : '') + (k != null ? ' data-k="' + esc(k) + '"' : ''); }
    function btn(kind, label, icon, a, v, extra) {
      return '<button type="button" class="b hv ' + kind + '"' + act(a || 'tip', v == null ? label : v) + (extra || '') + '>' + (icon ? ic(icon) : '') + esc(label) + '</button>';
    }
    function lnk(kind, label, url, icon) {
      return '<a class="b hv ' + kind + '" href="' + esc(url) + '" target="_blank" rel="noopener noreferrer">' + (icon ? ic(icon) : '') + esc(label) + '</a>';
    }
    function swOn(k, d) { return k in S.sw ? S.sw[k] : d; }
    function sw(k, d) { return '<button type="button" class="sw" role="switch" aria-checked="' + swOn(k, d) + '"' + act('sw', d ? 1 : 0, k) + '></button>'; }
    function selOf(k, d) { return k in S.sel ? S.sel[k] : d; }
    function dd(k, opts, d, w) {
      var cur = selOf(k, d);
      return '<span class="dd"><select data-sel="' + k + '"' + (w ? ' style="min-width:' + w + 'px"' : '') + '>' + opts.map(function (o) {
        return '<option value="' + esc(o[0]) + '"' + (o[0] === cur ? ' selected' : '') + '>' + esc(o[1]) + '</option>';
      }).join('') + '</select>' + ic('arrow_drop_down') + '</span>';
    }
    function tf(k, ph, w) {
      return '<input class="tf" type="text" data-t="' + k + '" placeholder="' + esc(ph || '') + '" value="' + esc(S.txt[k] || '') + '" autocomplete="off" spellcheck="false"' + (w ? ' style="width:' + (typeof w === 'number' ? w + 'px' : w) + '"' : '') + '>';
    }
    function row(icon, title, sub, trail) {
      return '<div class="lt">' + (icon ? ic(icon) : '') + '<div class="t"><div class="t1">' + title + '</div>' + (sub ? '<div class="t2">' + sub + '</div>' : '') + '</div>' + (trail ? '<div class="trail">' + trail + '</div>' : '') + '</div>';
    }
    function grp(title, rows) { return '<div class="grp"><h3>' + esc(title) + '</h3><div class="gc">' + rows.join('') + '</div></div>'; }
    function snav(groups, cur, a) {
      return '<nav class="snav">' + groups.map(function (g) {
        return '<div class="sgt">' + esc(g[0]) + '</div>' + g[1].map(function (it) {
          return '<button type="button" class="si hv' + (it[0] === cur ? ' on' : '') + '"' + act(a, it[0]) + '>' + ic(it[2]) + '<span>' + esc(it[1]) + '</span>' + (it[3] ? '<span class="tr">' + esc(it[3]) + '</span>' : '') + '</button>';
        }).join('');
      }).join('') + '</nav>';
    }
    function split(nav, inner, key) { return '<div class="split">' + nav + '<div class="panel"><div class="scr" data-s="' + key + '">' + inner + '</div></div></div>'; }
    function empty(icon, title, sub, extra) { return '<div class="empty">' + ic(icon) + '<div class="tt">' + esc(title) + '</div>' + (sub ? '<div>' + esc(sub) + '</div>' : '') + (extra || '') + '</div>'; }
    function dlCount(n) { return n >= 1e8 ? (n / 1e8).toFixed(1) + ' 亿' : n >= 1e4 ? Math.round(n / 1e4) + ' 万' : String(n); }

    function instTitle(v) { return v.ld ? v.mc + ' ' + LOADERS[v.ld].n : v.mc; }
    function vicon(v, size) {
      size = size || 44;
      var st = 'width:' + size + 'px;height:' + size + 'px;';
      if (!v.ld) return '<span class="vico" style="' + st + 'background:linear-gradient(180deg,#6fae3c 0 34%,#8b5a2b 34%);box-shadow:inset 0 -' + Math.round(size * .12) + 'px 0 rgb(0 0 0 / .15)"></span>';
      var L = LOADERS[v.ld];
      return '<span class="vico" style="' + st + 'background:' + L.c + ';color:' + L.fg + ';font-weight:800;font-size:' + Math.round(size * .36) + 'px">' + L.a + '</span>';
    }
    function cur() { return INST[S.inst]; }
    function glassOn() { return S.bg && S.layout !== 'std'; }
    function account() { return S.accounts[S.acc]; }
    function worldThumb(w) {
      return 'background:linear-gradient(180deg,' + w.sky + ' 0 46%,' + w.c + ' 46% 64%,#6b4a2f 64%)';
    }

    /* ---------- 侧栏与顶栏 ---------- */
    var NAV = [['home', '启动', 'rocket_launch'], ['download', '下载', 'download'], ['tools', '工具', 'construction'], ['accounts', '账户', 'person'], ['settings', '设置', 'settings'], ['ai', 'AI', 'chat_bubble']];
    var TITLES = { download: '下载', tools: '工具', accounts: '账户', settings: '设置', ai: 'AI 助手' };
    var SUBT = { versions: '实例', log: '游戏日志', instance: '实例详情', tasks: '任务' };
    function rail() {
      return '<nav class="rail" aria-label="主导航"><img class="logo" src="icon.png" alt="">' + NAV.map(function (n) {
        var on = S.page === n[0] && (!S.sub || (n[0] === 'home' && S.sub === 'instance'));
        return '<button type="button" class="ri hv' + (on ? ' on' : '') + '"' + act('nav', n[0]) + ' aria-current="' + on + '"><span class="pill">' + ic(n[2], on ? 'f' : '') + '</span><span class="l">' + n[1] + '</span></button>';
      }).join('') + '</nav>';
    }
    function greeting() {
      var h = new Date().getHours();
      return (h < 5 ? '夜深了' : h < 11 ? '早上好' : h < 13 ? '中午好' : h < 18 ? '下午好' : '晚上好') + '，' + account().n;
    }
    function taskPill() {
      var t = S.tasks.filter(function (x) { return x.p < 1; })[0];
      if (t) {
        return '<button type="button" class="chipb task busy hv"' + act('sub', 'tasks') + '>' + ic('downloading') + '<span class="x"><span style="display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">' + esc(t.n) + '</span><span class="bar" style="display:block"><i style="width:' + Math.round(t.p * 100) + '%"></i></span></span>' + ic('chevron_right') + '</button>';
      }
      return '<button type="button" class="chipb task hv"' + act('sub', 'tasks') + '>' + ic(S.running ? 'sports_esports' : 'check') + '<span class="x">' + (S.running ? '1 个游戏实例运行中' : '当前无后台任务') + '</span>' + ic('chevron_right') + '</button>';
    }
    function topbar() {
      var h;
      if (S.sub) {
        h = '<div class="tb sub"><div class="tt"><button type="button" class="ib hv"' + act('back') + ' aria-label="返回">' + ic('arrow_back') + '</button>' + SUBT[S.sub] + '</div>';
      } else if (S.page === 'home') {
        h = '<div class="tb"><div class="tt">' + esc(greeting()) + '<small>准备好冒险了吗？</small></div>';
      } else {
        h = '<div class="tb"><div class="tt">' + TITLES[S.page] + '</div>';
      }
      var a = account();
      return h + taskPill() +
        '<button type="button" class="ib hv"' + act('sub', 'versions') + ' aria-label="搜索实例" title="搜索实例">' + ic('search') + '</button>' +
        '<button type="button" class="ib hv"' + act('tip', '查看公告') + ' aria-label="公告" title="公告">' + ic('notifications') + '</button>' +
        '<button type="button" class="chipb acc hv"' + act('nav', 'accounts') + ' title="' + esc(a.n + ' · ' + a.t) + '"><span class="ava">' + esc(a.n.charAt(0).toUpperCase()) + '</span>' + esc(a.n + ' · ' + a.t) + '</button>' +
        '<div class="wbtns"><button type="button" class="wbtn hv"' + act('tip', '最小化窗口') + ' aria-label="最小化">' + ic('remove') + '</button><button type="button" class="wbtn hv"' + act('tip', '最大化窗口') + ' aria-label="最大化">' + ic('crop_square') + '</button><button type="button" class="wbtn x"' + act('tip', '关闭窗口') + ' aria-label="关闭">' + ic('close') + '</button></div></div>';
    }

    /* ---------- 启动页 ---------- */
    function home() {
      var v = cur();
      var facts = [v.ld ? v.mods + ' 个模组' : '原版，不加载模组', v.ago === '还没玩过' ? v.ago : v.ago + '玩过'].join(' · ');
      var hero = '<div class="hcard">' +
        '<svg class="deco" viewBox="0 0 100 100" aria-hidden="true"><path d="M50 5 90 27v46L50 95 10 73V27Z" fill="var(--p)"/></svg>' +
        '<button type="button" class="swi hv"' + act('menu', 'inst') + '>切换实例' + ic('expand_more') + '</button>' +
        '<div class="vh">' + vicon(v) + '<div style="min-width:0"><div class="n">' + esc(instTitle(v)) + '</div>' + (v.lv ? '<div class="id mono">' + esc(v.lv) + '</div>' : '') + '</div></div>' +
        '<div class="facts">' + esc(facts) + '</div>' +
        '<div class="hbtns">' +
        (S.running
          ? '<button type="button" class="launch run"' + act('stop') + '>' + ic('stop') + '结束游戏</button>'
          : '<button type="button" class="launch hv"' + act('launch') + '>' + ic('rocket_launch') + '开始游戏</button>') +
        '<button type="button" class="b out lg hv"' + act('detail', S.inst) + ' style="color:var(--os)">' + ic('tune') + '实例设置</button>' +
        '<button type="button" class="more hv"' + act('menu', 'more') + ' aria-label="更多">' + ic('more_horiz') + '</button></div></div>';
      var side = '<div class="side"><button type="button" class="anno hv"' + act('tip', '查看公告') + '><span class="h">' + ic('campaign') + '启动器公告<em>查看 ›</em></span>' +
        '<p>欢迎体验 Pixel World 网页演示。这里的界面和启动器一致，可以随便点；下载、安装和启动都只是演示，不会真的执行。</p></button>' +
        '<div class="qgrid">' +
        '<button type="button" class="qb hv"' + act('godl', 'mods') + '>' + ic('download') + '装模组</button>' +
        '<button type="button" class="qb hv"' + act('detail', S.inst, 'mods') + '>' + ic('view_list') + '管理模组</button>' +
        '<button type="button" class="qb hv"' + act('tip', '打开文件夹') + '>' + ic('folder') + '文件夹</button>' +
        '<button type="button" class="qb hv"' + act('sub', 'log') + '>' + ic('article') + '查看日志</button></div></div>';
      var worlds = WORLDS.map(function (w, i) {
        var tint = w.c;
        return '<button type="button" class="wt hv" style="background:linear-gradient(90deg,color-mix(in srgb,' + tint + ' 32%,var(--c1)),var(--c1) 55%)"' + act('world', i) + '>' +
          '<span class="th" style="' + worldThumb(w) + '"></span><span class="t"><b>' + esc(w.n) + '</b><span class="s">' + esc(instTitle(INST[w.i]) + ' · ' + w.ago) + '</span></span>' +
          '<span class="go hv" ' + act('playworld', i) + ' title="进入这个存档">' + ic('rocket_launch') + '</span></button>';
      }).join('');
      var fold = S.layout === 'split' ? splitFold(v, facts) : S.layout === 'min' ? minFold(v) : '<div class="fold"><div class="toprow">' + hero + side + '</div>' +
        '<div class="rh"><b>最近游玩</b><span class="sp"></span><button type="button" class="b txt sm hv"' + act('detail', S.inst, 'saves') + '>全部存档 ›</button></div>' +
        '<div class="worlds">' + worlds + '</div>' +
        '<div class="down"><button type="button" class="b txt sm hv"' + act('scrolldown') + '>向下滚动查看更多' + ic('expand_more') + '</button></div></div>';
      var left = '<div class="clog">' + ic('new_releases') + '<div style="flex:1"><b>更新日志 · v0.3.4</b><div style="font-size:12.5px">安卓支持 TouchController 触控模组，新增 Krypton Wrapper 渲染器；首页新增更新日志提示条。</div></div>' + lnk('txt sm', '查看', REPO + '/releases') + '</div>';
      if (swOn('news', true)) {
        left += '<div class="nh"><b>Minecraft 版本动态</b><small>来自 Minecraft Wiki</small><span class="sp"></span><button type="button" class="ib sm hv"' + act('refresh') + ' aria-label="刷新">' + ic('refresh') + '</button></div>' +
          NEWS.map(function (n) {
            var inner = '<span class="cv" style="background:' + (n.img ? 'var(--c3) url(&quot;' + esc(n.img) + '&quot;) center/cover no-repeat' : n.c) + '"></span><span class="tx"><span class="hd"><span class="badge' + (n.k === '正式版' ? ' pr' : '') + '">' + n.k + '</span><b>' + esc(n.id) + '</b><i>' + esc(n.d) + '</i></span><span class="sm">' + esc(n.t) + '</span></span>';
            return n.url ? '<a class="news hv" href="' + esc(n.url) + '" target="_blank" rel="noopener">' + inner + '</a>' : '<button type="button" class="news hv"' + act('tip', '打开 Wiki 页面') + '>' + inner + '</button>';
          }).join('');
      }
      var kv = function (k, x) { return '<div class="kv"><span>' + k + '</span><span>' + esc(x) + '</span></div>'; };
      var right = '<div class="card vinfo"><h5>' + esc(instTitle(v)) + '<span class="sp"></span><button type="button" class="ib sm hv"' + act('detail', S.inst) + ' aria-label="实例设置">' + ic('tune') + '</button></h5>' +
        kv('游戏版本', v.mc) + kv('加载器', v.ld ? LOADERS[v.ld].n : '原版') + kv('模组', v.ld ? v.mods + ' 个' : '—') + kv('Java', /^1\.(1[0-6]|[0-9])\./.test(v.mc + '.') ? 'Java 8' : 'Java 21') + kv('渲染器', '自动') + '</div>';
      if (swOn('hints', true)) {
        right += '<div style="height:12px"></div><div class="hint">' + ic('info') + '<div>你正在使用 Pixel World 0.3.4。这是第三方 Minecraft 启动器，功能还在完善中，遇到问题请到 <a href="' + REPO + '/issues" target="_blank" rel="noopener">GitHub 反馈</a>。</div></div>' +
          '<div class="hint">' + ic('volunteer_activism') + '<div>本软件完全免费、开源。如果你是付费购买或下载的，那么你可能被骗了，请向卖家申请退款，并从 <a href="' + REPO + '/releases" target="_blank" rel="noopener">GitHub 获取正版</a>。</div></div>';
      }
      return '<div class="scr" data-s="home"><div class="home">' + fold + '<div class="lower"><div class="l">' + left + '</div><div class="r">' + right + '</div></div></div></div>';
    }

    function dockLaunch(v) {
      return S.running
        ? '<button type="button" class="dock run"' + act('stop') + '>' + ic('stop') + '<span><b>结束游戏</b><span class="v">' + esc(instTitle(v)) + '</span></span></button>'
        : '<button type="button" class="dock hv"' + act('launch') + '>' + ic('rocket_launch') + '<span style="min-width:0"><b>开始游戏</b><span class="v">' + esc(instTitle(v)) + '</span></span></button>';
    }
    var downBtn = '<div class="down" style="margin:0 0 4px"><button type="button" class="b txt sm hv"' + act('scrolldown') + '>向下滚动查看更多' + ic('expand_more') + '</button></div>';
    /* 「上下」：顶部一条当前实例，中间留给背景，底部一条开始游戏和最近游玩的存档 */
    function splitFold(v, facts) {
      var tool = function (icon, tipText, a, val, k) { return '<button type="button" class="ib hv"' + act(a, val, k) + ' title="' + tipText + '" aria-label="' + tipText + '">' + ic(icon) + '</button>'; };
      var top = '<div class="strip">' + vicon(v, 40) + '<div class="ti"><b>' + esc(instTitle(v)) + '</b><span>' + esc(facts) + '</span></div>' +
        '<button type="button" class="swi flat hv"' + act('menu', 'inst') + '>切换实例' + ic('expand_more') + '</button><span class="sp"></span>' +
        tool('campaign', '启动器公告', 'tip', '查看公告') + tool('download', '装模组', 'godl', 'mods') + tool('view_list', '管理模组', 'detail', S.inst, 'mods') + tool('folder', '文件夹', 'tip', '打开文件夹') + tool('article', '查看日志', 'sub', 'log') +
        '<button type="button" class="b out hv" style="margin-left:6px"' + act('detail', S.inst) + '>实例设置</button></div>';
      var ws = WORLDS.slice(0, 3).map(function (w, i) {
        return '<button type="button" class="dw hv"' + act('playworld', i) + ' title="进入这个存档"><span class="th" style="' + worldThumb(w) + '"></span><span style="min-width:0"><b>' + esc(w.n) + '</b><span class="s">' + esc(instTitle(INST[w.i]) + ' · ' + w.ago) + '</span></span></button>';
      }).join('');
      var bottom = '<div class="strip">' + dockLaunch(v) + ws + '<span class="sp"></span><button type="button" class="b tonal hv"' + act('detail', S.inst, 'saves') + '>' + ic('grid_view') + '全部存档</button></div>';
      return '<div class="foldw">' + top + '<div class="gap"></div>' + downBtn + bottom + '</div>';
    }
    /* 「极简」：只在底部留一条，放当前实例和开始游戏 */
    function minFold(v) {
      var bar = '<div class="mbar">' + vicon(v, 40) + '<button type="button" class="vt hv"' + act('menu', 'inst') + '><b>' + esc(instTitle(v)) + '</b><span>切换实例' + ic('expand_more') + '</span></button><span class="div"></span>' +
        '<button type="button" class="ib hv"' + act('detail', S.inst, 'saves') + ' title="全部存档" aria-label="全部存档">' + ic('grid_view') + '</button>' +
        '<button type="button" class="ib hv"' + act('detail', S.inst) + ' title="实例设置" aria-label="实例设置">' + ic('tune') + '</button>' +
        '<button type="button" class="ib hv"' + act('menu', 'minmore') + ' title="更多" aria-label="更多">' + ic('more_horiz') + '</button>' + dockLaunch(v) + '</div>';
      return '<div class="foldw"><div class="gap"></div>' + downBtn + bar + '</div>';
    }

    /* ---------- 下载 ---------- */
    var DL_TABS = [['versions', '游戏版本']].concat(RES_TABS.map(function (t) { return [t[0], t[1]]; })).concat([['favorites', '收藏']]);
    function mcNum(id) {
      var m = /^1\.(\d+)(?:\.(\d+))?$/.exec(id);
      if (m) return +m[1] * 100 + (+m[2] || 0);
      m = /^(\d{2})\.(\d+)(?:\.(\d+))?$/.exec(id); // 26.1 起的年份版本号
      return m ? 3000 + +m[1] * 10 + +m[2] : 99999;
    }
    function loaderOk(k, id) {
      var n = mcNum(id);
      if (!k) return true;
      if (n === 99999) return false;
      switch (k) {
        case 'forge': return n >= 105;
        case 'neoforge': return n >= 2001;
        case 'cleanroom': return n === 1202;
        case 'labymod': return n >= 1800;
        case 'fabric': case 'quilt': return n >= 1400;
        case 'legacyfabric': return n >= 300 && n <= 1302;
        case 'liteloader': return n >= 500 && n <= 1202;
      }
      return false;
    }
    function dlRows() {
      var q = S.vq.trim().toLowerCase(), list = DL[S.filt].filter(function (x) { return !q || x[0].toLowerCase().indexOf(q) >= 0; });
      if (!list.length) return '<div class="empty" style="position:static;padding:40px">没有符合条件的版本</div>';
      var sel = selVersion(list);
      var installed = {}; INST.forEach(function (v) { installed[v.mc] = 1; });
      return list.slice(0, 120).map(function (x) {
        return '<button type="button" class="vr hv' + (x[0] === sel ? ' on' : '') + '"' + act('dlsel', x[0]) + '><b>' + esc(x[0]) + '</b>' +
          (x[0] === LATEST.release || x[0] === LATEST.snapshot ? '<span class="tag f">最新</span>' : '') + (installed[x[0]] ? '<span class="tag">已安装</span>' : '') +
          '<span class="d">' + esc(x[1]) + '</span></button>';
      }).join('');
    }
    function selVersion(list) {
      list = list || DL[S.filt];
      for (var i = 0; i < list.length; i++) if (list[i][0] === S.dlSel) return S.dlSel;
      return list[0] ? list[0][0] : null;
    }
    /* 加载器图标：启动器自绘的线条图标（lib/widgets/loader_icon.dart） */
    var CLOTH = '<path d="M4.5 10.5 12 4a2 2 0 0 1 2.8.2l5 5.6a2 2 0 0 1-.2 2.9L12 19.5a2 2 0 0 1-2.8-.2l-4.9-5.8a2 2 0 0 1 .2-3Z"/>';
    var LSVG = {
      '': '<path d="M12 2.8 20.5 7.5v9L12 21.2l-8.5-4.7v-9L12 2.8Z"/><path d="M3.5 7.5 12 12.2l8.5-4.7M12 12.2v9"/><path d="m3.5 10.6 2.8 1.5 2.4-.4 3.3 1.9 3.3-1.9 2.4.4 2.8-1.5"/>',
      forge: '<path d="M2.5 8H9V6h12.5v3c-3.2.7-5.5 2.2-5.5 4.6 0 1.2.8 2 2 2.4v3H6v-3c1.8-.4 3.2-1.6 3.2-3.4 0-1.9-4.5-1.2-6.7-4.6Z"/>',
      neoforge: '<path d="m4 3 1.4 7.6L3 13l9 8 9-8-2.4-2.4L20 3l-5 4.2H9L4 3Z"/><path d="M8.8 12.2v1.3M15.2 12.2v1.3M12 17v.01"/>',
      cleanroom: '<path d="M12 2.8 20 7.4v9.2l-8 4.6-8-4.6V7.4l8-4.6Z"/><path d="M15 9.6a4 4 0 1 0 0 4.8"/>',
      fabric: CLOTH + '<path d="m9 10 5.5 6M12.5 7l5.5 6"/>',
      legacyfabric: CLOTH + '<path d="M10 9v5.5h4.5"/>',
      quilt: '<rect x="3" y="3" width="8" height="8" rx="2"/><rect x="13" y="3" width="8" height="8" rx="2"/><rect x="3" y="13" width="8" height="8" rx="2"/><path d="m17 12.6 4.4 4.4-4.4 4.4-4.4-4.4 4.4-4.4Z"/>',
      optifine: '<rect x="3" y="6" width="7.5" height="12" rx="3"/><path d="M14.5 18V6H21M14.5 12H19"/>',
      labymod: '<rect x="4" y="4" width="16" height="16" rx="4"/><path d="M10 8.5V15.5H15"/>',
      liteloader: '<path d="M20 4c-6.5 0-11.5 3-13 8.5L6.5 17l4.5-.5C17 15 20 10.5 20 4Z"/><path d="m4 20 10-10"/>'
    };
    function lsvg(k, size) {
      return '<svg class="lic" viewBox="0 0 24 24" width="' + (size || 20) + '" height="' + (size || 20) + '" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + LSVG[k || ''] + '</svg>';
    }
    /* 顺序同启动器的安装面板：原版在前，其余按 LoaderKind 的顺序 */
    var INSTALL_ORDER = [null, 'forge', 'neoforge', 'fabric', 'quilt', 'legacyfabric', 'liteloader', 'cleanroom', 'labymod'];
    var FORGE = { '1.21.11': '61.0.2', '1.21.10': '60.0.15', '1.21.8': '58.1.0', '1.21.5': '55.0.24', '1.21.4': '54.1.0', '1.21.3': '53.1.0', '1.21.1': '52.1.0', '1.20.6': '50.1.0', '1.20.4': '49.1.0', '1.20.1': '47.4.0', '1.19.4': '45.3.0', '1.19.2': '43.5.0', '1.18.2': '40.3.0', '1.16.5': '36.2.42', '1.12.2': '14.23.5.2860', '1.8.9': '11.15.1.2318', '1.7.10': '10.13.4.1614' };
    function loaderVersions(ld, id) {
      var n = mcNum(id), v;
      switch (ld) {
        case 'forge': v = FORGE[id] || (n >= 3000 ? (60 + (n % 10) * 2) + '.1.8' : (Math.max(10, Math.round(n / 25) + 1)) + '.0.3'); return [v, '47.3.0'].filter(function (x, i, a) { return a.indexOf(x) === i; });
        case 'neoforge': return n >= 3000 ? [id + '.0.103', id + '.0.88-beta'] : n === 2001 ? ['47.1.106'] : [(Math.floor(n / 100) - 0) + '.' + (n % 100) + '.172', (Math.floor(n / 100)) + '.' + (n % 100) + '.90'];
        case 'fabric': return ['0.20.1', '0.17.3', '0.16.14'];
        case 'quilt': return ['0.24.0', '0.29.1-beta.3'];
        case 'legacyfabric': return ['0.17.3', '0.16.0'];
        case 'liteloader': return [id + '-SNAPSHOT'];
        case 'cleanroom': return ['0.3.31-alpha'];
        case 'labymod': return ['4.50.3（正式版）', '4.51.0（测试版）'];
      }
      return ['1.0'];
    }
    function defaultName(ld, id, lv) {
      switch (ld) {
        case null: return id;
        case 'liteloader': return id + '-LiteLoader';
        case 'quilt': return 'quilt-loader-' + lv + '-' + id;
        case 'fabric': return 'fabric-loader-' + lv + '-' + id;
        case 'legacyfabric': return 'fabric-loader-' + lv + '-' + id;
        case 'forge': return id + '-forge-' + lv;
        case 'neoforge': return 'neoforge-' + lv;
        case 'cleanroom': return id + '-cleanroom-' + lv;
        case 'labymod': return id + '-LabyMod-4.' + lv.replace(/（.*$/, '');
      }
      return id;
    }
    /* 和启动器一样，各加载器的版本列表分别获取，先返回的先显示 */
    var LOAD = { id: null, done: 0 }, loadTimer;
    function startLoading(id) {
      if (LOAD.id === id) return;
      LOAD = { id: id, done: 0 };
      clearInterval(loadTimer);
      loadTimer = setInterval(function () {
        LOAD.done++;
        if (LOAD.done >= INSTALL_ORDER.length - 1) clearInterval(loadTimer);
        var ip = app.querySelector('#pd-ip');
        if (ip && S.page === 'download' && S.dlTab === 'versions' && !S.sub) ip.innerHTML = installPanel(selVersion());
      }, 130 + Math.random() * 90);
    }
    function ldLoading(k, id) { return k && LOAD.id === id && INSTALL_ORDER.indexOf(k) > LOAD.done; }
    function installPanel(id) {
      if (!id) return empty('touch_app', '选择左边的版本');
      startLoading(id);
      var date = ''; DL[S.filt].forEach(function (x) { if (x[0] === id) date = x[1]; });
      var ld = S.ld && loaderOk(S.ld, id) && !ldLoading(S.ld, id) ? S.ld : null;
      var lvs = ld ? loaderVersions(ld, id) : null;
      var lv = ld ? (S.sel.ldv && lvs.indexOf(S.sel.ldv) >= 0 ? S.sel.ldv : lvs[0]) : '';
      var ofOk = (!ld || ld === 'forge') && mcNum(id) <= 2101 && mcNum(id) >= 700;
      var name = S.of && ofOk && !ld ? id + '-OptiFine_HD_U_J1' : defaultName(ld, id, lv);
      var same = INST.filter(function (v) { return v.mc === id; }).length;
      var total = INSTALL_ORDER.length - 1, got = Math.min(total, LOAD.id === id ? LOAD.done : total);
      var tiles = INSTALL_ORDER.map(function (k) {
        var loading = ldLoading(k, id), ok = loaderOk(k, id), on = (k || null) === ld;
        var hint = loading ? '正在获取…' : !ok ? '不支持 ' + id : !k ? '不加装' : loaderVersions(k, id)[0];
        return '<button type="button" class="lt2 hv' + (on ? ' on' : '') + (!ok && !loading ? ' off' : '') + '"' + act('ld', k || '') + (ok && !loading ? '' : ' disabled') + '>' + lsvg(k) +
          '<span class="tx"><b>' + (k ? LOADERS[k].n : '原版') + '</b><span>' + esc(hint) + '</span></span>' + (loading ? '<span class="spin"></span>' : '') + '</button>';
      }).join('');
      var ver = ld ? '<div class="fld" style="margin-top:10px"><label>' + LOADERS[ld].n + ' 版本</label><span class="dd" style="display:block"><select data-sel="ldv" style="width:100%">' +
        lvs.map(function (x) { return '<option' + (x === lv ? ' selected' : '') + '>' + esc(x) + '</option>'; }).join('') + '</select>' + ic('arrow_drop_down') + '</span></div>' : '';
      var ofLoading = LOAD.id === id && got < total;
      var ofSub = ofLoading ? '正在获取 OptiFine 版本…' : ld && !ofOk ? LOADERS[ld].n + ' 不支持与 OptiFine 一起安装' : !ofOk ? '该版本没有 OptiFine' : 'OptiFine HD U J1（演示）';
      var of = '<button type="button" class="of2 hv' + (S.of && ofOk ? ' on' : '') + (ofOk && !ofLoading ? '' : ' off') + '"' + act('of') + (ofOk && !ofLoading ? '' : ' disabled') + '>' + lsvg('optifine', 22) +
        '<span class="tx"><b>同时安装 OptiFine</b><span>' + esc(ofSub) + '</span></span><span class="cb">' + (S.of && ofOk ? ic('check') : '') + '</span></button>';
      return '<div class="scr" data-s="inst" style="bottom:68px"><div class="inst">' +
        '<h4>安装 ' + esc(id) + '<small>' + esc(date) + '</small>' + (got < total ? '<small style="margin-left:auto">正在获取加载器 ' + got + '/' + total + '</small>' : '') + '</h4>' +
        (got < total ? '<div class="lbar"><i style="width:' + Math.round(got / total * 100) + '%"></i></div>' : '') +
        '<div class="fld" style="margin-top:12px"><label>实例名称</label><input class="tf" data-t="iname" style="width:100%;height:42px;border-radius:10px" placeholder="' + esc(name) + '" value="' + esc(S.txt.iname || '') + '" autocomplete="off" spellcheck="false"></div>' +
        (same ? '<div class="note2">已经有 ' + same + ' 个 ' + esc(id) + ' 的实例；这次会再装一个独立的实例，存档和模组互不影响</div>' : '') +
        '<div class="lgrid">' + tiles + '</div>' + ver + of + '</div></div>' +
        '<div class="instbar"><span class="x">安装为 ' + esc((S.txt.iname || '').trim() || name) + '</span><button type="button" class="b fill ibtn2 hv"' + act('install', id) + (got < total && S.ld && ldLoading(S.ld, id) ? ' disabled' : '') + '>安装</button></div>';
    }
    function resList(tab) {
      var data = RESLIVE[tab] || RES[tab].map(function (x) { return { title: x[0], description: x[1], downloads: x[2] * 1e4 }; });
      var q = S.resQ.trim().toLowerCase();
      data = data.filter(function (x) { return !q || (x.title + x.description).toLowerCase().indexOf(q) >= 0; });
      if (!data.length) return '<div class="empty" style="position:static;padding:40px">没有找到相关的资源</div>';
      return data.map(function (x) {
        return '<button type="button" class="res hv"' + act('tip', '下载「' + x.title + '」') + '>' + (x.icon_url ? '<img src="' + esc(x.icon_url) + '" alt="" loading="lazy">' : '<span class="ph">' + esc(x.title.charAt(0)) + '</span>') +
          '<span style="flex:1;min-width:0"><span class="t1" style="display:block">' + esc(x.title) + '</span><span class="t2" style="display:block">' + esc(x.description) + '</span>' +
          '<span class="meta">' + '<span>' + ic('download') + dlCount(x.downloads) + '</span>' + (x.author ? '<span>' + ic('person') + esc(x.author) + '</span>' : '') + (x.versions && x.versions.length ? '<span>' + ic('sell') + esc(x.versions[x.versions.length - 1]) + '</span>' : '') + '</span></span>' +
          ic('chevron_right') + '</button>';
      }).join('');
    }
    function download() {
      var tabs = '<div class="tabs" role="tablist">' + DL_TABS.map(function (t) {
        return '<button type="button" class="tab hv' + (S.dlTab === t[0] ? ' on' : '') + '" role="tab"' + act('dltab', t[0]) + '>' + t[1] + '</button>';
      }).join('') + (S.dlTab === 'versions' ? '<div class="seg">' + [['release', '正式版'], ['snapshot', '快照'], ['old', '远古版'], ['fool', '愚人节']].map(function (f) {
        return '<button type="button" class="' + (S.filt === f[0] ? 'on' : '') + '"' + act('filt', f[0]) + '>' + f[1] + '</button>';
      }).join('') + '</div>' : '') + '</div>';
      if (S.dlTab === 'versions') {
        return tabs + '<div class="col"><div class="l"><div class="search box">' + ic('search') + '<input id="pd-vq" type="text" placeholder="搜索版本号" value="' + esc(S.vq) + '" autocomplete="off" spellcheck="false"></div>' +
          '<div class="vlist"><div class="scr" data-s="vl" id="pd-vl">' + dlRows() + '</div></div></div><div class="r" id="pd-ip">' + installPanel(selVersion()) + '</div></div>';
      }
      if (S.dlTab === 'favorites') return tabs + '<div class="col"><div class="r">' + empty('star', '还没有收藏', '在资源详情里点「收藏」，常用的模组会出现在这里') + '</div></div>';
      var lab = RES_TABS.filter(function (t) { return t[0] === S.dlTab; })[0][1];
      return tabs + '<div class="resbar"><div class="search" style="flex:1">' + ic('search') + '<input id="pd-rq" type="text" placeholder="在 Modrinth 搜索' + lab + '" value="' + esc(S.resQ) + '" autocomplete="off" spellcheck="false"></div>' +
        dd('rv', [['', '全部版本'], ['1.21.1', '1.21.1'], ['1.20.1', '1.20.1']], '') + dd('rsort', [['rel', '相关性'], ['dl', '下载量'], ['up', '最近更新']], 'dl') + '</div>' +
        '<div style="position:absolute;inset:104px 16px 16px 12px"><div class="scr" data-s="res" id="pd-res">' + resList(S.dlTab) + '<div style="font-size:12px;color:var(--osv);text-align:center;padding:8px">资源来自 Modrinth' + (RESLIVE[S.dlTab] ? '' : '（示例数据）') + '</div></div></div>';
    }

    /* ---------- 工具 ---------- */
    var TOOL_NAV = [
      ['联机', [['transfer', '局域网互传', 'swap_horiz'], ['server', '服务器查询', 'dns'], ['lobby', '联机大厅', 'lan', '规划中']]],
      ['排错', [['diagnose', '错误分析', 'troubleshoot']]],
      ['实用', [['download', '自定义下载', 'download_for_offline']]],
      ['趣味', [['skin', '皮肤与头像', 'face'], ['achievement', '成就图片', 'emoji_events'], ['luck', '今日人品', 'auto_awesome']]]
    ];
    function form(title, sub, fields, label, a) {
      return '<div class="h5">' + title + '</div><div class="sub" style="margin-top:6px">' + sub + '</div><div class="form">' + fields.map(function (f) {
        return '<div class="fld"><label>' + esc(f[1]) + '</label>' + tf(f[0], f[2] || '') + '</div>';
      }).join('') + '<div>' + btn('fill', label, null, a || 'tip', a ? null : label) + '</div></div>';
    }
    function luck() {
      var d = new Date(), key = account().n + d.getFullYear() + '-' + d.getMonth() + '-' + d.getDate(), h = 0;
      for (var i = 0; i < key.length; i++) h = (h * 31 + key.charCodeAt(i)) >>> 0;
      return h % 101;
    }
    function tools() {
      var s = S.toolSec, r;
      if (s === 'transfer') {
        r = '<div class="h5">局域网互传</div><div class="sub" style="margin-top:6px">在两台设备之间传模组、存档、整个实例。两台设备连同一个 Wi-Fi，一台发送，一台接收。</div>' +
          '<div style="display:flex;gap:12px;margin-top:22px">' +
          '<button type="button" class="res hv" style="flex:1;flex-direction:column;align-items:flex-start;gap:8px;padding:18px"' + act('tip', '发送文件') + '>' + ic('upload', 'f') + '<b>发送</b><span class="sub">选择实例、模组或存档，生成配对码</span></button>' +
          '<button type="button" class="res hv" style="flex:1;flex-direction:column;align-items:flex-start;gap:8px;padding:18px"' + act('tip', '接收文件') + '>' + ic('download', 'f') + '<b>接收</b><span class="sub">输入对方显示的地址和配对码</span></button></div>';
      } else if (s === 'server') {
        r = form('服务器查询', '查询服务器在线人数和延迟。', [['srv', '服务器地址', 'mc.hypixel.net 或 1.2.3.4:25565']], '查询', 'srv') + '<div id="pd-srv"></div>';
      } else if (s === 'lobby') {
        return split(snav(TOOL_NAV, s, 'tool'), empty('lan', '联机大厅', '让几位玩家组成虚拟局域网一起游戏，正在规划中'), 'tool');
      } else if (s === 'diagnose') {
        r = '<div class="h5">错误分析</div><div class="sub" style="margin-top:6px">查看日志，自动找出崩溃原因。</div><div style="height:20px"></div>' + grp('选择日志', [
          row('history', '最近一次游戏', '分析本次打开启动器后最近一次运行的游戏', btn('tonal', '分析', null, 'diag')),
          row('description', '日志文件', '选择崩溃报告（crash-reports）或日志文件（logs）', btn('tonal', '选择', null, 'tip', '选择日志文件')),
          row('content_paste', '粘贴日志', '粘贴别人发给你的崩溃报告或日志', btn('tonal', '粘贴', null, 'tip', '读取剪贴板'))
        ]) + '<div id="pd-diag"></div><div class="sub">启动器先用本地规则匹配常见问题；在「设置 → AI」填写自己的 AI 服务后，还可以让 AI 分析日志。游戏崩溃时会自动弹出提示。</div>';
      } else if (s === 'download') {
        r = form('自定义下载', '下载任意文件，进度显示在任务页。', [['dlurl', '下载地址', 'https://'], ['dlname', '文件名（可选）', '']], '开始下载', 'customdl');
      } else if (s === 'skin') {
        r = form('正版皮肤', '查看和下载正版玩家的皮肤，也可以从皮肤截取头像。', [['skin', '正版玩家名', '例如 Notch']], '获取', 'skin') + '<div id="pd-skin"></div>';
      } else if (s === 'achievement') {
        r = form('成就图片', '生成 Minecraft 风格的成就提示图片。', [['ach1', '标题', '获得成就！'], ['ach2', '第一行', '例如：钻石！'], ['ach3', '第二行（可选）', '']], '生成', 'ach') + '<div id="pd-ach"></div>';
      } else {
        var n = luck();
        r = '<div class="h5">' + esc(account().n) + ' 的今日人品</div><div class="sub" style="margin-top:6px">每人每天固定</div><div class="luck">' + n + '</div><div class="sub" style="font-size:15px">' +
          (n >= 90 ? '欧皇附体！今天开箱必出好东西。' : n >= 70 ? '运气不错，适合去挖钻石。' : n >= 40 ? '平平淡淡，稳扎稳打。' : n >= 15 ? '小心苦力怕，记得带床。' : '今天还是待在家里种田吧……') + '</div>';
      }
      return split(snav(TOOL_NAV, s, 'tool'), r, 'tool');
    }

    /* ---------- 账户 ---------- */
    function accounts() {
      var verified = S.accounts.some(function (a) { return a.t === '正版'; });
      var list = S.accounts.map(function (a, i) {
        return '<div class="acct' + (i === S.acc ? ' on' : '') + '"><button type="button" class="hv" style="display:flex;align-items:center;gap:14px;flex:1;text-align:left;border-radius:10px"' + act('acc', i) + '><span class="av">' + esc(a.n.charAt(0).toUpperCase()) + '</span><span><span class="t1" style="display:block">' + esc(a.n) + '</span><span class="t2" style="display:block">' + esc(a.t === '正版' ? '正版账户' : a.t === '离线' ? '离线账户' : a.t) + '</span></span></button>' +
          (i === S.acc ? ic('check_circle', 'f').replace('class="ic', 'style="color:var(--p);margin-right:4px" class="ic') : '') +
          '<button type="button" class="ib sm hv"' + act('delacc', i) + ' aria-label="删除" title="删除">' + ic('delete') + '</button></div>';
      }).join('') || '<div class="sub" style="padding:12px">还没有账户</div>';
      var inner = '<div style="max-width:620px">' + list +
        (verified ? '' : '<div class="note">为了正版验证，需要先登录一次购买了 Minecraft 的微软账户，才能使用离线账户和外置登录。</div>') +
        '<div class="sect">正版账户</div>' + btn('fill', '微软登录', 'login', 'mslogin') +
        '<div class="sect">添加离线账户</div><div style="display:flex;gap:10px;align-items:center"><div class="fld" style="flex:1"><label>用户名</label>' + tf('offname', '3–16 个字母、数字或下划线', '100%') + '</div>' +
        '<button type="button" class="b tonal hv"' + act('addoff') + (verified ? '' : ' disabled') + '>添加</button></div>' +
        '<div class="sect">第三方账户</div><button type="button" class="b tonal hv"' + act('tip', '外置登录') + (verified ? '' : ' disabled') + '>' + ic('dns') + '外置登录</button>' +
        '<div class="sub" style="margin-top:12px;line-height:1.6">说明：为了正版验证，离线账户和外置登录需要先登录一次拥有 Minecraft 的微软账户，确认你购买了游戏后才能添加和使用。</div></div>';
      return '<div class="split" style="padding-left:12px"><div class="panel"><div class="scr" data-s="acc"><div class="grp" style="margin:0"><h3>账户</h3><div class="gc" style="padding:16px 20px 20px">' + inner + '</div></div></div></div></div>';
    }

    /* ---------- 设置 ---------- */
    var SET_NAV = [
      ['游戏', [['launch', '启动', 'rocket_launch'], ['java', 'Java', 'coffee'], ['manage', '游戏管理', 'folder']]],
      ['启动器', [['appearance', '个性化', 'palette'], ['misc', '其他', 'tune']]],
      ['AI', [['ai', '模型与接口', 'auto_awesome'], ['aiTools', '工具与服务', 'extension'], ['aiWorkspace', '工作区与联网', 'travel_explore']]],
      ['关于', [['about', '关于与致谢', 'info'], ['docs', '使用文档', 'menu_book']]]
    ];
    var SEEDS = [['green', '#2f6b4f', '默认'], ['blue', '#2e6cb5', '蓝'], ['orange', '#b4632b', '橙'], ['purple', '#7a4fa0', '紫']];
    function settings() {
      var s = S.setSec, r = '';
      if (s === 'launch') {
        r = grp('启动', [
          row(null, '实例隔离', '新实例首次启动时按此规则决定，之后在实例设置中单独修改', dd('iso', [['mod', '隔离可安装模组的实例'], ['all', '隔离所有实例'], ['none', '关闭']], 'mod')),
          row(null, '游戏窗口', null, dd('win', [['def', '默认（854 × 480）'], ['launcher', '与启动器一致'], ['max', '最大化'], ['full', '全屏'], ['custom', '自定义大小']], 'def')),
          row(null, '游戏启动后', null, dd('after', [['keep', '保持不变'], ['min', '最小化，游戏退出后恢复'], ['hide', '隐藏，游戏退出后恢复'], ['exit', '直接关闭启动器']], 'keep')),
          row(null, '进程优先级', null, dd('prio', [['high', '高'], ['above', '较高'], ['normal', '中'], ['below', '较低']], 'normal')),
          row(null, '版本类型显示', '显示在游戏主界面左下角，留空则不显示', tf('vtype', 'Pixel World', 200)),
          row(null, '自动设置游戏语言', '新实例或没有存档时，把游戏语言设为与启动器一致', sw('lang', true))
        ]) + grp('高级', [
          row(null, 'JVM 参数', null, tf('jvm', '-XX:+UseG1GC', 300)),
          row(null, '游戏参数', null, tf('args', '', 300)),
          row(null, '启动前执行命令', '在游戏文件夹中执行', tf('pre', '', 300)),
          row(null, '使用高性能显卡', '仅 Windows：让 Java 使用独立显卡', sw('gpu', true))
        ]);
      } else if (s === 'java') {
        var j = selOf('java', 'auto'), rd = function (k, t, sub) {
          return '<button type="button" class="lt hv" style="text-align:left"' + act('java', k) + '><span class="ic" style="color:' + (j === k ? 'var(--p)' : 'var(--osv)') + '">' + (j === k ? 'radio_button_checked' : 'radio_button_unchecked') + '</span><span class="t"><span class="t1" style="display:block">' + t + '</span><span class="t2" style="display:block">' + sub + '</span></span></button>';
        };
        r = grp('Java', [
          rd('auto', '自动选择', '按版本要求选择，找不到时自动下载 Mojang 提供的 Java'),
          rd('j21', 'Java 21（21.0.5）', '启动器下载 · java-runtime-delta'),
          rd('j8', 'Java 8（1.8.0_432）', 'C:\\Program Files\\Java\\jre-1.8\\bin\\javaw.exe'),
          '<div class="lt"><div class="t"></div><div class="trail">' + btn('tonal', '手动选择', 'folder_open', 'tip', '选择 Java 文件') + btn('tonal', '重新检测', 'refresh', 'tip', '检测 Java') + '</div></div>'
        ]) + '<div class="sub" style="margin:-4px 4px 14px">实例设置里可以为单个实例指定 Java，优先于这里的设置。</div>' +
          grp('游戏内存', [
            row(null, '分配方式', '将分配 4.0 GB · 系统空闲 9.2 / 16 GB', dd('mem', [['auto', '自动'], ['custom', '自定义']], 'auto')),
            row(null, '锁定内存', '初始内存与最大内存相同（-Xms 等于 -Xmx）', sw('lock', false))
          ]);
      } else if (s === 'manage') {
        r = grp('游戏文件夹', [
          row('folder', '当前游戏文件夹', 'D:\\Minecraft\\.minecraft', btn('tonal', '打开', null, 'tip', '打开文件夹')),
          row('create_new_folder', '添加或切换文件夹', '可以同时管理多个游戏文件夹', btn('tonal', '实例列表', null, 'sub', 'versions'))
        ]) + grp('清理', [row('cleaning_services', '清理游戏垃圾', '删除日志、崩溃报告与解压出的本地库，不影响存档和模组', btn('tonal', '清理', null, 'clean'))]);
      } else if (s === 'appearance') {
        r = grp('外观', [
          row(null, '颜色模式', '启动器界面的明暗模式', dd('theme', [['system', '跟随系统'], ['light', '浅色'], ['dark', '深色']], S.theme)),
          (glassOn()
            ? row(null, '主题色', '跟随背景：按 Material Design 3 从背景图片取色，换图片后自动更新', '<span class="chip on">' + ic('wallpaper') + '跟随背景</span>')
            : '<div class="lt"><div class="t"><div class="t1">主题色</div><div class="t2">按 Material Design 3 从主题色生成整套浅色与深色配色</div></div><div class="trail">' + SEEDS.map(function (x) {
              return '<button type="button" class="swatch' + (S.seed === x[0] ? ' on' : '') + '" style="background:' + x[1] + '"' + act('seed', x[0]) + ' aria-label="' + x[2] + '" title="' + x[2] + '">' + (S.seed === x[0] ? ic('check') : '') + '</button>';
            }).join('') + '</div></div>'),
          row(null, '界面缩放', '自动：按屏幕尺寸计算，当前为 100%', dd('scale', [['auto', '自动'], ['90', '90%'], ['100', '100%'], ['110', '110%'], ['125', '125%']], 'auto'))
        ]) + grp('背景', [row(null, '背景图片', !S.bg ? '选择一张图片作为启动器的背景，界面面板会变成毛玻璃' : S.layout === 'std' ? '「标准」首页不显示背景图片，把首页布局换成「上下」或「极简」后生效' : '显示在整个窗口后面，界面面板会变成毛玻璃',
            S.bg ? btn('tonal', '换一张…', null, 'tip', '选择背景图片') + btn('txt', '移除', null, 'bgoff') : btn('tonal', '使用演示壁纸', null, 'bgon'))]) +
          grp('首页', [
            row(null, '首页布局', { std: '标准：大卡片、公告与快捷按钮、最近游玩', split: '上下：当前实例在顶部，开始游戏和存档在底部，中间留给背景；选背景图片时自动切到这个布局', min: '极简：只在底部留一条，放当前实例和开始游戏' }[S.layout], dd('layout', [['std', '标准'], ['split', '上下'], ['min', '极简']], S.layout)),
            row(null, '显示使用提示', '正在使用的版本与免费声明', sw('hints', true)),
            row(null, '显示 Minecraft 版本动态', '最新的正式版与快照，简介来自中文 Minecraft Wiki', sw('news', true))
          ]) + grp('帮助', [row(null, '新手教程', '再看一遍启动器各个地方的介绍：账户、安装游戏、实例、开始游戏、工具和设置', btn('tonal', '开始', null, 'tip', '开始新手教程'))]);
      } else if (s === 'misc') {
        r = grp('语言', [row(null, '界面语言', '启动器界面使用的语言；「自动设置游戏语言」也会跟随它', dd('lang2', [['auto', '跟随系统'], ['zh', '简体中文'], ['zht', '繁體中文'], ['en', 'English']], 'auto'))]) +
          grp('更新', [
            row(null, '更新通道', '正式版最稳定；预览版包含测试中的版本；Nightly 为 main 分支的每次更新，可能不稳定', dd('chan', [['stable', '正式版'], ['pre', '预览版'], ['nightly', 'Nightly']], 'stable')),
            row(null, '启动时检查更新', null, sw('upd', true)),
            row(null, '检查更新', '当前版本 0.3.4（正式版）', btn('tonal', '检查', null, 'checkupd'))
          ]) + grp('PCL-CE', [row(null, '从 PCL-CE 导入', '导入启动设置、游戏文件夹与账户；实例独立设置两者直接共用', btn('tonal', '导入', null, 'tip', '导入 PCL-CE 设置'))]) +
          grp('下载', [
            row(null, '下载源', '测速选择官方源或 BMCLAPI 镜像中较快的，失败时自动换另一个', dd('src', [['auto', '自动选择'], ['off', '官方源'], ['bm', 'BMCLAPI 镜像']], 'auto')),
            row(null, '同时下载的文件数', null, '<input type="range" min="1" max="64" value="' + (S.txt.threads || 32) + '" data-t="threads" aria-label="同时下载的文件数"><span style="width:28px;text-align:right" id="pd-thr">' + (S.txt.threads || 32) + '</span>'),
            row(null, '网络检测', '测试下载源、正版登录、Modrinth 和更新服务能不能连上、有多快', btn('tonal', '开始检测', null, 'tip', '检测网络'))
          ]);
      } else if (s === 'ai') {
        r = '<div class="sub" style="margin:0 4px 14px;line-height:1.6">AI 助手使用你自己的 AI 服务。支持 OpenAI 兼容接口（DeepSeek、通义千问、Kimi、OpenRouter、本机 Ollama 等）和 Anthropic 接口；费用由你的 AI 服务商收取。</div>' +
          grp('模型与接口', [
            row(null, '接口类型', null, dd('aitype', [['oa', 'OpenAI 兼容'], ['an', 'Anthropic']], 'oa')),
            row(null, '接口地址', null, tf('aiurl', 'https://api.deepseek.com', 300)),
            row(null, '模型', null, tf('aimodel', 'deepseek-chat', 300)),
            row(null, 'API Key', '只保存在本机', '<input class="tf" type="password" placeholder="sk-…" style="width:300px" autocomplete="off">'),
            '<div class="lt"><div class="t"></div><div class="trail">' + btn('tonal', '测试连接', null, 'tip', '连接 AI 服务') + '</div></div>'
          ]);
      } else if (s === 'aiTools') {
        r = grp('工具', [
          row('folder_open', '读取文件', '让 AI 查看日志、配置和模组列表', sw('t1', true)),
          row('edit_note', '修改文件', '修改配置文件；每次修改前都会询问你', sw('t2', true)),
          row('download', '下载模组', '从 Modrinth 搜索并安装模组；安装前会询问你', sw('t3', true)),
          row('terminal', '执行命令', '默认关闭；开启后每次执行前都会询问你', sw('t4', false))
        ]) + grp('服务', [row('travel_explore', '联网搜索', '查询 Minecraft Wiki 和 Modrinth', sw('t5', true))]);
      } else if (s === 'aiWorkspace') {
        r = grp('工作区', [
          row('folder', '工作区', 'AI 只能访问当前游戏文件夹', dd('ws', [['game', '当前游戏文件夹'], ['inst', '当前实例']], 'game')),
          row('shield', '隐私保护', '发送前自动隐去玩家名、令牌、UUID、用户目录与 IP 地址', sw('priv', true))
        ]) + grp('联网', [row('public', '允许访问的网站', 'zh.minecraft.wiki、modrinth.com', btn('tonal', '编辑', null, 'tip', '编辑网站列表'))]);
      } else if (s === 'docs') {
        r = '<div class="h5">使用文档</div><div class="sub" style="margin-top:6px">在启动器里阅读官网文档，可以切换页面；断网时显示最近一次缓存。</div><div style="height:18px"></div>' +
          grp('文档', [
            row('rocket_launch', '快速上手', '安装、登录、下载第一个版本', lnk('txt', '打开', 'docs/index.html')),
            row('android', '安卓版说明', '渲染器、触屏按键与常见问题', lnk('txt', '打开', 'docs/android.html')),
            row('lock', '隐私说明', '不收集你的信息；保存在本地的内容与会连接的服务', lnk('txt', '打开', 'docs/privacy.html'))
          ]);
      } else {
        r = grp('关于', [
          row('favorite', 'Paper.Zhu', 'Pixel World 的开发者', lnk('tonal sm', '赞助作者', 'https://afdian.com/a/Paper_Zhu')),
          '<div class="lt"><img src="icon.png" alt="" style="width:36px;height:36px"><div class="t"><div class="t1">Pixel World 启动器 0.3.4</div><div class="t2">Pixel World 是第三方 Minecraft 启动器，本项目为轻度使用 PCL 仓储库，界面布局参考 PCL 社区版（PCL-CE）</div></div></div>',
          row('code', '源代码', 'Pixel World 以 Apache-2.0 协议开源', lnk('txt', '打开', REPO)),
          row('gavel', 'PCL 存储库合理使用指南', '本项目遵循的命名、署名与使用规则，随源代码一同发布', lnk('txt', '查看', REPO + '/blob/main/PCL-GUIDE.md'))
        ]) + grp('致谢', [
          row('groups', 'PCL Community', 'PCL 社区版（PCL-CE）的开发者们，本软件与 PCL-CE 的数据兼容', lnk('txt', '查看', 'https://github.com/PCL-Community/PCL-CE')),
          row('android', '安卓版游戏运行时', '基于 Amethyst-Android（LGPL-3.0）、MobileGlues、Krypton Wrapper、LWJGL 与 OpenJDK，单独以 LGPL-3.0 开源', lnk('txt', '查看', REPO + '/blob/main/android/runtime/NOTICE.md')),
          row('flutter_dash', 'Flutter', '跨平台界面框架', lnk('txt', '查看', 'https://flutter.dev')),
          row('palette', 'Material Design 3', '界面设计语言与配色算法', lnk('txt', '查看', 'https://m3.material.io'))
        ]) + '<div class="sub" style="padding:0 4px">Minecraft 是 Mojang Studios 的商标。本软件不是官方 Minecraft 产品，未经 Mojang 或 Microsoft 批准，也与其无关。</div>';
      }
      return split(snav(SET_NAV, s, 'set'), r, 'set-' + s);
    }

    /* ---------- AI ---------- */
    function ai() {
      var ready = !!(S.txt.aiurl && S.txt.aimodel);
      var sess = '<div class="sess"><button type="button" class="b tonal hv" style="width:100%"' + act('ainew') + '>' + ic('add') + '新对话</button><div class="sgt" style="padding-left:4px">历史对话</div>' +
        (S.ai.length ? '<button type="button" class="si on" style="border-radius:12px">' + ic('chat') + '<span style="overflow:hidden;white-space:nowrap;text-overflow:ellipsis">' + esc(S.ai[0].t) + '</span></button>' : '<div class="sub" style="padding:8px 4px">还没有对话</div>') + '</div>';
      var body;
      if (!S.ai.length) {
        body = '<div class="wel">' + ic('auto_awesome') + '<h4>有什么可以帮你？</h4><p>可以问我 Minecraft 和启动器的问题；游戏崩溃时，在错误分析中选择「AI 分析」会自动带上日志。</p>' +
          (ready ? '' : '<div class="aicard">' + ic('key') + '<div style="flex:1"><div style="font-size:15px">先设置 AI 服务</div><div class="sub">填写你自己的 AI 服务的接口地址、模型和 API Key</div></div><button type="button" class="b tonal hv"' + act('goset', 'ai') + '>设置</button></div>') +
          '<div class="aichips">' + ['游戏启动后闪退，应该从哪里查原因？', '怎么给某个版本分配更多内存？', '1.20.1 的 Fabric 有哪些常用的优化模组？', 'Forge 和 NeoForge 有什么区别？'].map(function (q) {
            return '<button type="button" class="chip hv"' + act('ask', q) + '>' + esc(q) + '</button>';
          }).join('') + '</div></div>';
      } else {
        body = '<div style="flex:1;position:relative"><div class="scr" data-s="ai" style="padding:8px 4px">' + S.ai.map(function (m) {
          return '<div class="msg ' + m.r + '">' + esc(m.t) + '</div>';
        }).join('') + '</div></div>';
      }
      return '<div class="ai">' + sess + '<div class="chat">' + body + '<div class="aib"><textarea id="pd-ai" placeholder="输入问题，Enter 发送，Shift + Enter 换行" aria-label="输入问题"></textarea><button type="button" class="b fill hv"' + act('aisend') + ' aria-label="发送">' + ic('arrow_upward') + '</button></div></div></div>';
    }

    /* ---------- 子页面 ---------- */
    function versionsPage() {
      var q = S.instQ.trim().toLowerCase();
      var list = INST.map(function (v, i) { return [v, i]; }).filter(function (x) { return !q || x[0].id.toLowerCase().indexOf(q) >= 0; });
      return '<div class="split" style="padding-left:12px;flex-direction:column;gap:10px"><div style="display:flex;gap:10px"><div class="search" style="flex:1">' + ic('search') + '<input id="pd-iq" type="text" placeholder="搜索实例" value="' + esc(S.instQ) + '" autocomplete="off" spellcheck="false"></div>' +
        btn('tonal', '安装新实例', 'add', 'nav', 'download') + '</div><div style="flex:1;position:relative"><div class="scr" data-s="inst-list" id="pd-il">' + (list.map(function (x) {
          var v = x[0], i = x[1];
          return '<div class="irow' + (i === S.inst ? ' on' : '') + '"><button type="button" class="hv" style="display:flex;gap:14px;align-items:center;flex:1;text-align:left;border-radius:10px"' + act('pick', i) + '>' + vicon(v, 40) + '<span><span class="t1" style="display:block">' + esc(v.id) + '</span><span class="t2" style="display:block">' + esc((v.ld ? LOADERS[v.ld].n + ' · ' : '原版 · ') + v.mc + ' · ' + (v.ago === '还没玩过' ? v.ago : v.ago + '玩过')) + '</span></span></button>' +
            (i === S.inst ? '<span class="tag f">当前</span>' : '') + '<button type="button" class="ib sm hv"' + act('detail', i) + ' aria-label="实例设置" title="实例设置">' + ic('tune') + '</button></div>';
        }).join('') || '<div class="empty" style="position:static;padding:40px">没有匹配的实例</div>') + '</div></div></div>';
    }
    var DETAIL_TABS = [['overview', '概览'], ['setup', '设置'], ['mods', '模组'], ['saves', '存档'], ['resourcepacks', '资源包'], ['shaderpacks', '光影'], ['screenshots', '截图']];
    function detailPage() {
      var v = INST[S.detail], t = S.detailTab, r;
      var tabs = '<div class="tabs" style="margin-left:12px">' + DETAIL_TABS.filter(function (x) { return x[0] !== 'mods' || v.ld; }).map(function (x) {
        return '<button type="button" class="tab hv' + (t === x[0] ? ' on' : '') + '"' + act('dtab', x[0]) + '>' + x[1] + '</button>';
      }).join('') + '</div>';
      var kv = function (k, x) { return row(null, k, null, '<span class="muted">' + esc(x) + '</span>'); };
      if (t === 'overview') {
        r = '<div style="display:flex;align-items:center;gap:14px;margin-bottom:18px">' + vicon(v, 52) + '<div style="flex:1"><div class="h5" style="font-weight:700">' + esc(v.id) + '</div><div class="sub">' + esc(instTitle(v)) + '</div></div>' +
          (S.detail === S.inst ? '<span class="chip on">' + ic('check') + '当前实例</span>' : btn('tonal', '设为当前实例', null, 'pick', S.detail)) + '</div>' +
          grp('信息', [kv('游戏版本', v.mc), kv('加载器', v.ld ? (v.lv || LOADERS[v.ld].n) : '原版'), kv('实例隔离', '已开启'), kv('运行目录', 'D:\\Minecraft\\.minecraft\\versions\\' + v.id)]) +
          grp('管理', [row('folder_open', '打开实例文件夹', null, btn('tonal', '打开', null, 'tip', '打开文件夹')), row('content_copy', '复制实例', '复制一份独立的实例，可以放心折腾', btn('tonal', '复制', null, 'tip', '复制实例')), row('delete', '删除实例', '移到回收站；开启实例隔离时，其中的存档和模组也会一并删除', btn('err', '删除', null, 'tip', '删除实例'))]);
      } else if (t === 'setup') {
        r = grp('启动', [row(null, 'Java', '跟随全局设置', dd('ij', [['g', '跟随全局'], ['21', 'Java 21'], ['8', 'Java 8']], 'g')), row(null, '渲染器', '跟随全局设置', dd('ir', [['g', '跟随全局'], ['a', '自动']], 'g')), row(null, '游戏内存', null, dd('im', [['g', '跟随全局'], ['a', '自动'], ['c', '自定义']], 'g'))]) +
          grp('高级', [row(null, 'JVM 参数', null, tf('ijvm', '留空使用全局设置', 300)), row(null, '游戏参数', null, tf('iarg', '留空使用全局设置', 300))]);
      } else if (t === 'mods') {
        r = '<div style="display:flex;gap:10px;margin-bottom:12px"><div class="search" style="flex:1">' + ic('search') + '<input type="text" placeholder="搜索模组" autocomplete="off"></div>' + btn('tonal', '装模组', 'add', 'godl', 'mods') + '</div>' +
          '<div class="gc">' + MODS.slice(0, Math.min(v.mods, MODS.length)).map(function (m, i) {
            return row(null, esc(m), esc(['1.0.' + i, 'mc' + v.mc].join(' · ')), sw('mod' + i, i % 5 !== 3));
          }).join('') + '</div>';
      } else if (t === 'saves') {
        r = '<div class="gc">' + WORLDS.filter(function (w) { return w.i === S.detail; }).map(function (w) {
          return '<div class="lt"><span class="vico" style="width:40px;height:40px;' + worldThumb(w) + '"></span><div class="t"><div class="t1">' + esc(w.n) + '</div><div class="t2">' + esc(w.ago) + '玩过 · 生存</div></div><div class="trail">' + btn('tonal sm', '进入', null, 'playworld', WORLDS.indexOf(w)) + '</div></div>';
        }).join('') + '</div>';
        if (r === '<div class="gc"></div>') r = '<div style="position:relative;height:420px">' + empty('public', '还没有存档', '进入游戏创建世界后，会显示在这里') + '</div>';
      } else {
        var lab = { resourcepacks: '资源包', shaderpacks: '光影', screenshots: '截图' }[t];
        r = '<div style="position:relative;height:420px">' + empty('folder_open', '这里还没有' + lab, null, '<div style="margin-top:8px">' + btn('tonal', '打开文件夹', 'folder_open', 'tip', '打开文件夹') + '</div>') + '</div>';
      }
      return tabs + '<div style="position:absolute;inset:52px 16px 16px 12px;background:var(--c1);border-radius:20px;overflow:hidden"><div class="scr" data-s="detail-' + t + '" style="padding:20px 24px">' + r + '</div></div>';
    }
    function logPage() {
      var lines = S.running ? ['[12:00:01] [main/INFO]: Loading Minecraft ' + cur().mc + ' with ' + (cur().ld ? LOADERS[cur().ld].n : 'vanilla'),
        '[12:00:03] [Render thread/INFO]: Backend library: LWJGL version 3.3.3', '[12:00:05] [Render thread/INFO]: Reloading ResourceManager: vanilla' + (cur().ld ? ', fabric' : ''),
        '[12:00:07] [Render thread/INFO]: Sound engine started', '[12:00:08] [Render thread/INFO]: （网页演示：这些日志是示例）'] : ['[演示] 还没有启动过游戏。', '启动游戏后，这里会实时显示游戏输出；崩溃时可以一键分析。'];
      return '<div class="split" style="padding-left:12px;flex-direction:column;gap:10px"><div style="display:flex;gap:8px;justify-content:flex-end">' + btn('tonal sm', '复制', 'content_copy', 'tip', '复制日志') + btn('tonal sm', '错误分析', 'troubleshoot', 'gotool', 'diagnose') + '</div><div style="flex:1;position:relative"><div class="scr"><div class="log">' + esc(lines.join('\n')) + '</div></div></div></div>';
    }
    function tasksPage() {
      if (!S.tasks.length) return '<div class="split" style="padding-left:12px"><div class="panel">' + empty('task_alt', '当前无后台任务', S.running ? '1 个游戏实例运行中' : '下载与安装任务会显示在这里') + '</div></div>';
      return '<div class="split" style="padding-left:12px"><div class="panel"><div class="scr" data-s="tasks">' + S.tasks.slice().reverse().map(function (t) {
        var done = t.p >= 1;
        return '<div class="card" style="padding:14px 18px;margin-bottom:10px;background:var(--s)"><div style="display:flex;align-items:center;gap:10px">' + ic(done ? 'check_circle' : 'downloading', done ? 'f' : '') + '<b style="flex:1">' + esc(t.n) + '</b><span class="sub">' + (done ? '已完成' : Math.round(t.p * 100) + '% · ' + (3 + Math.round(t.p * 9)) + '.4 MB/s') + '</span></div>' +
          '<div class="chipb" style="height:auto;padding:0;background:none;display:block"><span class="bar" style="display:block;height:4px;margin-top:10px"><i style="width:' + Math.round(t.p * 100) + '%;background:var(--p)"></i></span></div>' +
          '<div class="sub" style="margin-top:6px">' + esc(done ? '文件已校验 · 来源 BMCLAPI 镜像（演示）' : t.step) + '</div></div>';
      }).join('') + '</div></div></div>';
    }

    function pageHtml() {
      if (S.sub === 'versions') return versionsPage();
      if (S.sub === 'instance') return detailPage();
      if (S.sub === 'log') return logPage();
      if (S.sub === 'tasks') return tasksPage();
      return { home: home, download: download, tools: tools, accounts: accounts, settings: settings, ai: ai }[S.page]();
    }

    /* ---------- 渲染 ---------- */
    var stage = document.createElement('div'); stage.className = 'pd-stage';
    var scale = document.createElement('div'); scale.className = 'pd-scale';
    var root = document.createElement('div'); root.className = 'pd';
    root.setAttribute('role', 'application'); root.setAttribute('aria-label', 'Pixel World 启动器网页演示');
    root.innerHTML = '<div class="app"></div><div class="toast" role="status" aria-live="polite"></div>';
    scale.appendChild(root); stage.appendChild(scale); host.innerHTML = ''; host.appendChild(stage);
    var app = root.firstChild, toast = root.lastChild;
    var mq = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;

    function applyTheme() {
      var dark = S.theme === 'dark' || (S.theme === 'system' && mq && mq.matches);
      root.classList.toggle('dark', !!dark);
      root.classList.toggle('glass', glassOn());
      if (S.seed === 'green') root.removeAttribute('data-seed'); else root.setAttribute('data-seed', S.seed);
    }
    if (mq) { var onMq = function () { applyTheme(); }; if (mq.addEventListener) mq.addEventListener('change', onMq); else if (mq.addListener) mq.addListener(onMq); }

    function render(anim) {
      var keep = {};
      app.querySelectorAll('.scr[data-s]').forEach(function (n) { keep[n.getAttribute('data-s')] = n.scrollTop; });
      app.innerHTML = rail() + '<div class="main">' + topbar() + '<div class="pbody' + (anim ? ' in' : '') + '">' + pageHtml() + '</div></div>';
      if (!anim) app.querySelectorAll('.scr[data-s]').forEach(function (n) { var k = n.getAttribute('data-s'); if (k in keep) n.scrollTop = keep[k]; });
      S.menu = null;
    }
    function fit() {
      var w = stage.clientWidth || W, s = Math.min(1, w / W);
      scale.style.transform = 'scale(' + s + ')';
      scale.style.left = Math.max(0, (w - W * s) / 2) + 'px';
      stage.style.height = Math.round(H * s) + 'px';
    }
    var timer;
    function say(msg) {
      toast.textContent = msg;
      toast.classList.add('show');
      clearTimeout(timer);
      timer = setTimeout(function () { toast.classList.remove('show'); }, 3200);
    }
    function tip(what) { say('这是网页演示，无法' + (what || '执行此操作') + '。请下载启动器体验完整功能。'); }

    /* 弹出菜单 */
    function closeMenu() { var m = root.querySelector('.menu'); if (m) m.remove(); S.menu = null; }
    function openMenu(anchor, items) {
      closeMenu();
      var r = anchor.getBoundingClientRect(), rr = root.getBoundingClientRect(), k = rr.width / W;
      var m = document.createElement('div'); m.className = 'menu'; m.setAttribute('role', 'menu');
      m.innerHTML = items.map(function (it) {
        return it === '-' ? '<div class="sep"></div>' : '<button type="button" class="hv" role="menuitem"' + act(it[0], it[1]) + '>' + (it[3] ? ic(it[3]) : '') + esc(it[2]) + '</button>';
      }).join('');
      m.style.left = ((r.left - rr.left) / k) + 'px';
      m.style.top = ((r.bottom - rr.top) / k + 4) + 'px';
      root.appendChild(m); S.menu = m;
    }

    /* 假的下载任务：进度走到 100% 后真的出现在实例列表里 */
    function runTask(name, steps, done) {
      var t = { n: name, p: 0, step: steps[0] };
      S.tasks.push(t);
      render(false);
      var iv = setInterval(function () {
        t.p = Math.min(1, t.p + 0.04 + Math.random() * 0.05);
        t.step = steps[Math.min(steps.length - 1, Math.floor(t.p * steps.length))];
        if (t.p >= 1) { clearInterval(iv); if (done) done(); say(name + ' 已完成（演示）'); render(false); return; }
        var pill = app.querySelector('.chipb.task .bar i'); if (pill) pill.style.width = Math.round(t.p * 100) + '%';
        if (S.sub === 'tasks') render(false);
      }, 260);
    }

    /* ---------- 真实数据 ---------- */
    var RESLIVE = {};
    function loadRes(tab) {
      if (RESLIVE[tab] || !window.fetch) return;
      var type = RES_TABS.filter(function (t) { return t[0] === tab; })[0][2];
      fetch('https://api.modrinth.com/v2/search?limit=20&index=downloads&facets=' + encodeURIComponent(JSON.stringify([['project_type:' + type]])))
        .then(function (r) { if (!r.ok) throw r.status; return r.json(); })
        .then(function (j) {
          if (!j.hits || !j.hits.length) return;
          RESLIVE[tab] = j.hits;
          if (S.page === 'download' && S.dlTab === tab && !S.sub) render(false);
        }).catch(function () { });
    }
    function loadNews() {
      if (!window.fetch) return;
      var WIKI = 'https://zh.minecraft.wiki';
      fetch('https://piston-meta.mojang.com/mc/game/version_manifest_v2.json')
        .then(function (r) { if (!r.ok) throw r.status; return r.json(); })
        .then(function (m) {
          LATEST = m.latest || LATEST;
          function pick(types, max) {
            return m.versions.filter(function (v) { return types.indexOf(v.type) >= 0; }).slice(0, max).map(function (v) { return [v.id, (v.releaseTime || '').slice(0, 10)]; });
          }
          DL.release = pick(['release'], 200);
          DL.snapshot = pick(['snapshot'], 80);
          DL.old = pick(['old_beta', 'old_alpha'], 200);
          if (S.page === 'download' && S.dlTab === 'versions' && !S.sub) render(false);
          var list = m.versions.filter(function (v) { return v.type === 'release' || v.type === 'snapshot'; }).slice(0, 4);
          var titles = list.map(function (v) { return 'Java版' + v.id; });
          var q = 'action=query&prop=extracts|pageimages&exintro=1&explaintext=1&exsentences=3&exlimit=max&piprop=thumbnail' +
            '&pithumbsize=640&pilimit=max&redirects=1&format=json&origin=*&titles=' + encodeURIComponent(titles.join('|'));
          return fetch(WIKI + '/api.php?' + q)
            .then(function (r) { return r.ok ? r.json() : {}; })
            .catch(function () { return {}; })
            .then(function (w) {
              var query = w.query || {}, from = {}, pages = {};
              (query.redirects || []).forEach(function (x) { from[x.to] = x.from; });
              Object.keys(query.pages || {}).forEach(function (k) {
                var p = query.pages[k];
                if (p.missing === undefined) pages[from[p.title] || p.title] = p;
              });
              return list.map(function (v, i) {
                var p = pages[titles[i]] || {};
                return {
                  k: v.type === 'release' ? '正式版' : '快照', id: v.id, d: (v.releaseTime || '').slice(0, 10),
                  t: (p.extract || '').trim() || 'Wiki 页面还在编写中。', img: p.thumbnail && p.thumbnail.source,
                  url: WIKI + '/w/' + encodeURIComponent(titles[i]), c: NEWS[i % NEWS.length].c
                };
              });
            });
        })
        .then(function (items) {
          if (!items || !items.length) return;
          NEWS = items;
          if (S.page === 'home' && !S.sub) render(false);
        })
        .catch(function () { });
    }
    function queryServer() {
      var addr = (S.txt.srv || '').trim() || 'mc.hypixel.net', out = app.querySelector('#pd-srv');
      if (!out) return;
      if (!/^[\w.-]+(:\d{1,5})?$/.test(addr)) { out.innerHTML = '<div class="ob">服务器地址格式不对。</div>'; return; }
      out.innerHTML = '<div class="ob">正在查询 ' + esc(addr) + '…</div>';
      var t0 = Date.now();
      fetch('https://api.mcsrvstat.us/3/' + encodeURIComponent(addr))
        .then(function (r) { if (!r.ok) throw r.status; return r.json(); })
        .then(function (j) {
          var o = app.querySelector('#pd-srv'); if (!o) return;
          if (!j.online) { o.innerHTML = '<div class="ob">' + esc(addr) + ' 当前不在线或无法连接。</div>'; return; }
          var motd = j.motd && j.motd.clean ? j.motd.clean.join('\n') : '';
          o.innerHTML = '<div class="ob" style="display:flex;gap:14px;align-items:center">' + (j.icon ? '<img src="' + esc(j.icon) + '" alt="" style="width:48px;height:48px;image-rendering:pixelated;border-radius:6px">' : '') +
            '<div><b>' + esc(j.hostname || addr) + '</b><div class="sub">在线 ' + (j.players ? j.players.online + ' / ' + j.players.max : '?') + ' · ' + esc(j.version || '未知版本') + ' · 查询耗时 ' + (Date.now() - t0) + ' ms</div>' +
            (motd ? '<div style="margin-top:4px;white-space:pre-wrap">' + esc(motd) + '</div>' : '') + '</div></div>';
        })
        .catch(function () { var o = app.querySelector('#pd-srv'); if (o) o.innerHTML = '<div class="ob">查询失败，请稍后再试。</div>'; });
    }

    /* ---------- 事件 ---------- */
    function go(page) { S.page = page; S.sub = null; render(true); if (page === 'download' && S.dlTab !== 'versions' && S.dlTab !== 'favorites') loadRes(S.dlTab); }
    root.addEventListener('click', function (e) {
      var el = e.target.closest ? e.target.closest('[data-a]') : null;
      if (!el || !root.contains(el)) { if (S.menu && !(e.target.closest && e.target.closest('.menu'))) closeMenu(); return; }
      if (el.hasAttribute('disabled')) return;
      var a = el.getAttribute('data-a'), v = el.getAttribute('data-v'), k = el.getAttribute('data-k');
      if (S.menu && !el.closest('.menu') && a !== 'menu') closeMenu();
      switch (a) {
        case 'tip': tip(v); break;
        case 'nav': go(v); break;
        case 'sub': S.sub = v; render(true); break;
        case 'back': S.sub = null; render(true); break;
        case 'menu':
          e.stopPropagation();
          if (S.menu) { closeMenu(); break; }
          if (v === 'inst') openMenu(el, INST.map(function (x, i) { return ['pick', i, x.id, i === S.inst ? 'check' : '']; }).concat(['-', ['sub', 'versions', '实例列表', 'list']]));
          else if (v === 'minmore') openMenu(el, [['godl', 'mods', '装模组', 'download'], ['detail', String(S.inst), '管理模组', 'view_list'], ['tip', '打开文件夹', '打开文件夹', 'folder_open'], ['sub', 'log', '查看日志', 'article'], ['tip', '查看公告', '启动器公告', 'campaign']]);
          else openMenu(el, [['sub', 'versions', '实例列表', 'list'], ['tip', '打开文件夹', '打开实例文件夹', 'folder_open'], ['sub', 'log', '游戏日志', 'article']]);
          break;
        case 'pick': S.inst = +v; if (S.sub === 'instance' || S.sub === 'versions') render(false); else { S.sub = null; render(false); } say('已切换到 ' + INST[S.inst].id); break;
        case 'detail': S.detail = +v; S.detailTab = k || 'overview'; if (S.detailTab === 'mods' && !INST[S.detail].ld) S.detailTab = 'overview'; S.page = 'home'; S.sub = 'instance'; render(true); break;
        case 'dtab': S.detailTab = v; render(false); break;
        case 'launch':
          S.running = true; render(false);
          say('这是网页演示，不会真的启动游戏。真实的启动器会在这里补全文件、登录并启动 ' + INST[S.inst].id + '。');
          break;
        case 'stop': S.running = false; render(false); break;
        case 'world': S.inst = WORLDS[+v].i; render(false); break;
        case 'playworld': e.stopPropagation(); S.inst = WORLDS[+v].i; S.running = true; S.sub = S.sub === 'instance' ? 'instance' : null; render(false); say('这是网页演示：真实的启动器会直接进入「' + WORLDS[+v].n + '」。'); break;
        case 'scrolldown': var sc = app.querySelector('.scr[data-s="home"]'); if (sc) sc.scrollTo({ top: 640, behavior: 'smooth' }); break;
        case 'refresh': loadNews(); say('正在刷新版本动态…'); break;
        case 'godl': S.page = 'download'; S.sub = null; S.dlTab = v; render(true); loadRes(v); break;
        case 'gotool': S.page = 'tools'; S.sub = null; S.toolSec = v; render(true); break;
        case 'goset': S.page = 'settings'; S.sub = null; S.setSec = v; render(true); break;
        case 'dltab': S.dlTab = v; S.resQ = ''; render(false); if (v !== 'versions' && v !== 'favorites') loadRes(v); break;
        case 'filt': S.filt = v; S.dlSel = null; S.ld = null; S.of = false; render(false); break;
        case 'dlsel': S.dlSel = v; S.ld = null; S.of = false; S.txt.iname = ''; render(false); break;
        case 'ld': S.ld = v || null; delete S.sel.ldv; if (S.ld && S.ld !== 'forge') S.of = false; render(false); break;
        case 'of': S.of = !S.of; render(false); break;
        case 'install':
          (function (id) {
            var ld = S.ld && loaderOk(S.ld, id) ? S.ld : null;
            var lv = ld ? (S.sel.ldv && loaderVersions(ld, id).indexOf(S.sel.ldv) >= 0 ? S.sel.ldv : loaderVersions(ld, id)[0]) : '';
            var name = (S.txt.iname || '').trim() || defaultName(ld, id, lv);
            S.txt.iname = '';
            say('已开始安装，进度见顶栏的后台任务');
            runTask('安装 ' + name, ['下载版本清单', '下载客户端', '下载依赖库', '下载资源文件', ld ? '安装 ' + LOADERS[ld].n : '校验文件'], function () {
              INST.push({ id: name, mc: id, ld: ld || (S.of ? 'optifine' : null), lv: ld ? defaultName(ld, id, lv) : null, mods: 0, ago: '还没玩过' });
            });
          })(v);
          break;
        case 'tool': S.toolSec = v; render(false); break;
        case 'srv': queryServer(); break;
        case 'diag':
          var d = app.querySelector('#pd-diag');
          if (d) d.innerHTML = '<div class="ob" style="margin-bottom:14px">' + (S.running ? '<b>没有发现问题</b><div class="sub">游戏还在运行，日志里没有错误。</div>' : '<b>本次打开启动器后还没有启动过游戏</b><div class="sub">可以先在首页点「开始游戏」（演示），或选择日志文件分析。</div>') + '</div>';
          break;
        case 'customdl': if (!(S.txt.dlurl || '').trim()) { say('请填写下载地址'); break; } runTask('下载 ' + ((S.txt.dlname || '').trim() || (S.txt.dlurl.split('/').pop() || '文件')), ['连接服务器', '下载中'], null); break;
        case 'skin':
          var nm = (S.txt.skin || '').trim(), box = app.querySelector('#pd-skin');
          if (!nm) { say('请填写正版玩家名'); break; }
          if (!/^\w{2,16}$/.test(nm)) { say('玩家名只能包含字母、数字和下划线'); break; }
          if (box) box.innerHTML = '<div class="ob" style="display:flex;gap:20px;align-items:center"><img src="https://mc-heads.net/body/' + encodeURIComponent(nm) + '/120" alt="' + esc(nm) + ' 的皮肤" style="height:180px;image-rendering:pixelated" onerror="this.replaceWith(document.createTextNode(\'没有找到这个玩家\'))"><img src="https://mc-heads.net/avatar/' + encodeURIComponent(nm) + '/96" alt="头像" style="width:96px;height:96px;border-radius:8px;image-rendering:pixelated" onerror="this.remove()"><div><b>' + esc(nm) + '</b><div class="sub">左边是皮肤预览，右边是从皮肤截取的头像</div><div style="margin-top:10px">' + btn('tonal sm', '保存皮肤', null, 'tip', '保存文件') + '</div></div></div>';
          break;
        case 'ach':
          var t1 = (S.txt.ach1 || '').trim() || '获得成就！', t2 = (S.txt.ach2 || '').trim(), out = app.querySelector('#pd-ach');
          if (!t2) { say('请填写标题和第一行文字'); break; }
          if (out) out.innerHTML = '<div style="margin-top:18px;display:inline-flex;gap:14px;align-items:center;padding:10px 18px 10px 12px;background:#212121;border:3px solid #555;box-shadow:inset 0 0 0 2px #000;font-family:monospace;image-rendering:pixelated"><span style="width:36px;height:36px;background:linear-gradient(135deg,#7fe7f0,#2aa7b5);clip-path:polygon(50% 0,100% 40%,50% 100%,0 40%)"></span><span><span style="display:block;color:#ffff55;font-size:15px">' + esc(t1) + '</span><span style="display:block;color:#fff;font-size:15px">' + esc(t2) + '</span>' + ((S.txt.ach3 || '').trim() ? '<span style="display:block;color:#fff;font-size:15px">' + esc(S.txt.ach3.trim()) + '</span>' : '') + '</span></div>';
          break;
        case 'acc': S.acc = +v; render(false); say('已切换到 ' + account().n); break;
        case 'delacc':
          if (S.accounts.length <= 1) { say('至少保留一个账户（演示）'); break; }
          S.accounts.splice(+v, 1); if (S.acc >= S.accounts.length) S.acc = S.accounts.length - 1; render(false); break;
        case 'mslogin': tip('登录微软账户'); break;
        case 'addoff':
          var on = (S.txt.offname || '').trim();
          if (!/^\w{3,16}$/.test(on)) { say('用户名需要 3–16 个字母、数字或下划线'); break; }
          S.accounts.push({ n: on, t: '离线' }); S.acc = S.accounts.length - 1; S.txt.offname = ''; render(false); say('已添加离线账户 ' + on); break;
        case 'set': S.setSec = v; render(false); break;
        case 'seed': S.seed = v; applyTheme(); render(false); break;
        case 'java': S.sel.java = v; render(false); break;
        case 'bgoff': S.bg = false; applyTheme(); render(false); break;
        case 'bgon': S.bg = true; if (S.layout === 'std') S.layout = 'split'; applyTheme(); render(false); break;
        case 'clean': say('已清理 128.4 MB（演示）'); break;
        case 'checkupd': say('已经是最新版本 0.3.4（演示）'); break;
        case 'sw':
          S.sw[k] = !swOn(k, v === '1');
          el.setAttribute('aria-checked', S.sw[k]);
          break;
        case 'ainew': S.ai = []; render(false); break;
        case 'ask': askAi(v); break;
        case 'aisend': var ta = app.querySelector('#pd-ai'); if (ta && ta.value.trim()) askAi(ta.value.trim()); break;
      }
    });
    function askAi(q) {
      S.ai.push({ r: 'u', t: q, title: q });
      if (!S.ai[0].t) S.ai[0].t = q;
      S.ai.push({ r: 'a', t: '这是网页演示，不能真的和 AI 对话。在启动器里填写你自己的 AI 服务（OpenAI 兼容接口或 Anthropic）后，AI 助手可以读取日志、查找模组、修改配置（每次修改前都会询问你）。' });
      render(false);
      var sc = app.querySelector('.scr[data-s="ai"]'); if (sc) sc.scrollTop = sc.scrollHeight;
    }
    root.addEventListener('change', function (e) {
      var t = e.target, k = t.getAttribute && t.getAttribute('data-sel');
      if (!k) return;
      S.sel[k] = t.value;
      if (k === 'theme') { S.theme = t.value; applyTheme(); }
      if (k === 'ldv') { var ipn = app.querySelector('#pd-ip'); if (ipn) ipn.innerHTML = installPanel(selVersion()); }
      if (k === 'layout') { S.layout = t.value; applyTheme(); render(false); }
    });
    root.addEventListener('input', function (e) {
      var t = e.target;
      if (t.id === 'pd-vq') { S.vq = t.value; S.dlSel = null; var l = app.querySelector('#pd-vl'); if (l) l.innerHTML = dlRows(); var ip = app.querySelector('#pd-ip'); if (ip) ip.innerHTML = installPanel(selVersion(DL[S.filt].filter(function (x) { return !S.vq.trim() || x[0].toLowerCase().indexOf(S.vq.trim().toLowerCase()) >= 0; }))); return; }
      if (t.id === 'pd-rq') { S.resQ = t.value; var rl = app.querySelector('#pd-res'); if (rl) rl.innerHTML = resList(S.dlTab); return; }
      if (t.id === 'pd-iq') { S.instQ = t.value; var pos = t.selectionStart; render(false); var n = app.querySelector('#pd-iq'); if (n) { n.focus(); n.setSelectionRange(pos, pos); } return; }
      var key = t.getAttribute && t.getAttribute('data-t');
      if (key) {
        S.txt[key] = t.value;
        if (key === 'threads') { var th = app.querySelector('#pd-thr'); if (th) th.textContent = t.value; }
        if (key === 'iname') { var x = app.querySelector('.instbar .x'); if (x) x.textContent = '安装为 ' + (t.value.trim() || t.placeholder); }
      }
    });
    root.addEventListener('keydown', function (e) {
      var t = e.target;
      if (t.id === 'pd-ai' && e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); if (t.value.trim()) askAi(t.value.trim()); }
      else if (e.key === 'Enter' && t.getAttribute && t.getAttribute('data-t') === 'srv') queryServer();
      else if (e.key === 'Escape') closeMenu();
    });

    applyTheme();
    render(false);
    fit();
    loadNews();
    if (window.ResizeObserver) new ResizeObserver(fit).observe(stage);
    window.addEventListener('resize', fit);
  }
})();
