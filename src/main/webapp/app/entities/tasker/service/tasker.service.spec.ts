import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ITasker } from '../tasker.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../tasker.test-samples';

import { TaskerService } from './tasker.service';

const requireRestSample: ITasker = {
  ...sampleWithRequiredData,
};

describe('Tasker Service', () => {
  let service: TaskerService;
  let httpMock: HttpTestingController;
  let expectedResult: ITasker | ITasker[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(TaskerService);
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

    it('should create a Tasker', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const tasker = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(tasker).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Tasker', () => {
      const tasker = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(tasker).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Tasker', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Tasker', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Tasker', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addTaskerToCollectionIfMissing', () => {
      it('should add a Tasker to an empty array', () => {
        const tasker: ITasker = sampleWithRequiredData;
        expectedResult = service.addTaskerToCollectionIfMissing([], tasker);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(tasker);
      });

      it('should not add a Tasker to an array that contains it', () => {
        const tasker: ITasker = sampleWithRequiredData;
        const taskerCollection: ITasker[] = [
          {
            ...tasker,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addTaskerToCollectionIfMissing(taskerCollection, tasker);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Tasker to an array that doesn't contain it", () => {
        const tasker: ITasker = sampleWithRequiredData;
        const taskerCollection: ITasker[] = [sampleWithPartialData];
        expectedResult = service.addTaskerToCollectionIfMissing(taskerCollection, tasker);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(tasker);
      });

      it('should add only unique Tasker to an array', () => {
        const taskerArray: ITasker[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const taskerCollection: ITasker[] = [sampleWithRequiredData];
        expectedResult = service.addTaskerToCollectionIfMissing(taskerCollection, ...taskerArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const tasker: ITasker = sampleWithRequiredData;
        const tasker2: ITasker = sampleWithPartialData;
        expectedResult = service.addTaskerToCollectionIfMissing([], tasker, tasker2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(tasker);
        expect(expectedResult).toContain(tasker2);
      });

      it('should accept null and undefined values', () => {
        const tasker: ITasker = sampleWithRequiredData;
        expectedResult = service.addTaskerToCollectionIfMissing([], null, tasker, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(tasker);
      });

      it('should return initial array if no Tasker is added', () => {
        const taskerCollection: ITasker[] = [sampleWithRequiredData];
        expectedResult = service.addTaskerToCollectionIfMissing(taskerCollection, undefined, null);
        expect(expectedResult).toEqual(taskerCollection);
      });
    });

    describe('compareTasker', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareTasker(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareTasker(entity1, entity2);
        const compareResult2 = service.compareTasker(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareTasker(entity1, entity2);
        const compareResult2 = service.compareTasker(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareTasker(entity1, entity2);
        const compareResult2 = service.compareTasker(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
