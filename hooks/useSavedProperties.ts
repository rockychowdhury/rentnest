import { useState, useEffect } from "react";
import { PropertyItem } from "@/service/getProperties";

const SAVED_PROPERTIES_KEY = "rentnest_saved_properties";

export function useSavedProperties() {
  const [savedProperties, setSavedProperties] = useState<PropertyItem[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(SAVED_PROPERTIES_KEY);
      if (stored) {
        setSavedProperties(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to parse saved properties from local storage");
    }
  }, []);

  const toggleSave = (property: PropertyItem) => {
    setSavedProperties((prev) => {
      let next;
      const isAlreadySaved = prev.some((p) => p.id === property.id);
      if (isAlreadySaved) {
        next = prev.filter((p) => p.id !== property.id);
      } else {
        next = [...prev, property];
      }
      localStorage.setItem(SAVED_PROPERTIES_KEY, JSON.stringify(next));
      return next;
    });
  };

  const isSaved = (propertyId: string) => {
    return savedProperties.some((p) => p.id === propertyId);
  };

  return { savedProperties, toggleSave, isSaved };
}
