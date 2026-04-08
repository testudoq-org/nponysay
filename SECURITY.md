# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| Latest  | ✅ Yes             |
| Older   | ❌ No              |

This is a small open-source CLI tool. Only the latest released version is actively supported for security updates.

## Reporting a Vulnerability

If you discover a security vulnerability in **nponysay**, please report it responsibly.

**Please do NOT open a public GitHub issue.**

### How to report:
1. Go to the [Security Advisories page](https://github.com/testudoq-org/nponysay/security/advisories)
2. Click **"New security advisory"** or **"Report a vulnerability"**
3. Fill in the details of the vulnerability

Alternatively, you can email the maintainer directly:

- **Email**: admin@testudoq.co.nz (or your preferred email)

### What to include in the report:
- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)
- Affected version(s)

## Response Time

- We will acknowledge your report within **best endeavour**.
- We aim to provide a full response or fix within **asap days** (depending on complexity).
- 

## Security Updates

- Security fixes will be released as soon as reasonably possible.
- Dependabot is configured to automatically open PRs for security vulnerabilities in dependencies.
- Codacy, snyk and sonarcloud automatically scan for added security protections

## Note about Dependencies

This project uses [Puppeteer](https://github.com/puppeteer/puppeteer), which downloads a full Chromium browser. While we keep dependencies updated for security, please be aware that large dependencies like Puppeteer can occasionally introduce transitive vulnerabilities.

---

Thank you for helping keep **nponysay** secure! 🙏
