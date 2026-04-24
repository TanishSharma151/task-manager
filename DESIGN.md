# DESIGN.md — Task Manager

## Data Model

### User
```json
{
  "_id": "ObjectId",
  "name": "string",
  "email": "string (unique, lowercase)",
  "password": "string (bcrypt hashed)",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```
**Reasoning:** Minimal user model — only what's needed for auth. Password is always hashed with bcrypt before storage, never stored in plain text.

### Tag
```json
{
  "_id": "ObjectId",
  "name": "string",
  "userId": "ObjectId (ref: User)",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```
**Reasoning:** Tags are user-scoped. Each tag belongs to one user via `userId`. Deleting a tag removes it from all tasks using `$pull` on the Task collection — tasks themselves are never deleted.

### Task
```json
{
  "_id": "ObjectId",
  "title": "string (required)",
  "description": "string (optional)",
  "dueDate": "Date (optional)",
  "priority": "enum: low | medium | high",
  "status": "enum: todo | in-progress | done",
  "tags": ["ObjectId (ref: Tag)"],
  "userId": "ObjectId (ref: User)",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```
**Reasoning:** Tasks store tag references as an array of ObjectIds — this is a many-to-many relationship handled without a junction collection, which is idiomatic in MongoDB. Tags are populated on read using Mongoose's `.populate()`.

---

## Indexes Added and Why

| Collection | Field | Type | Reason |
|------------|-------|------|--------|
| User | `email` | Unique | Fast lookup during login, prevents duplicate accounts |
| Task | `userId` | Standard | Every task query filters by userId — index speeds this up significantly |
| Tag | `userId` | Standard | Every tag query filters by userId |
| Task | `status` | Standard | Filter by status is a common operation |
| Task | `priority` | Standard | Filter by priority is a common operation |

---

## Data Isolation Between Users

Every database query includes `userId: req.user.id` as a filter condition. The `req.user.id` is extracted from the verified JWT token in the auth middleware — it cannot be spoofed without the JWT secret.

- Tasks: `Task.find({ userId: req.user.id })`
- Tags: `Tag.find({ userId: req.user.id })`
- Updates/Deletes: `Task.findOne({ _id: req.params.id, userId: req.user.id })` — this ensures a user cannot modify another user's resources even if they know the ID.

---

## At 100,000 Active Users — What Breaks First

At 100,000 active users the first bottleneck would be the MongoDB free tier hitting its connection and storage limits, followed by the Render free tier server going cold after inactivity and introducing latency spikes. The AI suggestion endpoint hitting Groq rate limits under concurrent load would also be a problem. To address this I would migrate to a dedicated MongoDB Atlas cluster with proper indexing and connection pooling, move the backend to a paid Render or Railway instance with auto-scaling, add Redis caching for frequently accessed task lists, implement a queue system for AI requests to handle bursts, and add pagination on the task list endpoint to reduce payload size per request.

---

## Feature Deliberately Left Out

**Automated Reminders & Email Notifications** — The ability to proactively alert users via email as task deadlines approach. This would require a background worker (using node-cron) to scan the database for upcoming dueDate values and trigger an external notification service. Given the timeline, this was deferred to prioritize core AI subtask generation and a secure user experience. With one more day, I would integrate the Resend API (as I have in previous production projects) to handle automated, reliable deadline alerts.