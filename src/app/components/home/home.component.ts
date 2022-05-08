import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Builder } from 'builder-pattern';
import { Court } from 'src/app/model/court';
import { CourtService } from 'src/app/services/court.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  public courtsToDisplay: Court[][] = [];
  public courts: Court[] = [];
  constructor( private _router: Router, private _activatedRoute: ActivatedRoute, private courtService : CourtService) {

   }

  ngOnInit(): void {
    this.courtService.fetchCourtInfo().subscribe(data => {
      this.courts = data;
      this.courtsToDisplay = this.chunkArray(this.courts, 3);
    });

  }

  public goToCourtOverview(courtId : Number){
    this._router.navigate(['/tennis-scheduler/overview'], { queryParams: { court: courtId } })
  }
  
  chunkArray(myArray : Court[], chunk_size: number){
    var index = 0;
    var arrayLength = myArray.length;
    var tempArray = [];
    var myChunk = [];
    
    for (index = 0; index < arrayLength; index += chunk_size) {
        myChunk = myArray.slice(index, index+chunk_size);
        tempArray.push(myChunk);
    }

    return tempArray;

  }


}
