import * as Nedb from 'nedb';

export class TodoService {
  private db: Nedb;
  private settingsDb: Nedb;

  constructor() {
    this.db = new Nedb({ filename: 'todos.db', autoload: true });
    this.settingsDb = new Nedb({ filename: 'todos.settings.db', autoload: true });
  }

  getAll(): any[] {
    return this.db.getAllData();
  }

  findById(id: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.db.findOne({ id }, this.dbResponseHandler(resolve, reject));
    });
  }

  add(todo: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.db.insert(todo, this.dbResponseHandler(resolve, reject));
    });
  }

  update(id: string, todo: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.db.update({ id }, todo, {}, this.dbResponseHandler(resolve, reject));
    });
  }

  remove(id: string): Promise<number> {
    return new Promise((resolve, reject) => {
      this.db.remove({ id }, this.dbResponseHandler(resolve, reject));
    });
  }

  // Grid settings
  getGridSetting(key: string): Promise<any> {
    return Promise.resolve(
      this.settingsDb.getAllData().find(x => x.key === key)
    ).then((x: any) => x.setting);
  }

  setGridSetting(key: string, setting: any): Promise<any> {
    return new Promise((resolve, reject) => {
      if (this.settingsDb.getAllData().some(x => x.key === key)) {
        this.settingsDb.update({ key }, { key, setting }, {}, this.dbResponseHandler(resolve, reject));
      } else {
        this.settingsDb.insert({ key, setting }, this.dbResponseHandler(resolve, reject));
      }
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
