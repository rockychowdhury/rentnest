"use server";

export interface TenantProfileMock {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  avatarUrl: string | null;
  nid: string | null;
  nidVisibility: boolean;
  emergencyContact: {
    name: string;
    phone: string;
    relation: string;
  } | null;
  rentalHistory: {
    totalLeases: number;
    onTimePaymentsPercentage: number;
    avgReviewScore: number | null;
  };
}

export async function getTenantProfile(): Promise<{ success: boolean; data: TenantProfileMock }> {
  // Mock data for profile
  return {
    success: true,
    data: {
      id: "usr-123",
      fullName: "Tanent User",
      email: "tanent@gmail.com",
      phone: "01711111111",
      avatarUrl: null,
      nid: "1234567890",
      nidVisibility: true,
      emergencyContact: {
        name: "Brother User",
        phone: "01822222222",
        relation: "Brother"
      },
      rentalHistory: {
        totalLeases: 3,
        onTimePaymentsPercentage: 98,
        avgReviewScore: 4.8,
      }
    }
  };
}
