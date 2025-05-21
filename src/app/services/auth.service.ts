import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://localhost:7085/api/Auth';

  constructor(private http: HttpClient) {}

  login(data: { username: string, password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, data).pipe(
      tap((res: any) => {
        // Store session data (role, username, etc.)
        sessionStorage.setItem('userRole', res.role);
        sessionStorage.setItem('username', res.username);
        sessionStorage.setItem('userId', res.userId);
      })
    );
  }

signup(data: { username: string, password: string, role: string }) {
  return this.http.post(`${this.apiUrl}/signup`, data);
}



  logout() {
    sessionStorage.clear();
  }

  getRole(): string | null {
    return sessionStorage.getItem('userRole');
  }

  isLoggedIn(): boolean {
    return !!sessionStorage.getItem('userRole');
  }
}
