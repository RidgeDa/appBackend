const vueapp = new Vue({     
    el: '#content',     
    data: {         
        games: games     
    } 

    
})

if('serviceWorker' in navigator) {     
    navigator.serviceWorker.register('/pwa-examples/js13kpwa/sw.js'); 
};

var button = document.getElementById("notifications"); button.addEventListener('click', function(e) {     
    Notification.requestPermission().then(function(result) {         
    if(result === 'granted') {             
        randomNotification();         
    }     
}); 
});


function randomNotification() {     
    var randomItem = Math.floor(Math.random()*games.length);     
    var notifTitle = games[randomItem].name;     
    var notifBody = 'Created by '+games[randomItem].author+'.';     
    var notifImg = 'data/img/'+games[randomItem].slug+'.jpg';     
    var options = {         
        body: notifBody,         
    icon: notifImg     
}     
var notif = new Notification(notifTitle, options);     
setTimeout(randomNotification, 30000); 
}

self.addEventListener('install', (e) => {     
    console.log('[Service Worker] Install'); 
})

var cacheName = 'js13kPWA-v1'; var appShellFiles = [   
    '/pwa-examples/js13kpwa/',   
    '/pwa-examples/js13kpwa/index.html',   
    '/pwa-examples/js13kpwa/app.js',   
    '/pwa-examples/js13kpwa/style.css',   
    '/pwa-examples/js13kpwa/fonts/graduate.eot',   
    '/pwa-examples/js13kpwa/fonts/graduate.ttf',   
    '/pwa-examples/js13kpwa/fonts/graduate.woff',   
    '/pwa-examples/js13kpwa/favicon.ico',   
    '/pwa-examples/js13kpwa/img/js13kgames.png',   
    '/pwa-examples/js13kpwa/img/bg.png',   
    '/pwa-examples/js13kpwa/icons/icon-32.png',   
    '/pwa-examples/js13kpwa/icons/icon-64.png',   
    '/pwa-examples/js13kpwa/icons/icon-96.png',   
    '/pwa-examples/js13kpwa/icons/icon-128.png',   
    '/pwa-examples/js13kpwa/icons/icon-168.png',   
    '/pwa-examples/js13kpwa/icons/icon-192.png',   
    '/pwa-examples/js13kpwa/icons/icon-256.png',   
    '/pwa-examples/js13kpwa/icons/icon-512.png' 
];

var gamesImages = []; 
for(var i=0; i<games.length; i++) {   
    gamesImages.push('data/img/'+games[i].slug+'.jpg'); 
} 
var contentToCache = appShellFiles.concat(gamesImages);

self.addEventListener('install', (e) => {   
    console.log('[Service Worker] Install');   
    e.waitUntil(     
        caches.open(cacheName).then((cache) => {           
            console.log('[Service Worker] Caching all: app shell and content');       
            return cache.addAll(contentToCache);     
        })   
        ); 
    });

