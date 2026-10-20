
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import {
  IonHeader, IonToolbar, IonTitle, IonContent,
  IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent,
  IonGrid, IonRow, IonCol, ToastController
} from '@ionic/angular';

interface Ticket {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
}

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent,
    IonGrid, IonRow, IonCol
  ],
})
export class HomePage implements OnInit {
  private http = inject(HttpClient);
  private toastCtrl = inject(ToastController);

  tickets: Ticket[] = [];
  cargando = true;

  get total(): number {
    return this.tickets.length;
  }

  get resueltos(): number {
    return this.tickets.filter(t => t.completed).length;
  }

  get abiertos(): number {
    return this.total - this.resueltos;
  }

  get porcentajeResueltos(): number {
    if (this.total === 0) {
      return 0;
    }
    return Math.round((this.resueltos / this.total) * 100);
  }

  ngOnInit() {
    this.http.get<Ticket[]>('https://jsonplaceholder.typicode.com/todos').subscribe({
      next: (data) => {
        this.tickets = data;
        this.cargando = false;
        this.mostrarToast('Tickets cargados', 'success');
      },
      error: () => {
        this.cargando = false;
        this.mostrarToast('Error al cargar los tickets', 'danger');
      }
    });
  }

  async mostrarToast(mensaje: string, color: string) {
    const toast = await this.toastCtrl.create({
      message: mensaje,
      duration: 2000,
      color: color,
      position: 'bottom'
    });
    await toast.present();
  }
}