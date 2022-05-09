import { AbstractControl, ValidationErrors } from "@angular/forms";
import { NgbDateStruct } from "@ng-bootstrap/ng-bootstrap";
import { NgbDateStructAdapter } from "@ng-bootstrap/ng-bootstrap/datepicker/adapters/ngb-date-adapter";

export class Validator {
    
    static cannotContainWhitespaceOnly(control: AbstractControl) : ValidationErrors | null {
        var string = (control.value as string);
        if(string === null || string.match(/^ *$/) !== null){
            return {cannotContainWhitespaceOnly: true}
        }
        return null;
    }

    static isUncategorized(control: AbstractControl) : ValidationErrors | null {
        if (control.value === null || control.value === undefined || control.value === "Select category" || control.value.match(/^ *$/) !== null) return {isUncategorized: true}
        return null;
    }

    static invalidDate(control: AbstractControl) : ValidationErrors | null {

        if (control.value === null || control.value === undefined){
            return {invalidDate: true}
        } else if (Validator.isIntegerValue(control.value)){
            return {invalidDate: true}
        } else if (typeof control.value === 'string' ){
            if (Object.is(NaN, Date.parse(control.value))) return {invalidDate: true}
        } else if (Validator.isDatePickerSelected(control.value)) {
            return null;
        }
        return null;
    }


    static isIntegerValue(value : any) : boolean{

        return /^\+?\d+$/.test(value);
    }

    static isEmptySpaceOrWhiteSpace(value : any) : boolean{

        if (value === null || value === undefined) return true;
        if (value.match(/^ *$/) !== null) return true;

        return false;
    }

    private static isDatePickerSelected(datePicker: NgbDateStruct): datePicker is NgbDateStruct { 
        return (<NgbDateStruct>datePicker).year !== undefined && 
               (<NgbDateStruct>datePicker).month !== undefined && 
               (<NgbDateStruct>datePicker).day !== undefined;
    }
}