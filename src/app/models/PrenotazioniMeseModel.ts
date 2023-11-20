import { FasciaOrariaModel } from "./FasciaOrariaModel";

export interface PrenotazioniMeseModel {
    giorno: Date;
    fasceOrarie: FasciaOrariaModel[]
}