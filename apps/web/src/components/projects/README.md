# Projects Components

Components for managing project portfolios, including creation, editing, and display.

## Components

### ProjectsList

Displays all user projects in list or grid view with sorting, filtering, and actions.

#### Features

- **Dual View Modes**: Toggle between grid and list views
- **Project Cards**: Show thumbnail, title, description, tags, and status
- **Visibility Badges**: Indicate public/private status with icons
- **Completion Status**: Show completed vs in-progress projects
- **Actions**: Edit, delete, and view buttons for each project
- **Empty State**: Helpful message when no projects exist
- **Error Handling**: Display errors gracefully

#### Usage

```tsx
import { ProjectsList } from "@/components/projects/ProjectsList";

export function MyProjectsPage() {
  return (
    <ProjectsList
      viewMode="grid"
      onEdit={(project) => console.log("Edit:", project)}
      onDelete={(projectId) => console.log("Delete:", projectId)}
      onViewProject={(project) => console.log("View:", project)}
    />
  );
}
```

#### Props

- `viewMode?: "list" | "grid"` - Initial view mode (default: "grid")
- `onEdit?: (project: Project) => void` - Called when edit button clicked
- `onDelete?: (projectId: string) => void` - Called when delete button clicked
- `onViewProject?: (project: Project) => void` - Called when view button clicked

#### Data Displayed

Each project shows:
- Thumbnail image (from first media or stored thumbnail)
- Title and short description
- Tags (up to 3 shown, with "+X more" indicator)
- Completion status badge
- Visibility badge (public/private with icon)
- Last updated date and project slug
- Formatted slug for reference

### CreateEditProjectForm

Form for creating new projects or editing existing ones.

#### Features

- **Auto-Generated Slugs**: Converts project title to URL-friendly slug automatically
- **Real-time Slug Preview**: Shows how the project URL will look
- **Two Modes**: Create or edit based on whether projectId is provided
- **Tag Management**: Add and remove tags (up to 10)
- **Visibility Control**: Toggle between public and private with helpful messaging
- **Status Tracking**: Mark projects as completed or in-progress
- **Rich Descriptions**: Separate short and detailed description fields
- **Character Counters**: Show remaining characters for text fields
- **Error Messages**: Clear validation errors for each field
- **Loading States**: Show progress during form submission
- **Auto-Load Project**: Fetches existing project data when editing

#### Usage

```tsx
import { CreateEditProjectForm } from "@/components/projects/CreateEditProjectForm";

// Create new project
export function NewProjectPage() {
  return (
    <CreateEditProjectForm
      onSuccess={() => {
        console.log("Project created!");
      }}
    />
  );
}

// Edit existing project
export function EditProjectPage({ projectId }: { projectId: string }) {
  return (
    <CreateEditProjectForm
      projectId={projectId}
      onSuccess={() => {
        console.log("Project updated!");
      }}
    />
  );
}
```

#### Props

- `projectId?: string` - When provided, loads and allows editing that project
- `onSuccess?: () => void` - Called after successful creation/update

#### Form Fields

**Project Information**
- Title: 2-100 characters, required
- Short Description: 10-300 characters, required
- Detailed Description: Up to 10,000 characters, optional
- Auto-generated slug preview based on title

**Project Status**
- Completion Status: "In Progress" or "Completed"
- Visibility: "Private" (only you) or "Public" (searchable)
- Contextual messaging about visibility impact

**Tags**
- Up to 10 tags
- Each tag: 1-30 characters
- Add/remove buttons for easy management
- Optional but recommended

#### API Integration

```
POST /api/v1/users/me/projects          - Create new project
PATCH /api/v1/users/me/projects/:id     - Update project
GET /api/v1/users/me/projects            - List all projects
GET /api/v1/projects/:id                - Get project details
DELETE /api/v1/users/me/projects/:id    - Delete project
```

## Pages

### /dashboard/projects

Main projects dashboard showing all projects with create button.

### /dashboard/projects/new

Page with form to create a new project.

### /dashboard/projects/[id]/edit

Page with form to edit an existing project.

## Design System Integration

All projects components use:
- **Typography**: Heading2, Paragraph, Caption from text system
- **Form Inputs**: Input, Textarea, Select from form components
- **Styling**: Tailwind CSS with design-system colors
- **Icons**: Lucide React for action icons

## Testing

Comprehensive tests included for:

### ProjectsList
- Component rendering and loading states
- Grid and list view switching
- Project data display (title, description, tags, badges)
- Callback functions (edit, delete, view)
- Empty state and error handling
- View mode persistence

### CreateEditProjectForm
- Create mode vs edit mode
- Auto-generated slug from title
- Form submission with validation
- Tag management (add, remove, limit)
- Visibility message display
- Error handling and display
- Callback on success

Run tests with:

```bash
pnpm test ProjectsList
pnpm test CreateEditProjectForm
```

## Slug Generation

Slugs are automatically generated from project titles using the `slugify` function:

```
"My Awesome Game" → "my-awesome-game"
"Game 2.0!" → "game-20"
"  spaces  " → "spaces"
```

**Uniqueness**: If a slug is already taken, the system appends a number:
- "my-game" → "my-game-1" → "my-game-2" etc.

**URL Format**: Projects are accessible at `/projects/{slug}`

## Visibility & Privacy

### Public Projects
- ✓ Visible in search results
- ✓ Shown on your public profile
- ✓ Discoverable by other users
- ✓ Can be featured in browse section

### Private Projects
- 🔒 Only visible to you
- 🔒 Not searchable
- 🔒 Not on public profile
- 🔒 Can share direct link if needed

Visibility can be changed anytime after creation.

## Tags

Tags help users discover projects:
- Normalized to lowercase
- Automatically deduplicated
- Up to 10 per project
- Suggestions from existing tags

### Tag Best Practices

- Use 3-5 relevant tags
- Be specific: "puzzle-game" not just "game"
- Include role/discipline: "3D-modeling", "UI-design"
- Add genre/style: "multiplayer", "story-driven"

Examples:
- Game: "game, puzzle, multiplayer"
- Model: "3D-model, character, rigged"
- UI: "UI-design, buttons, responsive"

## Completion Status

- **In Progress**: Project currently being worked on
- **Completed**: Project finished and ready to showcase

This affects how projects appear in search and profile sorting.

## Accessibility

All components meet WCAG 2.1 AA standards:

- ✅ Proper form labels with accessibility attributes
- ✅ Error messages linked with ARIA descriptions
- ✅ Keyboard navigation fully supported
- ✅ Focus indicators visible on all interactive elements
- ✅ Screen reader compatible
- ✅ Semantic HTML structure
- ✅ Color not the only indicator of status

## Performance

- React Query for efficient data fetching
- Optimized image thumbnails
- Debounced slug generation
- Minimal re-renders with controlled components
- Lazy loading for project images

## Error Handling

Clear error messages for:
- Network failures
- Validation errors (client-side)
- Server-side validation errors
- Duplicate slugs
- File upload failures

## Future Enhancements

- [ ] Media gallery component for project images/videos
- [ ] Drag-and-drop project reordering
- [ ] Bulk tag management
- [ ] Project templates/duplication
- [ ] Advanced filtering in projects list
- [ ] Project sharing/collaboration
- [ ] Analytics (views, interested developers)
- [ ] Project versions/history

## Related Components

- `EditProfileForm` - Edit developer profile
- `MediaGallery` - Show project images/videos
- `ContactRequestForm` - Send collaboration requests
- `DeveloperCard` - Display projects on public profile

## Troubleshooting

**Can't create project?**
- Check title and short description are filled
- Verify short description is 10+ characters
- Ensure you're authenticated

**Slug not updating?**
- Slug auto-generates from title
- Check title is valid (10+ chars)
- Try refreshing the form

**Project not appearing in search?**
- Verify project is set to "Public"
- Check at least one tag is added
- Projects appear in search after short delay

**Can't delete project?**
- Confirm you own the project
- Check for any dependent data
- Try refreshing if stuck

## API Documentation

See `PROJECT_MANAGEMENT_SETUP.md` for detailed API documentation including:
- Request/response formats
- Error handling
- Field validation rules
- Rate limiting
- Authentication requirements
