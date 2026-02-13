import {
  Directive,
  Input,
  TemplateRef,
  ViewContainerRef,
  inject,
  effect,
} from '@angular/core';
import { CircuitService } from '../circuit-service/circuit.service';

@Directive({
  selector: '[cktCircuit]',
  standalone: true,
})
export class CircuitDirective {
  private templateRef = inject(TemplateRef<unknown>);
  private viewContainer = inject(ViewContainerRef);
  private circuitService = inject(CircuitService);

  private _featureName = '';
  private _elseTemplate: TemplateRef<unknown> | null = null;

  @Input()
  set cktCircuit(name: string) {
    this._featureName = name;
  }

  @Input()
  set cktCircuitElse(tpl: TemplateRef<unknown> | null) {
    this._elseTemplate = tpl;
  }

  constructor() {
    effect(() => {
      const isEnabled = this.circuitService.isEnabled(this._featureName);

      this.viewContainer.clear();

      if (isEnabled) {
        this.viewContainer.createEmbeddedView(this.templateRef);
      } else if (this._elseTemplate) {
        this.viewContainer.createEmbeddedView(this._elseTemplate);
      }
    });
  }
}
