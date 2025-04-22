import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-sucursales',
  standalone: true,
  imports: [],
  templateUrl: './sucursales.component.html',
  styleUrl: './sucursales.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SucursalesComponent { }
