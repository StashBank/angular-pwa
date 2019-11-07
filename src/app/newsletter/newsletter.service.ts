import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class NewsletterService {
  constructor(private http: HttpClient) {}

  addPushSubscriber(sub: PushSubscription) {
    return this.http.post<{id: string}>('/api/notifications', sub);
  }

  removePushSubscriber(id: string) {
    return this.http.delete<any>(`/api/notifications/${id}`);
  }

  send(payload: {title?: string, body?: string, data?: any, actions?: any[] }, senderId) {
    return this.http.post<{message: string}>('/api/newsletter', payload, {
      params: {senderId}
    });
  }
}
