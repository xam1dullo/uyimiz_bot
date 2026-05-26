# ADR 0006: Tenant RLS and Database Roles

**Status:** Accepted

Families are tenant roots: `families.id` is the current family context, and all other tenant-owned tables must have a non-optional `family_id`. Runtime access uses a restricted `uyimiz_app` role subject to RLS, while schema ownership and migrations use `uyimiz_owner`; `postgres` is only a local bootstrap/superuser role and must not be used by the running API.

Pre-context onboarding/auth flows may resolve Telegram identity or invite codes, but after an invite resolves to a family, reads and writes must enter that family context. This keeps tenant isolation enforceable at the database layer instead of relying on every application call site to remember the right filter.
