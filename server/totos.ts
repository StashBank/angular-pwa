import * as Nedb from 'nedb';

export class TodoService {
  private db: Nedb;

  constructor() {
    this.db = new Nedb({
      filename: 'todos.db',
      autoload: true
    });
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
