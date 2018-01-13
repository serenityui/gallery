/// <reference path="../../../../../src/ts/serenityui.d.ts"/>

import * as Shared from "../profile/profile.models";

interface ExcerciseTypeParams {
  id: number;
  type: string;
  title: string;
}

class ExcerciseType extends serenity.Model implements ExcerciseTypeParams {
  id: number;
  type: string;
  title: string;

  constructor(params?: ExcerciseTypeParams) {
    super(params);

    this.id = params.id;
    this.type = params.type;
    this.title = params.title;
  }
}

interface ExcerciseParams {
  id: number;
  date: string;
  type: string;
  title: string;
  minutes: number;
  calories: number;
  profile: Shared.Profile;
}

class Excercise extends serenity.Model implements ExcerciseParams {
  id: number;
  date: string;
  type: string;
  title: string;
  minutes: number;
  calories: number;
  profile: Shared.Profile;

  constructor(params?: ExcerciseParams) {
    super(params);

    this.id = params.id;
    this.date = params.date;
    this.type = params.type;
    this.title = params.title;
    this.minutes = params.minutes;
    this.calories = params.calories;
    this.profile = params.profile;
    
    if (typeof this.minutes === "undefined") {
      this.minutes = 0;
    }
  }

  validate(): Array<string> {
      /// <summary>Validate the information for the excercise.</summary>
      /// <return type="Array[string]">Array of errors.  Empty array if no errors.</return>

      var errors = [];

      if (this.minutes === null) {
          errors.push("Minutes is required.");
      }

      return errors;
  }
}

interface CardioParams extends ExcerciseParams {
  distance: number;
  measurement: string;
}

class Cardio extends Excercise implements CardioParams {

  distance: number;
  measurement: string;

  constructor(params?: SwimmingParams) {
      super(params);

      this.distance = params.distance;
      this.measurement = params.measurement;
  }
}

class Treadmill extends Cardio {

}

type SwimmingStroke = "Freestyle, Leisurely"|"Freestyle, Moderate"|"Freestyle, Fast"|"Backstroke"|"Breaststroke"|"Butterfly";

interface SwimmingParams extends CardioParams {
  stroke: SwimmingStroke;
  distance: number;
  measurement: string;
}

class Swimming extends Cardio implements CardioParams {

  stroke: SwimmingStroke;
  distance: number;
  measurement: string;

  constructor(params?: SwimmingParams) {
    super(params);

    this.stroke = params.stroke;
    this.distance = params.distance;
    this.measurement = params.measurement;

    if (this.calories === 0) {
      this._recalculateCalories();
    }
    
    if (typeof this.stroke === "undefined") {
      this.stroke = "Freestyle, Leisurely";
    }

    // When there is a change to a property, then recalculate calories.
    this.bind("change", () => {
      this._recalculateCalories();
    });
  }

  private _recalculateCalories(): void {
    /// <summary>Recalculate calories based on stroke, time and weight.</summary>
    /// <reference>http://www.flaswim.com/calories-burned-swimming-calculator/</reference>

    if (typeof this.stroke !== "undefined") {
      let pace = 0;
      switch (this.stroke) {
        case "Freestyle, Leisurely":
          pace = 6;
          break;
        case "Freestyle, Moderate":
          pace = 7;
          break;
        case "Freestyle, Fast":
          pace = 10;
          break;
        case "Backstroke":
          pace = 7;
          break;
        case "Breaststroke":
          pace = 10;
          break;
        case "Butterfly":
          pace = 11;
          break;
      }

      let weight = this.profile.weight;
      if (this.profile.measurement === "pounds") {
        weight = weight * .45359237;
      }

      let minutes: number = this.minutes;
      let calories = Math.round((weight * pace) * moment.duration(minutes, "minutes").asHours());

      this.set("calories", calories);
    }
  }

  validate(): Array<string> {
      /// <summary>Validate the information for the swimming excercise.</summary>
      /// <return type="Array[string]">Array of errors.  Empty array if no errors.</return>

      var errors = super.validate();

      if (this.distance === null) {
          errors.push("Distance is required.");
      }

      return errors;
  }
}

interface EntryParams {
  id: number;
  date: string;
}

class Entry extends serenity.Model {
  id: number;
  date: string;

  _excercises: Array<Excercise>;

  profile: Shared.Profile = null;

  constructor(params?: EntryParams) {
    super(params);

    this.id = params.id;
    this.date = params.date;

    this._excercises = new Array<Excercise>();
  }

  set excercises(list: Array<Excercise>) {
    
    this._excercises = list;
    
    this.profile.selectedExcerciseTypes.forEach(excerciseType => {
      if (typeof Excercises[excerciseType.type] !== "undefined") {
        if (Enumerable.From(list).Where(item => item.type === excerciseType.type).Count() === 0) {
          this._excercises.push(new Excercises[excerciseType.type]({
            id: serenity.guid(),
            type: excerciseType.type,
            title: excerciseType.title,
            profile: this.profile,
            calories: 0,
            minutes: 0
          }));
        }
      }
    });
  }
  
  get excercises(): Array<Excercise> {

    return this._excercises;
  }
  
  getExcercise(id: string): Excercise {
    
    var excercise = Enumerable.From(this.excercises)
      .Where(e => e.id === id)
      .FirstOrDefault();
    
    return excercise;
  }
}

var Excercises = {
  Treadmill: Treadmill,
  Swimming: Swimming
};


export {Entry, ExcerciseType, Excercise, Cardio, Treadmill, Swimming}
