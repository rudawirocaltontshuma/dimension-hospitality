"use client";

import * as React from "react";

import { Plus } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { Guest, VipTier } from "@/data/hospitality";

const VIP_TIERS: VipTier[] = ["None", "Silver", "Gold", "Platinum"];

export function CreateGuestDialog({ onCreate }: { onCreate: (guest: Guest) => void }) {
  const [open, setOpen] = React.useState(false);
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [nationality, setNationality] = React.useState("");
  const [vipTier, setVipTier] = React.useState<VipTier>("None");
  const [notes, setNotes] = React.useState("");

  function resetForm() {
    setName("");
    setEmail("");
    setPhone("");
    setNationality("");
    setVipTier("None");
    setNotes("");
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    if (!name.trim() || !email.trim()) {
      toast.error("Guest name and email are required.");
      return;
    }

    const guest: Guest = {
      id: `guest-new-${Date.now()}`,
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim() || "Not provided",
      nationality: nationality.trim() || "Unspecified",
      vipTier,
      totalStays: 0,
      totalSpend: 0,
      lastVisit: null,
      loyaltyPoints: 0,
      notes: notes.trim(),
      createdAt: new Date().toISOString().slice(0, 10),
    };

    onCreate(guest);
    toast.success(`${guest.name} added to the guest directory.`);
    resetForm();
    setOpen(false);
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) resetForm();
      }}
    >
      <DialogTrigger asChild>
        <Button>
          <Plus />
          Add guest
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create guest profile</DialogTitle>
            <DialogDescription>Fictional guest details for the Nexora Hospitality demo directory.</DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4 py-4">
            <div className="grid gap-1.5">
              <Label htmlFor="guest-name">Full name</Label>
              <Input id="guest-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Jordan Lee" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-1.5">
                <Label htmlFor="guest-email">Email</Label>
                <Input
                  id="guest-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="jordan@mailbox.com"
                />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="guest-phone">Phone</Label>
                <Input
                  id="guest-phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 555 0100"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-1.5">
                <Label htmlFor="guest-nationality">Nationality</Label>
                <Input
                  id="guest-nationality"
                  value={nationality}
                  onChange={(e) => setNationality(e.target.value)}
                  placeholder="Canada"
                />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="guest-tier">Loyalty tier</Label>
                <Select value={vipTier} onValueChange={(value) => setVipTier(value as VipTier)}>
                  <SelectTrigger id="guest-tier">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {VIP_TIERS.map((tier) => (
                        <SelectItem key={tier} value={tier}>
                          {tier}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="guest-notes">Notes</Label>
              <Textarea
                id="guest-notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Preferences, special requests..."
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit">Create guest</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
