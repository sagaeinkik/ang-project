import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Course } from '../../models/course';
import { LocalStorageService } from '../services/local-storage.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ramschema',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './ramschema.component.html',
  styleUrl: './ramschema.component.scss',
})
export class RamschemaComponent {
  constructor(private localStorageService: LocalStorageService) {}
  savedCourses: Course[] = []; //array som ska visas i ramschemat

  ngOnInit() {
    //Använd service för att hämta kurser ur lagringen
    const fromStorage = this.localStorageService.getSavedCourses();
    if (fromStorage) {
      this.savedCourses = fromStorage;
    }
  }
}
