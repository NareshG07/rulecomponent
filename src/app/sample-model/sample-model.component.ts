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
export class SampleModelComponent implements OnInit{
  @ViewChild('addEditRuleSetModal', { static: true }) private addEditRuleSetModal!: ModalComponent;
  title:String='Create Rule';
  public ruleGenerateForm!: FormGroup;
  public rules:any;
  public operatorValues:string[] = ['=','!=','<=','>=','Contains'];
  public logicalOperatorValues:string[]=['AND','OR','NONE'];
  public finalRuleArray: string[]=[];
  public finalRule:string='';
  public ruleDivCounter:number=0;
  public ruleIndexArray:number[]=[];
  public indexValue:number=0;

  public setOperatorIndexArray:number[]=[];
  public ruleCondition:string = '';
  public isFromExistingRule : boolean =false;
  public rule: Rule | undefined;
  // public rule: Rule = new Rule("( EP2693 >= '1' OR EP2699 >= '1' OR EP2708 >= '1' OR EP2711 >= '1' OR EP2717 >= '1' OR EP2723 >= '1' OR EP2732 >= '1' )");

  private items = [
    'EP1 - Offline Name',
    'EP2 - Offline Name',
    'EP3 - Offline Name',
    'EP4 - Offline Name',
    'EP5 - Offline Name',
    'EP6 - Offline Name',
    'EP7 - Offline Name',
    'EP8 - Offline Name',
    'EP9 - Offline Name',
    'EP10 - Offline Name',
    'EP11 - Offline Name',
    'EP111 - Online Name',
    'EP22 - Online Name'
  ];
  public filteredItems = this.items;

  constructor(private formBuilder: FormBuilder , private papa: Papa,
              private changeDetectorRef: ChangeDetectorRef) { }


  ngOnInit() {
    this.ruleGenerateForm = this.formBuilder.group({
      queries: this.formBuilder.array([this.createQueryFormGroup()])
    });
    this.rules = this.ruleGenerateForm.get('queries') as FormArray;
    console.log(this.rules)
  }


  public multiSearchSelectFormGroup = new FormGroup({
    selectDefault: new FormControl([])
  });

  addEditRuleSetForm = new FormGroup({
    value: new FormControl('', [Validators.required])
  });


  public queryDisplayForm = new FormGroup(
    {
      query: new FormControl('', [
        Validators.required
      ])}
  )

  private createQueryFormGroup(): FormGroup {
    return new FormGroup({
      EPcode   : new FormControl(),
      operator : new FormControl('='),
      parameter : new FormControl(),
      logicalOperator : new FormControl({value:null,disabled:true}),
    })
  }

  get queryArray(): FormArray {
    return <FormArray> this.ruleGenerateForm.get('queries');
  }


  public onSearchChange(searchText: string): void {
    this.filteredItems = searchText
      ? this.items.filter(
        (name) => name.toLowerCase().indexOf(searchText.toLowerCase()) > -1
      )
      : this.filteredItems;
    this.changeDetectorRef.detectChanges();
  }


  public hide() {
    this.addEditRuleSetForm.reset();
    while(this.ruleDivCounter>=0) {
      this.removeOrClearRule(this.ruleDivCounter);
      this.ruleDivCounter--;
    }
    this.ruleGenerateForm.reset();
    this.multiSearchSelectFormGroup.reset();
    this.finalRuleArray=[];
    this.ruleIndexArray=[];
    this.setOperatorIndexArray=[];
    this.rules.at(0).get('operator').setValue('=');
    this.displayRule();
    this.addEditRuleSetModal.hide().then(() => {
      console.log('hidden called from consumer');
    });
  }

  public show() {
    if(!this.rule)
    {
      this.title='Create Rule';
      this.ruleDivCounter=0;
      this.addEditRuleSetModal.show().then(() => {
        console.log('shown called from consumer');
      });
    }
    else{
      this.title='Edit Rule';
      this.isFromExistingRule=true;
      this.ruleDivCounter=0;
      this.finalRuleArray=this.rule.humanReadableRule.split(/(?=E)|(?=\sOR)|(?=\sAND)|(?=\()|(?=\s\))/);
      console.log(this.finalRuleArray);
      this.finalRuleArray.forEach((ele,i) => {
        if(ele.includes('AND') || ele.includes('OR'))
          this.setOperatorIndexArray.push(i);
        if(ele.includes('EP'))
          this.ruleIndexArray.push(i);
      })
      this.displayRule();
      this.createRuleInputFields(this.finalRuleArray)

      this.addEditRuleSetModal.show().then(() => {
        console.log('shown called from consumer');
      });
    }
    console.log(this.rules);
  }

  public addQueryFormGroup(i:number) {
    if(this.isFromExistingRule && i==this.ruleDivCounter){
      this.rules.push(this.createQueryFormGroup());
      this.ruleDivCounter++;
      return;
    }
    if (i >= 0 && this.rules.value[i].logicalOperator == 'NONE') {
      this.finalRuleArray[this.setOperatorIndexArray[i]] = "";
      // this.finalRuleArray.splice(this.setOperatorIndexArray[i],1);
      // this.setOperatorIndexArray.splice(i,1);
      this.displayRule();
      return;
    }

    if (i == this.ruleDivCounter && this.setOperatorIndexArray[i] == null) {
      this.rules.push(this.createQueryFormGroup());
      this.ruleDivCounter++;
      this.finalRuleArray.push(' ' + this.rules.value[i].logicalOperator + ' ');
      this.setOperatorIndexArray.push(this.finalRuleArray.length - 1)
    } else if(this.rules.value[i].logicalOperator) {
      this.finalRuleArray[this.setOperatorIndexArray[i]] = ' ' + this.rules.value[i].logicalOperator + ' ';
    }
    this.displayRule();
  }

  public createRuleInputFields(ruleArray:String[]){
    let reqArr = ruleArray.filter(ele => ele.includes("EP"))
    console.log(reqArr)
    reqArr.forEach((ele, i) => {
      if(i>=1) this.addQueryFormGroup(i-1)
    });
    let abc = reqArr.map(ele =>{
      return ele.trim().split(" ").filter(x => !x.match(/[\(\)]/))
    })
    console.log(abc)
    console.log(this.setOperatorIndexArray)
    console.log(this.rules)
    for(let i=0; i<this.rules.length; i++){
      console.log(abc[i][0]);
      this.rules.at(i).get('EPcode').setValue(abc[i][0])
      this.rules.at(i).get('operator').setValue(abc[i][1])
      this.rules.at(i).get('parameter').setValue(abc[i][2].slice(1,-1))
      this.rules.at(i).get('logicalOperator').enable();
      if(this.setOperatorIndexArray[i])
      this.rules.at(i).get('logicalOperator').setValue(this.finalRuleArray[this.setOperatorIndexArray[i]].trim());
      if(i==this.rules.length-1) this.isFromExistingRule = false;
    }
  }


  public modalShown() {
    console.log('shown');
  }

  public modalHidden() {
    console.log('hidden');
  }


  public updateSingleRule(index:number){
    console.log('In updateSingleQuery');
    let updateIndex=index;
    this.ruleCondition= this.rules.at(index).get('EPcode').value+' '+ this.rules.at(index).get('operator').value+' '+'\''+ this.rules.at(index).get('parameter').value+'\'';
    // this.ruleCondition= this.rules.value[index].EPcode+' '+ this.rules.value[index].operator+' '+'\''+ this.rules.value[index].parameter+'\'';
    // this.ruleConditionSetOperator=(this.queries.value[index].logicalOperator && this.queries.value[index].logicalOperator!='NONE')?' '+this.queries.value[index].logicalOperator+' ':'';
    if(index>=this.ruleIndexArray.length)
    {
      this.finalRuleArray.push(this.ruleCondition);
      // this.finalQueryArray.push(this.ruleConditionSetOperator);
      this.ruleIndexArray.push(this.finalRuleArray.length-1);
    }
    else{
      updateIndex=this.ruleIndexArray[index];
      this.finalRuleArray[updateIndex]=this.ruleCondition;
    }
    this.rules.at(index).get('logicalOperator').enable();
    this.displayRule();
  }

  public removeOrClearRule(i: number) {
    if (this.rules.length > 1) {
      this.rules.removeAt(i);
      if(this.setOperatorIndexArray[i]){
        this.finalRuleArray.splice(this.setOperatorIndexArray[i],1);
        this.setOperatorIndexArray.splice(i,1);
      }
      if(this.ruleIndexArray[i]){
        this.finalRuleArray.splice(this.ruleIndexArray[i],1);
        this.ruleIndexArray.splice(i,1);
      }
      this.ruleDivCounter--;
    } else {
      this.ruleGenerateForm.reset();
      this.ruleDivCounter=0;
      this.finalRuleArray=[];
      this.ruleIndexArray=[];
      this.setOperatorIndexArray=[];
      this.rules.removeAt(1);
      this.rules.at(0).get('operator').setValue('=');
    }
    this.displayRule();
  }

  public EPcodeUpdate(value:string){
    if(typeof value=='string'){
      let tempStr=value.split("-");
      this.rules.at(this.indexValue).get('EPcode').setValue(tempStr[0].trim());
    }
  }

  public clickonEPcode(i:number){
    document.getElementById('EpcodeDropdown')
      ?.getElementsByTagName("button")[0]
      ?.dispatchEvent(new MouseEvent('mousedown', {shiftKey: true}));
    this.indexValue=i;
    this.multiSearchSelectFormGroup.get('selectDefault')?.setValue(this.rules.at(this.indexValue).get('EPcode').value);
  }

  public displayRule(){
    this.finalRule = this.finalRuleArray.join('');
  }

  public addOpenParenthesis(){
    this.finalRuleArray.push('( ');
    this.displayRule();
  }
  public addClosedParenthesis(){
    this.finalRuleArray.push(' )');
    this.displayRule();
  }

  public deleteParenthesis(){
    if(this.finalRuleArray[this.finalRuleArray.length-1]=='( ' || this.finalRuleArray[this.finalRuleArray.length-1].includes(')') )
    this.finalRuleArray.pop();
    this.displayRule();
  }



}
