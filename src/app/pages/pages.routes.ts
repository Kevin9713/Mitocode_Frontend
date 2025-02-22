import { Routes } from '@angular/router';
import { PatientComponent } from './patient/patient.component';
import { PatientEditComponent } from './patient/patient-edit/patient-edit.component';
import { MedicComponent } from './medic/medic.component';
import { SpecialtyComponent } from './specialty/specialty.component';
import { SpecialtyEditComponent } from './specialty/specialty-edit/specialty-edit.component';
import { ExamComponent } from './exam/exam.component';
import { ConsultWizardComponent } from './consult-wizard/consult-wizard.component';
import { SearchComponent } from './search/search.component';
import { ReportComponent } from './report/report.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { certGuard } from '../guard/cert.guard';
import { Not403Component } from './not403/not403.component';
import { Not404Component } from './not404/not404.component';
import { MyaccountComponent } from './myaccount/myaccount.component';
import { VitalsignComponent } from './vitalsign/vitalsign.component';
import { VitalsignEditComponent } from './vitalsign/vitalsign-edit/vitalsign-edit.component';

export const pagesRoutes: Routes = [
  { path: 'dashboard', component: DashboardComponent, canActivate: [certGuard] },
  {
    path: 'patient',
    component: PatientComponent,
    children: [
      { path: 'new', component: PatientEditComponent },
      { path: 'edit/:id', component: PatientEditComponent },
    ], canActivate: [certGuard]
  },
  {
    path: 'specialty',
    component: SpecialtyComponent,
    children: [
      { path: 'new', component: SpecialtyEditComponent },
      { path: 'edit/:id', component: SpecialtyEditComponent },
    ], canActivate: [certGuard]
  },
  { 
    path: 'vitalsign', 
    component: VitalsignComponent,
    children: [
        { path: 'new', component: VitalsignEditComponent},
        { path: 'edit/:id', component: VitalsignEditComponent},
    ],canActivate: [certGuard]
},
  { path: 'medic', component: MedicComponent, canActivate: [certGuard] },  
  { path: 'exam', component: ExamComponent, canActivate: [certGuard] },
  { path: 'consult-wizard', component: ConsultWizardComponent, canActivate: [certGuard] },
  { path: 'search', component: SearchComponent, canActivate: [certGuard] },
  { path: 'report', component: ReportComponent, canActivate: [certGuard] },
  { path: 'myaccount', component: MyaccountComponent}, 
  { path: 'not-403', component: Not403Component},
  { path: 'not-404', component: Not404Component}
];

