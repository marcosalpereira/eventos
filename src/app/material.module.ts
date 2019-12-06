import { NgModule } from '@angular/core';

import {
  MatToolbarModule, MatButtonModule, MatSidenavModule,
  MatIconModule, MatListModule, MatDatepickerModule, MatNativeDateModule,
  MatFormFieldModule, MatInputModule, MatCardModule, MatSelectModule,
  MatTabsModule, MatTableModule, MatCheckboxModule, MatSnackBarModule, MatChipsModule, MatBadgeModule
} from '@angular/material';

import {MatGridListModule} from '@angular/material/grid-list';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatExpansionModule } from '@angular/material/expansion';


@NgModule({
  declarations: [],
  imports: [
    BrowserAnimationsModule,
    MatToolbarModule, MatButtonModule, MatSidenavModule,
    MatIconModule, MatListModule, BrowserAnimationsModule, MatDatepickerModule, MatNativeDateModule,
    MatButtonModule, MatCardModule, MatSelectModule,
    MatFormFieldModule, MatTabsModule, MatTableModule, MatCheckboxModule,
    MatInputModule, MatExpansionModule, MatSnackBarModule,
    MatGridListModule, MatChipsModule, MatBadgeModule
  ],
  exports: [
    BrowserAnimationsModule,
    MatToolbarModule, MatButtonModule, MatSidenavModule,
    MatIconModule, MatListModule, BrowserAnimationsModule, MatDatepickerModule, MatNativeDateModule,
    MatButtonModule, MatCardModule, MatSelectModule,
    MatFormFieldModule, MatTabsModule, MatTableModule, MatCheckboxModule,
    MatInputModule, MatExpansionModule, MatSnackBarModule,
    MatGridListModule, MatChipsModule, MatBadgeModule
  ]
})
export class MaterialModule { }
