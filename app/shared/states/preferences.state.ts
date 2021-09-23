import { State } from './state';
import { Injectable } from '@angular/core';
import { PreferenceModel } from '../models/preference.model';

@Injectable({ providedIn: 'root' })
export class PreferencesState extends State<PreferenceModel[]> {}
