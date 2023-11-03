import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IJobDescriptor } from '../job-descriptor.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../job-descriptor.test-samples';

import { JobDescriptorService } from './job-descriptor.service';

const requireRestSample: IJobDescriptor = {
  ...sampleWithRequiredData,
};

describe('JobDescriptor Service', () => {
  let service: JobDescriptorService;
  let httpMock: HttpTestingController;
  let expectedResult: IJobDescriptor | IJobDescriptor[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(JobDescriptorService);
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

    it('should create a JobDescriptor', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const jobDescriptor = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(jobDescriptor).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a JobDescriptor', () => {
      const jobDescriptor = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(jobDescriptor).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a JobDescriptor', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of JobDescriptor', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a JobDescriptor', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addJobDescriptorToCollectionIfMissing', () => {
      it('should add a JobDescriptor to an empty array', () => {
        const jobDescriptor: IJobDescriptor = sampleWithRequiredData;
        expectedResult = service.addJobDescriptorToCollectionIfMissing([], jobDescriptor);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(jobDescriptor);
      });

      it('should not add a JobDescriptor to an array that contains it', () => {
        const jobDescriptor: IJobDescriptor = sampleWithRequiredData;
        const jobDescriptorCollection: IJobDescriptor[] = [
          {
            ...jobDescriptor,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addJobDescriptorToCollectionIfMissing(jobDescriptorCollection, jobDescriptor);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a JobDescriptor to an array that doesn't contain it", () => {
        const jobDescriptor: IJobDescriptor = sampleWithRequiredData;
        const jobDescriptorCollection: IJobDescriptor[] = [sampleWithPartialData];
        expectedResult = service.addJobDescriptorToCollectionIfMissing(jobDescriptorCollection, jobDescriptor);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(jobDescriptor);
      });

      it('should add only unique JobDescriptor to an array', () => {
        const jobDescriptorArray: IJobDescriptor[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const jobDescriptorCollection: IJobDescriptor[] = [sampleWithRequiredData];
        expectedResult = service.addJobDescriptorToCollectionIfMissing(jobDescriptorCollection, ...jobDescriptorArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const jobDescriptor: IJobDescriptor = sampleWithRequiredData;
        const jobDescriptor2: IJobDescriptor = sampleWithPartialData;
        expectedResult = service.addJobDescriptorToCollectionIfMissing([], jobDescriptor, jobDescriptor2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(jobDescriptor);
        expect(expectedResult).toContain(jobDescriptor2);
      });

      it('should accept null and undefined values', () => {
        const jobDescriptor: IJobDescriptor = sampleWithRequiredData;
        expectedResult = service.addJobDescriptorToCollectionIfMissing([], null, jobDescriptor, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(jobDescriptor);
      });

      it('should return initial array if no JobDescriptor is added', () => {
        const jobDescriptorCollection: IJobDescriptor[] = [sampleWithRequiredData];
        expectedResult = service.addJobDescriptorToCollectionIfMissing(jobDescriptorCollection, undefined, null);
        expect(expectedResult).toEqual(jobDescriptorCollection);
      });
    });

    describe('compareJobDescriptor', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareJobDescriptor(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareJobDescriptor(entity1, entity2);
        const compareResult2 = service.compareJobDescriptor(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareJobDescriptor(entity1, entity2);
        const compareResult2 = service.compareJobDescriptor(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareJobDescriptor(entity1, entity2);
        const compareResult2 = service.compareJobDescriptor(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
