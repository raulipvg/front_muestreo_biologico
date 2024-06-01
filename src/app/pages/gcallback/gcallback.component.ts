import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from 'src/app/modules/auth';
import { env } from 'src/environments/env';

@Component({
  selector: 'app-gcallback',
  standalone: true,
  imports: [],
  templateUrl: './gcallback.component.html'
})
export class GcallbackComponent implements OnInit{

  constructor(
    private authService: AuthService
  ) { authService.google() }

  ngOnInit(): void {
    
  }

}
