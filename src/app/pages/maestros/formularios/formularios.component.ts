import { AfterViewInit, ChangeDetectorRef, Component, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { DataTablesModule } from 'angular-datatables';
import { languageConfig } from '../../../../assets/sass/core/base/datatables/language_es';
import { FormulariosService } from '../../../services/formularios/formularios.service';
import { ModalAccionesComponent } from './modalAciones/modalacciones.component'
import { Subject } from 'rxjs';

@Component({
  selector: 'app-formularios',
  standalone: true,
  imports: [
    DataTablesModule,
    ModalAccionesComponent
  ],
  templateUrl: './formularios.component.html',
  styleUrl: './formularios.component.scss'
})

export class FormulariosComponent implements OnInit, AfterViewInit {
  @Input() dtOptions: any = {};
  @Input() dtTrigger: Subject<any> = new Subject<any>();

  @ViewChild('modal') modal: ModalAccionesComponent;

  allFormularios: any[];
  estadoBoton : any[];
  private getFormulariosCompleted = new Subject<void>(); // Subject para indicar que getUsers() ha completado


   constructor(
    private formulariosService: FormulariosService, 
    private renderer: Renderer2,
    private cdRef: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.inicializarTabla();
    this.getFormularios();
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
        { title:'Id', data: 'Id' },
        { title:'Titulo', data: 'Titulo' },
        { title:'Descripción', data: 'Descripcion' },
        { title: 'Estado', data: 'Enabled' },
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
      (data: any) => {
              this.getFormulariosCompleted.next();
              this.getFormulariosCompleted.complete();
              this.allFormularios = data;    
              this.dtTrigger.next(null);
              this.cdRef.detectChanges();
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
            const { action, id } = btn.dataset;
            if(action === 'edit' || action === 'ver'){
                this.formulariosService.getOne(id).subscribe((data: any) => {
                this.modal.AbrirModal(action, id,data);
              });
            }
            else{
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
