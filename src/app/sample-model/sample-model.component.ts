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
  @ViewChild('basicModal', { static: true }) private addEditRuleSetModal!: ModalComponent;
  @ViewChild('selectEPcode',{ read: ElementRef }) divClick!: ElementRef<HTMLElement>;
  title:String='Create Rule';
  public queryGenerateForm!: FormGroup;
  public rules:any;
  public operatorValues:string[] = ['=','!=','<=','>=','Contains'];
  public logicalOperatorValues:string[]=['AND','OR','NONE'];
  public finalRuleArray: string[]=[];
  public finalRule:string='';
  public ruleDivCounter:number=0;
  public ruleIndexArray:number[]=[];
  public indexValue:number=0;
  // public rule: Rule | undefined;
  public setOperatorIndexArray:number[]=[];
  public ruleCondition:string = '';
  public setOperatorCondition:boolean = false;
  public isFromExistingRule : boolean =false;
  public rule: Rule = new Rule("( ( EP1091 <= '4000' AND EP1091 >= '3001' ) OR ( EP1087 <= '4000' AND EP1087 >= '3001' ) OR ( EP1085 <= '4000' AND EP1085 >= '3001' ) OR ( EP1083 <= '4000' AND EP1083 >= '3001' ) OR ( EP1082 <= '4000' AND EP1082 >= '3001' ) OR ( EP1089 <= '4000' AND EP1089 >= '3001' ) )");

  constructor(private formBuilder: FormBuilder , private papa: Papa,
              private changeDetectorRef: ChangeDetectorRef) { }


  ngOnInit() {
    this.queryGenerateForm = this.formBuilder.group({
      queries: this.formBuilder.array([this.createQueryFormGroup()])
    });
    this.rules = this.queryGenerateForm.get('queries') as FormArray;
  }

  private createQueryFormGroup(): FormGroup {
    return new FormGroup({
      Checkbox : new FormControl(),
      EPcode   : new FormControl(),
      operator : new FormControl('='),
      parameter : new FormControl(),
      logicalOperator : new FormControl({value:null,disabled:true}),
      // removeQuery : new FormControl()
    })
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
        this.displayQuery();
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
    this.displayQuery();
  }

  get queryArray(): FormArray {
    return <FormArray> this.queryGenerateForm.get('queries');
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

  private items = [
    'EP1',
    'EP2',
    'EP3',
    'EP4',
    'EP5',
    'EP6',
    'EP7',
    'EP8',
    'EP9',
    'EP10',
    'EP11',
    'EP111',
    'EP22'
  ];
  public filteredItems = this.items;

  public onSearchChange(searchText: string): void {
    this.filteredItems = searchText
      ? this.items.filter(
        (name) => name.toLowerCase().indexOf(searchText.toLowerCase()) > -1
      )
      : this.filteredItems;
    this.changeDetectorRef.detectChanges();
  }


  public closeBasicModal() {
    this.addEditRuleSetForm.reset();
    while(this.ruleDivCounter>=0) {
      this.removeOrClearQuery(this.ruleDivCounter);
      this.ruleDivCounter--;
    }
    this.queryGenerateForm.reset();
    this.multiSearchSelectFormGroup.reset();
    this.finalRuleArray=[];
    this.ruleIndexArray=[];
    this.setOperatorIndexArray=[];
    this.rules.at(0).get('operator').setValue('=');
    this.displayQuery();
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
      this.displayQuery();
      this.createRuleInputFields(this.finalRuleArray)

      this.addEditRuleSetModal.show().then(() => {
        console.log('shown called from consumer');
      });
    }
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
    this.ruleCondition= this.rules.value[index].EPcode+' '+ this.rules.value[index].operator+' '+'\''+ this.rules.value[index].parameter+'\'';
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
    this.displayQuery();
  }

  public removeOrClearQuery(i: number) {
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
      this.queryGenerateForm.reset();
      this.ruleDivCounter=0;
      this.finalRuleArray=[];
      this.ruleIndexArray=[];
      this.setOperatorIndexArray=[];
      this.rules.removeAt(1);
      this.rules.at(0).get('operator').setValue('=');
    }
    this.displayQuery();

  }

  public addOpenBracket(){
    this.finalRuleArray.push('( ');
    this.displayQuery();
  }
  public addCloseBracket(){
    this.finalRuleArray.push(' )');
    this.displayQuery();
  }

  public displayQuery(){
    this.finalRule = this.finalRuleArray.join('');
  }

  public deleteBracket(){
    if(this.finalRuleArray[this.finalRuleArray.length-1]=='( ' || this.finalRuleArray[this.finalRuleArray.length-1].includes(')') )
    this.finalRuleArray.pop();
    this.displayQuery();
  }

  public EPcodeUpdate(value:string){
    this.rules.at(this.indexValue).get('EPcode').setValue(value);
  }

  public clickonEPcode(i:number){
      document.getElementById('EpcodeDropdown')
        ?.getElementsByTagName("button")[0]
        ?.dispatchEvent(new MouseEvent('mousedown', {shiftKey: true}));
      this.indexValue=i;
      this.multiSearchSelectFormGroup.get('selectDefault')?.setValue(this.rules.at(this.indexValue).get('EPcode').value);
  }

}
