import { Component, inject } from '@angular/core';
import { DialogComponent } from '../dialog/dialog.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [DialogComponent],
  template: `
    <app-dialog 
      title="{{dialogData.title}}" 
      cancelLabel="{{dialogData.cancelLabel}}" 
      saveLabel="{{dialogData.saveLabel}}"
      (onSave)="onConfirmDialog()" 
      >
      <p class="confirm-dialog__message">{{dialogData.message}}</p>
    </app-dialog>
  `,
  styleUrl: './confirm-dialog.component.scss'
})
export class ConfirmDialogComponent {
  private dialogRef = inject(MatDialogRef<ConfirmDialogComponent>);
  dialogData = inject(MAT_DIALOG_DATA);

  onConfirmDialog() {
    this.dialogRef.close(true);
  }
}
