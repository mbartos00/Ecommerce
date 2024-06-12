import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterModule } from '@angular/router';
import { BestsellerSectionComponent } from './bestseller-section.component';
import { ProductCardComponent } from '../ui/product-card/product-card.component';
import { HlmSpinnerComponent } from '../ui/ui-spinner-helm/src';
import { of } from 'rxjs';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';
import 'zone.js';
import { HttpClient } from '@angular/common/http';
import { CategoryService } from '../data-access/category.service';

TestBed.initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting()
);

describe('BestsellerSectionComponent', () => {
  let component: BestsellerSectionComponent;
  let fixture: ComponentFixture<BestsellerSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterModule.forRoot([]),
        BestsellerSectionComponent,
        ProductCardComponent,
        HlmSpinnerComponent,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BestsellerSectionComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set active tab index', () => {
    component.setActiveTabIndex(2);
    expect(component.activeTabIndex).toBe(2);
  });

  it('should fetch products for all categories if active tab index is 0', () => {
    component.setActiveTabIndex(0);
    expect(component.products$).toBeTruthy();
  });

  it('should fetch products for a specific category if active tab index is not 0', () => {
    const mockCategory = { id: '1', name: 'Category 1' };
    component.categories = [mockCategory];
    component.setActiveTabIndex(1);
    expect(component.products$).toBeTruthy();
  });

  it('should fetch products', () => {
    const mockProducts = {
      data: [
        {
          productDetails: {
            name: 'Product 1',
            price: 10,
          },
        },
        {
          productDetails: {
            name: 'Product 2',
            price: 20,
          },
        },
      ],
    };

    const httpMock = TestBed.inject(HttpClient);
    jest.spyOn(httpMock, 'get').mockReturnValue(of(mockProducts));

    component.fetchProducts();

    component.products$.subscribe(products => {
      expect(products).toEqual(mockProducts);
    });
  });
  it('should fetch categories successfully', () => {
    const mockCategories = [
      { id: '1', name: 'Category 1' },
      { id: '2', name: 'Category 2' },
    ];
    const categoryService = TestBed.inject(CategoryService);
    jest
      .spyOn(categoryService, 'getCategories')
      .mockReturnValue(of(mockCategories));

    component.fetchCategories();

    expect(component.categories).toEqual([
      { id: 'all', name: 'All' },
      ...mockCategories,
    ]);
  });
  it('should fetch products for all categories if active tab index is 0 or no categories are available', () => {
    component.activeTabIndex = 0;
    component.fetchProducts();
    expect(component.products$).toBeTruthy();

    component.activeTabIndex = 1;
    component.categories = [];
    component.fetchProducts();
    expect(component.products$).toBeTruthy();
  });

  it('should fetch products for a specific category if active tab index is not 0 and categories are available', () => {
    const mockCategory = { id: '1', name: 'Category 1' };
    component.activeTabIndex = 1;
    component.categories = [mockCategory];
    component.fetchProducts();
    expect(component.products$).toBeTruthy();
  });
});
