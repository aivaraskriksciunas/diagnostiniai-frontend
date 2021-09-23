import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalComponent, ModalHeader, ModalActions, ModalContent } from './pages/shared/components/modal/modal.component';
import { DropdownComponent, DropdownItem, DropdownButton } from './pages/shared/components/dropdown/dropdown.component';
import { DotsLoaderComponent } from './shared/components/loaders/dots-loader/dots-loader.component';
import { FlatpickrDirective } from './shared/components/flatpickr.directive';
import { PaginatorComponent } from './shared/components/paginator/paginator.component';
import { MultipleSelectComponent } from './pages/shared/components/multiple-select/multiple-select.component';
import { SubjectSelectorComponent } from './pages/shared/components/subject-selector/subject-selector.component';
import { MultipleSelectItemComponent } from './pages/shared/components/multiple-select/multiple-select-item/multiple-select-item.component';

const components = [
  // Modal elements
  ModalComponent,
  ModalHeader,
  ModalActions,
  ModalContent,

  // Dropdown elements
  DropdownComponent,
  DropdownItem,
  DropdownButton,

  // Loaders
  DotsLoaderComponent,
  
  FlatpickrDirective,

  PaginatorComponent,

  MultipleSelectComponent,
  MultipleSelectItemComponent,
  SubjectSelectorComponent,
]

@NgModule({
  imports: [
    CommonModule,
  ],
  exports: components,
  declarations: components
})
export class SharedModule { }
