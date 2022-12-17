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

@Component({
  selector: 'app-sample-model',
  templateUrl: './sample-model.component.html',
  styleUrls: ['./sample-model.component.css']
})
export class SampleModelComponent implements OnInit{
  @ViewChild('basicModal', { static: true }) private basicModal!: ModalComponent;
  @ViewChild('selectEPcode',{ read: ElementRef }) divClick!: ElementRef<HTMLElement>;
  title:String='Create Rule';
  public queryGenerateForm!: FormGroup;
  public queries:any;
  public operatorValues:string[] = ['=','!=','<=','>=','Contains'];
  public logicalOperatorValues:string[]=['AND','OR','NONE'];
  public finalQueryArray: string[]=[];
  public finalQuery:string='';
  public queryDivCounter:number=0;
  public queryIndexArray:number[]=[];
  public indexValue:number=0;
  public tempEP='';


  constructor(private formBuilder: FormBuilder , private papa: Papa,
              private changeDetectorRef: ChangeDetectorRef) { }

  ngOnInit() {
    this.queryGenerateForm = this.formBuilder.group({
      queries: this.formBuilder.array([this.createQueryFormGroup()])
    });
    this.queries = this.queryGenerateForm.get('queries') as FormArray;
  }

  private createQueryFormGroup(): FormGroup {
    return new FormGroup({
      Checkbox : new FormControl(),
      EPcode   : new FormControl(),
      operator : new FormControl(this.operatorValues[0]),
      parameter : new FormControl(),
      logicalOperator : new FormControl(),
      // removeQuery : new FormControl()
    })
  }

  public addQueryFormGroup(i:number) {
    if(this.queries.value[i].logicalOperator=='NONE') return;
    if(i==this.queryDivCounter){
      this.queries.push(this.createQueryFormGroup());
      this.queryDivCounter++;
    }

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
  public singleQuery:string = '';
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
    this.basicModal.hide().then(() => {
      console.log('hidden called from consumer');
    });
  }

  public launchBasicModal() {
    this.basicModal.show().then(() => {
      console.log('shown called from consumer');
    });
  }

  public modalShown() {
    console.log('shown');
  }

  public modalHidden() {
    console.log('hidden');
  }


  public updateSingleQuery(index:number){
    console.log('In updateSingleQuery');
    let updateIndex=index;
    this.singleQuery= this.queries.value[index].EPcode+ this.queries.value[index].operator+'\''+ this.queries.value[index].parameter+'\'';
    this.singleQuery+=(this.queries.value[index].logicalOperator && this.queries.value[index].logicalOperator!='NONE')?' '+this.queries.value[index].logicalOperator+' ':'';
    if(index>=this.queryIndexArray.length)
    {
      this.finalQueryArray.push(this.singleQuery);
      this.queryIndexArray.push(this.finalQueryArray.length-1);
    }
    else{
      updateIndex=this.queryIndexArray[index];
      this.finalQueryArray[updateIndex]=this.singleQuery;
    }
    // this.queries.value[index].removeQuery.disable(true);
    this.displayQuery();
    this.singleQuery='';
  }

  public removeOrClearQuery(i: number) {
    if (this.queries.length > 1) {
      this.queries.removeAt(i)
      this.finalQueryArray[this.queryIndexArray[i]]='';
      this.queryDivCounter--;
    } else {
      this.queryGenerateForm.reset();
      this.queryDivCounter=0;
      this.finalQueryArray=[];
      this.queries.removeAt(1);
    }
    this.displayQuery();

  }

  public addOpenBracket(){
    this.finalQueryArray.push('( ');
    this.displayQuery();
  }
  public addCloseBracket(){
    this.finalQueryArray.push(' )');
    this.displayQuery();
  }

  public displayQuery(){
    this.finalQuery = this.finalQueryArray.join('');
  }

  public deleteBracket(){
    if(this.finalQueryArray[this.finalQueryArray.length-1]=='( ' || this.finalQueryArray[this.finalQueryArray.length-1]==' )' )
    this.finalQueryArray.pop();
    this.displayQuery();
  }

  public EPcodeUpdate(value:string){
    this.tempEP=value;
    this.queries.at(this.indexValue).get('EPcode').setValue(value)
  }

  public clickonSearch(i:number){
      document.getElementById('EpcodeDropdown')
        ?.getElementsByTagName("button")[0]
        ?.dispatchEvent(new MouseEvent('mousedown', {shiftKey: true}));
      this.indexValue=i;
      console.log('clicked on Search')
  }

}
