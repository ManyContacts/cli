# ManyContacts CLI

Terminal CLI for ManyContacts that allows AI agents (Claude Code, Cowork, etc.) and power users to perform all ManyContacts operations programmatically.

## Installation

```bash
npm install -g @manycontacts/cli
```

Or run directly:

```bash
npx @manycontacts/cli
```

## Setup

### Login (generates and stores a CLI token automatically)

```bash
mc auth login --email user@example.com --password mypassword
```

### Register a new account

```bash
mc auth register --email user@example.com --name "My Company"
```

### Environment variables

- `MC_CLI_TOKEN` - CLI authentication token (alternative to login)
- `MC_API_URL` - API base URL (default: `https://api.manycontacts.com`)

## Usage

All responses are JSON by default (ideal for AI agent consumption):

```json
{ "ok": true, "data": {...}, "pagination": { "page": 1, "limit": 50, "has_more": true } }
```

### Quick account context

```bash
mc context
```

Returns: organization, connected channels, counters (contacts, users, tags, etc.), active features and modules.

### Contact management

```bash
mc contacts list --open true --limit 20
mc contacts get +34600000000
mc contacts create --phone "+34600000000" --name "John Smith"
mc contacts update +34600000000 --name "John A. Smith"
mc contacts assign +34600000000 --user <user-id>
mc contacts unassign +34600000000
mc contacts close +34600000000
mc contacts open +34600000000
mc contacts tag-add +34600000000 --tag <tag-id>
mc contacts tag-remove +34600000000 --tag <tag-id>
mc contacts team-add +34600000000 --team <team-id>
mc contacts set-stage +34600000000 --funnel <funnel-id> --stage <stage-id>
mc contacts set-notes +34600000000 --notes "Contact notes"
mc contacts bulk --action close --phones "+34600000000,+34600000001"
mc contacts bulk --action add_tag --phones "+34600000000" --value <tag-id>
mc contacts delete +34600000000
```

#### Contact list filters

| Filter | Example | Description |
|---|---|---|
| `--open` | `--open true` | Filter by open (`true`) or closed (`false`) status |
| `--assigned-to` | `--assigned-to <user-id>` | Filter by assigned user |
| `--search` | `--search "John"` | Search by name or phone number |
| `--tags` | `--tags id1,id2` | Contacts that have **all** specified tags |
| `--team` | `--team <team-id>` | Contacts assigned to a team |
| `--stages` | `--stages id1,id2` | Contacts in specific funnel stages |
| `--date-from` | `--date-from 2026-01-01` | Updated after this date |
| `--date-to` | `--date-to 2026-04-14` | Updated before this date |
| `--sort` | `--sort az` | Sort: `recent` (default), `az`, `oldest`, `newest` |
| `--unread` | `--unread` | Only contacts with unread messages |
| `--blacklist` | `--blacklist` | Only blacklisted contacts |
| `--scheduled` | `--scheduled` | Only contacts with pending scheduled messages |

Filters can be combined:

```bash
mc contacts list --tags <vip-tag-id> --open true --sort az --limit 100
mc contacts list --team <support-team-id> --unread --date-from 2026-04-01
```

### Messaging

```bash
mc messages list +34600000000 --limit 20
mc messages get +34600000000 <message-id>
mc messages send text +34600000000 --body "Hello, how can we help you?"
mc messages send note +34600000000 --body "Internal team note"
mc messages send media +34600000000 --file ./document.pdf --caption "Attachment"
mc messages send template +34600000000 --template <template-id> --vars '["John"]'
mc messages read +34600000000 <message-id>
```

### Templates

```bash
mc templates list
mc templates list --status approved
mc templates get <template-id>
mc templates sync
```

The `list` command shows all visible templates with their name, code, status, components and media flags. Use `--status` to filter by `approved`, `pending` or `rejected`. The `sync` command fetches the latest templates from the WhatsApp (Meta Cloud API) account.

### Tags

```bash
mc tags list
mc tags create --name "VIP" --color "#ff0000"
mc tags update <id> --name "Premium"
mc tags delete <id>
```

### Teams

```bash
mc teams list
mc teams create --name "Support"
mc teams add-member <team-id> --user <user-id>
mc teams remove-member <team-id> --user <user-id>
mc teams delete <id>
```

### Funnels / Pipelines

```bash
mc funnels list
mc funnels create --name "Sales"
mc funnels add-stage <funnel-id> --name "Contacted" --order 1
mc funnels update-stage <funnel-id> <stage-id> --name "Negotiating"
mc funnels delete-stage <funnel-id> <stage-id> --move-to <other-stage-id>
mc funnels contacts <funnel-id>
mc funnels delete <id>
```

### Custom fields

```bash
mc custom-fields list
mc custom-fields create --name "Company" --type text
mc custom-fields update <id> --name "Organization"
mc custom-fields delete <id>
```

### Quick replies

```bash
mc short-responses list
mc short-responses create --name "greeting" --text "Hello! How can I help you?"
mc short-responses update <id> --text "Updated text"
mc short-responses delete <id>
```

### AI agents

```bash
mc ai-agents list
mc ai-agents create --name "Assistant" --instructions "You are a sales assistant..."
mc ai-agents get <id>
mc ai-agents update <id> --active true --instructions "New instructions..."
mc ai-agents feedback <id>
mc ai-agents delete <id>
```

### Channels

```bash
mc channels list
mc channels connect whatsapp-api
mc channels connect whatsapp-coexistence
mc channels connect whatsapp-qr
mc channels whatsapp-profile
mc channels update-whatsapp-profile --about "Our company" --description "Description"
mc channels delete <id>
```

The `connect` command returns a URL that must be opened in a browser. Each channel type follows a different flow:
- **whatsapp-qr**: Shows a QR code to scan with WhatsApp on your phone.
- **whatsapp-api**: Opens a Meta embedded signup popup to authorize the WhatsApp Business API.
- **whatsapp-coexistence**: Same as whatsapp-api but for the Coexistence mode.

### Widget

```bash
mc widget get
mc widget get-code
mc widget update --name "My Widget"
```

### Organization

```bash
mc org get
mc org update --timezone "Europe/Madrid" --auto-reply-open true
mc org schedule get
mc org schedule update --data '[{"day":1,"start":"09:00","end":"18:00","active":true}]'
mc org apikey
mc org checklist
mc org empty --confirm
```

### Users and permissions

```bash
mc users list
mc users get <id>
mc users update <id> --name "New name"
mc users invite --email "new@company.com"
mc users invitations
mc users revoke-invitation <id>
mc users permissions-schema
mc users delete <id>
```

### Campaigns

```bash
mc campaigns list
mc campaigns create --name "Black Friday" --template <template-id> --phones "+34600000000,+34600000001,+34600000002" --date "2026-11-27T10:00:00"
mc campaigns create --name "Promo" --template <id> --phones "+34600000000" --date "2026-12-01T09:00:00" --variables '["John","20%"]'
mc campaigns delete <id>
```

### Billing

```bash
mc billing subscriptions
mc billing checkout
```

### Email

```bash
mc email status
mc email folders
mc email list
mc email get <id>
mc email send --to "user@example.com" --subject "Subject" --body "<p>Content</p>"
mc email disconnect
```

### CLI tokens

```bash
mc auth whoami
mc auth token-list
mc auth token-create --name "CI/CD Pipeline" --scopes "contacts:read,messages:read"
mc auth token-revoke <token-id>
mc auth token-rotate <token-id>
mc auth logout
```

## Security

- CLI tokens are stored hashed (SHA-256) in the database
- Granular scopes: `account:read`, `account:write`, `contacts:read`, `contacts:write`, `messages:read`, `messages:write`, `campaigns:read`, `campaigns:write`, `settings:read`, `settings:write`, `ai:read`, `ai:write`, `email:read`, `email:write`, `*`
- **7-day free trial**: after trial expiration, a paid subscription is required to continue using the CLI
- Rate limit: 60 requests/minute (paid accounts), 10 requests/minute (free accounts within trial)
- Optional IP allowlist per token
- Optional token expiration
- Audit log for all operations
- All operations are scoped to the token's organization

## For AI agents

The CLI is designed to be used by AI agents:

- **JSON output**: all responses are parseable JSON
- **`mc context`**: quick summary of the account state
- **`mc --help`**: documentation for all commands
- **Consistent error codes**: `{ "ok": false, "error": "message" }`
- **`--quiet`**: suppresses spinners and colors for clean parsing
