
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Horse } from "@/types/horse";

interface HorseSearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectHorse: (horse: Horse) => void;
}

const HorseSearchDialog = ({ open, onOpenChange, onSelectHorse }: HorseSearchDialogProps) => {
  // Sample horse data - in real app this would come from API
  const horses: Horse[] = [
    { 
      id: "1", 
      name: "Midnight Approval", 
      yearOfBirth: 2022, 
      sex: "Colt", 
      color: "Bay",
      sire: "Sire Name",
      dam: "Dam Name",
      paternalGrandfather: "PG Father",
      paternalGrandmother: "PG Mother",
      maternalGrandfather: "MG Father",
      maternalGrandmother: "MG Mother",
      trainer: "Trainer Name",
      owner: "Owner Name"
    },
    { 
      id: "2", 
      name: "Thunder Strike", 
      yearOfBirth: 2021, 
      sex: "Filly", 
      color: "Chestnut",
      sire: "Sire Name 2",
      dam: "Dam Name 2",
      paternalGrandfather: "PG Father 2",
      paternalGrandmother: "PG Mother 2",
      maternalGrandfather: "MG Father 2",
      maternalGrandmother: "MG Mother 2",
      trainer: "Trainer Name 2",
      owner: "Owner Name 2"
    },
    { 
      id: "3", 
      name: "Golden Dawn", 
      yearOfBirth: 2020, 
      sex: "Mare", 
      color: "Palomino",
      sire: "Sire Name 3",
      dam: "Dam Name 3",
      paternalGrandfather: "PG Father 3",
      paternalGrandmother: "PG Mother 3",
      maternalGrandfather: "MG Father 3",
      maternalGrandmother: "MG Mother 3",
      trainer: "Trainer Name 3",
      owner: "Owner Name 3"
    },
    { 
      id: "4", 
      name: "Storm Chaser", 
      yearOfBirth: 2023, 
      sex: "Colt", 
      color: "Black",
      sire: "Sire Name 4",
      dam: "Dam Name 4",
      paternalGrandfather: "PG Father 4",
      paternalGrandmother: "PG Mother 4",
      maternalGrandfather: "MG Father 4",
      maternalGrandmother: "MG Mother 4",
      trainer: "Trainer Name 4",
      owner: "Owner Name 4"
    },
    { 
      id: "5", 
      name: "Royal Thunder", 
      yearOfBirth: 2019, 
      sex: "Stallion", 
      color: "Grey",
      sire: "Sire Name 5",
      dam: "Dam Name 5",
      paternalGrandfather: "PG Father 5",
      paternalGrandmother: "PG Mother 5",
      maternalGrandfather: "MG Father 5",
      maternalGrandmother: "MG Mother 5",
      trainer: "Trainer Name 5",
      owner: "Owner Name 5"
    },
  ];

  const handleSelectHorse = (horse: Horse) => {
    onSelectHorse(horse);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Search Horse Profile</DialogTitle>
        </DialogHeader>
        <Command className="rounded-lg border shadow-md">
          <CommandInput placeholder="Search horses..." />
          <CommandList>
            <CommandEmpty>No horses found.</CommandEmpty>
            <CommandGroup>
              {horses.map((horse) => (
                <CommandItem
                  key={horse.id}
                  onSelect={() => handleSelectHorse(horse)}
                  className="cursor-pointer"
                >
                  <div className="flex flex-col">
                    <span className="font-medium">{horse.name}</span>
                    <span className="text-sm text-muted-foreground">
                      {horse.yearOfBirth} • {horse.sex}
                    </span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
};

export default HorseSearchDialog;
