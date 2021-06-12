import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.css']
})
export class PieChartComponent implements OnInit {
  @Input() pieChartData;

  public pieChartLabels1:string[] = [];
  public pieChartData1:number[] = [];

  public pieChartLabels2:string[] = [];
  public pieChartData2:number[] = [];

  // public pieChartLabels3:string[] = ['Developers Allowed', 'Developers Present'];
  // public pieChartData3:number[] = [50, 50 ];

  public pieChartType:string = 'pie';
  showNodata1 = false;
  showNodata2 = false;
  constructor() { }


  ngOnInit(): void {
    // console.log('From pie:',this.pieChartData);

    if(this.pieChartData['userCount'].length == 0) {
      this.showNodata1 = true;
    }

    if(this.pieChartData['techDataCount'].length == 0) {
      this.showNodata2 = true;
    }

    for(let item of this.pieChartData.userCount) {
      this.pieChartLabels1.push(item['_id']);
      this.pieChartData1.push(item['count']);
    }
    for(let item of this.pieChartData.techDataCount) {
      this.pieChartLabels2.push(item['_id']);
      this.pieChartData2.push(item['count']);
    }

  }



  // events
  public chartClicked(e:any):void {
    // console.log(e);
  }

  public chartHovered(e:any):void {
    // console.log(e);
  }
}
