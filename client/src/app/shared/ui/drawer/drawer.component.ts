import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  inject,
} from '@angular/core';

@Component({
  selector: 'app-drawer',
  standalone: true,
  templateUrl: 'drawer.component.html',
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DrawerComponent {
  @Input() title!: string;
  drawerDisplayedDelay = 400;

  showDrawer = false;
  private cdr = inject(ChangeDetectorRef);

  closeDrawer(): void {
    this.showDrawer = false;

    this.cdr.markForCheck();
  }

  openDrawer(): void {
    this.showDrawer = true;

    this.cdr.markForCheck();
  }
}
