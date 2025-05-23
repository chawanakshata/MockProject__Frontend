import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet, RouterLink, RouterLinkActive, RouterLinkWithHref, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, RouterLinkWithHref],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  sessionUsername: string | null = null;
  constructor(public router: Router) {
    this.updateSessionUsername();
    // Listen for route changes and update sessionUsername
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.updateSessionUsername();
      }
    });
  }
  title = 'MockProject';
  showMenu = false;

  updateSessionUsername() {
    this.sessionUsername = sessionStorage.getItem('username');
  }

  isLoginPage(): boolean {
    return this.router.url === '/login';
  }

  logout() {
    sessionStorage.clear(); // Clear all session storage, including guest mode
    this.router.navigate(['/login']); // Redirect to login page
    this.sessionUsername = null;
  }
}
