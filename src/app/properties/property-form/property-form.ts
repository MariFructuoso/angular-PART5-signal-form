import { Component, DestroyRef, inject, output, signal } from '@angular/core';
import { Property, PropertyInsert } from '../interface/property';
import { FormsModule } from '@angular/forms';
import { PropertiesService } from '../../services/properties-service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { EncodeBase64Directive } from '../../shared/directives/encode-base64-directive';
import { ProvinceService } from '../../services/province-service';
import { Router } from '@angular/router';
import { CanComponentDeactivate } from '../../shared/guards/leave-page-guard';

@Component({
  selector: 'property-form',
  imports: [FormsModule, EncodeBase64Directive],
  templateUrl: './property-form.html',
  styleUrl: './property-form.css',
})
export class PropertyForm implements CanComponentDeactivate {
  add = output<Property>();
  newProperty: PropertyInsert = {
    townId: 0,
    address: '',
    title: '',
    description: '',
    price: 0,
    sqmeters: 0,
    numRooms: 0,
    numBaths: 0,
    mainPhoto: '',
  };
  filename = '';
  province = signal<number>(0);
  saved = false;

  #propertiesService = inject(PropertiesService); // Injectamos el servicio
  #provinceService = inject(ProvinceService); // Injectamos el servicio
  #destroyRef = inject(DestroyRef);
  readonly provincesResource = this.#provinceService.provincesResource;
  readonly townsResource = this.#provinceService.getTownsResource(this.province);
  #router = inject(Router);

  // Este método cambia (no gestionamos la inserción en el array de productos)
  addProperty() {
    const propertyData: PropertyInsert = {
      title: this.newProperty.title as string,
      description: this.newProperty.description as string,
      townId: +this.newProperty.townId,
      address: this.newProperty.address as string,
      price: +this.newProperty.price,
      sqmeters: +this.newProperty.sqmeters,
      numRooms: +this.newProperty.numRooms,
      numBaths: +this.newProperty.numBaths,
      mainPhoto: this.newProperty.mainPhoto,
    };
    this.#propertiesService
      .addProperty(propertyData)
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe(() => {
        this.saved = true;
        this.#router.navigate(['/properties']);
      });
  }
  canDeactivate() {
    return this.saved || confirm('¿Quieres abandonar la página?. Los cambios se perderán...');
  }
}
