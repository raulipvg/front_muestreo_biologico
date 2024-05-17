import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { toJSON } from 'src/app/_metronic/kt/_utils';
import { CookieComponent } from 'src/app/_metronic/kt/components';
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
