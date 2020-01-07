# How to Contribute

Thank you for your interest in contributing to ISREN! Included are some general
rules to follow that will help ease the contribution process.

- [Bug Reports](#bug-reports)
  - [Reporting Bugs](#reporting-bugs)
  - [Fixing an Outstanding Issue](#fixing-an-outstanding-issue)
- [Code Changes](#code-changes)
  - [Technology](#technology)
  - [Branding](#branding)
  - [Tests](#tests)
  - [Code Formatting](#code-formatting)
  - [Code Linting](#code-linting)
  - [Pull Requests](#pull-requests)
  - [Commit Messages](#commit-messages)
  - [Changelog](#changelog)
  - [Versioning](#versioning)
  - [Changes to Data Flow](#changes-to-data-flow)
  - [Contribution Agreement](#contribution-agreement)

## Bug Reports

### Reporting bugs

Before reporting bugs, please ensure the bug was not already reported by
searching the open issues. If you're unable to find an open issue addressing the
problem, open a new one. Be sure to include a title and clear description, as
much relevant information as possible, and a code sample or an executable test
case demonstrating the expected behavior that is not occurring.

> Note: Due to the nature of this program and the data usually contained within
> git repositories, caution should be exercised when sharing program output. It
> is advised that you scrub any identifying/confidential information before
> sharing any output generated from ISREN.

### Fixing an Outstanding Issue

When fixing an outstanding issue:

- Open a new pull request with the fix.
- Ensure the pull request description clearly describes the problem and
  solution. Include the relevant issue number if applicable (e.g `closes #14`)
- Please familiarize yourself with the [Code Changes](#code-changes) section of
  this guide.

## Code Changes

### Technology

ISREN should utilize LTS dependencies where possible to ensure minimal
turbulence in-between releases. Dependencies should only be added to the project
in rare occurrences, when their functionality would take a considerable amount
of time to replicate, e.g. adding support for a new service. 

### Branding

ISREN is an [Acronym](https://en.wikipedia.org/wiki/Acronym), so for consistency
it should only appear in two different variations:

1. When appearing as a name, it should be displayed as `ISREN`
2. When appearing in a code example, it should be displayed as its literal
   executable name `isren`

### Tests

ISREN is heavily tested, and it should remain that way to maximize system
reliability, and minimize the amount of manual intervention required for testing
new features. If you are contributing a new feature or functionality, please
include applicable tests to ensure any future developer can't accidentally break
core functionality. ISREN currently has <95% test coverage, all contributions
should aim to keep or improve that coverage.

The tests can be run with the npm script `test`: `npm run test`

Test coverage can be calculated using the npm script `coverage`:
`npm run coverage`

### Code Formatting

This project uses [Prettier](https://prettier.io/) for code formatting and can
run with the npm script `format`: `npm run format`

All formatting errors should be resolved before a merge is accepted.

> Note: The formatting script is configured to overwrite files, so it's
> recommended that you save all your files before and after running it to ensure
> git picks up the changes.

### Code Linting

This project uses [eslint](https://eslint.org/) for code linting and can be run
with the npm script `lint`: `npm run lint`

All lint errors should be resolved before a merge is accepted. Lint issues
should not be fixed with lint ignores. Very obscure lint edge-cases will be
judged on a per case basis for lint ignore consideration.

### Pull Requests

All pull requests should be created off of the master branch, so they represent
the latest version of code. It is common to fall behind during periods of active
development. Please ensure your branch is up-to-date with master when you seek
review and acceptance.

If you have issues pulling in the latest code, please reach out for assistance.

### Commit Messages

Upon successful merge, commits will be squashed. It is important to capture
contextual information in each pull request, so it is requested that you make
meaningful commit messages so that we have context when reviewing changes, for
the initial merge or when debugging in the future.

### Changelog

Each change to ISREN should contain an entry in the
[CHANGELOG.md](./CHANGELOG.md) file. Each new release should start a new
unreleased section:

```markdown
## [UNRELEASED]
```

### Versioning

This project adheres to
[Semantic Versioning](https://semver.org/spec/v2.0.0.html). Please keep this in
mind when making changes to the [CHANGELOG.md](./CHANGELOG.md) file or
`package.json`. 

### Changes to Data Flow

All changes to data flow or the internal structure of ISREN should be reflected
in the [README.md Data Flow Graphic](README.md#data-flow) and the link below.

The current graphic can be found on
[mermaidjs.github.io](https://mermaidjs.github.io/mermaid-live-editor/#/edit/eyJjb2RlIjoiZ3JhcGggVERcblxuc3ViZ3JhcGggQ29uZmlndXJhdGlvblxuYVtDTEkgUGFyYW1ldGVyc11cbmJbLmVudl1cbmVuZFxuXG5zdWJncmFwaCBJU1JFTlxuY1tEZXRlcm1pbmUgR2l0IFNlcnZpY2VdXG5kW0dpdCBTZXJ2aWNlIEF1dGhlbnRpY2F0aW9uXVxuZVtHZXQgQWxsIElzc3Vlc11cbmZbUnVuIElzc3VlcyBUaHJvdWdoIFRyYW5zZm9ybXNdXG5nW091dHB1dCBQcm9jZXNzZWQgSXNzdWVzXVxuZW5kXG5cbmEtLT5jXG5iLS0-Y1xuYy0tPmRcbmQtLT5lXG5lLS0-ZlxuZi0tPmciLCJtZXJtYWlkIjp7InRoZW1lIjoibmV1dHJhbCJ9fQ)

> Note: SVG rendering does not seem to accurately replicate the display from
> the website, so a cropped screenshot should be used.

### Contribution Agreement

By contributing to this project, you agree that your contributions will be
licensed under the same terms defined in the [LICENSE](./LICENSE)

