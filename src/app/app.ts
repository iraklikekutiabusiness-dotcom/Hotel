import { Component } from '@angular/core';
import { HotelDiscoveryPageComponent } from './features/hotels/pages/hotel-discovery-page.component';

@Component({
  imports: [HotelDiscoveryPageComponent],
  selector: 'app-root',
  styleUrl: './app.scss',
  template: '<app-hotel-discovery-page />',
})
export class App {}
