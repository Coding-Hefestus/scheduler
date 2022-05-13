import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Court } from 'src/app/model/court';
import { Mode } from 'src/app/model/mode';
import { CourtService } from 'src/app/services/court.service';
import { PassingDataService } from 'src/app/services/passing-data.service';
import { Validator } from 'src/app/utils/validator';

@Component({
  selector: 'app-court-management',
  templateUrl: './court-management.component.html',
  styleUrls: ['./court-management.component.css']
})
export class CourtManagementComponent implements OnInit {

  public courtForm: FormGroup;
  public mode: string;
  public newCourt: Court = new Court();
  public selectedFile: File;
  public selectedCourt : Court;
  public courts: Court[] = [];
  public disableId: true;

  constructor(private passingDataService : PassingDataService, private fb: FormBuilder, private router: Router, private courtService : CourtService) { }

  ngOnInit(): void {

    this.passingDataService.currentMode.subscribe(currentMode => {
      if (Mode.REGISTER == currentMode){
        this.mode = 'register'
        this.initCreateMode();
      } else if (Mode.EDIT == currentMode){
        this.mode = 'edit'
        this.initCourts();
        
      }
    })
  }

  public onCourtSelected(selectedCourt){
    // this.selectedCourt = selectedCourt;
    // console.log(JSON.stringify( this.selectedCourt))

    //console.log(JSON.stringify(selectedCourt))

    this.courtService.fetchCourtData(selectedCourt.id).subscribe(c => {
      this.selectedCourt = c;
      this.initEditMode();
    });



    
  }

  public changeCoveredToTrue(){
      this.newCourt.covered = true;
  }

  public changeCoveredToFalse(){
    this.newCourt.covered = false;
  }

  public submitFormCreate(){

    if (!this.courtForm.get('type').value){
      alert("You must specify Court type!")
      return;
    }

    if (!this.courtForm.get('dimension').value){
      alert("You must specify Court dimensions!")
      return;
    }
    if (!this.courtForm.get('name').value){
      alert("You must specify Court name!")
      return;
    }
    if (!this.selectedFile){
      alert("You must specify Court image!")
      return;
    }

   

    this.newCourt.type = this.courtForm.get('type').value;
    this.newCourt.dimension = this.courtForm.get('dimension').value;
    this.newCourt.name = this.courtForm.get('name').value;

    var fd = new FormData();

    fd.append('file', this.selectedFile, this.selectedFile.name);
    fd.append("court", JSON.stringify(this.newCourt))

    this.courtService.createNewCourt(fd).subscribe(data => {
     
      
      
    })
  }

  public onFileSelected(event){
    if (event.target.files[0] != null && event.target.files[0] != undefined){
      this.selectedFile = event.target.files[0];
    }
  } 

  public initCourts(){
    this.courtService.fetchCourtInfo().subscribe(courts => {
      this.courts = courts;
    })
  }

  private initEditMode(){
    this.courtForm = this.fb.group({
      //add image 
      // covered:   [this.newCourt.covered, ],
      id:        [{value: this.selectedCourt.courtId, disabled: true}, [Validators.required]],
      covered:   [{'type': 1}, [Validators.required]],
      type:      [this.selectedCourt.type,     [ Validators.required]],
      dimension: [this.selectedCourt.dimension,[ Validators.required,      Validators.minLength(3), Validator.cannotContainWhitespaceOnly]],
      name:      [this.selectedCourt.name,     [ Validators.required]],
      
    });
  
  }

  private initCreateMode(){

    this.courtForm = this.fb.group({
      //add image 
      // covered:   [this.newCourt.covered, ],

      covered: [{'type': 1}, [Validators.required]],
      type:      ['',     [ Validators.required]],
      dimension: ['',     [ Validators.required,      Validators.minLength(3), Validator.cannotContainWhitespaceOnly]],
      name:      ['',     [ Validators.required]],
      
    });
  }

}
