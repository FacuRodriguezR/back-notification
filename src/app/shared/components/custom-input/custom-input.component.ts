import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-custom-input',
  templateUrl: './custom-input.component.html',
  styleUrls: ['./custom-input.component.scss'],
})
export class CustomInputComponent implements OnInit {
  @Input() control!: FormControl;
  @Input() type!: string;
  @Input() label!: string;
  @Input() autocomplete!: string;
  @Input() icon!: string;
  @Input() inputmode?: string;
  @Input() maxlength?: string;
  @Input() isSelect = false;
  @Input() options: { label: string; value: any }[] = [];

  isPassword!: boolean;
  hide: boolean = true;

  constructor() {}

  ngOnInit() {
    if (this.type == 'password') this.isPassword = true;
  }

  showOrHidePassword() {
    this.hide = !this.hide;

    if (this.hide) this.type = 'password';
    else this.type = 'text';
  }
}
