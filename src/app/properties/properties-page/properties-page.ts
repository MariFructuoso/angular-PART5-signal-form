import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  linkedSignal,
  signal,
} from '@angular/core';
import { Property } from '../interface/property';
import { FormsModule } from '@angular/forms';
import { PropertyCard } from '../property-card/property-card';
import { PropertiesService } from '../../services/properties-service';
import { ProvinceService } from '../../services/province-service';

@Component({
  selector: 'properties-page',
  imports: [FormsModule, PropertyCard],
  templateUrl: './properties-page.html',
  styleUrl: './properties-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PropertiesPage {
  search = signal('');
  provinceFilter = signal('');
  readonly #propertiesService = inject(PropertiesService); // Inyectamos el servicio
  readonly propertiesResource = this.#propertiesService.propertiesResource;
  properties = linkedSignal(() => this.propertiesResource.value().properties);
  #provinceService = inject(ProvinceService); // Injectamos el servicio
  readonly provincesResource = this.#provinceService.provincesResource;

  propertiesFilter = computed(() =>
    this.properties().filter(
      (p) =>
        p.title.toLowerCase().includes(this.search().toLowerCase()) &&
        p.town.province.id.toString().includes(this.provinceFilter()),
    ),
  );

  addProperty(property: Property) {
    this.properties.update((properties) => [...properties, property]);
  }
  deleteProperty(property: Property) {
    this.properties.update((properties) => properties.filter((p) => p !== property));
  }
  filtrado() {
    let text = '';
    if (!this.search() && !this.provinceFilter()) {
      text = 'No filters applied';
    } else {
      text += this.search() ? `Search: ${this.search()}` : '';
      text += this.provinceFilter() ? ` Province: ${this.provinceFilter()}` : '';
    }
    return text;
  }
}
