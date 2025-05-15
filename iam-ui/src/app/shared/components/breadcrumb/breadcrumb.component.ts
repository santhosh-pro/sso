import {Component, inject, input, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from "rxjs";
import {filter} from "rxjs/operators";
import {NavigationEnd, Router} from "@angular/router";
import {NgClass} from "@angular/common";

@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  imports: [
    NgClass
  ],
  templateUrl: './breadcrumb.component.html',
  styleUrl: './breadcrumb.component.scss'
})
export class BreadcrumbComponent implements OnInit, OnDestroy {
  router = inject(Router);
  breadcrumbs: Breadcrumb[] = [];

  private subscription: Subscription | undefined;


  ngOnInit(): void {
    this.generateBreadcrumbs();
    this.subscription = this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.generateBreadcrumbs();
      });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  private generateBreadcrumbs(): void {
    const url = this.router.url.split('?')[0]; // Remove query parameters
    const urlSegments = url.split('/').filter((segment) => segment); // Split by '/' and remove empty segments

    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i; // Regex to match UUIDs

    let accumulatedPath = '';
    this.breadcrumbs = urlSegments
      .filter((segment) => !uuidRegex.test(segment)) // Skip segments matching the UUID format
      .map((segment) => {
        accumulatedPath += `/${segment}`; // Accumulate path for breadcrumb route
        return {
          title: this.formatSegment(segment), // Convert to readable title
          route: accumulatedPath,
        };
      });
  }

  private formatSegment(segment: string): string {
    return segment
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  navigate(route: string): void {
    this.router.navigate([route]);
  }
}


export interface Breadcrumb {
  title: string;
  route?: string;
}
