import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.css']
})
export class PieChartComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  public pieChartLabels1:string[] = ['Developers', 'Scrum Master', 'Assurance'];
  public pieChartData1:number[] = [28, 4, 9 ];

  public pieChartLabels2:string[] = ['Project Completed', 'Project In-progress'];
  public pieChartData2:number[] = [17, 6];

  // public pieChartLabels3:string[] = ['Developers Allowed', 'Developers Present'];
  // public pieChartData3:number[] = [50, 50 ];
  
  public pieChartType:string = 'pie';
 
  // events
  public chartClicked(e:any):void {
    // console.log(e);
  }
 
  public chartHovered(e:any):void {
    // console.log(e);
  }
}
