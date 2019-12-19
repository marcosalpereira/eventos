import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  constructor(private snackBar: MatSnackBar) { }

  show(msg: string, action = 'Fechar', duration = 5000) {
    this.snackBar.open(msg, action, { duration });
  }
}
