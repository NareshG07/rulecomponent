import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
  ViewChildren
} from '@angular/core';
import {ModalComponent} from "@epsilon/core-ui";
import {FormBuilder, FormArray, FormControl, FormGroup, Validators} from "@angular/forms";
import {query} from "@angular/animations";
import {Papa} from "ngx-papaparse";
import {Rule} from "../_models/Rule";
import {isEmpty} from "rxjs";
import {forEach} from "angular";

@Component({
  selector: 'app-sample-model',
  templateUrl: './sample-model.component.html',
  styleUrls: ['./sample-model.component.css']
})
export class SampleModelComponent {
  @ViewChild('addEditRuleSetModal', { static: true }) private addEditRuleSetModal!: ModalComponent;
  // public rule:Rule = new Rule( "EP1 = 'Y' OR ( EP2 = 'Y' AND EP3 = 'Y' )" )
  // public rule: Rule = new Rule("( EP2693 >= '1' OR EP2699 >= '1' OR EP2708 >= '1' OR EP2711 >= '1' OR EP2717 >= '1' OR EP2723 >= '1' OR EP2732 >= '1' )");
   public rule:Rule = new Rule("( ( EP1091 <= '4000' AND EP1091 >= '3001' ) OR ( EP1087 <= '4000' AND EP1087 >= '3001' ) OR ( EP1085 <= '4000' AND EP1085 >= '3001' ) OR ( EP1083 <= '4000' AND EP1083 >= '3001' ) OR ( EP1082 <= '4000' AND EP1082 >= '3001' ) OR ( EP1089 <= '4000' AND EP1089 >= '3001' ) )");
  // private rule: Rule | undefined;

  private items = [
    'EP1091 - Offline Name',
    'EP1087- Offline Name',
    'EP1085 - Offline Name',
    'EP1089 - Offline Name',
    'EP1082 - Offline Name',
    'EP1083 - Offline Name',
    'EP7 - Offline Name',
    'EP8 - Offline Name',
    'EP9 - Offline Name',
    'EP10 - Offline Name',
    'EP11 - Offline Name',
    'EP111 - Offline Name',
    'EP22 '
  ];
  public filteredItems = this.items;


  // private rule:Rule = new Rule('')
  private index: number | undefined;
  private origin: string | undefined;
  private iceField: string | undefined;

  title: string = '';
  notificationStyle: string = '';
  notificationMessage: string = '';

  public operatorValues: string[] = ['=', '!=', '<=', '>=', 'Contains'];
  public logicalOperatorValues: string[] = ['AND', 'OR', 'NONE'];
  public finalRuleArray: string[] = [];
  public finalRule: string = '';
  public ruleDivCounter: number = 0;
  public ruleIndexArray: number[] = [];
  public indexValue: number = 0;

  public setOperatorIndexArray: number[] = [];
  public ruleCondition: string = '';
  public isFromExistingRule: boolean = false;
  public multiSearchSelectFormGroup = new FormGroup({
    selectDefault: new FormControl([]),
  });

  addEditRuleSetForm = new FormGroup({
    value: new FormControl('', [Validators.required]),
    humanReadableRule: new FormControl('', [Validators.required]),
  });

  ruleGenerateForm = new FormGroup({
    rules: new FormArray([
      this.fb.group({
        epCode: new FormControl(),
        operator: new FormControl('='),
        parameter: new FormControl(),
        logicalOperator: new FormControl({ value: '', disabled: true }),
      }),
    ]),
  });

  constructor(
    private fb: FormBuilder,
    private papa: Papa,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  get rules(): FormArray {
    return this.ruleGenerateForm.get('rules') as FormArray;
  }

  public onSearchChange(searchText: string): void {
    this.filteredItems = searchText
      ? this.items?.filter(
        (name) => name.toLowerCase().indexOf(searchText.toLowerCase()) > -1
      )
      : this.filteredItems;
    this.changeDetectorRef.detectChanges();
  }

  private createRuleFormGroup(): FormGroup {
    return this.fb.group({
      epCode: new FormControl(),
      operator: new FormControl('='),
      parameter: new FormControl(),
      logicalOperator: new FormControl({ value: '', disabled: true }),
    });
  }

  show(
  ) {

    if (this.rules.length == 0) {
      this.rules.push(this.createRuleFormGroup());
    }
    if (!this.rule) {
      this.title = 'Create Rule';
      this.ruleDivCounter = 0;
      this.addEditRuleSetForm.setValue({
        value: null,
        humanReadableRule: null,
      });

    } else {
      this.title = 'Edit Rule';
      this.addEditRuleSetForm.setValue({
        value: 5,
        humanReadableRule: this.rule.humanReadableRule,
      });
      this.isFromExistingRule = true;
      this.ruleDivCounter = 0;
      this.finalRuleArray = this.rule.humanReadableRule.split(
        /(?=E)|(?=\sOR)|(?=\sAND)|(?=\()|(?=\s\))/
      );
      this.finalRuleArray.forEach((ele, i) => {
        if (ele.includes('AND') || ele.includes('OR'))
          this.setOperatorIndexArray.push(i);
        if (ele.includes('EP')) this.ruleIndexArray.push(i);
      });
      this.displayRule();
      this.createRuleInputFields(this.finalRuleArray);
    }
    this.addEditRuleSetModal.show();
  }

  hide() {
    this.addEditRuleSetForm.reset();
    this.ruleGenerateForm.reset();
    this.rules.clear();
    this.multiSearchSelectFormGroup.reset();
    this.finalRuleArray = [];
    this.ruleIndexArray = [];
    this.setOperatorIndexArray = [];
    this.ruleDivCounter = 0;
    this.displayRule();
    this.addEditRuleSetModal.hide();
  }

  // submit() {
  //   if (this.addEditRuleSetForm.valid) {
  //     this.rule.errorMessages = [];
  //     this.rule.iceFieldValue = this.addEditRuleSetForm.get('value')?.value;
  //     this.rule.humanReadableRule =
  //       this.addEditRuleSetForm.get('humanReadableRule')?.value;
  //
  //     this.ruleEngineService.validateRule(this.rule).subscribe(
  //       (response: Rule) => {
  //         this.rule = response;
  //         if (!!this.rule.errorMessages && this.rule.errorMessages.length > 0) {
  //           const message = this.rule.errorMessages.join('. ');
  //           this.showNotification('error', message);
  //         } else {
  //           if (this.origin == 'attribute') {
  //             if (typeof this.index !== 'number') {
  //               this.updateAttributeValue.emit({ rule: this.rule });
  //             } else {
  //               this.updateAttributeValue.emit({
  //                 rule: this.rule,
  //                 index: this.index,
  //               });
  //             }
  //           }
  //           this.hide();
  //         }
  //       },
  //       () => {
  //         this.showNotification('error', 'Error while validating rule.');
  //       }
  //     );
  //   } else {
  //     this.addEditRuleSetForm.markAllAsTouched();
  //   }
  // }


  public addRuleFormGroup(i: number) {
    if (this.isFromExistingRule && i == this.ruleDivCounter) {
      this.rules.push(this.createRuleFormGroup());
      this.ruleDivCounter++;
      return;
    }
    if (i >= 0 && this.rules.value[i]?.logicalOperator == 'NONE') {
      this.finalRuleArray[this.setOperatorIndexArray[i]] = '';
      this.displayRule();
      return;
    }

    if (i == this.ruleDivCounter && this.setOperatorIndexArray[i] == null) {
      this.rules.push(this.createRuleFormGroup());
      this.ruleDivCounter++;
      this.finalRuleArray.push(
        ' ' + this.rules.value[i]?.logicalOperator + ' '
      );
      this.setOperatorIndexArray.push(this.finalRuleArray.length - 1);
    } else if (
      i == this.ruleDivCounter &&
      (this.rules.value[i]?.logicalOperator == 'AND' ||
        this.rules.value[i]?.logicalOperator == 'OR')
    ) {
      this.rules.push(this.createRuleFormGroup());
      this.ruleDivCounter++;
      this.finalRuleArray[this.setOperatorIndexArray[i]] =
        ' ' + this.rules.value[i]?.logicalOperator + ' ';
    }
    else if (this.rules.value[i]?.logicalOperator) {
      this.finalRuleArray[this.setOperatorIndexArray[i]] =
        ' ' + this.rules.value[i]?.logicalOperator + ' ';
    }
    this.displayRule();
  }

  public createRuleInputFields(ruleArray: String[]) {
    console.log(ruleArray)
    let ruleConditions = ruleArray.filter((ele) => ele.includes('EP'));
    ruleConditions.forEach((ele, i) => {
      if (i >= 1) this.addRuleFormGroup(i - 1);
    });
    let splitRuleConditions = ruleConditions.map((ele) => {
      return ele
        .trim()
        .split(' ')
        .filter((x) => !x.match(/[\(\)]/));
    });
    console.log(splitRuleConditions);
    for (let i = 0; i < this.rules.length; i++) {
      let epCodeInput = this.items?.filter(e => e.split('-')[0].trim() == splitRuleConditions[i][0]).toString();
      console.log(epCodeInput);
      this.rules.at(i).get('epCode')?.setValue(epCodeInput);
      this.rules.at(i).get('operator')?.setValue(splitRuleConditions[i][1]);
      this.rules
        .at(i)
        .get('parameter')
        ?.setValue(splitRuleConditions[i][2].slice(1, -1));
      this.rules.at(i).get('logicalOperator')?.enable();
      if (this.setOperatorIndexArray[i])
        this.rules
          .at(i)
          .get('logicalOperator')
          ?.setValue(this.finalRuleArray[this.setOperatorIndexArray[i]].trim());
      if (i == this.rules.length - 1) this.isFromExistingRule = false;
    }
  }

  public updateSingleRule(index: number) {
    console.log('in show')
    console.log(this.rules.at(index).get('epCode')?.value);
    this.ruleCondition =
      this.rules.at(index).get('epCode')?.value.split('-')[0] +
      ' ' +
      this.rules.at(index).get('operator')?.value +
      ' ' +
      "'" +
      this.rules.at(index).get('parameter')?.value +
      "'";
    console.log(this.ruleCondition)
    if (index >= this.ruleIndexArray.length) {
      this.finalRuleArray.push(this.ruleCondition);
      this.ruleIndexArray.push(this.finalRuleArray.length - 1);
    } else {
      let updateIndex = this.ruleIndexArray[index];
      this.finalRuleArray[updateIndex] = this.ruleCondition;
    }
    this.rules.at(index).get('logicalOperator')?.enable();
    console.log(this.ruleIndexArray);
    this.displayRule();
  }

  public removeOrClearRule(i: number) {
    if (this.rules.length > 1) {
      this.rules.removeAt(i);
      if (this.setOperatorIndexArray[i]) {
        this.finalRuleArray.splice(this.setOperatorIndexArray[i], 1);
        this.setOperatorIndexArray.splice(i, 1);
      }
      if (this.ruleIndexArray[i]) {
        this.finalRuleArray.splice(this.ruleIndexArray[i], 1);
        this.ruleIndexArray.splice(i, 1);
      }
      this.ruleDivCounter--;
    } else {
      this.ruleGenerateForm.reset();
      this.ruleDivCounter = 0;
      this.finalRuleArray = [];
      this.ruleIndexArray = [];
      this.setOperatorIndexArray = [];
      this.rules.removeAt(1);
      this.rules.at(0).get('operator')?.setValue('=');
      this.rules.at(0).get('logicalOperator')?.disable();
    }
    this.displayRule();
  }

  public clickonEPcode(i: number) {
    document
      .getElementById('EpcodeDropdown')
      ?.getElementsByTagName('button')[0]
      ?.dispatchEvent(new MouseEvent('mousedown', { shiftKey: true }));
    this.indexValue = i;
    console.log(this.rules.at(i).value.epCode);
    this.multiSearchSelectFormGroup.get('selectDefault')?.setValue(
      this.rules.at(i).value.epCode
    );
  }

  public EPcodeUpdate(value: string) {
    if (typeof value == 'string') {
      // let tempStr = value.split('-');
      this.rules.at(this.indexValue).get('epCode')?.setValue(value);
    }
  }

  public displayRule() {
    console.log('in displayRule');
    console.log(this.finalRuleArray);
    this.finalRule = this.finalRuleArray.join('');
    this.addEditRuleSetForm.controls['humanReadableRule'].setValue(
      this.finalRule
    );
  }

  public addOpenParenthesis() {
    this.finalRuleArray.push('( ');
    this.displayRule();
  }
  public addClosedParenthesis() {
    this.finalRuleArray.push(' )');
    this.displayRule();
  }

  public deleteParenthesis() {
    if (
      this.finalRuleArray[this.finalRuleArray.length - 1] == '( ' ||
      this.finalRuleArray[this.finalRuleArray.length - 1].includes(')')
    )
      this.finalRuleArray.pop();
    this.displayRule();
  }
}
