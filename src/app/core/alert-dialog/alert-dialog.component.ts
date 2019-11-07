import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

export enum AlertDialogButtonCode {
  Ok = 'ok',
  Yes = 'yes',
  No = 'no',
  Cancel = 'cancel',
}

export enum AlertDialogButtonColor {
  Primary = 'primary',
  Accent = 'accent',
  Warn = 'warn',
  None = '',
}

export enum AlertDialogType {
  Info = 'info',
  Warn = 'warn',
  Error = 'error'
}

export class AlertDialogButtonConfig {
  buttonCode: AlertDialogButtonCode;
  color?: AlertDialogButtonColor;
}

export class AlertDialogData {
  title?: string;
  message?: string;
  buttons?: AlertDialogButtonConfig[];
  type?: AlertDialogType;
}

@Component({
  selector: 'app-alert-dialog',
  templateUrl: './alert-dialog.component.html',
  styleUrls: ['./alert-dialog.component.sass']
})
export class AlertDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<AlertDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AlertDialogData) { }

  ngOnInit() {
    if (!this.data) {
      this.data = {} as AlertDialogData;
    }
    if (!this.data.buttons || !this.data.buttons.length) {
      this.data.buttons = [{ buttonCode: AlertDialogButtonCode.Ok }];
    }
  }

}
