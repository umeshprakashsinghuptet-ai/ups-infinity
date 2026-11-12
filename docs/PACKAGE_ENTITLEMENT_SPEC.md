# Package entitlement specification (implementation pending)

Package identifiers: `DAILY`, `SINGLE_STUDY`, `FULL_STUDY`.

Required server-side records:
- `packages`: package_id, display_name, price_minor_units, currency, duration_days, feature_limits, active.
- `purchase_requests`: id, user_id, package_id, amount_minor_units, payment_reference, submitted_at, status, verified_by, verified_at.
- `entitlements`: id, user_id, package_id, starts_at, expires_at, status, source_purchase_id.
- `admin_audit_log`: actor_id, action, target_id, timestamp, metadata.

Rules:
1. User selects package and sees server-configured price/duration before payment.
2. Payment submission creates PENDING request; client callback alone cannot activate access.
3. Authorized admin verifies transaction and approves/rejects with audit record.
4. Approval creates a package-scoped entitlement; expiration disables access automatically on server checks.
5. Every protected API checks user identity, active entitlement and requested feature scope.
6. Daily, Single Study and Full Study permissions must not leak into one another.
7. Admin role is granted only through trusted server-side process; never via public signup or client-editable profile field.
