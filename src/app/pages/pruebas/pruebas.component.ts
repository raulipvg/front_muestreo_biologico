import { AfterViewInit, Component, ElementRef, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output, Renderer2, ViewChild, viewChild} from '@angular/core';
import { DataTablesModule } from 'angular-datatables';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { languageConfig } from '../../../assets/sass/core/base/datatables/language_es';
import { UsersService } from '../../services/users/users.service';
import { HttpClientModule } from '@angular/common/http';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { ChangeDetectorRef } from '@angular/core';
import { ModalRegistrarComponent } from './modalregistrar/modalregistrar.component'



@Component({
  selector: 'app-pruebas',
  standalone: true,
  imports: [
    CommonModule,
    DataTablesModule,
    HttpClientModule, 
    NgbTooltip, 
    ModalRegistrarComponent
  ],
  templateUrl: './pruebas.component.html',
  styleUrl: './pruebas.component.scss'
})
export class PruebasComponent implements OnInit, AfterViewInit, OnDestroy  {
  //@ViewChildren(NgbTooltip) tooltips: QueryList<NgbTooltip>;

  @Input() datatableConfig: DataTables.Settings = {};
  @Input() dtOptions: any = {};
  @Input() dtTrigger: Subject<any> = new Subject<any>();
  @ViewChild('modalito') modalito: ModalRegistrarComponent;
  //@ViewChild(DataTableDirective, { static: false })
  //private datatableElement: DataTableDirective

  

  allUsers: any[] =[];
  private getUsersCompleted = new Subject<void>(); // Subject para indicar que getUsers() ha completado


  @Output() editEvent = new EventEmitter<number>();
  @Output() deleteEvent = new EventEmitter<number>();

 //@Input() recargar: EventEmitter<boolean>;

  private idInAction: number;
  private clickListener: () => void;

  flag : boolean =false;
  //@ViewChildren('tablabody') databody: QueryList<ElementRef>;
  
 //ng-select data 
  constructor(
    private userService : UsersService, 
    private renderer: Renderer2,
    private cdRef: ChangeDetectorRef,
    private el:ElementRef
  ) { }

  
        
  ngOnInit(): void {        
    this.inicializarTabla();
    this.getUsers();  
  }
  ngAfterViewInit(): void {  
    this.getUsersCompleted.subscribe(() => {
      const containerElement = document.querySelector('.tabla-body');
      if(containerElement){
        // Este código se ejecutará cuando getUsers() haya completado su ejecución
        this.clickListener = this.renderer.listen(containerElement, 'click', (event) => {
          const btn = event.target.closest('.btn');
          if (btn) {
            const { action, id } = btn.dataset;
            //this.idInAction = id;
            this.modalito.AbrirModal(action, id);          
          }
        
        });
      }
      

    });
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  //////****************** *//
  inicializarTabla(): void {
    this.dtOptions = {
      dom: `<'d-flex flex-md-row flex-column justify-content-md-between justify-content-start align-items-center'"
            <'filtro'B>"
            <''f>"
            >"
            <'table-responsive'tr>
            <'d-flex flex-md-row flex-column justify-content-md-between'
              <'d-flex align-items-center justify-content-center'li>
              <'d-flex align-items-center justify-content-center'p>
            >`,
      buttons: [
              {
                  extend: 'copy',
                  className: 'btn btn-secondary',
                  exportOptions: {
                      columns: [0, 1, 2, 3]
                  }
              },
              {
                  extend: 'excel',
                  className: 'btn btn-secondary',
                  exportOptions: {
                      columns: [0, 1, 2, 3]
                  }
              },
              {
                  extend: 'print',
                  className: 'btn btn-secondary',
                  exportOptions: {
                      columns: [0, 1, 2, 3]
                  }
              }
          ],      
      pageLength:10,
      displayLength: 25,
      //paging: true,
      // processing: true,
      language: languageConfig,
      responsive:true,
      columns:[
        { title:'Id', data: 'id' },
        { title:'Nombre', data: 'name' },
        { title:'Email', data: 'email' },
        { title: 'Phone', data: 'phone' },
        { title: 'Accion', data: 'actions'}
        //{ title: 'Actions', data: 'actions'}
      ],
      initComplete: () => {
        $('.filtro').children().addClass('btn-group btn-group-sm btn-secondary')
        $('.dataTables_filter').addClass('p-0')
      },
      headerCallback: (thead:any , data: any, start:any, end:any, display:any) => {
        $(thead).addClass('fw-bolder text-uppercase');
      },
      createdRow: (row:any, data:any, dataIndex:any) => {
        $(row).children('td').addClass('p-1');
        $(row).children('td:eq(1)').addClass('text-capitalize text-gray-800 fw-bolder');
      }
    };
  }

  getUsers():void {
    this.userService
    .getAll()
    .subscribe(
      (data: any[]) => {
              this.getUsersCompleted.next();
              this.getUsersCompleted.complete();
              this.allUsers = data;       
              this.dtTrigger.next(null);
              this.cdRef.detectChanges();
      });
  }

  // NO FUNCIONÓ, A FORZARLO MEJOR
/*
  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent) {
    const closestBtn = (event.target as HTMLElement).closest('.btn-action');
    if (closestBtn) {
      const action = closestBtn.dataset.action;
      const id = closestBtn.dataset.id;
      console.log(Clic en botón con acción: ${action} e ID: ${id});
      // Lógica adicional aquí, como abrir un modal
    }
  }
*/
 /*
  getUsersViaDatatable(): void {

    this.userService
        .getAll()
        .subscribe(
          (data: any[]) => {
            //this.allUsers = data;           
              // Agregar la fila a la tabla
              if (this.datatableElement && this.datatableElement.dtInstance) {
                this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
                  this.allUsers.forEach((user: any,index: number) => { 

                    const verButton = `<button #btncaca class="btn btn-icon btn-success w-30px h-30px btn-tooltip mx-1" data-action="ver" data-id="${user.id}" ngbTooltip="Tooltip content" placement="top">
                                          <i class="ki-duotone ki-eye fs-3"><span class="path1"></span><span class="path2"></span><span class="path3"></span></i>
                                      </button>`;
                    
                    const editButton = `<button class="btn btn-icon btn-warning w-30px h-30px mx-1" data-action="edit" data-id="${user.id}" ngbTooltip="Tooltip content" placement="top">
                                          <i class="ki-duotone ki-pencil fs-3"><span class="path1"></span><span class="path2"></span></i>
                                        </button>`;
                        
                    const deleteButton = `<button class="btn btn-icon btn-primary w-30px h-30px mx-1" data-action="delete" data-id="${user.id}">
                                            <i class="ki-duotone ki-trash fs-3">
                                              <span class="path1"></span><span class="path2"></span>
                                              <span class="path3"></span><span class="path4"></span><span class="path5"></span>
                                            </i>
                                          </button>`;

                    const buttons = verButton +editButton+deleteButton;
                    
                    user.actions = buttons;
                    //this.allUsers[index].actions =buttons;
                    dtInstance.row.add(user);
                    
                  });         
                  dtInstance.draw();                  
                  this.getUsersCompleted.next();
                  this.getUsersCompleted.complete();
                }); 
              }
            

              /*
           if (this.datatableElement && this.datatableElement.dtInstance) {
              this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
                dtInstance.clear(); // Limpiar los datos existentes en la tabla
                dtInstance.rows.add(this.allUsers); // Agregar los nuevos datos      
                dtInstance.draw(); // Dibujar la tabla                
              });
            } 
            */           
          //}
       //);
    //this.renderActionColumn();
       
        
        
  //}
  
  

}
