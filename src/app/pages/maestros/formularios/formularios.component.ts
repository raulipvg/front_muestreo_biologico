import { AfterViewInit, ChangeDetectorRef, Component, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { DataTableDirective, DataTablesModule } from 'angular-datatables';
import { languageConfig } from '../../../../assets/sass/core/base/datatables/language_es';
import { FormulariosService, IFormularioModel } from '../../../services/formularios/formularios.service';
import { ModalAccionesComponent } from './modalAciones/modalacciones.component'
import { Observable, Subject } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { KTHelpers, KTUtil } from 'src/app/_metronic/kt';
import { PageLoadingComponent } from 'src/app/modules/page-loading/page-loading.component';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-formularios',
  standalone: true,
  imports: [
    DataTablesModule,
    ModalAccionesComponent,
    PageLoadingComponent
  ],
  templateUrl: './formularios.component.html',
  styleUrl: './formularios.component.scss'
})

export class FormulariosComponent implements OnInit, AfterViewInit {

  @Input() dtOptions: any = {};
  @Input() dtTrigger: Subject<any> = new Subject<any>();
  @ViewChild(DataTableDirective, { static: false })
  private dtElement: DataTableDirective;

  @ViewChild('modal') modal: ModalAccionesComponent;

  allFormularios: IFormularioModel[];
  estadoBoton : any[];
  private getFormulariosCompleted = new Subject<void>(); // Subject para indicar que getUsers() ha completado
  isLoading: boolean;


   constructor(
    private formulariosService: FormulariosService, 
    private renderer: Renderer2,
    private cdRef: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.isLoading = false;
    this.inicializarTabla();
    this.getFormularios();
    //this.isLoading = false;
  }

  cambiaLoading(){
    this.isLoading = !this.isLoading;
    this.cdRef.detectChanges();
  }

  // Inicializar datatable
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
      paging: true,
      processing: true,
      language: languageConfig,
      responsive:true,
      columns:[
        { title:'Id', data: 'id' },
        { title:'Titulo', data: 'titulo' },
        { title:'Descripción', data: 'descripcion' },
        { title: 'Estado', data: 'enabled' },
        { title: 'Accion', data: 'actions'}
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

  getFormularios():void {
    this.formulariosService
    .getAll()
    .subscribe(
      (data: IFormularioModel[]) => {
              this.getFormulariosCompleted.next();
              this.getFormulariosCompleted.complete();
              this.allFormularios = data;    
              this.dtTrigger.next(null);
              this.cdRef.detectChanges();
      });
  }

  cambiosAllUsuarios(data: any) {
    const index = this.allFormularios.findIndex(item => item.id === data.id);
    this.allFormularios[index] = data;
    
    
    data.enabled = `<div class="btn-group btn-group-sm" role="group">
                        <button class="btn btn-sm fs-7 text-uppercase btn-action justify-content-center p-1 w-115px
                                      ${data.enabled ? 'btn-light-success' : 'btn-light-warning'}"
                                      data-action="cambiar-estado"
                                      data-kt-indicator="off"
                                      data-id="${data.id}" >
                            <span class="indicator-label"> ${data.enabled ? 'HABILITADO' : 'DESHABILITADO'}</span>
                            <span class="indicator-progress">
                                <span class="spinner-border spinner-border-sm align-middle"></span>
                            </span>
                        </button>
                    </div>`;
    // Destruir la tabla
    /*
    if (this.dtElement && this.dtElement.dtInstance) {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.clear();
      dtInstance.rows.add(this.allFormularios);
      dtInstance.draw();
      this.cdRef.detectChanges();
      //this.dtTrigger.next(null);
    });
    
  }*/
  
    // Destruir la tabla
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      //dtInstance.clear();
      const updatedRow = { ...dtInstance.row(index).data(), ...data };
      dtInstance.row(index).data(updatedRow).draw();
      this.cdRef.detectChanges();
      //dtInstance.destroy();
      //this.cdRef.detectChanges();
    });
  
    


    
    
  }
  ngAfterViewInit(): void {  
    this.getFormulariosCompleted.subscribe(() => {
      const containerElement = document.querySelector('.tabla-body');
      if(containerElement){
        // Este código se ejecutará cuando getUsers() haya completado su ejecución
        this.renderer.listen(containerElement, 'click', (event) => {
          const btn = event.target.closest('.btn-action');
          if (btn) {
            btn.setAttribute('data-kt-indicator','on');
            
            this.cambiaLoading();
            //ACCIONES
            
            const { action, id } = btn.dataset;
            if(action === 'edit' || action === 'ver'){
                this.formulariosService.get(id).subscribe({
                  next: (data: IFormularioModel) => {
                    this.modal.AbrirModal(action, id,data);
                  },
                  error: (error: HttpErrorResponse) => {
                    console.log('error: '+error.status);
                    //MANEJAR ERROR
                  },
                  complete: () => {
                    btn.removeAttribute('data-kt-indicator');
                    this.cambiaLoading();
                  }
                });
            }
            else if(action === 'cambiar-estado'){
              this.formulariosService.cambiarestado(id).subscribe({
                next: (data: IFormularioModel) => {
                  if(btn.classList.contains('btn-light-success')){
                    btn.classList.remove('btn-light-success');
                    btn.classList.add('btn-light-warning');
                    btn.querySelector('.indicator-label').textContent = 'DESHABILITADO';
                  }
                  else if(btn.classList.contains('btn-light-warning')){
                    btn.classList.remove('btn-light-warning');
                    btn.classList.add('btn-light-success');
                    btn.querySelector('.indicator-label').textContent = 'HABILITADO';
                  }
                },
                error: (error: HttpErrorResponse) => {
                  console.log('error: '+error.status);
                  //MANEJAR ERROR
                },
                complete: () => {
                  btn.removeAttribute('data-kt-indicator');
                  this.cambiaLoading();
                }
              });
    
            }
            //END ACCIONES
          }
          
        });
      }
    });
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

}
