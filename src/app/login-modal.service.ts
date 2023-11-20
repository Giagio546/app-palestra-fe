import { Injectable } from '@angular/core';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { LoginComponent } from './login/login.component';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginModalService {
  private overlayRef: OverlayRef | null = null;
  private closeModalSubject = new Subject<void>();

  constructor(private overlay: Overlay) { }

  openModal(): void {
     this.overlayRef = this.overlay.create({
      hasBackdrop: true,
      positionStrategy: this.overlay.position().global().centerHorizontally().centerVertically()
    });

    const portal = new ComponentPortal(LoginComponent);
    this.overlayRef.attach(portal);
    this.overlayRef.backdropClick().subscribe( () => {
      this.closeModal();
    })
  }

  closeModal(): void {
    if (this.overlayRef) {
      this.overlayRef.detach();
      this.closeModalSubject.next();
      this.closeModalSubject.complete();
    }
  }

  onCloseModal(): Subject<void> {
    return this.closeModalSubject;
  }
  
}
