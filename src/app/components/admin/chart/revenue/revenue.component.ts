import { Component } from '@angular/core';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-revenue',
  standalone: true,
  imports: [],
  templateUrl: './revenue.component.html',
  styleUrl: './revenue.component.css'
})
export class RevenueComponent {
  public chart: any;

  ngOnInit(): void {
    this.createChart();
  }





  // createChart() {
  //   this.chart = new Chart("RevenueChart", {
  //     type: 'bar', // biểu đồ cột
  //     data: {
  //       labels: ['2022-05-10', '2022-05-11', '2022-05-12', '2022-05-13',
  //         '2022-05-14', '2022-05-15', '2022-05-16', '2022-05-17'],
  //       datasets: [
  //         {
  //           label: "Doanh thu",
  //           data: [467, 576, 572, 79, 92, 574, 573, 576],
  //           backgroundColor: 'blue'
  //         }
  //       ]
  //     },
  //     options: {
  //       aspectRatio: 2.5,
  //       plugins: {
  //         legend: {
  //           display: true, // hiển thị chú thích "Doanh thu"
  //         }
  //       },
  //       scales: {
  //         y: {
  //           beginAtZero: true, // trục Y bắt đầu từ 0
  //           title: {
  //             display: true,
  //             text: 'Số tiền (VNĐ)'
  //           }
  //         },
  //         x: {
  //           title: {
  //             display: true,
  //             text: 'Ngày'
  //           }
  //         }
  //       }
  //     }
  //   });
  // }


  createChart() {
  this.chart = new Chart("RevenueChart", {
    type: 'line',
    data: {
      labels: ['2022-05-10','2022-05-11','2022-05-12','2022-05-13',
               '2022-05-14','2022-05-15','2022-05-16','2022-05-17'],
      datasets: [{
        label: "Doanh thu",
        data: [467, 576, 572, 79, 92, 574, 573, 576],
        borderColor: 'blue',
        backgroundColor: 'rgba(0,0,255,0.2)',
        tension: 0.3, // độ cong của đường
        fill: true    // tô màu dưới đường
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: true } }
    }
  });
}



//Biểu đồ tròn dùng cho doanh thu theo sản phẩm
// createChart() {
//   this.chart = new Chart("RevenueChart", {
//     type: 'doughnut',
//     data: {
//       labels: ['Sản phẩm A','Sản phẩm B','Sản phẩm C'],
//       datasets: [{
//         data: [300, 450, 120],
//         backgroundColor: ['blue','limegreen','orange']
//       }]
//     },
//     options: {
//       responsive: true,
//       plugins: { legend: { position: 'bottom' } }
//     }
//   });
// }


// createChart() {
//   this.chart = new Chart("RevenueChart", {
//     data: {
//       labels: ['2022-05-10','2022-05-11','2022-05-12','2022-05-13',
//                '2022-05-14','2022-05-15','2022-05-16','2022-05-17'],
//       datasets: [
//         {
//           type: 'bar',
//           label: 'Doanh thu',
//           data: [467, 576, 572, 79, 92, 574, 573, 576],
//           backgroundColor: 'blue'
//         },
//         {
//           type: 'line',
//           label: 'Lợi nhuận',
//           data: [200, 320, 290, 50, 30, 310, 280, 300],
//           borderColor: 'limegreen',
//           fill: false
//         }
//       ]
//     }
//   });
// }

}
