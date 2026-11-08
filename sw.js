/* Service Worker — 3mix Push Notifications */
self.addEventListener('push', ev => {
  let data = { title: 'Nova venda!', body: 'Uma nova venda foi registrada.', tag: 'venda' };
  try { data = ev.data.json(); } catch (e) {}
  ev.waitUntil(
    self.registration.showNotification(data.title || 'Nova venda!', {
      body: data.body || '',
      icon: '/icon-192.png',
      badge: '/favicon-48.png',
      tag: data.tag || 'venda',
      vibrate: [200, 100, 200],
      data: { url: self.location.origin }
    })
  );
});

self.addEventListener('notificationclick', ev => {
  ev.notification.close();
  const url = (ev.notification.data && ev.notification.data.url) || self.location.origin;
  ev.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
      for (const c of list) { if (c.url.startsWith(url) && 'focus' in c) return c.focus(); }
      return clients.openWindow(url);
    })
  );
});
