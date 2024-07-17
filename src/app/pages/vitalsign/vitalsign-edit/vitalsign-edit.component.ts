import { Component, OnInit } from '@angular/core';
import { MaterialModule } from '../../../material/material.module';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { VitalsignService } from '../../../services/vitalsign.service';
import { PatientService } from '../../../services/patient.service';
import { Patient } from '../../../model/patient';
import { map, Observable, switchMap } from 'rxjs';
import { VitalSign } from '../../../model/vitalsign';
import { AsyncPipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PatientDialogComponent } from '../patient-dialog/patient-dialog.component';

@Component({
  selector: 'app-vitalsign-edit',
  standalone: true,
  imports: [MaterialModule, ReactiveFormsModule, RouterLink, AsyncPipe],
  templateUrl: './vitalsign-edit.component.html',
  styleUrl: './vitalsign-edit.component.css'
})
export class VitalsignEditComponent implements OnInit{

  Etiquetform: FormGroup;
  id: number;
  isEdit: boolean;

  patients: Patient[];
  patients$: Observable<Patient[]>; 
  patientControl: FormControl = new FormControl();
  patientvalid: boolean;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private vitalsignService: VitalsignService,
    private patientService: PatientService,
    private formBuilder: FormBuilder,
    private _dialog: MatDialog,
    private _snackBar: MatSnackBar
  ){}

  ngOnInit(): void {
    this.Etiquetform = this.formBuilder.group({
      idSigns: new FormControl(0),
      patient: [this.patientControl, Validators.required],
      registrationDate: new FormControl('', Validators.required),
      temperature: new FormControl('', Validators.required),
      pulse: new FormControl('', Validators.required),
      respiratoryRate: new FormControl('', Validators.required)
    })

    this.route.params.subscribe(data => {
      this.id = data['id'];
      this.isEdit = data['id'] != null;
      this.initForm();
      this.loadInitialDataPatient();
    })

  }

  showPatient(val: any){
    return val? `${val.firstName} ${val.lastName}` : val
  }

  loadInitialDataPatient(){  
    this.patientService.findAll().subscribe(data => {this.patients = data;});
  }

  initForm() {
    if (this.isEdit) {
      this.patients$ = this.patientService.findAll();
      // Edit/:id -> precargar los datos
      this.vitalsignService.findById(this.id).subscribe(data => {
        this.Etiquetform = new FormGroup({
          idSigns: new FormControl(data.idSigns),
          patient: new FormControl(data.patient, Validators.required),
          registrationDate: new FormControl(data.registrationDate, Validators.required),
          temperature: new FormControl(data.temperature, [Validators.required]),
          pulse: new FormControl(data.pulse, Validators.required),
          respiratoryRate: new FormControl(data.respiratoryRate, Validators.required),
        });
      })
    }else{
      //New 
      this.patientService.getPatientChange().subscribe(data => {
        this.patients = data;
      });  
      this.patientService.getMessageChange().subscribe(data => {
        this._snackBar.open(data, 'INFO', { duration: 2000, horizontalPosition: 'right', verticalPosition: 'top' });
      })

      this.patientvalid = true; //Mostrar + Add Patient
      this.patients$ = this.patientControl.valueChanges.pipe(map(val => this.filterPatients(val)));
    }
  }

  InsertOrUpdate() {
    if(this.Etiquetform.invalid){return;}

    const vitalsigns: VitalSign = new VitalSign();
    vitalsigns.idSigns = this.Etiquetform.value['idSigns'];
    vitalsigns.patient = this.Etiquetform.value['patient'];
    vitalsigns.registrationDate = this.Etiquetform.value['registrationDate'];
    vitalsigns.temperature = this.Etiquetform.value['temperature'];
    vitalsigns.pulse = this.Etiquetform.value['pulse'];
    vitalsigns.respiratoryRate = this.Etiquetform.value['respiratoryRate'];

    if (this.isEdit) {
      //UPDATE

      this.vitalsignService.update(this.id, vitalsigns).subscribe(() => {
        this.vitalsignService.findAll().subscribe(data => {
          this.vitalsignService.setVitalSignChange(data);
          this.vitalsignService.setMessageChange('UPDATED!');
        })
      });
    } else {
      //INSERT
      vitalsigns.patient = this.Etiquetform.value['patient'].value; //Insert al object

      this.vitalsignService.save(vitalsigns)
        .pipe(switchMap(() => this.vitalsignService.findAll()))
        .subscribe(data => {
          this.vitalsignService.setVitalSignChange(data);
          this.vitalsignService.setMessageChange('CREATED!');
        });
    }

    this.router.navigate(['pages/vitalsign']);
  }

  filterPatients(val: any){
    if(val?.idPatient > 0 ){
      return this.patients.filter(el =>
        el.firstName.toLowerCase().includes(val.firstName.toLowerCase()) || 
        el.lastName.toLowerCase().includes(val.lastName.toLowerCase())
      )
    }else{
      return this.patients.filter(el =>
        el.firstName.toLowerCase().includes(val?.toLowerCase()) || 
        el.lastName.toLowerCase().includes(val?.toLowerCase())
      )
    }    
  }

  get f(){
    return this.Etiquetform.controls;
  }

  openDialog(){
    this._dialog.open(PatientDialogComponent, {
      width: '350px',
      disableClose: false,
    });
  }
}
