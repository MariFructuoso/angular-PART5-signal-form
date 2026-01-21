import { Component, inject, signal, effect, untracked, computed } from '@angular/core';
import { PropertiesService } from '../../services/properties-service';
import { EncodeBase64Directive } from '../../shared/directives/encode-base64-directive';
import { ProvinceService } from '../../services/province-service';
import { Router } from '@angular/router';
import { CanComponentDeactivate } from '../../shared/guards/leave-page-guard';
import { form, FormField, min, max, pattern, required, minLength } from '@angular/forms/signals';
import { PropertyInsert } from '../interface/property';


@Component({
  selector: 'property-form',
  imports: [FormField, EncodeBase64Directive],
  templateUrl: './property-form.html',
  styleUrl: './property-form.css',
})
export class PropertyForm implements CanComponentDeactivate {
  #router = inject(Router);
  #propertiesService = inject(PropertiesService);
  #provincesService = inject(ProvinceService);

  saved = false;
  provinceId = signal('0');

  newProperty = signal<PropertyInsert>({ //Modelo signal
    title: '',
    description: '',
    price: 0,
    address: '',
    townId: '0',
    mainPhoto: '',
    sqmeters: 0,
    numRooms: 0,
    numBaths: 0,
  });

  //Validaciones
  propertyForm = form(this.newProperty, (schema) => {
    required(schema.title, { message: 'The title is required' });
    minLength(schema.title, 5, { message: 'Title must be at least 5 characters long' });
    pattern(schema.title, /^[a-zA-Z][a-zA-Z ]*$/, { message: 'Title can only contain letters and spaces' });

    required(schema.description, { message: 'Description is required' });

    required(schema.address, { message: 'Address is required' });

    required(schema.price);
    min(schema.price, 1, { message: 'Price must be greater than 0' });

    required(schema.sqmeters);
    min(schema.sqmeters, 1);

    required(schema.numRooms);
    min(schema.numRooms, 1, { message: 'At least 1 room' });
    max(schema.numRooms, 20, { message: 'Max 20 rooms' });

    required(schema.numBaths);
    min(schema.numBaths, 1, { message: 'At least 1 bath' });
    max(schema.numBaths, 20, { message: 'Max 20 baths' });

    required(schema.townId);
    pattern(schema.townId, /^[1-9]\d*$/, { message: 'You must select a town' });

    required(schema.mainPhoto, { message: 'An image is required' });
  });

  provincesResource = this.#provincesService.provincesResource;
townsResource = this.#provincesService.getTownsResource(computed(() => +this.provinceId()));
  constructor() {
    effect(() => {
      this.provinceId();
      untracked(() => this.propertyForm.townId().value.set('0'));
    });
  }

  addProperty(event: Event) {
    event.preventDefault();
    
    const product = this.newProperty();
    const productToSend: PropertyInsert = {
      ...product,
      townId: +product.townId 
    };

    this.#propertiesService.addProperty(productToSend).subscribe(() => {
      this.saved = true;
      this.#router.navigate(['/properties']);
    });
  }
  canDeactivate() {
    if (this.saved || !this.propertyForm().dirty()) {
      return true;
    }
    return confirm('Do you want to leave the page? Changes will be lost.');
  }
}
