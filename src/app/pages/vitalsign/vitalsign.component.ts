import { Component, OnInit, ViewChild } from '@angular/core';
import { MaterialModule } from '../../material/material.module';
import { ActivatedRoute, RouterLink, RouterOutlet } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { VitalSign } from '../../model/vitalsign';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { VitalsignService } from '../../services/vitalsign.service';
import { DatePipe } from '@angular/common';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-vitalsign',
  standalone: true,
  imports: [MaterialModule, RouterOutlet, RouterLink, DatePipe],
  templateUrl: './vitalsign.component.html',
  styleUrl: './vitalsign.component.css'
})
export class VitalsignComponent implements OnInit{

  dataSource: MatTableDataSource<VitalSign>;

  columnDefinitions = [
    { def: 'idSigns', label: 'idSigns', hide: true },
    { def: 'patient', label: 'Patient', hide: false },
    { def: 'temperature', label: 'Temperature', hide: true },
    { def: 'pulse', label: 'Pulse', hide: true },
    { def: 'respiratoryRate', label: 'Respiratory Rate', hide: true },
    { def: 'registrationDate', label: 'Registration Date', hide: false },
    { def: 'actions', label: 'Actions', hide: false },
  ]

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private vitalsignService: VitalsignService,
    private _snackBar: MatSnackBar,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.vitalsignService.findAll().subscribe(data => {
      this.createTable(data);
    });

    this.vitalsignService.getVitalSignChange().subscribe(data => {
      this.createTable(data);
    });
    this.vitalsignService.getMessageChange().subscribe(data => {
      this._snackBar.open(data, 'INFO', { duration: 2000, horizontalPosition: 'right', verticalPosition: 'top' });
    })

  }

  createTable(data: VitalSign[]) {
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  getDisplayedColumns() {
    return this.columnDefinitions.filter(cd => !cd.hide).map(cd => cd.def);
  }

  applyFilter(e: any) {
    this.dataSource.filter = e.target.value.trim();

    console.log("-> dataSource:: ",this.dataSource.filteredData);
  }

  checkChildren(){
    return this.route.children.length > 0;
  }

  delete(idVitalsign: number) {
    this.vitalsignService.delete(idVitalsign)
      .pipe(switchMap(() => this.vitalsignService.findAll()))
      .subscribe(data => {
        this.vitalsignService.setVitalSignChange(data);
        this.vitalsignService.setMessageChange('DELETED!');
      });
  }
}
