import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatLegacyDialogModule as MatDialogModule, MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss']
})
export class ConfirmDialogComponent {
  constructor(public dialog: MatDialogRef<ConfirmDialogComponent>, @Inject(MAT_DIALOG_DATA) public message: string) {}

  public reject(event: MouseEvent): void {
    event.stopImmediatePropagation();
    this.dialog.close(false);
  }

  public confirm(event: MouseEvent): void {
    event.stopImmediatePropagation();
    this.dialog.close(true);
  }
}
