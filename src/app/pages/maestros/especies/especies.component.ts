import { ChangeDetectorRef, Component, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { DataTableDirective, DataTablesModule } from 'angular-datatables';
import { languageConfig } from '../../../../assets/sass/core/base/datatables/language_es';
import { EspeciesService, IEspecieModel } from '../../../services/especies/especies.service';
import { Subject } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { PageLoadingComponent } from 'src/app/modules/page-loading/page-loading.component';
import { ModalAccionesComponent } from './modalAciones/modalacciones.component';


@Component({
  selector: 'maestro-especie',
  standalone: true,
  imports: [
    DataTablesModule,
    ModalAccionesComponent,
    PageLoadingComponent
  ],
  templateUrl: './especies.component.html',
  styleUrl: './especies.component.scss'
})
export class EspeciesComponent implements OnInit {

  @Input() dtOptions: any = {};
  @Input() dtTrigger: Subject<any> = new Subject<any>();
  @ViewChild(DataTableDirective, { static: false })
  private dtElement: DataTableDirective;

  @ViewChild('modal') modal: ModalAccionesComponent;
  @ViewChild('loading') loading: PageLoadingComponent;

  allData: IEspecieModel[];
  estadoBoton : any[];
  private getDataCompleted = new Subject<void>(); // Subject para indicar que getUsers() ha completado

  cargando : boolean = false;

   constructor(
    private servicio: EspeciesService, 
    private renderer: Renderer2,
    private cdRef: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.cargando = true;
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
        { title: 'Última modificación', data: 'updated_at', render: function(data : any, type : string, row : any) {
          if (type === 'display' || type === 'filter') {
            // Formato de fecha 'dd-mm-yyyy'
            return data ? new Date(data).toLocaleDateString('es-CL', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '';
          }
          return data;
        } },
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

  cambioRow(data: any) {
    const index = this.allData.findIndex(item => item.id === data.id);
    this.allData[index] = data;

    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      const dataRow = { ...dtInstance.row(index).data(), ...data };
      dtInstance.row(index).data(dataRow).draw();
    });
  }

  agregaRow(data: any) {
    this.allData.push(data);
    
    this.dtElement.dtInstance.then((table) => {
      table.row.add(data).draw();
    });
    
  }

  columnaAcciones():void{
    const actionColumn = {
      sortable: false,
      title: 'Acciones',
      data: 'actions',
      render: (data: any, type: any, full: any) => {
        
        const verButton = `<button class="btn btn-icon btn-success w-30px h-30px btn-action" data-action="ver"  data-id="${full.id}">
                              <span class="indicator-label">
                                <i class="ki-duotone ki-eye fs-3"><span class="path1"></span><span class="path2"></span><span class="path3"></span></i>
                              </span>
                              <span class="indicator-progress">
                                  <span class="spinner-border spinner-border-sm align-middle"></span>
                              </span>
                          </button>`;
        
        const editButton = `
                          <button class="btn btn-icon btn-warning w-30px h-30px btn-action" data-action="edit" data-id="${full.id}">
                              <span class="indicator-label">
                                  <i class="ki-duotone ki-pencil fs-3"><span class="path1"></span><span class="path2"></span></i>
                              </span>
                              <span class="indicator-progress">
                                  <span class="spinner-border spinner-border-sm align-middle"></span>
                              </span>
                          </button>`;

        const buttons = [];

        buttons.push(verButton);
        buttons.push(editButton);

        return buttons.join('');
      },
    };

    const estadoColumn = {
      sortable: false,
      title: 'Estado',
      render: (data: any, type: any, full: any) => {
        const estadoButton = `<div class="btn-group btn-group-sm" role="group">
                              <button class="btn btn-sm fs-7 text-uppercase btn-action justify-content-center p-1 w-115px
                                            ${full.enabled ? 'btn-light-success' : 'btn-light-warning'}"
                                            data-action="cambiar-estado"
                                            data-kt-indicator="off"
                                            data-id="${full.id}" >
                                  <span class="indicator-label"> ${full.enabled ? 'HABILITADO' : 'DESHABILITADO'}</span>
                                  <span class="indicator-progress">
                                      <span class="spinner-border spinner-border-sm align-middle"></span>
                                  </span>
                              </button>
                          </div>`;

        const buttons = [];

        buttons.push(estadoButton);
        
        return buttons.join('');
      },
    };

    if (this.dtOptions.columns) {
      this.dtOptions.columns.push(estadoColumn);
      this.dtOptions.columns.push(actionColumn);
    }
  }

  loadingEvent(){
    this.loading.cambiaLoading();
  }
  
  ngAfterViewInit(): void {
    this.servicio.getAll().subscribe((data: IEspecieModel[]) => {
                    this.getDataCompleted.next();
                    this.getDataCompleted.complete();
                    this.allData = data;
                    this.dtElement.dtOptions.data = this.allData;
                    this.columnaAcciones();
                    this.dtTrigger.next(null);
                    this.cargando = false;
                    this.cdRef.detectChanges();
                  });

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
                  next: (data: IEspecieModel) => {
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
                next: (data: IEspecieModel) => {
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
