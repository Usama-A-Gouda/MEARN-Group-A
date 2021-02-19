import { Component } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import emailjs, { EmailJSResponseStatus } from 'emailjs-com';

@Component({
  selector: 'contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.scss'],
})
export class ContactUsComponent {
  contactForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.createForm();
  }

  createForm() {
    this.contactForm = this.fb.group({
      Username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      massage: ['', Validators.required],
    });
  }

  showMsg: boolean = false;

  public sendEmail(e: Event) {
    e.preventDefault();
    emailjs
      .sendForm(
        'service_h2o6b14',
        'template_wnssfcj',
        e.target as HTMLFormElement,
        'user_8j9cXPrxdnov1nmKkn8oT'
      )
      .then(
        (result: EmailJSResponseStatus) => {
          this.showMsg = true;
          console.log(result.text);
        },
        (error) => {
          console.log(error.text);
        }
      );
  }
  isDark = false;
  ngDoCheck() {
    let theme = localStorage.getItem('Theme');
    console.log(theme);
    console.log(this.isDark);
    if (theme == 'Dark') {
      this.isDark = true;
      console.log(this.isDark);
    } else {
      this.isDark = false;
    }
  }
}
