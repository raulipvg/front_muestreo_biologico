import { Component, 
  ViewChild, 
  EventEmitter, 
  Input, 
  ChangeDetectorRef,
  OnInit,  
  inject} from '@angular/core';
import { ModalConfig, 
  ModalsModule, 
  ModalComponent 
} from 'src/app/_metronic/partials';
import { NgSelectModule } from '@ng-select/ng-select';
import { 
  FormsModule,
  FormControl,
  Validators,
  FormGroup,
  ReactiveFormsModule,
  FormBuilder
 } from '@angular/forms';
import { NgClass } from '@angular/common';


@Component({
  selector: 'modal-registrar',
  standalone: true,
  imports: [
    NgSelectModule,
    ModalsModule,
    ReactiveFormsModule,
    FormsModule,
    NgClass
  ],
  templateUrl: './modalRegister.component.html',
  styleUrl: './modalregistrar.component.scss'
})
      
export class ModalRegistrarComponent implements OnInit{
  @ViewChild('modal') private modalComponent: ModalComponent;
  @Input() abrirModal = new EventEmitter();

  constructor(private cdRef: ChangeDetectorRef, private _formBuilder : FormBuilder) {}

  //private readonly _formBuilder = inject(FormBuilder);

  
  formulario : FormGroup;

  //Forma clásica con FormGroup
  /*
  formulario = new FormGroup({
    Nombre : new FormControl(''),
    Apellido : new FormControl(''),
    Auto : new FormControl('')
  })
  */
  
  declararlo : string;

  ngOnInit(): void {
    this.formulario = this._formBuilder.group({
      Nombre : ['',
                [Validators.required,
                Validators.minLength(3),
                Validators.maxLength(15)]
              ],
      Apellido : ['', 
              [Validators.required,
              Validators.minLength(3),
              Validators.maxLength(15)]
            ],
      Auto : [2, Validators.required],
      Email : ['', [Validators.email, Validators.required]]
    });
  }

  get f(){
    return this.formulario.controls;
  }

  registerFormSubmit() {
    this.formulario.markAllAsTouched();
    console.log("clikeao")
    console.log(this.formulario.controls.Auto.value);
    if (this.formulario.valid) {
      // Enviar el formulario aquí (por ejemplo, usando un servicio o llamada a la API)
      console.log('¡Formulario enviado!');
     this.declararlo = JSON.stringify(this.formulario.getRawValue());
    }
  }


  selectedCars: number[] = [];
  flag: boolean =false;
  cars = [
    { id: 1, name: 'Volvo' },
    { id: 2, name: 'Saab' },
    { id: 3, name: 'Opel' },
    { id: 4, name: 'Audi' },
  ];

  modalConfig: ModalConfig = {
    modalTitle: 'GRAN TITULO GRAN DEL MODAL',
    dismissButtonLabel: 'Enviar',
    closeButtonLabel: 'Cerrar',
    onClose(): boolean{ return false;}
    

  };


  async AbrirModal(action?: string, id?:number){
    this.flag=true;
    console.log(action);
    switch (action) {
      case 'ver':
        this.selectedCars = [1];
        this.cdRef.detectChanges();
        break;
      case 'edit':
        this.flag=false;
       // this.modalito.AbrirModal(action, id);
        this.selectedCars = [];
        this.cdRef.detectChanges();
        break;
      case 'delete':
        //console.log('delete');
        break;
      default:
        this.selectedCars = [2];
        //console.log('create');
        break;
    }
    //this.selectedCars = [];
    this.cdRef.detectChanges();
    return await this.modalComponent.open();
  }
}
