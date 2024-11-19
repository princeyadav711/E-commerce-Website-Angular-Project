import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from '../services/product.service';
import { product } from '../data-type';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  userName: string = '';
  cartItems = 0;
  searchResult: undefined | product[];
  isMenuOpen = false; // Property to track the menu state
  menuType: string | undefined;

  constructor(
    private route: Router,
    private product: ProductService,
    private cdRef: ChangeDetectorRef // Inject ChangeDetectorRef to trigger change detection
  ) {}

  ngOnInit(): void {
    this.route.events.subscribe((val: any) => {
      if (val.url) {
        console.log('Current URL:', val.url);
        
        // Check for seller login and route
        if (localStorage.getItem('seller') && val.url.includes('seller')) {
          let sellerStore = localStorage.getItem('seller');
          let sellerData = sellerStore && JSON.parse(sellerStore)[0];
          console.log('Seller Data:', sellerData);
          this.userName = sellerData?.name || '';
          this.menuType = 'seller';
        }
        // Check for user login
        else if (localStorage.getItem('user')) {
          let userStore = localStorage.getItem('user');
          let userData = userStore && JSON.parse(userStore);
          this.userName = userData?.name || '';
          this.menuType = 'user';
          this.product.getCartList(userData.id);
        } 
        // Default to non-logged in view
        else {
          this.menuType = 'default';
        }
      }
    });
  
    // Load cart items from local storage
    let cartData = localStorage.getItem('localCart');
    if (cartData) {
      this.cartItems = JSON.parse(cartData).length;
    }
  
    // Subscribe to cart data updates
    this.product.cartData.subscribe((items) => {
      this.cartItems = items.length;
    });
  }

  // Method to toggle the hamburger menu
  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen; // Toggle the boolean value
  }

  // Function to dynamically update header based on user/seller login
  updateHeader() {
    const userStore = localStorage.getItem('user');
    console.log("User data from local storage: ", userStore); // Add this to debug
    
    if (userStore) {
      const userData = JSON.parse(userStore);
      this.userName = userData.name;
      console.log("User name set to: ", this.userName); // Add this to debug
    } else {
      this.userName = '';
      console.log("No user found, cleared userName."); // Add this to debug
    }
  
    this.cdRef.detectChanges(); // Trigger manual change detection to update the view
  }

  // Handle user logout without page reload
  userLogout() {
    localStorage.removeItem('user');
    this.userName = ''; // Clear the username immediately
    this.product.cartData.emit([]); // Reset cart data
    this.updateHeader(); // Manually update the header after logout
    this.route.navigate(['/user-auth']);
  }

  searchProduct(query: KeyboardEvent) {
    if (query) {
      const element = query.target as HTMLInputElement;
      this.product.searchProduct(element.value).subscribe((result) => {
        this.searchResult = result.length > 5 ? result.slice(0, 5) : result;
      });
    }
  }

  hideSearch() {
    this.searchResult = undefined;
  }

  redirectToDetails(id: number) {
    this.route.navigate(['/details/' + id]);
  }

  submitSearch(val: string) {
    this.route.navigate([`search/${val}`]);
  }
}

