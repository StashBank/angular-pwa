import * as Nedb from 'nedb';

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
