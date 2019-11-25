importScripts('./idb.js');

(function () {
  'use strict';

  var dbPromise = idb.open('todoPosts', 1, function (db) {
    if (!db.objectStoreNames.contains('todo')) {
      db.createObjectStore('todo', { keyPath: 'key' });
    }
  });

  self.addEventListener('notificationclick', (event) => {
    var notification = event.notification;
    var action = event.action;
    event.notification.close();
    console.log('notification details: ', event.notification);
    if (action === 'go' && notification.data && notification.data.url) {
      event.waitUntil(
        clients.matchAll()
          .then(function (clientList) {
            var client = clientList.find(function (c) {
              return c.visibilityState === 'visible';
            });

            if (client !== undefined) {
              client.navigate(notification.data.url);
              client.focus();
            } else {
              clients.openWindow(notification.data.url);
            }
            notification.close();
          })
      );
    }
  });

  self.addEventListener('sync', function (event) {
    if (event.tag === 'sync-todo-posts') {
      console.log('[Service Worker] Syncing new Posts');
      event.waitUntil(
        readAllData('todo')
          .then(function (data) {
            return Promise.all(data.map(function(dt) {
                var url = dt.url;
                if(dt.options && dt.options.params) {
                  url += '?';
                  for(var paramKey in dt.options.params) {
                    url += encodeURIComponent(paramKey) + '=' + encodeURIComponent(dt.options.param[paramKey]);
                  }
                }
                return fetch(dt.url, {
                  method: dt.method,
                  headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                  },
                  body: JSON.stringify(dt.body)
                })
                  .then(function (res) {
                    console.log('Sent data', res);
                    if (res.ok) {
                      deleteItemFromData('todo', dt.key);
                    }
                  })
                  .catch(function (err) {
                    console.log('Error while sending data', err);
                  });
              })
            )}
          )
      );
    }
  });

  function readAllData(st) {
    return dbPromise
      .then(function (db) {
        var tx = db.transaction(st, 'readonly');
        var store = tx.objectStore(st);
        return store.getAll();
      });
  }

  function deleteItemFromData(st, id) {
    dbPromise
      .then(function (db) {
        var tx = db.transaction(st, 'readwrite');
        var store = tx.objectStore(st);
        store.delete(id);
        return tx.complete;
      })
      .then(function () {
        console.log('Item deleted!');
      });
  }

}());
