import { Injectable } from '@angular/core';
import { Course } from '../../models/course';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  constructor() {}
  savedCourses: Course[] = this.getSavedCourses(); //Array för lagrade kurser

  //Lägg till en kurs
  addCourse(course: Course): void {
    this.savedCourses.push(course);
    localStorage.setItem('savedCourses', JSON.stringify(this.savedCourses));
  }

  //Hämta kurser från localstorage
  getSavedCourses(): Course[] {
    const saved = localStorage.getItem('savedCourses');
    return saved ? JSON.parse(saved) : [];
  }

  //Kolla status på kurs, sparad eller ej
  courseStatus(course: Course): boolean {
    return this.savedCourses.some((c) => c.courseCode === course.courseCode);
  }

  //Radera kurs ur Storage
  removeCourse(course: Course): void {
    //Filtrera bort kursen och spara arrayen
    this.savedCourses = this.savedCourses.filter(
      (kurs) => kurs.courseCode !== course.courseCode
    );
    localStorage.setItem('savedCourses', JSON.stringify(this.savedCourses));
  }
}
