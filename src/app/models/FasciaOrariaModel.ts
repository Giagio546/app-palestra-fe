import { PrenotazioneModel } from "./PrenotazioneModel";

export interface FasciaOrariaModel {
    fasciaOraria: string,
    prenotazioni: PrenotazioneModel[]
}