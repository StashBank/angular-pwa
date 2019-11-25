import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

import * as express from 'express';
import * as serve from 'express-static';
import * as bodyParser from 'body-parser';
import * as webpush from 'web-push';
import { NotificationService } from './notifications';
import { TodoService } from './totos';

import 'firebase/firestore';
import 'firebase/database';


const firebaseApp = admin.initializeApp();
const config = functions.config();

const { public_key, private_key} = config.vapidkey;

const notificationSvc = new NotificationService(firebaseApp.firestore(), public_key, private_key);
const todoSvc = new TodoService(firebaseApp.firestore());

const app = express();
app.use(bodyParser.json());

const api = express.Router();

app.get('/', (req, res) => {
  res.sendFile(__dirname + '\\public\\index.html');
});

api.post('/notifications', async (req, res) => {
  try {
    const pushSubscription = req.body;
    const { endpoint } = pushSubscription;
    const existing = await notificationSvc.findSubscriptionByEndpoint(endpoint);
    if (existing) {
      res.send({ id: existing.id });
    } else {
      const subscription = await notificationSvc.registerSubscription(pushSubscription);
      res.send({ id: subscription.id });
    }
  } catch (err) {
    res.status(500).send(err);
  }
});

api.delete('/notifications/:id', (req, res) => {
  try {
    const id = req.params.id;
    notificationSvc.remove(id);
    res.send();
  } catch (err) {
    res.status(500).send(err);
  }
});

api.post('/newsletter', async (req, res) => {
  const payload = req.body || {};
  const senderId = req.query.senderId;
  const allSubscriptions = (await notificationSvc.getAll()).filter(x => x.id !== senderId);
  const notificationPayload = {
    notification: {
      title: payload.title || 'News',
      body: payload.body || 'Newsletter Available!',
      icon: 'assets/icons/bell.png',
      image: 'assets/icons/bell.png',
      badge: 'assets/icons/bell.png',
      vibrate: [500, 110, 500, 110, 450, 110, 200, 110, 170, 40, 450, 110, 200, 110, 170, 40, 500],
      data: payload.data || {
        dateOfArrival: Date.now(),
        primaryKey: 1
      },
      actions: payload.actions || [{
        action: 'ok',
        title: 'OK'
      }]
    }

  };
  await Promise.all(
    allSubscriptions.map(
      sub => webpush.sendNotification(sub as any, JSON.stringify(notificationPayload))
    )
  ).catch(err => {
    console.error('Error sending notification, reason: ', err);
    res.status(500).send({
      message: 'Error sending notification',
      reason: err.message
    });
  });
  res.status(200).json({ message: 'Newsletter sent successfully.' });
});


const todosApi = express.Router()
  .get('', async (req, res) => {
    const data = await todoSvc.getAll();
    res.send(data);
  })
  .get('/:id', async (req, res) => {
    const id = req.params.id;
    try {
      const data = await todoSvc.findById(id);
      res.send(data);
    } catch (err) {
      res.status(500).status(err);
    }
  })
  .post('', async (req, res) => {
    const body = req.body;
    const senderId = req.query.senderId;
    try {
      const data = await todoSvc.add(body);
      notificationSvc.sendNotification({
        title: 'Todo',
        body: `New TODO created "${data.title}"`,
        data: {
          id: data.id,
          url: `/#/todo/edit/${data.id}`
        },
        actions: [{ action: 'go', title: 'Go to TODO' }]
      }, senderId);
      res.send(data);
    } catch (err) {
      res.status(500).status(err);
    }
  })
  .put('/:id', async (req, res) => {
    const id = req.params.id;
    const body = req.body;
    const senderId = req.query.senderId;
    try {
      await todoSvc.update(id, body);
      notificationSvc.sendNotification({
        title: 'Todo',
        body: `TODO "${body.title}" updated`,
        data: {
          id: body.id,
          url: `/#/todo/edit/${body.id}`
        },
        actions: [{ action: 'go', title: 'Go to TODO' }]
      }, senderId);
      res.send(body);
    } catch (err) {
      res.status(500).status(err);
    }
  })
  .get('/settings/:key', async (req, res) => {
    const key = req.params.key;
    const setting = await todoSvc.getGridSetting(key);
    res.send(setting);
  })
  .post('/settings/:key', async (req, res) => {
    const key = req.params.key;
    const setting = req.body;
    const numbers = await todoSvc.setGridSetting(key, setting);
    res.send({ numbers });
  });

api.use('/todos', todosApi);

app.use('/api', api);

app.use(serve(__dirname + '\\public'));


export const application = functions.https.onRequest(app);
