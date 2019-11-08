import { Guid } from 'guid-typescript';

export interface DbPushSubscription extends PushSubscription {
  id: string;
}

export class NotificationService {

  get collection() {
    return this.db.collection('notifications');
  }

  constructor(private db: FirebaseFirestore.Firestore) {}

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

}
