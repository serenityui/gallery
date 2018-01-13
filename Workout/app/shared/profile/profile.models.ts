/// <reference path="../../../../../src/ts/serenityui.d.ts"/>
import * as Models from "../../shared/entry/entry.models";


type WeightMeasurement = "pounds"|"kilograms";

interface ProfileParams {
  id: number;
  weight: number;
  measurement: WeightMeasurement;
  selectedExcerciseTypes: Array<Models.ExcerciseType>;
}

class Profile extends serenity.Model implements ProfileParams {
  id: number;
  weight: number;
  measurement: WeightMeasurement;
  selectedExcerciseTypes: Array<Models.ExcerciseType>;
    
  constructor(params?: ProfileParams) {
    super(params);

    this.id = params.id;
    this.weight = params.weight;
    this.measurement = params.measurement;
    
    this.selectedExcerciseTypes = params.selectedExcerciseTypes;
  }
}

export {Profile}