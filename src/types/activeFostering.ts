/**
 * Represents the possible fostering statuses.

 */
export type FosteringStatus = "Active" | "Completed" | "Canceled";

/**
 * Represents the fostering record returned by the backend
 * after successfully creating a new fostering.
 *
 */
export interface ActiveFostering {
  id: string;
  animalId: string;
  userId: string;
  amount: number;
  status: FosteringStatus;
  startDate: string;
  endDate?: string | null;
  updatedAt?: string | null;
}
