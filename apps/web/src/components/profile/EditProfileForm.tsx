"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  ProfileUpdateSchema,
  ROLE_LABELS,
  AVAILABILITY_LABELS,
  type ProfileUpdate,
} from "@rbxfolio/types";
import {
  Input,
  Textarea,
  Select,
  Checkbox,
  FileUpload,
  Heading2,
  Paragraph,
  Caption,
} from "@rbxfolio/design-system";
import { Button } from "@/components/ui/button";
import { useSession } from "@/lib/auth-client";

const ROLE_OPTIONS = Object.entries(ROLE_LABELS).map(([value, label]) => ({
  value,
  label,
}));

const EXPERIENCE_OPTIONS = [
  { value: "BEGINNER", label: "Beginner" },
  { value: "INTERMEDIATE", label: "Intermediate" },
  { value: "ADVANCED", label: "Advanced" },
  { value: "PROFESSIONAL", label: "Professional" },
];

const AVAILABILITY_OPTIONS = Object.entries(AVAILABILITY_LABELS).map(
  ([value, label]) => ({
    value,
    label,
  })
);

interface EditProfileFormProps {
  onSuccess?: () => void;
}

/**
 * EditProfileForm Component
 *
 * Allows developers to edit their profile information including:
 * - Display name, username, tagline, bio
 * - Primary and secondary roles
 * - Experience level and availability
 * - Location, languages, social links
 * - Avatar and banner uploads
 */
export function EditProfileForm({ onSuccess }: EditProfileFormProps) {
  const { data: session } = useSession();
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    reset,
  } = useForm<ProfileUpdate>({
    resolver: zodResolver(ProfileUpdateSchema),
    mode: "onBlur",
  });

  // Fetch current profile
  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const res = await fetch("/api/v1/users/me/profile");
      if (!res.ok) throw new Error("Failed to load profile");
      return res.json();
    },
    onSuccess: (data) => {
      reset(data);
      if (data.profilePictureUrl) setAvatarPreview(data.profilePictureUrl);
      if (data.bannerUrl) setBannerPreview(data.bannerUrl);
    },
  });

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (data: ProfileUpdate) => {
      const res = await fetch("/api/v1/users/me/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to update profile");
      return res.json();
    },
    onSuccess: () => {
      onSuccess?.();
    },
  });

  // Upload avatar mutation
  const uploadAvatarMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/v1/users/me/avatar", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Failed to upload avatar");
      return res.json();
    },
    onSuccess: (data) => {
      setAvatarPreview(data.profilePictureUrl);
    },
  });

  // Upload banner mutation
  const uploadBannerMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/v1/users/me/banner", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Failed to upload banner");
      return res.json();
    },
    onSuccess: (data) => {
      setBannerPreview(data.bannerUrl);
    },
  });

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setAvatarPreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
      uploadAvatarMutation.mutate(file);
    }
  };

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setBannerPreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
      uploadBannerMutation.mutate(file);
    }
  };

  const onSubmit = (data: ProfileUpdate) => {
    updateProfileMutation.mutate(data);
  };

  if (profileLoading) {
    return <Paragraph>Loading profile...</Paragraph>;
  }

  const secondaryRoles = watch("secondaryRoles");

  return (
    <div className="max-w-4xl mx-auto">
      <Heading2 className="mb-6">Edit Profile</Heading2>

      {/* Banner Upload */}
      <div className="mb-8">
        <div className="relative h-48 bg-gray-200 rounded-lg overflow-hidden mb-4">
          {bannerPreview && (
            <img
              src={bannerPreview}
              alt="Banner"
              className="w-full h-full object-cover"
            />
          )}
        </div>
        <FileUpload
          label="Banner Image"
          accept="image/*"
          maxSize={5242880}
          helpText="JPG, PNG, or WebP up to 5MB"
          onChange={handleBannerChange}
          disabled={uploadBannerMutation.isPending}
        />
      </div>

      {/* Avatar Upload */}
      <div className="mb-8 flex items-end gap-6">
        <div className="flex-shrink-0">
          <div className="w-24 h-24 bg-gray-200 rounded-full overflow-hidden">
            {avatarPreview && (
              <img
                src={avatarPreview}
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            )}
          </div>
        </div>
        <div className="flex-1">
          <FileUpload
            label="Avatar"
            accept="image/*"
            maxSize={5242880}
            helpText="JPG, PNG, or WebP up to 5MB"
            onChange={handleAvatarChange}
            disabled={uploadAvatarMutation.isPending}
          />
        </div>
      </div>

      {/* Main Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Info */}
        <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
          <Heading2 className="text-lg">Basic Information</Heading2>

          <Input
            label="Display Name"
            placeholder="Your name"
            error={errors.displayName?.message}
            {...register("displayName")}
          />

          <Input
            label="Username"
            placeholder="username123"
            error={errors.username?.message}
            hint="3-30 characters, lowercase with _ or - only"
            {...register("username")}
          />

          <Input
            label="Tagline"
            placeholder="One-line description of what you do"
            error={errors.tagline?.message}
            {...register("tagline")}
          />

          <Textarea
            label="Bio"
            placeholder="Tell us more about yourself..."
            error={errors.bio?.message}
            maxLength={2000}
            showCharCount
            {...register("bio")}
          />

          <Input
            label="Location"
            placeholder="City, Country"
            error={errors.location?.message}
            {...register("location")}
          />
        </div>

        {/* Professional Info */}
        <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
          <Heading2 className="text-lg">Professional Info</Heading2>

          <Select
            label="Primary Role"
            options={ROLE_OPTIONS}
            placeholder="Select your primary role"
            error={errors.primaryRole?.message}
            {...register("primaryRole")}
          />

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-3">
              Secondary Roles (up to 3)
            </label>
            <div className="space-y-2">
              {ROLE_OPTIONS.map((role) => (
                <Checkbox
                  key={role.value}
                  label={role.label}
                  value={role.value}
                  checked={(secondaryRoles ?? []).includes(role.value as any)}
                  {...register("secondaryRoles")}
                />
              ))}
            </div>
            {errors.secondaryRoles && (
              <Caption className="text-red-500 mt-2">
                {errors.secondaryRoles.message}
              </Caption>
            )}
          </div>

          <Select
            label="Experience Level"
            options={EXPERIENCE_OPTIONS}
            placeholder="Select your experience level"
            error={errors.experienceLevel?.message}
            {...register("experienceLevel")}
          />

          <Select
            label="Availability"
            options={AVAILABILITY_OPTIONS}
            placeholder="Select your availability"
            error={errors.availability?.message}
            {...register("availability")}
          />

          <Textarea
            label="Preferred Contact Method"
            placeholder="How should people contact you? (email, DM, etc.)"
            error={errors.preferredContact?.message}
            maxLength={200}
            showCharCount
            {...register("preferredContact")}
          />
        </div>

        {/* Languages */}
        <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
          <Heading2 className="text-lg">Languages</Heading2>
          <Caption>Add up to 10 languages you work with</Caption>
          {/* TODO: Implement language tag input component */}
        </div>

        {/* Social Links */}
        <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
          <Heading2 className="text-lg">Social Links</Heading2>

          <Input
            label="Roblox Profile"
            placeholder="https://www.roblox.com/users/..."
            error={errors.socialLinks?.roblox?.message}
            type="url"
            {...register("socialLinks.roblox")}
          />

          <Input
            label="GitHub"
            placeholder="https://github.com/..."
            error={errors.socialLinks?.github?.message}
            type="url"
            {...register("socialLinks.github")}
          />

          <Input
            label="Discord"
            placeholder="username#0000 or username"
            error={errors.socialLinks?.discord?.message}
            {...register("socialLinks.discord")}
          />

          <Input
            label="YouTube"
            placeholder="https://youtube.com/..."
            error={errors.socialLinks?.youtube?.message}
            type="url"
            {...register("socialLinks.youtube")}
          />

          <Input
            label="X (Twitter)"
            placeholder="https://x.com/..."
            error={errors.socialLinks?.x?.message}
            type="url"
            {...register("socialLinks.x")}
          />

          <Input
            label="Website"
            placeholder="https://yourwebsite.com"
            error={errors.socialLinks?.website?.message}
            type="url"
            {...register("socialLinks.website")}
          />
        </div>

        {/* Submit */}
        <div className="flex gap-4">
          <Button
            type="submit"
            disabled={
              isSubmitting ||
              updateProfileMutation.isPending ||
              uploadAvatarMutation.isPending ||
              uploadBannerMutation.isPending
            }
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
          >
            {updateProfileMutation.isPending ? "Saving..." : "Save Changes"}
          </Button>

          <Button
            type="button"
            onClick={() => reset()}
            className="px-6 py-2 bg-gray-300 text-gray-900 rounded-lg hover:bg-gray-400"
          >
            Cancel
          </Button>
        </div>

        {updateProfileMutation.isError && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <Caption className="text-red-700">
              Failed to update profile. Please try again.
            </Caption>
          </div>
        )}

        {updateProfileMutation.isSuccess && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <Caption className="text-green-700">
              Profile updated successfully!
            </Caption>
          </div>
        )}
      </form>
    </div>
  );
}
