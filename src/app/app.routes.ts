import { Routes } from '@angular/router';
import { LandingComponent } from './components/pages/landing/landing.component';
import { CoursesComponent } from './components/pages/courses/courses.component';
import { RamschemaComponent } from './ramschema/ramschema.component';

export const routes: Routes = [
  { path: '', component: LandingComponent, title: 'Utkantuniversitetet' },
  { path: 'courses', component: CoursesComponent, title: 'Kurser' },
  { path: 'ramschema', component: RamschemaComponent, title: 'Ramschema' },
  { path: '**', redirectTo: '' },
];
