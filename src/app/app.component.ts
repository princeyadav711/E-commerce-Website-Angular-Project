import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  isSeller: boolean = false;

  ngOnInit() {
    const seller = localStorage.getItem('seller');
    this.isSeller = seller !== null; // True if the seller is logged in
  }
}