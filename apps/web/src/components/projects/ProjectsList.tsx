"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { Trash2, Edit2, Eye, EyeOff } from "lucide-react";
import { Heading2, Paragraph, Caption } from "@rbxfolio/design-system";
import { Button } from "@/components/ui/button";
import type { ProjectUpdate } from "@rbxfolio/types";

interface Project {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  thumbnailUrl: string | null;
  completionStatus: "COMPLETED" | "IN_PROGRESS";
  visibility: "PUBLIC" | "PRIVATE";
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

interface ProjectsListProps {
  onEdit?: (project: Project) => void;
  onDelete?: (projectId: string) => void;
  onViewProject?: (project: Project) => void;
  viewMode?: "list" | "grid";
}

/**
 * ProjectsList Component
 *
 * Displays user's projects in list or grid view with:
 * - Project thumbnail, title, description
 * - Completion status indicator
 * - Visibility badge (public/private)
 * - Tag display
 * - Action buttons (edit, delete, view)
 */
export function ProjectsList({
  onEdit,
  onDelete,
  onViewProject,
  viewMode = "grid",
}: ProjectsListProps) {
  const [selectedViewMode, setSelectedViewMode] = useState(viewMode);

  const { data: projects, isLoading, error } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const res = await fetch("/api/v1/users/me/projects");
      if (!res.ok) throw new Error("Failed to load projects");
      return res.json() as Promise<Project[]>;
    },
  });

  if (isLoading) {
    return <Paragraph>Loading projects...</Paragraph>;
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <Caption className="text-red-700">Failed to load projects</Caption>
      </div>
    );
  }

  if (!projects || projects.length === 0) {
    return (
      <div className="text-center py-12">
        <Heading2 className="mb-2">No projects yet</Heading2>
        <Paragraph className="text-gray-600 mb-6">
          Create your first project to get started
        </Paragraph>
        <Button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          <Link href="/dashboard/projects/new">Create Project</Link>
        </Button>
      </div>
    );
  }

  return (
    <div>
      {/* View Mode Selector */}
      <div className="flex justify-between items-center mb-6">
        <Heading2>{projects.length} Projects</Heading2>
        <div className="flex gap-2">
          <button
            onClick={() => setSelectedViewMode("list")}
            className={`px-3 py-1 rounded ${
              selectedViewMode === "list"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            List
          </button>
          <button
            onClick={() => setSelectedViewMode("grid")}
            className={`px-3 py-1 rounded ${
              selectedViewMode === "grid"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            Grid
          </button>
        </div>
      </div>

      {/* Grid View */}
      {selectedViewMode === "grid" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onEdit={onEdit}
              onDelete={onDelete}
              onViewProject={onViewProject}
            />
          ))}
        </div>
      )}

      {/* List View */}
      {selectedViewMode === "list" && (
        <div className="space-y-2">
          {projects.map((project) => (
            <ProjectListItem
              key={project.id}
              project={project}
              onEdit={onEdit}
              onDelete={onDelete}
              onViewProject={onViewProject}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface ProjectCardProps {
  project: Project;
  onEdit?: (project: Project) => void;
  onDelete?: (projectId: string) => void;
  onViewProject?: (project: Project) => void;
}

function ProjectCard({
  project,
  onEdit,
  onDelete,
  onViewProject,
}: ProjectCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      {/* Thumbnail */}
      <div className="relative h-40 bg-gray-200">
        {project.thumbnailUrl && (
          <img
            src={project.thumbnailUrl}
            alt={project.title}
            className="w-full h-full object-cover"
          />
        )}
        {/* Visibility Badge */}
        <div className="absolute top-2 right-2">
          <span
            className={`px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${
              project.visibility === "PUBLIC"
                ? "bg-green-100 text-green-800"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            {project.visibility === "PUBLIC" ? (
              <>
                <Eye size={14} /> Public
              </>
            ) : (
              <>
                <EyeOff size={14} /> Private
              </>
            )}
          </span>
        </div>
        {/* Completion Status */}
        <div className="absolute bottom-2 left-2">
          <span
            className={`px-2 py-1 rounded-full text-xs font-semibold ${
              project.completionStatus === "COMPLETED"
                ? "bg-blue-100 text-blue-800"
                : "bg-yellow-100 text-yellow-800"
            }`}
          >
            {project.completionStatus === "COMPLETED"
              ? "Completed"
              : "In Progress"}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-lg text-gray-900 line-clamp-2 mb-1">
          {project.title}
        </h3>
        <p className="text-sm text-gray-600 line-clamp-2 mb-3">
          {project.shortDescription}
        </p>

        {/* Tags */}
        {project.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {project.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 text-xs bg-blue-50 text-blue-700 rounded"
              >
                {tag}
              </span>
            ))}
            {project.tags.length > 3 && (
              <span className="px-2 py-1 text-xs text-gray-500">
                +{project.tags.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Metadata */}
        <div className="flex justify-between items-center text-xs text-gray-500 mb-4">
          <span>Updated {new Date(project.updatedAt).toLocaleDateString()}</span>
          <span>/{project.slug}</span>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={() => onViewProject?.(project)}
            className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 text-sm font-medium flex items-center justify-center gap-2"
          >
            <Eye size={14} /> View
          </button>
          <button
            onClick={() => onEdit?.(project)}
            className="flex-1 px-3 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 text-sm font-medium flex items-center justify-center gap-2"
          >
            <Edit2 size={14} /> Edit
          </button>
          <button
            onClick={() => onDelete?.(project.id)}
            className="flex-1 px-3 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200 text-sm font-medium flex items-center justify-center gap-2"
          >
            <Trash2 size={14} /> Delete
          </button>
        </div>
      </div>
    </div>
  );
}

function ProjectListItem({
  project,
  onEdit,
  onDelete,
  onViewProject,
}: ProjectCardProps) {
  return (
    <div className="flex items-center gap-4 p-4 bg-white rounded-lg border border-gray-200 hover:border-gray-300">
      {/* Thumbnail */}
      <div className="w-20 h-20 rounded overflow-hidden bg-gray-200 flex-shrink-0">
        {project.thumbnailUrl && (
          <img
            src={project.thumbnailUrl}
            alt={project.title}
            className="w-full h-full object-cover"
          />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h3 className="font-semibold text-lg text-gray-900 line-clamp-1">
              {project.title}
            </h3>
            <p className="text-sm text-gray-600 line-clamp-1">
              {project.shortDescription}
            </p>
            <div className="flex gap-2 mt-2">
              {project.tags.slice(0, 2).map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 text-xs bg-blue-50 text-blue-700 rounded"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Status Badges */}
          <div className="flex flex-col gap-1 flex-shrink-0">
            <span
              className={`px-2 py-1 rounded text-xs font-semibold whitespace-nowrap ${
                project.visibility === "PUBLIC"
                  ? "bg-green-100 text-green-800"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {project.visibility}
            </span>
            <span
              className={`px-2 py-1 rounded text-xs font-semibold whitespace-nowrap ${
                project.completionStatus === "COMPLETED"
                  ? "bg-blue-100 text-blue-800"
                  : "bg-yellow-100 text-yellow-800"
              }`}
            >
              {project.completionStatus}
            </span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 flex-shrink-0">
        <button
          onClick={() => onViewProject?.(project)}
          title="View project"
          className="p-2 text-gray-600 hover:bg-gray-100 rounded"
        >
          <Eye size={18} />
        </button>
        <button
          onClick={() => onEdit?.(project)}
          title="Edit project"
          className="p-2 text-blue-600 hover:bg-blue-50 rounded"
        >
          <Edit2 size={18} />
        </button>
        <button
          onClick={() => onDelete?.(project.id)}
          title="Delete project"
          className="p-2 text-red-600 hover:bg-red-50 rounded"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
}
