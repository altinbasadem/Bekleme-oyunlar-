var V='bekleme-v1';
var FILES=['./','index.html','asansor.html','yol.html','manifest.json','icon-192.png','icon-512.png','apple-touch-icon.png'];
self.addEventListener('install',function(e){
  e.waitUntil(caches.open(V).then(function(c){return c.addAll(FILES);}).then(function(){return self.skipWaiting();}));
});
self.addEventListener('activate',function(e){
  e.waitUntil(caches.keys().then(function(k){return Promise.all(k.filter(function(n){return n!==V;}).map(function(n){return caches.delete(n);}));}).then(function(){return self.clients.claim();}));
});
self.addEventListener('fetch',function(e){
  var r=e.request; if(r.method!=='GET'){return;}
  var u=new URL(r.url);
  var font=u.hostname==='fonts.googleapis.com'||u.hostname==='fonts.gstatic.com';
  if(u.origin!==location.origin&&!font){return;}
  e.respondWith(caches.open(V).then(function(c){
    return c.match(r,{ignoreSearch:true}).then(function(hit){
      var net=fetch(r).then(function(res){
        if(res&&(res.ok||res.type==='opaque')){c.put(r,res.clone());}
        return res;
      }).catch(function(){return hit;});
      return hit||net;
    });
  }));
});
