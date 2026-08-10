"use client";

import * as React from "react";
import { Check, ChevronsUpDown, Loader2, MapPin } from "lucide-react";

import { cn } from "@/lib/utils/shadcnUtils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { searchAreasGlobally } from "@/app/(dashboard)/_actions/addressActions";

export interface Area {
  id: number;
  name: string;
  districtId: number;
  district: {
    name: string;
    division: {
      name: string;
    };
  };
}

interface AreaSearchComboboxProps {
  value: string; // areaId
  onChange: (areaId: string, areaName: string) => void;
  defaultAreaName?: string;
  className?: string;
}

export function AreaSearchCombobox({
  value,
  onChange,
  defaultAreaName = "",
  className,
}: AreaSearchComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");
  const debouncedInput = useDebouncedValue(inputValue, 300);

  const [areas, setAreas] = React.useState<Area[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);

  // Used for displaying the selected value when the popover is closed
  const [selectedName, setSelectedName] = React.useState<string>(defaultAreaName);

  React.useEffect(() => {
    // If the input is too short, clear options
    if (debouncedInput.length < 2) {
      setAreas([]);
      return;
    }

    let isMounted = true;

    const searchAreas = async () => {
      setIsLoading(true);
      try {
        const res = await searchAreasGlobally(debouncedInput);
        if (isMounted && res.success) {
          setAreas(res.data || []);
        }
      } catch (error) {
        console.error("Failed to search areas:", error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    searchAreas();

    return () => {
      isMounted = false;
    };
  }, [debouncedInput]);

  // Sync selectedName if value prop is cleared externally
  React.useEffect(() => {
    if (!value) {
      setSelectedName("");
    } else if (defaultAreaName && !selectedName) {
      setSelectedName(defaultAreaName);
    }
  }, [value, defaultAreaName]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn(
              "w-full justify-between h-9 px-3 text-xs border-border shadow-sm",
              !value && "text-muted-foreground",
              className
            )}
          />
        }
      >
        <div className="flex items-center gap-2 truncate">
          <MapPin className="size-3.5 shrink-0 opacity-50" />
          <span className="truncate font-normal">
            {value && selectedName ? selectedName : "Any Location"}
          </span>
        </div>
        <ChevronsUpDown className="ml-2 size-3.5 shrink-0 opacity-50" />
      </PopoverTrigger>
      <PopoverContent className="w-[300px] sm:w-[350px] p-0 shadow-lg" align="start">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Type area, district, or division..."
            value={inputValue}
            onValueChange={setInputValue}
            className="text-xs h-10"
          />
          <CommandList className="max-h-[250px]">
            {isLoading && (
              <div className="flex items-center justify-center p-4">
                <Loader2 className="size-4 animate-spin text-muted-foreground" />
              </div>
            )}
            {!isLoading && inputValue.length > 0 && inputValue.length < 2 && (
              <div className="p-4 text-center text-xs text-muted-foreground">
                Type at least 2 characters...
              </div>
            )}
            {!isLoading && areas.length === 0 && inputValue.length >= 2 && (
              <CommandEmpty className="text-xs py-4">No location found.</CommandEmpty>
            )}
            <CommandGroup>
              {areas.map((area) => {
                const isSelected = value === area.id.toString();
                
                return (
                  <CommandItem
                    key={area.id}
                    value={area.id.toString()}
                    onSelect={() => {
                      onChange(area.id.toString(), area.name);
                      setSelectedName(area.name);
                      setOpen(false);
                      setInputValue("");
                    }}
                    className="text-xs py-2 px-2.5 cursor-pointer"
                  >
                    <Check
                      className={cn(
                        "mr-2 size-3.5 shrink-0 text-primary",
                        isSelected ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <div className="flex flex-col truncate gap-0.5">
                      <span className="font-medium text-foreground truncate">
                        {area.name}
                      </span>
                      <span className="text-[10px] text-muted-foreground truncate">
                        {area.district.name}, {area.district.division.name}
                      </span>
                    </div>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
