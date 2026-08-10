"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Property } from "@/types";

interface PropertyContextType {
  property: Property;
  setProperty: React.Dispatch<React.SetStateAction<Property>>;
}

const PropertyContext = createContext<PropertyContextType | undefined>(undefined);

export function PropertyProvider({
  initialProperty,
  children,
}: {
  initialProperty: Property;
  children: React.ReactNode;
}) {
  const [property, setProperty] = useState<Property>(initialProperty);

  // Sync state if layout refetches and passes a new property object
  useEffect(() => {
    setProperty(initialProperty);
  }, [initialProperty]);

  return (
    <PropertyContext.Provider value={{ property, setProperty }}>
      {children}
    </PropertyContext.Provider>
  );
}

export function usePropertyContext() {
  const context = useContext(PropertyContext);
  if (context === undefined) {
    throw new Error("usePropertyContext must be used within a PropertyProvider");
  }
  return context;
}
