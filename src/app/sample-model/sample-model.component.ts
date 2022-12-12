import {ChangeDetectorRef, Component, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {ModalComponent} from "@epsilon/core-ui";
import {FormBuilder, FormArray, FormControl, FormGroup, Validators} from "@angular/forms";
import {query} from "@angular/animations";

@Component({
  selector: 'app-sample-model',
  templateUrl: './sample-model.component.html',
  styleUrls: ['./sample-model.component.css']
})
export class SampleModelComponent implements OnInit{
  @ViewChild('basicModal', { static: true }) private basicModal!: ModalComponent;
  title:String='Create Rule';
  public queryGenerateForm!: FormGroup;
  public queries:any;
  public operatorValues:string[] = ['>','<','=','>=','<='];
  public logicalOperatorValues:string[]=['AND','OR','NOT'];
  public finalQueryArray: string[]=[];
  public finalQuery:string='';
  public queryCounter:number=0;
  public queryIndexArray:number[]=[];

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.queryGenerateForm = this.formBuilder.group({
      queries: this.formBuilder.array([this.createQueryFormGroup()])
    });
    this.queries = this.queryGenerateForm.get('queries') as FormArray
  }

  private createQueryFormGroup(): FormGroup {
    return new FormGroup({
      Checkbox : new FormControl(),
      EPcode   : new FormControl(),
      operator : new FormControl(this.operatorValues[0]),
      parameter : new FormControl(),
      logicalOperator : new FormControl(),
    })
  }

  public addQueryFormGroup() {
    this.queries.push(this.createQueryFormGroup());
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
    'Apples',
    'Avocados',
    'Bananas',
    'Broccoli',
    'Cabbage',
    'Carrots',
    'Dates',
    'Donuts',
    'Eggs',
    'Fish',
    'Flour',
    'Garlic',
    'Grapes',
    'Ham',
    'Honey',
    'Ice cream',
    'Jelly',
  ];
  public filteredItems = this.items;

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

  public updateQuery() {
    for(let i of this.queries.value)
    {
      console.log(i.EPcode);
      console.log(i.opeartor);
      console.log(i.parameter);
    }

  }

  public updateSingleQuery(index:number){

    let updateIndex=index;
    this.singleQuery= this.queries.value[index].EPcode+ this.queries.value[index].operator+ this.queries.value[index].parameter;
    this.singleQuery+=(this.queries.value[index].logicalOperator)?' '+this.queries.value[index].logicalOperator+' ':'';
    // if(this.finalQueryArray.some(x=>x===this.singleQuery)){
    //   updateIndex=this.finalQueryArray.indexOf(this.singleQuery);
    //   console.log('updating single query at '+ updateIndex );
    //   this.finalQueryArray[updateIndex]=this.singleQuery;
    // }

    // updateIndex=this.UpdateQueryIndex(index);
    // if(updateIndex==index){
    //   this.finalQueryArray.push(this.singleQuery);
    // }
    // else{
    //   this.finalQueryArray[updateIndex]=this.singleQuery;
    // }
    if(index>=this.queryIndexArray.length)
    {
      this.finalQueryArray.push(this.singleQuery);
      this.queryIndexArray.push(this.finalQueryArray.length-1);
    }
    else{
      updateIndex=this.queryIndexArray[index];
      this.finalQueryArray[updateIndex]=this.singleQuery;
    }
    this.displayQuery();
    this.singleQuery='';
    console.log(this.finalQueryArray);
    console.log(this.queryIndexArray);
  }

  public UpdateQueryIndex(i:number):number{
    let count=-1;
    this.finalQueryArray.forEach((value,index) =>{
      if(value.includes('(') || value.includes(')')){
        console.log('found bracket')
      }
      else{
        count++;
        console.log('found query');
      }
      if(count == i) {i=index; return; }
    });
    return i;
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
    if(this.finalQueryArray[-1]=='( ' || this.finalQueryArray[-1]==' )' )
    this.finalQueryArray.pop();
    this.displayQuery();
  }
  // ngOnChanges(changes: SimpleChanges): void {
  //   this.updateQuery();
  // }
}
