import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-additional-login-methods',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule],
  templateUrl: './additional-login-methods.component.html',
  styleUrls: ['./additional-login-methods.component.scss'],
})
export class AdditionalLoginMethodsComponent {}
