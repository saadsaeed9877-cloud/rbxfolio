"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ContactRequestSchema, type ContactRequestInput } from "@rbxfolio/types";
import { apiFetch } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea } from "@/components/ui/input";

interface ContactRequestFormProps {
  username: string;
}

export function ContactRequestForm({ username }: ContactRequestFormProps) {
  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const form = useForm<ContactRequestInput>({
    resolver: zodResolver(ContactRequestSchema),
  });

  async function onSubmit(data: ContactRequestInput) {
    setError("");
    try {
      await apiFetch(`/users/${username}/contact-requests`, {
        method: "POST",
        body: JSON.stringify(data),
      });
      setSubmitted(true);
      form.reset();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to submit");
    }
  }

  if (!open) {
    return (
      <Button size="lg" onClick={() => setOpen(true)}>
        Request Contact
      </Button>
    );
  }

  if (submitted) {
    return (
      <div className="rounded-lg border border-border bg-card p-6">
        <p className="font-medium">Request sent!</p>
        <p className="mt-1 text-sm text-muted-foreground">
          The developer will review your message and respond if interested.
        </p>
        <Button variant="outline" className="mt-4" onClick={() => { setSubmitted(false); setOpen(false); }}>
          Close
        </Button>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border bg-card p-6">
      <h3 className="font-semibold">Request Contact</h3>
      <form onSubmit={form.handleSubmit(onSubmit)} className="mt-4 space-y-4">
        <div className="space-y-2">
          <Label>Your name</Label>
          <Input {...form.register("visitorName")} />
        </div>
        <div className="space-y-2">
          <Label>Message</Label>
          <Textarea {...form.register("message")} rows={4} placeholder="Hi, I'm interested in hiring you for..." />
        </div>
        {error && <p className="text-sm text-destructive">{error}</p>}
        <div className="flex gap-2">
          <Button type="submit">Submit</Button>
          <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
        </div>
      </form>
    </div>
  );
}
