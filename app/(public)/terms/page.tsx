import React from "react";
import Link from "next/link";

export const metadata = {
  title: "Terms of Service | RentNest",
  description: "Terms and conditions for using RentNest.",
};

export default function TermsPage() {
  return (
    <div className="w-full flex flex-col bg-background min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 w-full">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold font-heading text-foreground tracking-tight mb-4">
            Terms of Service
          </h1>
          <p className="text-muted-foreground">Last Updated: August 11, 2026</p>
        </div>

        <div className="prose prose-slate dark:prose-invert max-w-none prose-headings:font-heading prose-headings:font-bold prose-h2:text-2xl prose-a:text-primary">
          <p>
            Welcome to RentNest. Please read these Terms of Service ("Terms", "Terms of Service") carefully before using the RentNest website (the "Service") operated by RentNest Technologies Ltd. ("us", "we", or "our").
          </p>
          <p>
            Your access to and use of the Service is conditioned on your acceptance of and compliance with these Terms. These Terms apply to all visitors, users, tenants, landlords, and others who access or use the Service in Bangladesh.
          </p>

          <h2>1. Platform Description</h2>
          <p>
            RentNest is a technology platform that connects tenants seeking rental accommodations with landlords offering properties for rent. We provide tools for searching properties, submitting applications, and managing rental agreements. 
          </p>
          <p>
            <strong>RentNest is not a real estate agency or broker.</strong> We do not own, manage, or control any of the properties listed on the platform. All lease agreements are strictly between the Tenant and the Landlord.
          </p>

          <h2>2. User Accounts & Verification</h2>
          <p>
            When you create an account with us, you must provide information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account.
          </p>
          <ul>
            <li><strong>Tenants:</strong> You may be required to verify your identity (e.g., NID) before applying for certain properties to maintain platform safety.</li>
            <li><strong>Landlords:</strong> You must have the legal right to rent out the properties you list. We reserve the right to request proof of ownership or authorization.</li>
          </ul>

          <h2>3. Content & Listings</h2>
          <p>
            Landlords are responsible for the accuracy of their listings, including prices, availability, unit sizes, utility policies (WASA, gas, generator), and photographs. Any attempt to misrepresent a property (e.g., uploading fake images, obscuring hidden fees) is strictly prohibited.
          </p>

          <h2>4. Payments & Fees</h2>
          <p>
            RentNest may charge service fees for specific premium features. However, listing your first properties and basic tenant searches are free. We process payments through secure local gateways (bKash, Nagad, Card networks). You agree to pay all applicable fees related to the services you consume on the platform.
          </p>

          <h2>5. Prohibited Activities</h2>
          <p>
            You agree not to engage in any of the following prohibited activities:
          </p>
          <ul>
            <li>Bypassing or attempting to bypass platform security measures.</li>
            <li>Using the platform for any illegal purpose, including fraud or money laundering.</li>
            <li>Scraping data, listing information, or user details without our explicit written consent.</li>
            <li>Harassing, threatening, or discriminating against other users on the basis of race, religion, gender, or nationality.</li>
          </ul>

          <h2>6. Limitation of Liability</h2>
          <p>
            In no event shall RentNest, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.
          </p>

          <h2>7. Changes</h2>
          <p>
            We reserve the right, at our sole discretion, to modify or replace these Terms at any time. What constitutes a material change will be determined at our sole discretion. By continuing to access or use our Service after those revisions become effective, you agree to be bound by the revised terms.
          </p>

          <h2>8. Contact Us</h2>
          <p>
            If you have any questions about these Terms, please <Link href="/contact">contact us</Link>.
          </p>
        </div>
      </div>
    </div>
  );
}
