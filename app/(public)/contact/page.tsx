"use client";

import React from "react";
import { Mail, MapPin, Phone, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";


export default function ContactPage() {
  return (
    <div className="w-full flex flex-col bg-background min-h-screen">
      
      {/* Hero Section */}
      <section className="relative py-20 bg-primary/5 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold font-heading text-foreground tracking-tight mb-4">
            We&apos;re here to help
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Have a question about a property? Need help setting up your landlord account? Reach out to our dedicated support team.
          </p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            
            {/* Contact Form */}
            <div className="bg-card p-8 rounded-2xl border border-border shadow-sm">
              <h2 className="text-2xl font-bold font-heading mb-6">Send us a message</h2>
              <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="firstName" className="text-sm font-medium text-foreground">First Name</label>
                    <input type="text" id="firstName" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" placeholder="Rahim" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="lastName" className="text-sm font-medium text-foreground">Last Name</label>
                    <input type="text" id="lastName" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" placeholder="Uddin" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-foreground">Email Address</label>
                  <input type="email" id="email" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" placeholder="hello@example.com" />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="subject" className="text-sm font-medium text-foreground">Subject</label>
                  <select id="subject" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                    <option>General Inquiry</option>
                    <option>Support for Tenants</option>
                    <option>Support for Landlords</option>
                    <option>Billing Question</option>
                    <option>Report an Issue</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium text-foreground">Message</label>
                  <textarea id="message" rows={5} className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none" placeholder="How can we help you?"></textarea>
                </div>
                
                <Button type="submit" className="w-full h-11 text-base font-semibold">
                  Send Message
                </Button>
              </form>
            </div>
            
            {/* Contact Info */}
            <div className="space-y-10">
              <div>
                <h3 className="text-xl font-bold font-heading mb-6">Other ways to connect</h3>
                <div className="space-y-6">
                  
                  <div className="flex items-start gap-4">
                    <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <Mail className="size-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground text-base">Email Support</h4>
                      <p className="text-muted-foreground text-sm mt-1 mb-1">Our team typically responds within 2 hours.</p>
                      <a href="mailto:support@rentnest.com.bd" className="text-primary font-medium hover:underline text-sm">support@rentnest.com.bd</a>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <Phone className="size-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground text-base">Phone Support</h4>
                      <p className="text-muted-foreground text-sm mt-1 mb-1">Available Sunday–Thursday, 9am–6pm BST.</p>
                      <a href="tel:+8801234567890" className="text-primary font-medium hover:underline text-sm">+880 1234-567890</a>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <MessageSquare className="size-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground text-base">Live Chat</h4>
                      <p className="text-muted-foreground text-sm mt-1 mb-1">Available from your Tenant or Landlord dashboard.</p>
                      <span className="text-primary font-medium text-sm">Go to Dashboard</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <MapPin className="size-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground text-base">Headquarters</h4>
                      <p className="text-muted-foreground text-sm mt-1 leading-relaxed">
                        RentNest Technologies Ltd.<br />
                        Road 11, Banani<br />
                        Dhaka 1213, Bangladesh
                      </p>
                    </div>
                  </div>

                </div>
              </div>
            </div>
            
          </div>
        </div>
      </section>
      
    </div>
  );
}
