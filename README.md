# Warframe Task Checklist Web App

A simple, client-side web application to help Warframe players track their daily, weekly, and bi-weekly in-game tasks.

## Repository Updates

This repository will be updated (if changes are made) on the weekly reset (00:00 UTC) to avoid resets to the application hosted on Pages. To avoid any accidental resets of your progress, please fork this repository and host it yourself, or download it and use it locally (and make sure to update it weekly with any changes if needed).

## Description

This tool provides checklists for common recurring activities in Warframe. It saves your progress directly in your browser's local storage, automatically resets daily and weekly tasks based on UTC time, and offers a few customization options.

## Features

* **Comprehensive Task Lists:** Includes common daily, weekly, and bi-weekly tasks.
    * **Collapsible Sections:** Each major section (Daily, Weekly, Bi-Weekly) can be expanded or collapsed for a cleaner view.
    * **Subtasks:** Daily World Syndicate tasks are broken down into collapsible subtasks for specific syndicates (Ostron, Solaris United, Entrati, Cavia, etc.) with linked parent/child checking behavior.
* **Local Progress Saving:** Your checked tasks are saved directly in your browser's local storage, so your progress persists even if you close the tab or browser.
* **Automatic Resets with Local Time Display:**
    * Daily tasks reset automatically after 00:00 UTC.
    * Weekly tasks reset automatically after Monday 00:00 UTC.
    * Section headers display a dynamic countdown timer (e.g., "Resets in HH:MM:SS") showing the time remaining until the next reset in your local timezone.
* **Manual Reset Options:**
    * Buttons to manually reset "Daily Checks," "Weekly Checks," or "All Checks."
    * These buttons feature a two-click confirmation ("Are you Sure?") with a 10-second timeout to prevent accidental resets.
* **Customizable Theme:**
    * Toggle between a dark mode (default) and a light mode for the main content area.
    * Theme preference is saved in local storage.
* **Dynamic Background:**
    * Features a daily rotating background image (currently includes user-provided images and placeholders, with the ability to add more).
* **User-Friendly Error Handling:**
    * Displays clear error messages within the app if issues occur (e.g., problems saving to local storage).
    * Includes a "Copy" button in the error display to easily copy error details for reporting.
* **Responsive Design:** Styled with Tailwind CSS for a generally responsive layout on different screen sizes.
* **Footer Information:** Includes links to relevant resources (GitHub, License, Warframe Hub, Warframe Wiki, FrameHub), app version, and current Warframe version.

## How to Use

There are a few ways to use the Warframe Task Checklist:

1.  **Directly from Github Pages on this repository (Recommended for most users):**
    * Go directly to the Github Page that is run from this repository! https://warframe-tools.github.io/Task-Checklist/

2.  **GitHub Pages:**
    * The easiest way is to **fork this repository** to your own GitHub account.
    * Enable GitHub Pages for your forked repository (usually under `Settings > Pages`, select the `main` branch and `/ (root)` folder).
    * You will then have your own live version of the checklist that you control.
    * **Update Schedule:** The main `warframe-tools/Task-Checklist` repository will aim to be updated with new tasks or game version changes around the weekly reset (Monday 00:00 UTC) to avoid disrupting users mid-week. You can then pull these updates into your fork.

3.  **Download and Run Locally:**
    * Download the source package below and unzip it to your desired location.
    * The structure should be:
        ```
        your_folder/
        ├── index.html
        └── assets/
            └── your_image.jpg
            └── another_image.jpg
        ```
    * Open the `index.html` file directly in your web browser.
    * If you add images, make sure you update the code in the .html file with those image locations!

## Feedback, Issues & Feature Requests

Have feedback or have an idea for a new feature? Please use **GitHub Discussions**!

1.  **Go to Discussions:** Navigate to the [Discussions](https://github.com/warframe-tools/Task-Checklist/discussions) tab of this repository.
2.  **Choose a Category:** Select the most appropriate category (e.g., "Ideas" for feature requests, "Q&A" for questions, "General" for feedback, or create a new discussion if unsure).
3.  **Start Discussion:** Click "New discussion".
4.  **Describe:**
    * Provide a clear and concise title.
    * **For Bugs:** Describe the steps to reproduce the issue, what you expected, what happened, and paste any error messages (use the "Copy" button in the app's error bar if available). Include browser/OS info if possible.
    * **For Features:** Explain the feature clearly and why it would be useful.
    * **For Feedback:** Share your thoughts!
5.  **Submit:** Click "Start discussion".

## Reporting Issues (Bugs)

If you encounter a bug, graphical glitch, or something isn't working as expected, please report it using the **GitHub Issue Tracker**:

1.  **Check for Existing Issues:** First, please check the [Issues](https://github.com/warframe-tools/Task-Checklist/issues) tab to see if someone has already reported the same problem.
2.  **New Issue:** If not, click "New issue".
3.  **Describe the Bug:**
    * Provide a clear and concise title (e.g., "Weekly Reset Button Doesn't Reset All Weekly Tasks").
    * Describe the exact steps you took to encounter the bug.
    * What did you expect to happen?
    * What actually happened?
    * **Paste any error messages** shown in the app's error bar (use the "Copy" button) or from your browser's developer console.
    * Include your browser name and version, and operating system if possible.
4.  **Submit:** Click "Submit new issue".

## Support the Project

If you find this tool useful, consider supporting its development!

* **GitHub Sponsors:** You can sponsor this project via the [Sponsor](https://github.com/sponsors/warframe-tools) button on the repository page.
* **Create a Pull Request:** Do you have a feature you would like added, or a task that you would like added that could benefit other Tenno? Fork the repository, and create a pull request!

## Credits

* **Tailwind CSS:** [https://tailwindcss.com/](https://tailwindcss.com/)
* **Inter Font:** [https://fonts.google.com/specimen/Inter](https://fonts.google.com/specimen/Inter)
* Task list based on information discussed in the Warframe community.

## Disclaimer

This is an unofficial fan-made tool. Warframe and all related assets are the intellectual property of Digital Extremes Ltd. This project is not affiliated with, endorsed by, or sponsored by Digital Extremes Ltd.

## License

This project is licensed under the **GNU General Public License v3.0 (GPLv3)**. See the [LICENSE](https://github.com/warframe-tools/Task-Checklist?tab=GPL-3.0-1-ov-file) file for details.