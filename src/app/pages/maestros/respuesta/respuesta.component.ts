import { AfterViewInit, ChangeDetectorRef, Component, Input, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ModalRespComponent } from './modalresp/modalresp.component';
import { RespuestasService } from 'src/app/services/respuestas/respuestas.service';
import { Subject } from 'rxjs';
import { languageConfig } from 'src/assets/sass/core/base/datatables/language_es';
import { DataTablesModule } from 'angular-datatables';

@Component({
  selector: 'app-respuesta',
  standalone: true,
  imports: [
    DataTablesModule,
    ModalRespComponent
  ],
  templateUrl: './respuesta.component.html',
  styleUrl: './respuesta.component.scss'
})
export class RespuestaComponent implements OnInit, AfterViewInit, OnDestroy {

 
  allRespuestas: any[]= [];
  private getRespCompletada = new Subject<void>(); // Subject para indicar que getUsers() ha completado
 
  /** Variables para Datatables **/
  datatableConfig: DataTables.Settings = {};
  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject<any>();

  @ViewChild('modal_resp') modal: ModalRespComponent;
  flag : boolean =false;

  constructor(
    private respuestaService: RespuestasService,
    private cdRef: ChangeDetectorRef,
    private renderer: Renderer2,
  ){};
  ngOnInit(): void {
    this.inicializarTabla();
    this.getRespuestas(); 
  }

  getRespuestas() {
    this.respuestaService
    .getAll()
    .subscribe(
      (data: any[]) => {
              this.getRespCompletada.next();
              this.getRespCompletada.complete();
              this.allRespuestas = data;       
              this.dtTrigger.next(null);
              this.cdRef.detectChanges();
      })
  }
  inicializarTabla() {
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

  ngAfterViewInit(): void {
    const containerElement = document.querySelector('.tabla-body');
    if(containerElement){
      // Este código se ejecutará cuando getUsers() haya completado su ejecución
      this.renderer.listen(containerElement, 'click', (event) => {
        const btn = event.target.closest('.btn');
        if (btn) {
          const { action, id } = btn.dataset;
          //this.idInAction = id;
          this.modal.AbrirModal(action, id);   
        }
      
      });
    }
    
  }
  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }
}
