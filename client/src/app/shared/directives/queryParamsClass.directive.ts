import {
  Directive,
  ElementRef,
  Input,
  Renderer2,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

@Directive({
  //eslint-disable-next-line
  selector: '[queryParamClass]',
  standalone: true,
})
export class QueryParamClassDirective implements OnInit, OnDestroy {
  @Input('queryParamClass') elementClass!: string;
  @Input() param!: string;
  @Input() value!: string;

  private subscription!: Subscription;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.subscription = this.route.queryParams.subscribe(params => {
      if (params[this.param] === this.value) {
        this.renderer.addClass(this.el.nativeElement, this.elementClass);
      } else {
        this.renderer.removeClass(this.el.nativeElement, this.elementClass);
      }
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
