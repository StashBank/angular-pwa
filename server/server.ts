import * as express from 'express';
import * as serve from 'express-static';
import * as bodyParser from 'body-parser';
import { NotificationService } from './notifications';
import { TodoService } from './totos';

const notificationSvc = new NotificationService();
const todoSvc = new TodoService();

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
      res.send({ id: existing._id });
    } else {
      const subscription = await notificationSvc.registerSubscription(pushSubscription);
      res.send({ id: subscription._id });
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

api.post('/newsletter', (req, res) => {
  const payload = req.body || {};
  const senderId = req.query.senderId;

  notificationSvc.sendNotification(payload, senderId)
  .then(() => {
    res.status(200).json({ message: 'Newsletter sent successfully.' });
  })
  .catch(err => {
    console.error('Error sending notification, reason: ', err);
    res.sendStatus(500);
  });
});

const todosApi = express.Router()
  .get('', (req, res) => {
    res.send(todoSvc.getAll());
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
    todoSvc.update(id, body)
    .then(() => {
      console.log(`Todo "${body.title} updated. sending notification`);
      notificationSvc.sendNotification({
        title: 'Todo',
        body: `TODO "${body.title}" updated`,
        data: {
          id: body.id,
          url: `/#/todo/edit/${body.id}`
        },
        actions: [{ action: 'go', title: 'Go to TODO' }]
      }, senderId)
      .then(() => {
        console.log('Notification sended');
      })
      .catch(err => {
        console.log('Error while sending notification', err);
      });
      res.send(body);
    })
    .catch((err) => {
      res.status(500).status(err);
    });
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

const server = app.listen(3000, () => {
  const { port } = server && server.address() as { port: number };
  console.log('server is running at %s', port);
  console.log('Home directory is %s', __dirname);
});
