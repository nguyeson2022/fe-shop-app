import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{
  title = 'shoppapp-perfume';
  
  constructor(private route: ActivatedRoute , private router: Router) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params: Params) => {
      if (params['vnp_ResponseCode'] === '00') {
        alert('Thanh toán thành công!');
        this.router.navigate(['/']);
      }
    });
  }
}
