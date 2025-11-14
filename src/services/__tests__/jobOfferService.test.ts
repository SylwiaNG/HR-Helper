import { JobOfferCreateCommand, JobOfferUpdateCommand } from '@/types';

// Create mock functions that will be used in tests
let mockSingle: jest.Mock;
let mockSelect: jest.Mock;
let mockEq: jest.Mock;
let mockInsert: jest.Mock;
let mockUpdate: jest.Mock;
let mockDelete: jest.Mock;
let mockFrom: jest.Mock;

// Mock Supabase client
jest.mock('@/lib/supabase/client', () => ({
  createClient: jest.fn(() => ({
    from: (...args: unknown[]) => {
      // Call the mockFrom function that will be initialized in beforeEach
      if (!mockFrom) {
        throw new Error('mockFrom not initialized');
      }
      return mockFrom(...args);
    },
  })),
}));

// Import after mocking
import { jobOfferService } from '../jobOfferService';

describe('jobOfferService', () => {
  beforeEach(() => {
    // Initialize all mocks
    mockSingle = jest.fn();
    mockSelect = jest.fn();
    mockEq = jest.fn();
    mockInsert = jest.fn();
    mockUpdate = jest.fn();
    mockDelete = jest.fn();
    mockFrom = jest.fn();
    
    // Setup default chain
    mockSingle.mockReturnValue({ data: null, error: null });
    mockEq.mockReturnValue({ select: mockSelect, single: mockSingle });
    mockSelect.mockReturnValue({ eq: mockEq, single: mockSingle });
    mockInsert.mockReturnValue({ select: mockSelect });
    mockUpdate.mockReturnValue({ eq: mockEq });
    mockDelete.mockReturnValue({ eq: mockEq });
    mockFrom.mockReturnValue({
      select: mockSelect,
      insert: mockInsert,
      update: mockUpdate,
      delete: mockDelete,
    });
  });

  describe('createJobOffer', () => {
    it('should create a new job offer successfully', async () => {
      const mockJobOffer: JobOfferCreateCommand = {
        user_id: 'test-user-id',
        title: 'Senior Developer',
        description: 'Test description',
        keywords: ['React', 'TypeScript'],
      };

      const mockResponse = {
        id: 1,
        ...mockJobOffer,
        created_at: new Date().toISOString(),
      };

      mockSingle.mockResolvedValue({
        data: mockResponse,
        error: null,
      });

      const result = await jobOfferService.createJobOffer(mockJobOffer);

      expect(result).toEqual(mockResponse);
      expect(mockFrom).toHaveBeenCalledWith('job_offers');
    });

    it('should throw error when creation fails', async () => {
      const mockJobOffer: JobOfferCreateCommand = {
        user_id: 'test-user-id',
        title: 'Senior Developer',
      };

      mockSingle.mockResolvedValue({
        data: null,
        error: { message: 'Database error' },
      });

      await expect(jobOfferService.createJobOffer(mockJobOffer)).rejects.toThrow(
        'Database error'
      );
    });
  });

  describe('getJobOffers', () => {
    it('should fetch all job offers successfully', async () => {
      const mockOffers = [
        {
          id: 1,
          user_id: 'test-user-id',
          title: 'Senior Developer',
          description: 'Test description',
          keywords: ['React', 'TypeScript'],
          created_at: new Date().toISOString(),
        },
        {
          id: 2,
          user_id: 'test-user-id',
          title: 'Junior Developer',
          description: null,
          keywords: ['JavaScript'],
          created_at: new Date().toISOString(),
        },
      ];

      // Mock the select method to return data directly
      const mockSelectFn = jest.fn().mockResolvedValue({
        data: mockOffers,
        error: null,
      });
      
      mockFrom.mockReturnValueOnce({
        select: mockSelectFn,
      });

      const result = await jobOfferService.getJobOffers();

      expect(result).toEqual(mockOffers);
      expect(mockFrom).toHaveBeenCalledWith('job_offers');
    });

    it('should throw error when fetch fails', async () => {
      const mockSelectFn = jest.fn().mockResolvedValue({
        data: null,
        error: { message: 'Database connection failed' },
      });
      
      mockFrom.mockReturnValueOnce({
        select: mockSelectFn,
      });

      await expect(jobOfferService.getJobOffers()).rejects.toThrow('Database connection failed');
    });
  });

  describe('getJobOfferById', () => {
    it('should fetch a specific job offer by id', async () => {
      const mockOffer = {
        id: 1,
        user_id: 'test-user-id',
        title: 'Senior Developer',
        description: 'Test description',
        keywords: ['React', 'TypeScript'],
        created_at: new Date().toISOString(),
      };

      mockSingle.mockResolvedValue({
        data: mockOffer,
        error: null,
      });

      const result = await jobOfferService.getJobOfferById(1);

      expect(result).toEqual(mockOffer);
      expect(mockFrom).toHaveBeenCalledWith('job_offers');
    });

    it('should return null when job offer not found', async () => {
      mockSingle.mockResolvedValue({
        data: null,
        error: { code: 'PGRST116' },
      });

      const result = await jobOfferService.getJobOfferById(999);

      expect(result).toBeNull();
    });

    it('should throw error for other database errors', async () => {
      mockSingle.mockResolvedValue({
        data: null,
        error: { code: 'OTHER_ERROR', message: 'Database error' },
      });

      await expect(jobOfferService.getJobOfferById(1)).rejects.toThrow(
        'Database error'
      );
    });
  });

  describe('updateJobOffer', () => {
    it('should update a job offer successfully', async () => {
      const updateData: JobOfferUpdateCommand = {
        title: 'Updated Title',
        keywords: ['React', 'TypeScript', 'Node.js'],
      };

      const mockUpdatedOffer = {
        id: 1,
        user_id: 'test-user-id',
        title: 'Updated Title',
        description: 'Original description',
        keywords: ['React', 'TypeScript', 'Node.js'],
        created_at: new Date().toISOString(),
      };

      mockSingle.mockResolvedValue({
        data: mockUpdatedOffer,
        error: null,
      });

      const result = await jobOfferService.updateJobOffer(1, updateData);

      expect(result).toEqual(mockUpdatedOffer);
      expect(mockFrom).toHaveBeenCalledWith('job_offers');
    });

    it('should throw error when update fails', async () => {
      const updateData: JobOfferUpdateCommand = {
        title: 'Updated Title',
      };

      mockSingle.mockResolvedValue({
        data: null,
        error: { message: 'Update failed' },
      });

      await expect(jobOfferService.updateJobOffer(1, updateData)).rejects.toThrow(
        'Update failed'
      );
    });
  });

  describe('deleteJobOffer', () => {
    it('should delete a job offer successfully', async () => {
      const mockEqFn = jest.fn().mockResolvedValue({
        error: null,
      });
      
      mockFrom.mockReturnValueOnce({
        delete: jest.fn().mockReturnValue({
          eq: mockEqFn,
        }),
      });

      const result = await jobOfferService.deleteJobOffer(1);

      expect(result).toBe(true);
      expect(mockFrom).toHaveBeenCalledWith('job_offers');
    });

    it('should throw error when delete fails', async () => {
      const mockEqFn = jest.fn().mockResolvedValue({
        error: { message: 'Delete failed' },
      });
      
      mockFrom.mockReturnValueOnce({
        delete: jest.fn().mockReturnValue({
          eq: mockEqFn,
        }),
      });

      await expect(jobOfferService.deleteJobOffer(1)).rejects.toThrow(
        'Delete failed'
      );
    });
  });
});
