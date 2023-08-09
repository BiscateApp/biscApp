import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IPortfolio } from '../portfolio.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../portfolio.test-samples';

import { PortfolioService } from './portfolio.service';

const requireRestSample: IPortfolio = {
  ...sampleWithRequiredData,
};

describe('Portfolio Service', () => {
  let service: PortfolioService;
  let httpMock: HttpTestingController;
  let expectedResult: IPortfolio | IPortfolio[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(PortfolioService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should create a Portfolio', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const portfolio = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(portfolio).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Portfolio', () => {
      const portfolio = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(portfolio).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Portfolio', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Portfolio', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Portfolio', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addPortfolioToCollectionIfMissing', () => {
      it('should add a Portfolio to an empty array', () => {
        const portfolio: IPortfolio = sampleWithRequiredData;
        expectedResult = service.addPortfolioToCollectionIfMissing([], portfolio);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(portfolio);
      });

      it('should not add a Portfolio to an array that contains it', () => {
        const portfolio: IPortfolio = sampleWithRequiredData;
        const portfolioCollection: IPortfolio[] = [
          {
            ...portfolio,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addPortfolioToCollectionIfMissing(portfolioCollection, portfolio);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Portfolio to an array that doesn't contain it", () => {
        const portfolio: IPortfolio = sampleWithRequiredData;
        const portfolioCollection: IPortfolio[] = [sampleWithPartialData];
        expectedResult = service.addPortfolioToCollectionIfMissing(portfolioCollection, portfolio);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(portfolio);
      });

      it('should add only unique Portfolio to an array', () => {
        const portfolioArray: IPortfolio[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const portfolioCollection: IPortfolio[] = [sampleWithRequiredData];
        expectedResult = service.addPortfolioToCollectionIfMissing(portfolioCollection, ...portfolioArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const portfolio: IPortfolio = sampleWithRequiredData;
        const portfolio2: IPortfolio = sampleWithPartialData;
        expectedResult = service.addPortfolioToCollectionIfMissing([], portfolio, portfolio2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(portfolio);
        expect(expectedResult).toContain(portfolio2);
      });

      it('should accept null and undefined values', () => {
        const portfolio: IPortfolio = sampleWithRequiredData;
        expectedResult = service.addPortfolioToCollectionIfMissing([], null, portfolio, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(portfolio);
      });

      it('should return initial array if no Portfolio is added', () => {
        const portfolioCollection: IPortfolio[] = [sampleWithRequiredData];
        expectedResult = service.addPortfolioToCollectionIfMissing(portfolioCollection, undefined, null);
        expect(expectedResult).toEqual(portfolioCollection);
      });
    });

    describe('comparePortfolio', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.comparePortfolio(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.comparePortfolio(entity1, entity2);
        const compareResult2 = service.comparePortfolio(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.comparePortfolio(entity1, entity2);
        const compareResult2 = service.comparePortfolio(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.comparePortfolio(entity1, entity2);
        const compareResult2 = service.comparePortfolio(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
