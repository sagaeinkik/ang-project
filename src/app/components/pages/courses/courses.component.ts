import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PageEvent, MatPaginatorModule } from '@angular/material/paginator';

//Modeller och services
import { Course } from '../../../../models/course';
import { CourseService } from '../../../services/course.service';
import { LocalStorageService } from '../../../services/local-storage.service';
import { filter } from 'rxjs';

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

  /* SÖK OCH FILTRERING */
  searchCourse(): void {
    this.applyFilters();
  }
  filterBySubject(): void {
    this.applyFilters();
  }
  /* Funktion för att kombinera filtrering och sökning */
  applyFilters(): void {
    let filteredCourses = this.resetList;

    // Filtrera enligt sökinput till lowercase
    if (this.searchInput.trim() !== '') {
      this.specificSubject = '';
      filteredCourses = filteredCourses.filter(
        (course) =>
          course.courseCode
            .toLowerCase()
            .includes(this.searchInput.toLowerCase()) ||
          course.courseName
            .toLowerCase()
            .includes(this.searchInput.toLowerCase())
      );
    }

    // Filtrera enligt valt ämne
    if (this.specificSubject && this.specificSubject !== 'alla') {
      this.searchInput = '';
      filteredCourses = filteredCourses.filter(
        (course) => course.subject === this.specificSubject
      );
    }

    // Uppdatera paginerade kurser
    this.allCourses = filteredCourses;
    this.currentPageIndex = 0; //Nollställ denna först så att vyn kan uppdateras korrekt

    //Uppdatera med paginering
    this.onPageChange({
      pageIndex: this.currentPageIndex,
      pageSize: this.currentPageSize,
      length: this.allCourses.length,
    });
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

    //Uppdatera vyn om filtrering har gjort att inga kurser matchar
    if (this.allCourses.length === 0) {
      this.paginatedCourses = []; // Sätt till tom array
      return;
    }

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
