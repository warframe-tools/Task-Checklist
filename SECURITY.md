# Security Policy

## Supported Versions

This security policy applies to the latest version of the Warframe Task Checklist available on the `main` branch.

| Version | Supported          |
| ------- | ------------------ |
| 2.x.x   | :white_check_mark: |

## Reporting a Vulnerability

The Warframe Task Checklist is a purely client-side application. It runs entirely within your browser and does not communicate with any external server owned or operated by this project for its core functionality (beyond loading assets like fonts or the Tailwind CSS CDN). Data (checklist progress, theme preference) is stored only in your browser's `localStorage`.

Despite this limited scope, we take security seriously. If you believe you have found a security vulnerability, we appreciate your help in disclosing it responsibly.

**How to Report:**

Please report suspected vulnerabilities directly via **GitHub Security Advisories**.

1.  Go to the main page of the repository on GitHub.
2.  Click on the **Security** tab.
3.  Click on **Advisories**.
4.  Click **Report a vulnerability**.
5.  Fill out the form with as much detail as possible, including:
    * A clear description of the vulnerability.
    * Steps to reproduce the vulnerability.
    * Any potential impact.
    * Possible mitigation suggestions (if any).

**Scope:**

We are primarily interested in vulnerabilities such as:

* **Cross-Site Scripting (XSS):** Vulnerabilities that could allow malicious scripts to run in another user's browser context (though the current application design minimizes this risk as it doesn't process external user-generated content).
* **Data Exposure:** Issues related to the insecure handling or potential leakage of data stored in `localStorage` (though this data is local to the user's browser).
* **Dependency Issues:** Vulnerabilities originating from the external dependencies used (e.g., Tailwind CSS CDN - although these are generally managed by the CDN provider).

**Out of Scope:**

* **Server-Side Vulnerabilities:** As this is a client-side application, there are no project-specific servers to target.
* **Vulnerabilities in GitHub Pages or CDNs:** Issues with the underlying hosting platform or CDN should be reported to GitHub or the respective CDN provider.
* **Social Engineering:** Attempts to trick users into performing actions.
* **Denial of Service:** Issues related to overwhelming the GitHub Pages service.

**Our Commitment:**

* We will acknowledge receipt of your vulnerability report promptly (usually within 48 hours).
* We will investigate the report and determine its validity and severity.
* We will work to address valid vulnerabilities in a timely manner.
* We will credit you for your discovery if you wish (unless you prefer to remain anonymous).

Thank you for helping keep the Warframe Task Checklist secure!
