import { Component, EventEmitter, Input, OnInit, ViewChild, Renderer2 } from '@angular/core';
import { DataTableDirective, DataTablesModule } from 'angular-datatables';
import { CommonModule } from '@angular/common';
import { SwApiService } from '../../services/swApi.service';
import { Subject } from 'rxjs';
import { ModalRegComponent } from './modal/modalReg.component';

@Component({
  selector: 'app-pruebas2',
  standalone: true,
  imports: [
    DataTablesModule, 
    CommonModule,
    ModalRegComponent
  ],
  templateUrl: './pruebas2.component.html',
  styleUrl: './pruebas2.component.scss'
})

export class Pruebas2Component implements OnInit {

  //DT declaration
  dtOptions: DataTables.Settings = {};

  dtTrigger : Subject<any> = new Subject<any>();
  private unsubscribe$ = new Subject<void>(); // For proper component cleanup

  @Input() datatableConfig: DataTables.Settings = {};
  @ViewChild(DataTableDirective, { static: false })
  private datatableElement: DataTableDirective;

  // Reload emitter inside datatable
  @Input() reload: EventEmitter<boolean>;

  @ViewChild('modalReg') modalReg : ModalRegComponent;
  
  clickListener: any;
  idInAction: any;
  constructor(private renderer: Renderer2, private apiService: SwApiService) {  }

  ngOnInit(): void {

    //Datatable Options
    this.dtOptions = {
      dom: `<'d-flex flex-md-row flex-column justify-content-md-between justify-content-start align-items-center'"
            <'filtro'B>"
            <''f>"
            >"
            <'table-responsive'tr>
            <'row'
            <'col-sm-12 col-md-5 d-flex align-items-center justify-content-center justify-content-md-start'i>
            <'col-sm-12 col-md-7 d-flex align-items-center justify-content-center justify-content-md-end'p>
            >`,
      columns : [
        {title:"Ep N°", data:"episode_id"},
        {title:"Nombre", data: "title"},
        {title:"Director", data: "director"},
        {title:"Fecha Lanzamiento", data:"release_date"},
        {title:"URL", data: "url"}
      ],
      processing : true,
      pageLength : 10,
      paging: true,
      ... this.datatableConfig
    }
    
    
  }
  
  ngAfterViewInit(): void {
    this.apiService.getMovies().subscribe((data:any) => {
        this.datatableElement.dtOptions.data = data.results;
        
        this.columnaAcciones();
        this.dtTrigger.next(null);
      });
    
      this.clickListener = this.renderer.listen(document, 'click', (event) => {
        const closestBtn = event.target.closest('.btn-action');
        if (closestBtn) {
          const { action, id } = closestBtn.dataset;
          this.idInAction = id;
          console.log(closestBtn);
          switch (action) {
            case 'view':
              this.modalReg.abrirModal();
              break;
  
            case 'edit':
              this.modalReg.abrirModal();
              break;
          }
        }
      });
    

  }

  agregarOtro():void{
    let otro = {
      "episode_id" : 7,
      "title" : "Force awakens",
      "director" : "JJ Abrams",
      "release_date" : "2016",
      "url" : null
    };

    this.datatableElement.dtInstance.then((dtInstace : DataTables.Api)=>{
      dtInstace.row.add(otro).draw();
    });
  }

  columnaAcciones():void{
    const actionColumn = {
      sortable: false,
      title: 'Acciones',
      render: (data: any, type: any, full: any) => {
        const editButton = `
          <button class="btn btn-icon btn-action btn-active-light-primary w-30px h-30px me-3" data-action="edit" data-id="${full.episode_id}" ngbTooltip="What a great tip!">
            <i class="ki-duotone ki-pencil fs-3"><span class="path1"></span><span class="path2"></span></i>
          </button>`;

        const deleteButton = `
          <button class="btn btn-icon btn-action btn-active-light-primary w-30px h-30px" data-action="delete" data-id="${full.episode_id}" >
            <i class="ki-duotone ki-trash fs-3">
              <span class="path1"></span><span class="path2"></span>
              <span class="path3"></span><span class="path4"></span><span class="path5"></span>
            </i>
          </button>`;

        const buttons = [];

        buttons.push(editButton);
        

        buttons.push(deleteButton);
        

        return buttons.join('');
      },
    };

    

    if (this.dtOptions.columns) {
      this.dtOptions.columns.push(actionColumn);
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next(); // Unsubscribe to prevent memory leaks
    this.unsubscribe$.complete();
  }
}
