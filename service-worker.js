self.addEventListener("install",()=>{
self.skipWaiting();
});

self.addEventListener("activate",()=>{
clients.claim();
});

self.addEventListener("notificationclick",(e)=>{
e.notification.close();

e.waitUntil(
clients.openWindow("./")
);
});
