import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Color } from 'ng2-charts';

@Component({
  selector: 'app-visual-chart',
  templateUrl: './visual-chart.component.html',
  styleUrls: ['./visual-chart.component.css']
})
export class VisualChartComponent implements OnInit {

  @ViewChild('f') form: NgForm;
  projects = [];
  versions = [];
  sprints = [];
  show;
  public barChartOptions = {
    scaleShowVerticalLines: true,
    responsive: true,
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true,
          stepSize: 2
        }
      }]
    },
  };

  public barChartLabels = ['10/05', '12/05', '14/05', '16/05', '18/05', '20/05', '22/05', '24/05', '26/05', '28/05', '30/05', '01/06', '03/06','05/06','07/06'];
  public barChartType = 'line';
  public barChartLegend = true;

  public barChartData = [
    {
      data: [0, 0, 1, 3, 4, 4, 5, 6, 8, 9, 11, 13, 13, 16, 17],
      label: 'Completed',
    },
    {data: [20, 18, 17, 15, 14, 13, 10, 9, 8, 7 , 5, 5, 4, 2, 1], label: 'Backlogs'},
    {data: [0, 2, 5, 5, 8, 7, 6, 5, 2, 0, 4, 3, 3, 1, 2], label: 'In-Progress'}
  ];
  public lineChartColors: Color[] = [
    {
      borderColor: 'green',
    },
    {
      borderColor: 'red',
    },
    {
      borderColor: 'rgb(223, 223, 25)',
    }
  ];

  constructor() { }

  ngOnInit(): void {
    this.projects = [
      {
      title : "Project-1",
      desc: "With supporting text below as a natural lead-in to additional content."
      },
      {
        title : "Project-2",
        desc: "With supporting text below as a natural lead-in to additional content."
      },
      {
        title : "Project-3",
        desc: "With supporting text below as a natural lead-in to additional content."
      },
      {
        title : "Project-4",
        desc: "With supporting text below as a natural lead-in to additional content."
      },
      {
        title : "Project-5",
        desc: "With supporting text below as a natural lead-in to additional content."
      },
      {
        title : "Project-6",
        desc: "With supporting text below as a natural lead-in to additional content."
      },
      {
        title : "Project-7",
        desc: "With supporting text below as a natural lead-in to additional content."
      },
      {
        title : "Project-8",
        desc: "With supporting text below as a natural lead-in to additional content."
      },
  ];
  this.versions = [
    {
    title : "Version-1.0.0",
    desc: "With supporting text below as a natural lead-in to additional content."
    },
    {
      title : "Version-2.0.0",
      desc: "With supporting text below as a natural lead-in to additional content."
    },
    {
      title : "Version-3.0.0",
      desc: "With supporting text below as a natural lead-in to additional content."
    },
    {
      title : "Version-4.0.0",
      desc: "With supporting text below as a natural lead-in to additional content."
    },
    {
      title : "Version-5.0.0",
      desc: "With supporting text below as a natural lead-in to additional content."
    }];
    this.sprints = [
      {
      title : "Sprint-1",
      desc: "With supporting text below as a natural lead-in to additional content."
      },
      {
        title : "Sprint-2",
        desc: "With supporting text below as a natural lead-in to additional content."
      },
      {
        title : "Sprint-3",
        desc: "With supporting text below as a natural lead-in to additional content."
      },
      {
        title : "Sprint-4",
        desc: "With supporting text below as a natural lead-in to additional content."
      },
      {
        title : "Sprint-5",
        desc: "With supporting text below as a natural lead-in to additional content."
      }];
  }

  onViewChart() {
    if(this.form.invalid) {
      return;
    }
    this.show=false;
    console.log(this.form.value);
    setTimeout(() => {
      this.show = true;
    },2000)
  }

  onReset() {
    this.form.reset();
  }
}
