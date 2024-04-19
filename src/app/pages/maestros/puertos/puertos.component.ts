import { ChangeDetectorRef, Component, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { DataTableDirective, DataTablesModule } from 'angular-datatables';
import { languageConfig } from '../../../../assets/sass/core/base/datatables/language_es';
import { PuertosService, IPuertoModel } from '../../../services/puertos/puertos.service';
import { Subject } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { PageLoadingComponent } from 'src/app/modules/page-loading/page-loading.component';
import { ModalAccionesComponent } from './modalAciones/modalacciones.component';


@Component({
  selector: 'maestro-puerto',
  standalone: true,
  imports: [
    DataTablesModule,
    ModalAccionesComponent,
    PageLoadingComponent
  ],
  templateUrl: './puertos.component.html',
  styleUrl: './puertos.component.scss'
})
export class PuertosComponent implements OnInit {

  @Input() dtOptions: any = {};
  @Input() dtTrigger: Subject<any> = new Subject<any>();
  @ViewChild(DataTableDirective, { static: false })
  private dtElement: DataTableDirective;

  @ViewChild('modal') modal: ModalAccionesComponent;
  @ViewChild('loading') loading: PageLoadingComponent;

  allData: IPuertoModel[];
  estadoBoton : any[];
  private getDataCompleted = new Subject<void>(); // Subject para indicar que getUsers() ha completado


   constructor(
    private servicio: PuertosService, 
    private renderer: Renderer2,
    private cdRef: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.inicializarTabla();
    this.getData();
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
        { title:'Nombre', data: 'nombre' },
        
        { title: 'Última modificación', data: 'updated_at' },
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

  getData():void {
    this.servicio
    .getAll()
    .subscribe(
      (data: IPuertoModel[]) => {
              this.getDataCompleted.next();
              this.getDataCompleted.complete();
              this.allData = data;    
              this.dtTrigger.next(null);
              this.cdRef.detectChanges();
      });
  }

  cambioRow(data: any) {
    const index = this.allData.findIndex(item => item.id === data.id);
    this.allData[index] = data;
    
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

    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      const dataRow = { ...dtInstance.row(index).data(), ...data };
      dtInstance.row(index).data(dataRow).draw();
    });
  }

  loadingEvent(){
    this.loading.cambiaLoading();
  }
  
  ngAfterViewInit(): void {  
    this.getDataCompleted.subscribe(() => {
      const containerElement = document.querySelector('.tabla-body');
      if(containerElement){
        // Este código se ejecutará cuando getUsers() haya completado su ejecución
        this.renderer.listen(containerElement, 'click', (event) => {
          const btn = event.target.closest('.btn-action');
          if (btn) {
            btn.setAttribute('data-kt-indicator','on');
            this.loading.cambiaLoading();

            const { action, id } = btn.dataset;
            //ACCIONES
            if(action === 'edit' || action === 'ver'){
                this.servicio.get(id).subscribe({
                  next: (data: IPuertoModel) => {
                    this.modal.AbrirModal(action, id,data);
                  },
                  error: (error: HttpErrorResponse) => {
                    console.log('error: '+error.status);
                    //MANEJAR ERROR
                  },
                  complete: () => {
                    btn.removeAttribute('data-kt-indicator');
                    this.loading.cambiaLoading();
                  }
                });
            }
            else if(action === 'cambiar-estado'){
              this.servicio.cambiarestado(id).subscribe({
                next: (data: IPuertoModel) => {
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
                  this.loading.cambiaLoading();
                }
              });
    
            }
          }
          
        });
      }
    });
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }
}
