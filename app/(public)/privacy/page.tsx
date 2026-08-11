import React from "react";
import Link from "next/link";

export const metadata = {
  title: "Privacy Policy | RentNest",
  description: "How RentNest collects, uses, and protects your data.",
};

export default function PrivacyPage() {
  return (
    <div className="w-full flex flex-col bg-background min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 w-full">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold font-heading text-foreground tracking-tight mb-4">
            Privacy Policy
          </h1>
          <p className="text-muted-foreground">Last Updated: August 11, 2026</p>
        </div>

        <div className="prose prose-slate dark:prose-invert max-w-none prose-headings:font-heading prose-headings:font-bold prose-h2:text-2xl prose-a:text-primary">
          <p>
            RentNest Technologies Ltd. ("us", "we", or "our") operates the RentNest platform. This page informs you of our policies regarding the collection, use, and disclosure of personal data when you use our Service and the choices you have associated with that data.
          </p>
          <p>
            We use your data to provide and improve the Service. By using the Service, you agree to the collection and use of information in accordance with this policy.
          </p>

          <h2>1. Information Collection and Use</h2>
          <p>
            We collect several different types of information for various purposes to provide and improve our Service to you.
          </p>
          
          <h3>Types of Data Collected:</h3>
          <ul>
            <li>
              <strong>Personal Data:</strong> While using our Service, we may ask you to provide us with certain personally identifiable information that can be used to contact or identify you. This may include, but is not limited to: Email address, First name and last name, Phone number, NID/Passport details (for verification), and Address.
            </li>
            <li>
              <strong>Usage Data:</strong> We may also collect information on how the Service is accessed and used. This may include information such as your computer's IP address, browser type, browser version, the pages of our Service that you visit, the time and date of your visit, and other diagnostic data.
            </li>
            <li>
              <strong>Tracking & Cookies Data:</strong> We use cookies and similar tracking technologies to track the activity on our Service and hold certain information. You can instruct your browser to refuse all cookies, but if you do not accept cookies, you may not be able to use some portions of our Service.
            </li>
          </ul>

          <h2>2. Use of Data</h2>
          <p>RentNest uses the collected data for various purposes:</p>
          <ul>
            <li>To provide and maintain the Service</li>
            <li>To notify you about changes to our Service</li>
            <li>To allow you to participate in interactive features of our Service when you choose to do so</li>
            <li>To provide customer care and support</li>
            <li>To monitor the usage of the Service</li>
            <li>To detect, prevent and address technical issues</li>
            <li>To verify the identity of landlords and tenants to maintain platform safety</li>
          </ul>

          <h2>3. Transfer of Data</h2>
          <p>
            Your information, including Personal Data, may be transferred to — and maintained on — computers located outside of your state, province, country or other governmental jurisdiction where the data protection laws may differ than those from your jurisdiction.
          </p>
          <p>
            If you are located outside Bangladesh and choose to provide information to us, please note that we transfer the data, including Personal Data, to secure cloud servers and process it there. Your consent to this Privacy Policy followed by your submission of such information represents your agreement to that transfer.
          </p>

          <h2>4. Disclosure of Data</h2>
          <p>We may disclose your Personal Data in the good faith belief that such action is necessary to:</p>
          <ul>
            <li>To comply with a legal obligation</li>
            <li>To protect and defend the rights or property of RentNest</li>
            <li>To prevent or investigate possible wrongdoing in connection with the Service</li>
            <li>To protect the personal safety of users of the Service or the public</li>
            <li>To protect against legal liability</li>
          </ul>

          <h2>5. Security of Data</h2>
          <p>
            The security of your data is important to us, but remember that no method of transmission over the Internet, or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your Personal Data, we cannot guarantee its absolute security.
          </p>

          <h2>6. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please <Link href="/contact">contact us</Link>.
          </p>
        </div>
      </div>
    </div>
  );
}
