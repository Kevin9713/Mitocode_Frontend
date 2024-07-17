import { Injectable } from '@angular/core';
import { GenericService } from './generic.service';
import { VitalSign } from '../model/vitalsign';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class VitalsignService extends GenericService<VitalSign>{

  private vitalsignChange: Subject<VitalSign[]> = new Subject<VitalSign[]>;
  private messageChange: Subject<string> = new Subject<string>;

  constructor( protected override http: HttpClient){
    super(http, `${environment.HOST}/vitalsigns`)
  }

  //////////////////////////////////////
  setVitalSignChange(data: VitalSign[]){
    this.vitalsignChange.next(data);
  }
  getVitalSignChange(){
    return this.vitalsignChange.asObservable();
  }

  setMessageChange(data: string){
    this.messageChange.next(data);
  }
  getMessageChange(){
    return this.messageChange.asObservable();
  }
}
