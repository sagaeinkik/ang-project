import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PageEvent, MatPaginatorModule } from '@angular/material/paginator';

//Modeller och services
import { Course } from '../../../../models/course';
import { CourseService } from '../../../services/course.service';
import { LocalStorageService } from '../../../services/local-storage.service';

@Component({
  selector: 'app-courses',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    CommonModule,
    FormsModule,
    MatPaginatorModule,
  ],
  templateUrl: './courses.component.html',
  styleUrl: './courses.component.scss',
})
export class CoursesComponent {
  constructor(
    private courseService: CourseService,
    private localStorageService: LocalStorageService
  ) {}

  //Variabler
  allCourses: Course[] = []; //Array för alla kurser
  resetList: Course[] = []; //Array för att återställa filtrering
  allSubjects: String[] = []; //array för alla unika ämnen
  specificSubject: string = ''; //Ämne man valt i listan
  filteredBySubject: Course[] = []; //Kurser som matchar ämnet man valt i listan
  searchInput: string = ''; //Sökinput
  searchResults: Course[] = []; //Array för sökresultat
  latestSort: null | string = null; //Lagra senaste sorteringen
  paginatedCourses: Course[] = []; //Array för kurser som ska visas (paginerade)

  // Info om paginering
  currentPageIndex: number = 0;
  currentPageSize: number = 50;

  ngOnInit() {
    /* Fetchanrop */
    this.courseService.fetchCourses().subscribe((data) => {
      this.allCourses = data;
      this.resetList = data;

      /* Lägg in unika ämnen i array */
      const subjects = this.allCourses.map((course) => course.subject);
      this.allSubjects = Array.from(new Set(subjects));

      this.onPageChange({
        pageIndex: 0,
        pageSize: 20,
        length: this.allCourses.length,
      });

      this.updateCourseFromStorage();
    });
  }
  /* Funktion för att filtrera enligt ämne */
  filterBySubject(): void {
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
  searchCourse(): void {
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

  //Sortering
  sortCourses(sortByX: keyof Course): void {
    let sortedCourses: Course[];
    //sortera arrayen
    sortedCourses = this.allCourses.sort((a, b) => {
      const aValue = a[sortByX];
      const bValue = b[sortByX];

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return aValue.localeCompare(bValue);
      }

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return aValue - bValue;
      }

      return 0;
    });
    //Peta in i variabeln
    this.allCourses = sortedCourses;

    //Om sortByX är likadan som Latestsort, byt ordning
    if (sortByX === this.latestSort) {
      sortedCourses.reverse();
      this.latestSort = null;
    } else {
      //Om sortByX inte är likadan, nollställ så sorteringen börjar om
      this.latestSort = sortByX;
    }

    this.onPageChange({
      pageIndex: this.currentPageIndex,
      pageSize: this.currentPageSize,
      length: this.allCourses.length,
    });
  }

  //Lägg till i ramschema
  addCourse(course: Course): void {
    course.added = !course.added;

    if (course.added) {
      this.localStorageService.addCourse(course);
    } else {
      this.localStorageService.removeCourse(course);
    }
  }

  //Uppdatera kursernas lägg till-ikon enligt localStorage
  updateCourseFromStorage(): void {
    this.allCourses.forEach((course) => {
      course.added = this.localStorageService.courseStatus(course);
    });
  }

  //Funktion för paginering
  onPageChange(event: PageEvent) {
    // Uppdatera den aktuella sidinformationen
    this.currentPageIndex = event.pageIndex;
    this.currentPageSize = event.pageSize;

    //Sätt startindex till sidoindex * hur många kurser som är på sidan
    const startIndex = event.pageIndex * event.pageSize;
    //Sätt slutindex till startindex plus sidstorlek
    const endIndex = startIndex + event.pageSize;
    //Kolla att kurser inte är tomma; gör brytpunkt med start/slutindex, lagra i paginatedCourses
    if (this.allCourses && this.allCourses.length) {
      this.paginatedCourses = this.allCourses.slice(startIndex, endIndex);
    }
  }
}
