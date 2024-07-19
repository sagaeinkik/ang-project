import { Component } from '@angular/core';
import { Course } from '../../../../models/course';
import { CourseService } from '../../../services/course.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss',
})
export class LandingComponent {
  allCourses: Course[] = [];

  constructor(private courseService: CourseService) {}

  ngOnInit() {
    this.courseService.fetchCourses().subscribe((data) => {
      this.allCourses = data;
    });
  }
}
