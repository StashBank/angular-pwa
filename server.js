const express = require('express');
const serve = require('express-static');
const bodyParser = require('body-parser');
const webpush = require('web-push');
const vapidKeys = require('./vapid-key.json');
const Nedb = require('nedb');
const db = new Nedb({
  filename: 'data.db',
  autoload: true
});

webpush.setVapidDetails(
  'mailto:o.pavlovskyi@certentinc.com',
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

const app = express();
app.use(bodyParser.json())

const api = express.Router();

app.get('/', (req, res) => {
  res.sendFile(__dirname + '\\dist\\index.html');
});

api.post('/notifications', (req, res) => {
  const pushSubscription = req.body;
  const { endpoint } = pushSubscription;
  db.findOne({ endpoint }, (err, existingDoc) => {
    if (err) {
      res.status(500).send(err);
    } else if (existingDoc) {
      res.send({ id: existingDoc._id });
    } else {
      db.insert(pushSubscription, (err, newDoc) => {
        if (err) {
          res.status(500).send(err);
        } else {
          res.send({ id: newDoc._id });
        }
      })
    }
  })
});

api.delete('/notifications/:id', (req, res) => {
  const id = req.params.id;
  db.remove({ _id: id}, (err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.send();
    }
  })
})

api.post('/newsletter', async (req, res) => {
  const payload = req.body || {};
  const senderId = req.query.senderId;
  const allSubscriptions = db.getAllData().filter(x => x._id !== senderId);
  const notificationPayload = {
    "notification": {
      "title": payload.title || "News",
      "body": payload.body || "Newsletter Available!",
      "icon": "assets/icons/bell.svg",
      "vibrate": [100, 50, 100],
      "data": payload.data || {
        "dateOfArrival": Date.now(),
        "primaryKey": 1
      },
      "actions": payload.actions || [{
        "action": "ok",
        "title": "OK"
      }]
    }

  };
  await Promise.all(
    allSubscriptions.map(
      sub => webpush.sendNotification(sub, JSON.stringify(notificationPayload))
    )
  ).catch(err => {
    console.error("Error sending notification, reason: ", err);
    res.sendStatus(500);
  });
  res.status(200).json({ message: 'Newsletter sent successfully.' })
})

app.use('/api', api);

app.use(serve(__dirname + '\\dist'));

const server = app.listen(3000, function () {
  console.log('server is running at %s', server.address().port);
});