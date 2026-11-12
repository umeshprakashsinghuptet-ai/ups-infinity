# Release QA checklist — live/manual acceptance (25 checks)

Automated source checks are tracked separately in `FINAL_QA_REPORT_HI.md`. None of the following live/manual checks should be marked PASS until performed on the deployed environment.

## Desktop (4)
- [ ] Chrome/Edge: navigation, wizard, forms, copy brief
- [ ] 1366×768 and 1920×1080 layouts
- [ ] Keyboard focus and readable contrast
- [ ] Search empty/error/success states and project save/load

## Mobile (5)
- [ ] Android Chrome 360px / 390px widths
- [ ] Sidebar open/close
- [ ] Wizard scroll and keyboard behavior
- [ ] PWA install and offline fallback
- [ ] No horizontal overflow

## Supabase (5)
- [ ] Auth redirect URL configured
- [ ] Register/login/logout
- [ ] RLS blocks access to other users' rows
- [ ] Project insert/select/update/delete
- [ ] No service-role key in browser bundle

## Backend (7)
- [ ] HTTPS enabled
- [ ] CORS restricted to known origins
- [ ] Rate limit active (including auth-specific limit)
- [ ] Health/capabilities endpoint
- [ ] Search RSS failure handled
- [ ] AI provider failure handled
- [ ] Secrets stored in host environment, not GitHub

## Release (4)
- [ ] Privacy policy and terms
- [ ] Copyright and platform policy review
- [ ] Backup and rollback tested
- [ ] Actual feature status matches end-to-end test results

**Total live/manual checks: 25.** These are not passed by static unit tests.
