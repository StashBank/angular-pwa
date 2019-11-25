import * as Nedb from 'nedb';
import * as webpush from 'web-push';
import * as vapidKeys from '../vapid-key.json';

const { publicKey, privateKey } = vapidKeys as any;

webpush.setVapidDetails(
  'mailto:o.pavlovskyi@certentinc.com',
  publicKey,
  privateKey
);

export interface DbPushSubscription extends PushSubscription {
  _id: string;
}

export class NotificationService {

  private db: Nedb;

  constructor() {
    this.db = new Nedb({
      filename: 'notifications.db',
      autoload: true
    });
  }

  getAll(): DbPushSubscription[] {
    return this.db.getAllData();
  }

  findSubscriptionByEndpoint(endpoint: string): Promise<DbPushSubscription> {
    return new Promise((resolve, reject) => {
      this.db.findOne({ endpoint }, this.dbResponseHandler(resolve, reject));
    });
  }

  registerSubscription(pushSubscription: PushSubscription): Promise<DbPushSubscription> {
    return new Promise((resolve, reject) => {
      this.db.insert(pushSubscription, this.dbResponseHandler(resolve, reject));
    });
  }

  remove(id: string): Promise<number> {
    return new Promise((resolve, reject) => {
      this.db.remove({ _id: id }, this.dbResponseHandler(resolve, reject));
    });
  }

  sendNotification(payload: any, senderId: string) {
    const allSubscriptions = this.getAll().filter(x => x._id !== senderId);
    if (payload.data && payload.data.id) {
      payload.data.url = '/#/todo/edit/' + payload.data.id;
    }
    const notificationPayload = {
      notification: {
        title: payload.title || 'News',
        body: payload.body || 'Newsletter Available!',
        icon: '/assets/icons/bell.png',
        image: '/assets/icons/bell.png',
        badge: '/assets/icons/bell.png',
        vibrate: [100, 50, 100],
        data: payload.data || {
          dateOfArrival: Date.now(),
          primaryKey: 1
        },
        actions: payload.actions || [{
          action: 'ok',
          title: 'OK',
          icon: '/assets/icons/bell.png'
        }]
      }

    };

    console.log(`Sending notification to ${allSubscriptions.length} subscriptions`);
    return Promise.all(
      allSubscriptions.map(
        sub => webpush.sendNotification(sub as any, JSON.stringify(notificationPayload))
      )
    );
  }

  // tslint:disable-next-line: ban-types
  private dbResponseHandler(resolve: Function, reject: Function) {
    return (err: Error, data: any) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    };
  }
}
