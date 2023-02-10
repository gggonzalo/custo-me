import { Component, Input } from '@angular/core';
import { Character } from '../models/Character';

@Component({
  selector: 'character-card',
  templateUrl: './character-card.component.html',
  styleUrls: ['./character-card.component.scss']
})
export class CharacterCardComponent {
  @Input()
  character!: Character;
}
