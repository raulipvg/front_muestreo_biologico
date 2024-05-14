import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { DataTableDirective, DataTablesModule } from 'angular-datatables';
import { Subject } from 'rxjs';
import { PageLoadingComponent } from 'src/app/modules/page-loading/page-loading.component';
import { FormulariosService } from 'src/app/services/formularios/formularios.service';
import { IRespuestaModel, RespuestasService } from 'src/app/services/respuestas/respuestas.service';
import { languageConfig } from 'src/assets/sass/core/base/datatables/language_es';

@Component({
  selector: 'maestro-respuesta-biologico',
  standalone: true,
  imports: [
    DataTablesModule,
    PageLoadingComponent,
    RouterModule
  ],
  templateUrl: './respuestabiologico.component.html',
  styleUrl: './respuestabiologico.component.scss'
})
export class RespuestabiologicoComponent implements OnInit{

  @Input() dtOptions: any = {};
  @Input() dtTrigger: Subject<any> = new Subject<any>();
  @ViewChild(DataTableDirective,{static:false})
  private dtElement: DataTableDirective;

  @ViewChild('loading') loading: PageLoadingComponent;

  allData: IRespuestaModel[] = [];
  private getDataCompleted = new Subject<void>(); // Subject para saber cuando se completó la petición de datos
  cargando: boolean = false;
  

  constructor(
    private cdRef: ChangeDetectorRef,
    private renderer: Renderer2,
    private servicio: RespuestasService,
    private router: Router,
    public formularios : FormulariosService
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
                      columns: [0, 1, 2, 3,4,5,6]
                  }
              },
              {
                  extend: 'excel',
                  className: 'btn btn-secondary',
                  exportOptions: {
                    columns: [0, 1, 2, 3,4,5,6]
                  }
              },
              {
                  extend: 'print',
                  className: 'btn btn-secondary',
                  exportOptions: {
                    columns: [0, 1, 2, 3,4,5,6]
                  }
              }
          ],      
      pageLength:100,
      displayLength: 50,
      paging: true,
      processing: true,
      language: languageConfig,
      responsive:true,
      order: [[0, 'desc']],
      columns:[
        { title:'Id', data: 'id' },
        { title:'Nave', data: 'nave' },
        { title: 'Puerto', data: 'puerto'},
        { title: 'Planta', data: 'planta'},
        { title: 'Analista', data: 'persona'},
        { title: 'Especie Objetivo', data: 'nombres_especies'},
        { title: 'Fecha', data: 'created_at', render: function(data : any, type : string, row : any) {
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
        $(row).children('td:eq(-1)').addClass('text-center');
      }
    };
  }

  loadingEvent(){
    this.loading.cambiaLoading();
  }

  ngAfterViewInit(): void {
    this.servicio.getAllbyFormulario(1).subscribe((data: IRespuestaModel[]) => {
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
              //console.log('edit/ver: '+id)
              //llamar a la ruta /biologico/:id
              this.router.navigate(['/biologico', id]);       


            }
            else if(action === 'cambiar-estado'){
              
              this.servicio.cambiarestado(id).subscribe({
                next: (data: IRespuestaModel) => {
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
  columnaAcciones():void{
    const actionColumn = {
      sortable: false,
      title: 'Acciones',
      className: 'text-center',
      data: 'actions',
      render: (data: any, type: any, full: any) => {
        /*
        const verButton = `<button class="btn btn-icon btn-success w-30px h-30px btn-action" data-action="ver"  data-id="${full.id}">
                              <span class="indicator-label">
                                <i class="ki-duotone ki-eye fs-3"><span class="path1"></span><span class="path2"></span><span class="path3"></span></i>
                              </span>
                              <span class="indicator-progress">
                                  <span class="spinner-border spinner-border-sm align-middle"></span>
                              </span>
                          </button>`;
        */
        const editButton = `
                          <a class="btn btn-icon btn-warning w-30px h-30px btn-action" data-action="edit" data-id="${full.id}">
                              <span class="indicator-label">
                                  <i class="ki-duotone ki-pencil fs-3"><span class="path1"></span><span class="path2"></span></i>
                              </span>
                              <span class="indicator-progress">
                                  <span class="spinner-border spinner-border-sm align-middle"></span>
                              </span>
                          </a>`;

        const buttons = [];

        //buttons.push(verButton);
        buttons.push(editButton);

        return buttons.join('');
      },
    };

    const estadoColumn = {
      sortable: false,
      title: 'Estado',
      className: 'text-center',
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

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }
}
