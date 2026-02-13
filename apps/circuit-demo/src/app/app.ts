import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CircuitDirective } from 'ngx-circuit';

@Component({
  standalone: true,
  imports: [RouterModule, CircuitDirective],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
})
export class App {
  title = 'circuit-demo';

  resetSession() {
    sessionStorage.removeItem('circuit_session_id');
    window.location.reload();
  }
}
