'use client';

import { Button } from "@/components/ui/button";
import {
  CustomCard,
  CustomCardContent,
  CustomCardDescription,
  CustomCardHeader,
  CustomCardTitle,
} from "@/components/ui/CustomCard";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/label";

export function UpdatePasswordForm() {
  return (
    <CustomCard>
      <CustomCardHeader>
        <CustomCardTitle>Aktualizacja hasła</CustomCardTitle>
        <CustomCardDescription>
          Wprowadź nowe hasło, aby odzyskać dostęp do konta.
        </CustomCardDescription>
      </CustomCardHeader>
      <CustomCardContent>
        <form className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password">Nowe hasło</Label>
            <Input id="password" type="password" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm-password">Powtórz nowe hasło</Label>
            <Input id="confirm-password" type="password" required />
          </div>
          <Button type="submit" className="w-full">
            Zaktualizuj hasło
          </Button>
        </form>
      </CustomCardContent>
    </CustomCard>
  );
}
