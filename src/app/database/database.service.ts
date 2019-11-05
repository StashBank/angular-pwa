import { Injectable, NgZone } from '@angular/core';
import { Observable, of as observableOf, Subscriber } from 'rxjs';
import { Guid } from 'guid-typescript';


@Injectable()
export abstract class DatabaseService<T> {

  protected db: Nedb;

  constructor(protected collectionName: string, protected ngZone: NgZone) {
    this.db = new Nedb({
      filename: `${this.collectionName}.db`,
      autoload: true
    });
  }

  public getAll(): Observable<T[]> {
    const query = new Observable<T[]>(observer => {
      this.db.find({}, {}, this.getDbResponseHandler(observer));
    });
    return query;
  }

  public getById(id: string): Observable<T> {
    const query = new Observable<T>(observer => {
      this.db.findOne({ id }, this.getDbResponseHandler(observer));
    });
    return query;
  }

  public create(dto: T): Observable<T> {
    const id = Guid.create().toString();
    const query = new Observable<T>(observer => {
      this.db.insert({ id, ...dto}, this.getDbResponseHandler(observer));
    });
    return query;
  }

  public update(id: string, dto: T): Observable<T> {
    const query = new Observable<T>(observer => {
      this.db.update({ id }, dto, {}, this.getDbResponseHandler(observer));
    });
    return query;
  }

  public remove(id: string): Observable<number> {
    const query = new Observable<number>(observer => {
      this.db.remove({ id }, this.getDbResponseHandler(observer));
    });
    return query;
  }

  protected getDbResponseHandler<G>(observer: Subscriber<G>) {
    return (err, data) => {
      this.ngZone.run(() => {
        if (err) {
          observer.error(err);
        } else {
          observer.next(data);
        }
        observer.complete();
      });
    };
  }
}
