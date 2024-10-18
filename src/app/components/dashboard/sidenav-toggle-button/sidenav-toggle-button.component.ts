import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatDrawer } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-sidenav-toggle-button',
  templateUrl: './sidenav-toggle-button.component.html',
  styleUrls: ['./sidenav-toggle-button.component.scss'],
  standalone: true,
  imports: [MatIconModule, MatButtonModule]
})
export class SidenavToggleButtonComponent {
  @Input() drawer!: MatDrawer;

  toggleDrawer() {
    this.drawer.toggle();
  }
}
