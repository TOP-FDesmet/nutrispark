"use client";

import { useRouter } from "next/navigation";

import { IFoodReduced, IFood } from "@/types";

import { useEffect, useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
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

export default function Home() {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [foods, setFoods] = useState<IFoodReduced[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchFoods = async () => {
    try {
      const reponse = await fetch("/api/foods/all");
      const data = await reponse.json();
      const foodsReduced: IFoodReduced[] = data.map((food: IFood) => ({
        value: food.name.toLowerCase().replace(/ /g, "-"),
        label: food.name,
      }));
      setFoods(foodsReduced);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const initialize = async () => {
      await fetchFoods();
      setIsLoading(false);
    };
    initialize();
  }, []);

  useEffect(() => {
    if (value.length > 0) {
      router.push(`/food/${value}`);
    }
  }, [value]);

  return (
    <>
      {!isLoading ? (
        <div className="flex flex-col items-center justify-center min-h-screen p-6">
          <h1 className="text-5xl font-extrabold mb-4">
            Welcome to <span className="title_colored">Nutrispark</span>
          </h1>
          <p className="text-lg mb-8 text-center max-w-2xl">
            Discover the nutritional values of your favorite foods. Use the
            search below to get started.
          </p>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-[300px] justify-between"
              >
                {value
                  ? foods.find((food) => food.value === value)?.label
                  : "Select food..."}
                <ChevronsUpDown className="opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] p-0">
              <Command>
                <CommandInput placeholder="Search food..." className="h-9" />
                <CommandList>
                  <CommandEmpty>No food found.</CommandEmpty>
                  <CommandGroup>
                    {foods.map((food) => (
                      <CommandItem
                        key={food.value}
                        value={food.value}
                        onSelect={(currentValue) => {
                          setValue(currentValue === value ? "" : currentValue);
                          setOpen(false);
                        }}
                      >
                        {food.label}
                        <Check
                          className={cn(
                            "ml-auto",
                            value === food.value ? "opacity-100" : "opacity-0"
                          )}
                        />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
      ) : (
        <div className="flex items-center justify-center h-screen">
          <p>Loading...</p>
        </div>
      )}
    </>
  );
}
