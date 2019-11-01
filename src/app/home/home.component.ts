import { AppService } from 'src/app/app.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.sass']
})
export class HomeComponent implements OnInit {

  get touchUI(): boolean {
    return this.appService.touchUI;
  }

  get mobileView(): boolean {
    return this.appService.mobileView;
  }

  constructor(
    private appService: AppService
  ) { }

  ngOnInit() {
  }

}
