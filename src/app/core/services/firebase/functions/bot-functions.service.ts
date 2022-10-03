import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface CreateBotRequestBody {
  token: string;
}

export interface CreateBotResponse {
  token: string;
}

@Injectable({ providedIn: 'root' })
export class BotFunctionsService {
  constructor(private http: HttpClient) {}

  public createBot(botToken: string): Observable<CreateBotResponse> {
    return this.http.post<CreateBotResponse>('https://create-736ronyepq-uc.a.run.app', { token: botToken } as CreateBotRequestBody);
  }
}
