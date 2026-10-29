// Service worker do painel: deixa instalar como app e mostra o banner de feedback novo.
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));
self.addEventListener('fetch', () => {});
self.addEventListener('push', e => {
  let d = {};
  try { d = e.data ? e.data.json() : {}; } catch (_) { d = {body: e.data && e.data.text()}; }
  e.waitUntil(self.registration.showNotification(d.title || 'Feedback novo no PULZR', {
    body: d.body || 'Abra o painel para ver.',
    icon: 'img/icon-192.png',
    badge: 'img/icon-192.png',
    tag: d.tag || 'pulzr-feedback',
    renotify: true,
    vibrate: [120, 60, 120],
    data: {url: 'painel.html'}
  }));
});
self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(self.clients.matchAll({type: 'window', includeUncontrolled: true}).then(list => {
    for (const c of list) if (c.url.includes('painel')) { c.postMessage('reload'); return c.focus(); }
    return self.clients.openWindow('painel.html');
  }));
});
