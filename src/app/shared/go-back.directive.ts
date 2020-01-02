import { Directive, HostListener, OnInit, ElementRef } from '@angular/core';
import { Location } from '@angular/common';

@Directive({
  selector: '[appGoBack]'
})
export class GoBackDirective {

  constructor(private location: Location, private elementRef: ElementRef) {
    this.elementRef.nativeElement.title = 'Voltar';
  }

  @HostListener('click')
  onClick() {
      this.location.back();
  }

}
