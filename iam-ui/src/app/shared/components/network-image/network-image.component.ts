import {Component, computed, input, signal} from '@angular/core';


@Component({
  selector: 'lib-network-image',
  standalone: true,
  imports: [],
  templateUrl: './network-image.component.html',
  styleUrl: './network-image.component.scss'
})
export class NetworkImageComponent {

  placeholderImage = input<string | undefined>();
  imageUrl = input<string | undefined>();

  isError = signal(false);

  placeHolderUrl = computed(() => {
    return this.placeholderImage() ?? 'assets/images/background/restaurant-placeholder.png';
  })

  sourceUrl = computed(() => {
    if (this.imageUrl()) {
      return this.imageUrl();
    } else {
      return this.placeholderImage() ?? 'assets/images/background/restaurant-placeholder.png';
    }
  })

  handleImageError() {
    this.isError.update((c) => true);
  }
}
