import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  BrnSheetContentDirective,
  BrnSheetTriggerDirective,
} from '@spartan-ng/ui-sheet-brain';
import {
  HlmSheetComponent,
  HlmSheetContentComponent,
  HlmSheetDescriptionDirective,
  HlmSheetFooterComponent,
  HlmSheetHeaderComponent,
  HlmSheetTitleDirective,
} from '@spartan-ng/ui-sheet-helm';
import { TopHeaderComponent } from '../../header/top-header/top-header.component';

@Component({
  selector: 'app-hamburger-menu',
  standalone: true,
  imports: [
    TopHeaderComponent,
    CommonModule,
    BrnSheetTriggerDirective,
    BrnSheetContentDirective,
    HlmSheetComponent,
    HlmSheetContentComponent,
    HlmSheetHeaderComponent,
    HlmSheetFooterComponent,
    HlmSheetTitleDirective,
    HlmSheetDescriptionDirective,
  ],
  templateUrl: './hamburger-menu.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HamburgerMenuComponent {}
