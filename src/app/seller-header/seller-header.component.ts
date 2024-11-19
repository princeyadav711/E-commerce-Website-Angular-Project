import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-seller-header',
  templateUrl: './seller-header.component.html',
  styleUrls: ['./seller-header.component.css'],
})
export class SellerHeaderComponent implements OnInit {
  sellerName: string = '';
  menuOpen = false;
  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  constructor(private route: Router, private product: ProductService) {}

  ngOnInit(): void {
    this.updateSellerHeader(); // Initialize seller header on load
  }

  // Function to update seller header
  updateSellerHeader() {
    const sellerStore = localStorage.getItem('seller');
    if (sellerStore) {
      const sellerData = JSON.parse(sellerStore)[0]; // Assuming it's an array
      this.sellerName = sellerData.name;
    }
  }

  // Handle seller logout with a page reload
  logout() {
    localStorage.removeItem('seller');
    this.route.navigate(['/']).then(() => {
      location.reload(); // Force page reload after logout
    });
  }
}
