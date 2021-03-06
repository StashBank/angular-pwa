
import { Guid } from 'guid-typescript';

export class TodoService {

  get collection() {
    return this.db.collection('todos');
  }

  get settingsCollection() {
    return this.db.collection('todos-settings');
  }

  constructor(private db: FirebaseFirestore.Firestore) {}

  getAll(): Promise<any[]> {
    const query = this.collection.get()
      .then(r => r.docs.map(d => ({
        id: d.id,
        ...d.data()
      } as any)));
    return query;
  }

  findById(id: string): Promise<any> {
    const docRef = this.collection.doc(id);
    const query = docRef.get()
      .then(d => ({
        id: d.id,
        ...d.data()
      } as any));
    return query;
  }

  add(dto: any): Promise<any> {
    const id = dto.id || Guid.create().toString();
    delete dto.id;
    const docRef = this.collection.doc(id);
    const query = docRef.set(dto)
      .then(_ => docRef.get())
      .then(d => ({
          id: d.id,
          ...d.data()
        } as any));
    return query;
  }

  update(id: string, dto: any): Promise<any> {
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

  // Grid settings
  getGridSetting(key: string): Promise<any> {
    const docRef = this.settingsCollection.doc(key);
    const query = docRef.get()
      .then(d => d.data());
    return query;
  }

  setGridSetting(key: string, setting: any): Promise<any> {
    const docRef = this.settingsCollection.doc(key);
    const query = docRef.set(setting)
      .then(_ => docRef.get())
      .then(d => d.data());
    return query;
  }

}
