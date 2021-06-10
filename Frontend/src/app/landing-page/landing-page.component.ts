import * as $ from 'jquery';
import { AfterViewInit, Component, OnInit} from '@angular/core';



// declare var $:any;
@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent implements OnInit, AfterViewInit {


  width;
  constructor() { }

  ngOnInit(): void {
    this.width = window.innerWidth;
    console.log('width:',this.width);
    $(document).ready(function(){
      $('.header').height($(window).height());

      $(".navbar a, .navbar-brand").click(function(){
        $("body,html").animate({
          scrollTop:$("#" + $(this).data('value')).offset().top
        },1000)

      })

     })

     const items = document.querySelectorAll(".accordion a");

     function toggleAccordion(){
       this.classList.toggle('active');
       this.nextElementSibling.classList.toggle('active');
     }

     items.forEach(item => item.addEventListener('click', toggleAccordion));
  }

  ngAfterViewInit() {


  }
  onToggle() {
    document.getElementById('navbarSupportedContent').style.display = document.getElementById('navbarSupportedContent').style.display === 'block' ? 'none' : 'block';
  }

}
