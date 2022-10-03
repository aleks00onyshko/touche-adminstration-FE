import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { CreateBotInstructionsComponent } from './create-bot-instructions/create-bot-instructions.component';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-create-store-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatCardModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatInputModule,
    CreateBotInstructionsComponent,
    HttpClientModule
  ],
  templateUrl: './create-store-dialog.component.html',
  styleUrls: ['./create-store-dialog.component.scss']
})
export class CreateStoreDialogComponent {
  public createStoreForm = new FormGroup({
    botToken: new FormControl<string>('', [Validators.required, Validators.minLength(10)]),
    shopName: new FormControl<string>('', [Validators.required])
  });

  constructor(private dialogRef: MatDialogRef<CreateStoreDialogComponent>) {}

  public createStore(): void {
    const { botToken, shopName } = this.createStoreForm.value;

    this.dialogRef.close({ botToken: botToken as string, shopName: shopName as string } as CreateShopDialogResult);
  }
}

export interface CreateShopDialogResult {
  botToken: string;
  shopName: string;
}
