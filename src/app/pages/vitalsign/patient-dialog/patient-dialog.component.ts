import { Component, Inject, OnInit } from '@angular/core';
import { MaterialModule } from '../../../material/material.module';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Patient } from '../../../model/patient';
import { PatientService } from '../../../services/patient.service';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-patient-dialog',
  standalone: true,
  imports: [MaterialModule, FormsModule],
  templateUrl: './patient-dialog.component.html',
  styleUrl: './patient-dialog.component.css'
})
export class PatientDialogComponent implements OnInit {

  patient: Patient;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: Patient,
    private _dialogRef: MatDialogRef<PatientDialogComponent>,
    private patientService: PatientService
  ) { }
  ngOnInit(): void {
    this.patient = { ...this.data };
  }

  save() {
    //INSERT
    this.patientService.save(this.patient)
      .pipe(switchMap(() => this.patientService.findAll()))
      .subscribe(data => {
        this.patientService.setPatientChange(data);
        this.patientService.setMessageChange('CREATED!')
      })

    this.close();
  }

  close() {
    this._dialogRef.close();
  }
}
