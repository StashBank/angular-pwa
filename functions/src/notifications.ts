import { Guid } from 'guid-typescript';
import * as webpush from 'web-push';


export interface DbPushSubscription extends PushSubscription {
  id: string;
}

export class NotificationService {

  get collection() {
    return this.db.collection('notifications');
  }

  constructor(private db: FirebaseFirestore.Firestore, publicKey: string, privateKey: string) {
    webpush.setVapidDetails(
      'mailto:o.pavlovskyi@certentinc.com',
      publicKey,
      privateKey
    );
  }

  getAll(): Promise<DbPushSubscription[]> {
    const query = this.collection.get()
      .then(r => r.docs.map(d => ({
        id: d.id,
        ...d.data()
      } as DbPushSubscription)));
    return query;
  }

  findSubscriptionByEndpoint(endpoint: string): Promise<DbPushSubscription> {
    const query = this.collection.where('endpoint', '==', endpoint).get()
      .then(r => r.docs.map(d => ({
        id: d.id,
        ...d.data()
      } as DbPushSubscription))[0]);
    return query;
  }

  registerSubscription(dto: PushSubscription): Promise<DbPushSubscription> {
    const id = Guid.create().toString();
    const docRef = this.collection.doc(id);
    const query = docRef.set(dto)
      .then(_ => docRef.get())
      .then(d => ({
        id: d.id,
        ...d.data()
      } as any));
    return query;
  }

  remove(id: string): Promise<any> {
    const docRef = this.collection.doc(id);
    const query = docRef.delete();
    return query;
  }

  async sendNotification(payload: any, senderId: string) {
    const allSubscribtions = await this.getAll();
    const allSubscriptions = allSubscribtions.filter(x => x.id !== senderId);
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
        (sub: any) => webpush.sendNotification(sub, JSON.stringify(notificationPayload))
      )
    );
  }

}
