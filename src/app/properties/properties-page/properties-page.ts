import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  linkedSignal,
  signal,
} from '@angular/core';
import { Property } from '../interface/property';
import { PropertyCard } from '../property-card/property-card';
import { PropertiesService } from '../../services/properties-service';
import { form, FormField, debounce } from '@angular/forms/signals';
import { ProvinceService } from '../../services/province-service';

@Component({
  selector: 'properties-page',
  imports: [FormField, PropertyCard],
  templateUrl: './properties-page.html',
  styleUrl: './properties-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PropertiesPage {
  search = signal('');
  readonly #propertiesService = inject(PropertiesService); // Inyectamos el servicio
  readonly #provinceService = inject(ProvinceService);

  readonly propertiesResource = this.#propertiesService.propertiesResource;
  readonly provincesResource = this.#provinceService.provincesResource;

  properties = linkedSignal(() => this.propertiesResource.value().properties);
  province = signal('');

  searchField = form(this.search, (schema) => {
    debounce(schema, 600);
  });

  provinceField = form(this.province);

  propertiesFilter = computed(() =>
    this.properties().filter(
      (p) =>
        p.title.toLowerCase().includes(this.search().toLowerCase()) &&
        p.town.province.id.toString().includes(this.province())
    )
  );

  addProperty(property: Property) {
    this.properties.update((properties) => [...properties, property]);
  }
  deleteProperty(property: Property) {
    this.properties.update((properties) => properties.filter((p) => p !== property));
  }
  filtrado() {
    let text = '';
    if (!this.search() && !this.province()) {
      text = 'No filters applied';
    } else {
      text += this.search() ? `Search: ${this.search()}` : '';
      text += this.province() ? ` Province: ${this.province()}` : '';
    }
    return text;
  }
}
