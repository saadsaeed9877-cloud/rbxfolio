# Contact Components

Components for managing collaboration and contact requests.

## Components

### ContactRequestInbox

Displays incoming contact/collaboration requests with filtering, status management, and message display.

#### Features

- **Request List**: Show all incoming collaboration requests
- **Status Filtering**: Filter by All, Pending, Accepted, or Declined
- **Status Indicators**: Visual badges and icons showing request status
- **Expandable Cards**: Click to view full message and details
- **Status Management**: Accept or decline pending requests
- **Preferred Contact**: Display accepted collaborators' preferred contact method
- **Request Timeline**: Show when request was received and responded to
- **Smooth Animations**: Framer Motion for expand/collapse and status changes
- **Real-time Updates**: Query invalidation keeps data fresh after changes
- **Empty States**: Helpful messaging when no requests exist

#### Usage

```tsx
import { ContactRequestInbox } from "@/components/contact/ContactRequestInbox";

export function MyRequestsPage() {
  return (
    <div>
      <h1>Collaboration Requests</h1>
      <ContactRequestInbox />
    </div>
  );
}
```

#### Data Display

Each request card shows:

**Collapsed View:**
- Visitor name with status badge
- Message preview (2 lines)
- Request date and time
- Status indicator icon (clock, checkmark, or X)

**Expanded View:**
- Full message text
- Preferred contact method (if accepted)
- Timeline: received and responded timestamps
- Action buttons (if pending)
- Status confirmation (if accepted/declined)

#### Request Status

- **PENDING**: Awaiting your response (shows Accept/Decline buttons)
- **ACCEPTED**: You accepted the collaboration request
- **DECLINED**: You declined the request

#### Filtering

Click tabs to filter by status:

- **All**: Show all requests (total count)
- **PENDING**: Only pending requests (shows count of new)
- **ACCEPTED**: Only accepted requests
- **DECLINED**: Only declined requests

Each tab shows the count of requests in that status.

#### Status Counts

Displayed in badge format next to each filter tab:
- Updated in real-time as you accept/decline
- Shows breakdown of request status

#### Preferred Contact

When you accept a collaboration request, the requester's preferred contact method is displayed:

- Email address
- Discord username
- Phone number
- Custom contact info

Use this to reach out and start collaborating.

#### Actions

**For PENDING Requests:**
- ✓ **Accept**: Accept the collaboration request
- ✕ **Decline**: Decline the request

**For ACCEPTED/DECLINED Requests:**
- View-only status confirmation
- Preferred contact display (for accepted)

#### API Integration

```
GET /api/v1/users/me/contact-requests              - Load all requests
PATCH /api/v1/users/me/contact-requests/:id        - Update request status
```

#### Sorting

Requests are sorted by:
1. Status (pending first, then accepted, then declined)
2. Date (newest first within each status)

#### Performance

- React Query for efficient caching
- Debounced updates
- Optimized animations
- Minimal re-renders

#### Accessibility

All components meet WCAG 2.1 AA standards:

- ✅ Keyboard navigation support
- ✅ Screen reader friendly
- ✅ ARIA labels on buttons
- ✅ Focus indicators visible
- ✅ Semantic HTML structure
- ✅ Status conveyed by more than color alone

#### Testing

Comprehensive tests included for:
- Component rendering
- Request display and filtering
- Expand/collapse interactions
- Status management (accept/decline)
- Empty state display
- Error handling
- Real-time updates

Run tests with:

```bash
pnpm test ContactRequestInbox
```

## Usage Examples

### In Dashboard

```tsx
import { ContactRequestInbox } from "@/components/contact/ContactRequestInbox";

export function DashboardPage() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <ContactRequestInbox />
      </div>
      <aside>
        {/* Other dashboard widgets */}
      </aside>
    </div>
  );
}
```

### Stats Integration

```tsx
export function CollaborationStats() {
  const { data: requests } = useQuery({
    queryKey: ["contact-requests"],
    queryFn: () => fetch("/api/v1/users/me/contact-requests").then(r => r.json()),
  });

  const pending = requests?.filter(r => r.status === "PENDING").length ?? 0;
  const accepted = requests?.filter(r => r.status === "ACCEPTED").length ?? 0;

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="p-4 bg-yellow-50 rounded-lg">
        <p className="text-sm text-yellow-600">Pending Requests</p>
        <p className="text-2xl font-bold">{pending}</p>
      </div>
      <div className="p-4 bg-green-50 rounded-lg">
        <p className="text-sm text-green-600">Collaborators</p>
        <p className="text-2xl font-bold">{accepted}</p>
      </div>
    </div>
  );
}
```

## Best Practices

1. **Regular Checking**: Review pending requests regularly
2. **Timely Responses**: Respond to requests within 24-48 hours
3. **Clear Communication**: Accept or decline promptly so requesters know
4. **Contact Method**: Update your preferred contact method in profile
5. **Professional Tone**: Keep request responses professional

## Status Management

### Accepting a Request

When you accept a collaboration request:
1. The requester sees your acceptance
2. Their preferred contact info becomes visible to you
3. You can reach out to start collaborating
4. Request moves from PENDING to ACCEPTED status

### Declining a Request

When you decline:
1. Request status changes to DECLINED
2. Requester is notified of your decision
3. Preferred contact info is not displayed
4. You can still view the declined request for reference

## Notifications

(Future Enhancement) When implemented, you'll receive notifications for:
- New contact requests
- When someone accepts/declines your requests
- When you have pending requests waiting

## Blocking & Spam

(Future Enhancement) Features to add:
- Report spam requests
- Block users
- Request moderation
- Rate limiting for outbound requests

## Analytics

(Future Enhancement) Track:
- Total requests received
- Acceptance rate
- Response time
- Successful collaborations

## Related Components

- `EditProfileForm` - Update preferred contact method
- `ProjectsList` - Show projects offered for collaboration
- `DeveloperCard` - Display your portfolio to potential collaborators

## Troubleshooting

**Not seeing requests?**
- Check the "All" filter is selected
- Verify you're logged in with the right account
- Try refreshing the page

**Can't accept/decline?**
- Check your internet connection
- Verify session is still active
- Try refreshing if buttons are unresponsive

**Preferred contact not showing?**
- Check request is ACCEPTED (not pending)
- Verify the requester provided contact info
- Your email may be hidden in privacy settings

## Future Enhancements

- [ ] Message thread/conversation view
- [ ] Counter-proposals for collaboration terms
- [ ] Calendar for scheduling discussions
- [ ] File attachments for portfolios
- [ ] Message templates for faster response
- [ ] Scheduled responses/auto-reply
- [ ] Request analytics dashboard
- [ ] Integration with calendar systems
- [ ] Video call scheduling
- [ ] Collaboration agreement templates

## API Documentation

See `CONTACT_REQUESTS_SETUP.md` for detailed API documentation including:
- Request/response formats
- Status validation
- Rate limiting
- Authentication requirements
- Error responses
