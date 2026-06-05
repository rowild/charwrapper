# Agent Notes

## `fin-patch`

When the user writes `fin-patch`, finish the current patch by doing all of the following:

- Increase the patch version.
- Document all changes in the files that need to know about them, including `CHANGELOG.md`.
- Update `AGENTS.md` if the workflow or project instructions changed.
- Run the relevant checks.
- Create clean, descriptive git commit(s). Use more than one commit when the work naturally separates into different ideas.

Do not treat `fin-patch` as only a summary request.

## Changelog

Maintain `CHANGELOG.md` for every versioned patch. Use version and date chapter headings:

```md
## 2.0.2 - 2026-06-05
```

Keep entries concise and grouped by useful categories such as Added, Changed, Fixed, Documentation, and Tests.

If a lockfile is intentionally ignored by the repository, do not force-add it during `fin-patch` unless the user explicitly asks.
