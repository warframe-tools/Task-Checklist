# Warframe Task Checklist Web App

A simple, client-side web application to help Warframe players track their daily, weekly, and bi-weekly in-game tasks.

## Repository Updates

This repository will be updated (if changes are made) on the weekly reset (00:00 UTC) to avoid resets to the application hosted on Pages. To avoid any accidental resets of your progress, please fork this repository and host it yourself, or download it and use it locally (and make sure to update it weekly with any changes if needed).

## Description

This tool provides checklists for common recurring activities in Warframe. It saves your progress directly in your browser's local storage, automatically resets daily and weekly tasks based on UTC time, and offers a few customization options.

## Features

* **Task Tracking:** Check off tasks as you complete them.
* **Categorized Lists:** Tasks are separated into Daily, Weekly, and Bi-Weekly sections.
* **Local Storage:** Your checklist progress is automatically saved in your browser's local storage, so it persists between sessions.
* **Automatic Resets:**
    * Daily tasks automatically reset after 00:00 UTC each day.
    * Weekly tasks automatically reset after Monday 00:00 UTC each week.
    * Local reset times are displayed in section headers for convenience.
* **Manual Resets:** Buttons are provided to manually reset Daily, Weekly, or All tasks if needed. Includes a confirmation step to prevent accidental resets.
* **Collapsible Sections:** Each task section (Daily, Weekly, Bi-Weekly) can be collapsed or expanded by clicking its header.
* **Theme Toggle:** Switch between a dark (default) and light theme for the checklist content area. Your preference is saved locally.
* **Rotating Background:** Features a daily rotating background image.
* **Error Handling:** Displays user-friendly error messages within the app (e.g., if saving fails) and allows copying the error details.
* **Responsive Design:** Basic responsive layout using Tailwind CSS.

## How to Use

1.  **Download:** Download the `index.html` file and the `assets` folder.
2.  **Placement:** Ensure the `assets` folder is in the same directory as the `.html` file.
3.  **Open:** Open the `index.html` file in your web browser.

Alternatively, if hosted (e.g., on GitHub Pages), simply navigate to the provided URL.

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

## Credits

* **Tailwind CSS:** [https://tailwindcss.com/](https://tailwindcss.com/)
* **Inter Font:** [https://fonts.google.com/specimen/Inter](https://fonts.google.com/specimen/Inter)
* Task list based on information discussed in the Warframe community.

## Disclaimer

This is an unofficial fan-made tool. Warframe and all related assets are the intellectual property of Digital Extremes Ltd. This project is not affiliated with, endorsed by, or sponsored by Digital Extremes Ltd.

## License

This project is licensed under the **GNU General Public License v3.0 (GPLv3)**. See the [LICENSE](https://github.com/warframe-tools/Task-Checklist?tab=GPL-3.0-1-ov-file) file for details.