import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private showModalSource = new BehaviorSubject<boolean>(false);
  currentShowModal = this.showModalSource.asObservable();

  constructor() { }

  openModal() {
    this.showModalSource.next(true);
  }

  closeModal() {
    this.showModalSource.next(false);
  }
}
