import { TestBed, ComponentFixture } from '@angular/core/testing';
import { IndicatorSelectComponent } from './indicator-selector.component';
import { NgicimrsSharedModule } from 'src/app/shared/ngicimrs-shared.module';

describe('Indicator-range component Tests', () => {
    let comp: IndicatorSelectComponent;
    let fixture: ComponentFixture<IndicatorSelectComponent>;

    beforeEach(async() => {
        TestBed.configureTestingModule({
            imports: [
                NgicimrsSharedModule
            ],
            declarations: [IndicatorSelectComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(IndicatorSelectComponent);
        comp = fixture.componentInstance;
    });

    it('should be defined', () => {
        expect(comp).toBeDefined();
    });

    it('should have required properties', () => {
        expect(comp.selectedIndicators).toBeDefined();
        expect(comp.indicatorOptions).toBeUndefined();
    });

    it('should have methods defined and callable', () => {
        expect(comp.onIndicatorSelected).toBeDefined();
        expect(comp.getIndicators).toBeDefined();
        expect(comp.selectAll).toBeDefined();

        const selectedIndicators = ['T', 'A', 'D'];
        comp.onIndicatorSelected(selectedIndicators);
        expect(comp.selectedIndicators).toBe(selectedIndicators);

        comp.indicators = ['test inicator'];
        comp.getIndicators();
        expect(comp.indicatorOptions).toEqual(['test inicator']);

    });

});
