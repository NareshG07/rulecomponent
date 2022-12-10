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

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.queryGenerateForm = this.formBuilder.group({
      queries: this.formBuilder.array([this.createQueryFormGroup()])
    });
  }

  private createQueryFormGroup(): FormGroup {
    return new FormGroup({
      Checkbox : new FormControl(),
      EPcode   : new FormControl(),
      opeartor : new FormControl(),
      parameter : new FormControl(),
      logicalOperator : new FormControl(),
    })
  }

  public addQueryFormGroup() {
    const queries = this.queryGenerateForm.get('queries') as FormArray
    queries.push(this.createQueryFormGroup());
    console.log(queries);
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

  // public queryGenerateForm = new FormGroup(
  //   {
  //     Checkbox : new FormControl(),
  //     EPcode   : new FormControl(),
  //     opeartor : new FormControl(),
  //     parameter : new FormControl(),
  //     logicalOperator : new FormControl(),
  //     })

  public queryDisplayForm = new FormGroup(
    {
      query: new FormControl('', [
        Validators.required
      ])}
  )
  private completeQuery:string = '';
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
    //   if (this.queryGenerateForm.controls['EPcode'].value &&
    //     this.queryGenerateForm.controls['opeartor'].value &&
    //     this.queryGenerateForm.controls['parameter'].value) {
    //   this.completeQuery = this.queryGenerateForm.controls['EPcode'].value +
    //     this.queryGenerateForm.controls['opeartor'].value +
    //     this.queryGenerateForm.controls['parameter'].value;
    // }
    //   this.queryDisplayForm.controls['query'].setValue(this.completeQuery) ;

  }

  public addOpeningBracket(){
    this.completeQuery +='(';
    this.updateQuery();
  }

  // ngOnChanges(changes: SimpleChanges): void {
  //   this.updateQuery();
  // }
}
