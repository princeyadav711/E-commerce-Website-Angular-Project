import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {
  contactForm!: FormGroup;
  submitted = false;
  successMessage: string | null = null;
  errorMessage = '';

  constructor(private formBuilder: FormBuilder, private http: HttpClient) {}

  ngOnInit(): void {
    this.contactForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      mobileNumber: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      message: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.contactForm.invalid) {
      this.errorMessage = 'Please fill all fields correctly.';
      this.successMessage = null;
      return;
    }

    const formData = {
      name: this.contactForm.value.name,
      email: this.contactForm.value.email,
      mobileNumber: this.contactForm.value.mobileNumber,
      lastName: this.contactForm.value.lastName,
      message: this.contactForm.value.message
    };

    // Post form data to Formspree
    this.http.post('https://formspree.io/f/mwpkkrjj', formData).subscribe(
      (response) => {
        this.successMessage = 'Form submitted successfully!!';
        this.errorMessage = '';
        this.contactForm.reset();
        this.submitted = false;
      },
      (error) => {
        this.errorMessage = 'There was an error submitting the form. Please try again.';
        this.successMessage = null;
      }
    );
  }
}
