import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Course } from '../../../../models/course';
import { CourseService } from '../../../services/course.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-courses',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule, FormsModule],
  templateUrl: './courses.component.html',
  styleUrl: './courses.component.scss',
})
export class CoursesComponent {
  constructor(private courseService: CourseService) {}
  allCourses: Course[] = []; //Array för alla kurser
  resetList: Course[] = []; //Array för att återställa filtrering
  allSubjects: String[] = []; //array för alla unika ämnen
  specificSubject: string = ''; //Ämne man valt i listan
  filteredBySubject: Course[] = []; //Kurser som matchar ämnet man valt i listan
  searchInput: string = ''; //Sökinput
  searchResults: Course[] = []; //Array för sökresultat

  ngOnInit() {
    /* Fetchanrop */
    this.courseService.fetchCourses().subscribe((data) => {
      this.allCourses = data;
      this.resetList = data;

      /* Lägg in unika ämnen i array */
      const subjects = this.allCourses.map((course) => course.subject);
      this.allSubjects = Array.from(new Set(subjects));
    });
  }
  /* Funktion för att filtrera enligt ämne */
  filterBySubject() {
    /* Nollställ lista om tom */
    if (this.specificSubject === 'alla') {
      this.allCourses = this.resetList;
    } else {
      this.allCourses = this.resetList;
      this.filteredBySubject = this.allCourses.filter((course) =>
        course.subject.includes(this.specificSubject)
      );
      this.allCourses = this.filteredBySubject;
    }
  }
  /* Funktion för att fritextsökning */
  searchCourse() {
    //Kolla så det sökts på något
    if (this.searchInput.trim() !== '') {
      //Nollställ ämne om man har valt det
      this.specificSubject = '';

      //Filtrera enligt kurskod/kursnamn i små bokstäver
      this.searchResults = this.resetList.filter(
        (course) =>
          course.courseCode
            .toLowerCase()
            .includes(this.searchInput.toLowerCase()) ||
          course.courseName
            .toLowerCase()
            .includes(this.searchInput.toLowerCase())
      );
      // Uppdatera allCourses med sökresultaten
      this.allCourses = this.searchResults;
    } else {
      //Återställ resultat
      this.allCourses = this.resetList;
    }
  }
}
