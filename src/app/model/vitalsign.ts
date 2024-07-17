import { Patient } from "./patient";

export class VitalSign{
    idSigns: number;
    patient: Patient;
    registrationDate: string;
    temperature: string;
    pulse: string;
    respiratoryRate: string;
}