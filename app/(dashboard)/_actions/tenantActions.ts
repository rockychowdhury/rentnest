"use server";

// Mock data for Tenant Dashboard

export async function getTenantOverview() {
  // Mocking the scenario where the tenant has no active lease and no payment due
  // Change these booleans to test different UI states
  const hasActiveLease = false;
  const isPaymentDue = false;

  return {
    success: true,
    data: {
      hasActiveLease,
      isPaymentDue,
      upcomingPayment: isPaymentDue ? {
        amount: 25000,
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days from now
        leaseId: "mock-lease-1"
      } : null,
      stats: {
        pendingApplications: 1,
        savedProperties: 4,
      },
      recentActivity: [
        {
          id: "act-1",
          type: "APPLICATION_UPDATE",
          title: "Application Under Review",
          description: "Your application for 4-Bed Apartment in Mirpur is being reviewed.",
          date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
        },
        {
          id: "act-2",
          type: "FAVORITE_ADDED",
          title: "Saved Property",
          description: "You saved Cozy 2-Bed Apartment.",
          date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
        }
      ]
    }
  };
}
