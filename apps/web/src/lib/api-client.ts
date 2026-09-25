/**
 * API Client - Centralized utility for all backend API calls
 * Handles errors, loading states, and data formatting
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  loading: boolean;
}

export async function apiCall<T>(
  endpoint: string,
  options?: {
    method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
    body?: unknown;
    headers?: Record<string, string>;
  }
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...options?.headers,
  };

  try {
    const response = await fetch(url, {
      method: options?.method || 'GET',
      headers,
      body: options?.body ? JSON.stringify(options.body) : undefined,
      credentials: 'include', // Include cookies for session
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || `API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`API call failed: ${endpoint}`, error);
    throw error;
  }
}

/**
 * Get featured developers for homepage
 */
export async function getFeaturedDevelopers() {
  return apiCall<Array<{
    id: string;
    displayName: string;
    username: string;
    profilePictureUrl: string;
    tagline: string;
    primaryRole: string;
    availability: string;
    projectCount: number;
    socialLinks: Record<string, string>;
  }>>('/search/featured');
}

/**
 * Browse projects with sorting and filtering
 */
export async function browseProjects(params?: {
  sort?: 'newest' | 'updated';
  role?: string;
  page?: number;
  limit?: number;
}) {
  const query = new URLSearchParams();
  if (params?.sort) query.append('sort', params.sort);
  if (params?.role) query.append('role', params.role);
  if (params?.page) query.append('page', params.page.toString());
  if (params?.limit) query.append('limit', params.limit.toString());

  return apiCall<{
    data: Array<{
      id: string;
      userId: string;
      title: string;
      shortDescription: string;
      thumbnailUrl: string;
      user: {
        displayName: string;
        username: string;
        primaryRole: string;
      };
      tags: Array<{ name: string }>;
      _count: {
        media: number;
      };
    }>;
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  }>(`/search/browse?${query.toString()}`);
}

/**
 * Search developers by query and filters
 */
export async function searchDevelopers(params?: {
  q?: string;
  role?: string;
  page?: number;
  limit?: number;
}) {
  const query = new URLSearchParams();
  if (params?.q) query.append('q', params.q);
  if (params?.role) query.append('role', params.role);
  if (params?.page) query.append('page', params.page.toString());
  if (params?.limit) query.append('limit', params.limit.toString());

  return apiCall<{
    data: Array<{
      id: string;
      displayName: string;
      username: string;
      profilePictureUrl: string;
      tagline: string;
      primaryRole: string;
      availability: string;
      projectCount: number;
    }>;
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  }>(`/search/search?${query.toString()}`);
}

/**
 * Get public user profile
 */
export async function getUserProfile(username: string) {
  return apiCall<{
    userId: string;
    displayName: string;
    username: string;
    profilePictureUrl: string;
    bannerUrl: string;
    tagline: string;
    bio: string;
    primaryRole: string;
    secondaryRoles: string[];
    experienceLevel: string;
    location: string;
    languages: string[];
    socialLinks: Record<string, string>;
    availability: string;
    createdAt: string;
    updatedAt: string;
  }>(`/users/${username}`);
}

/**
 * Get user's projects (public profile view)
 */
export async function getUserProjects(username: string) {
  return apiCall<
    Array<{
      id: string;
      userId: string;
      title: string;
      slug: string;
      shortDescription: string;
      detailedDescription: string;
      thumbnailUrl: string;
      completionStatus: string;
      tags: Array<{ id: string; name: string }>;
      _count: {
        media: number;
      };
      createdAt: string;
      updatedAt: string;
    }>
  >(`/projects?username=${username}`);
}

/**
 * Get single project details
 */
export async function getProject(projectId: string) {
  return apiCall<{
    id: string;
    userId: string;
    title: string;
    slug: string;
    shortDescription: string;
    detailedDescription: string;
    thumbnailUrl: string;
    completionStatus: string;
    visibility: string;
    tags: Array<{ id: string; name: string }>;
    media: Array<{
      id: string;
      type: string;
      url: string;
      mimeType: string;
      sizeBytes: number;
      sortOrder: number;
    }>;
    user: {
      userId: string;
      displayName: string;
      username: string;
      profilePictureUrl: string;
    };
    createdAt: string;
    updatedAt: string;
  }>(`/projects/${projectId}`);
}

/**
 * Get count statistics for homepage
 */
export async function getStatistics() {
  return apiCall<{
    totalDevelopers: number;
    totalProjects: number;
    totalConnections: number;
  }>('/search/statistics');
}
