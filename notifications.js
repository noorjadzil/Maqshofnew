async function initNotification(){

if(!("Notification" in window))
return false;

if(Notification.permission==="default"){

await Notification.requestPermission();

}

return Notification.permission==="granted";

}

async function showNotify(title,body){

const ok=
await initNotification();

if(!ok)
return;

const reg=
await navigator.serviceWorker.ready;

reg.showNotification(
title,
{
body,
icon:"icon-192.png",
badge:"icon-192.png",
vibrate:[300,150,300],
requireInteraction:true
}
);

}
