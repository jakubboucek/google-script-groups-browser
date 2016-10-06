# Google Script - Groups Browser
Browser of Google Groups in G Suite for domain's users

This tool allows your user to simple browse company's groups. Because Google doesn't provide any simple list of your Groups in domain you can use this tool to allow your users simple look to Groups and their members.

It's inspired by [Romain Vialard](https://plus.google.com/u/0/+RomainVialard-public/posts)'s [Groups Directory](https://sites.google.com/site/scriptsexamples/available-web-apps/list-members-of-a-group) (origin source code of Script is no more available).

![Warning:](https://www.iconfinder.com/icons/183416/download/svg/16) **This app can only be installed by a G Suite domain administrator**

## Requirements

- This tool is usable only on non-free G Suite (formerly called Google Apps for Work)
- You must be G Suite administrator for set-up app with minimal role privileges:
  - Users (read)
  - Groups (read)
- Organization utits must have [enabled Drive and Groups services](https://support.google.com/a/answer/182426) and [allowed access to various G Suite Administrative APIs](https://support.google.com/a/answer/60757).

## Setup
The first step is to create your Script and copy source code to it.

  1. Create a new standalone Script in your Google Drive ([instructions available here](https://developers.google.com/apps-script/managing_projects#creatingDrive)).
  2. Open source code of [Code.gs](Code.gs), copy the entire contents and put it into script.
  3. Create new HTML file in project (`File` > `New` > `HTML file`), name it `Index` and copy here content of [Index.html](Index.html) file.

### Activate Admin Directory API in Advanced Google Services
Google Script's capability allows simple access to Google services throught API - for security reasons you must enable each used API endpoint first. Please [read basic instructions first](https://developers.google.com/apps-script/guides/services/advanced).

> **Technically note:** Every Google Script is inside Google platform represented as one Project of Google Cloud. When you make a new Script, is concurrently created one Project.

Following steps enable access to **Admin Directory API** for this Project:
  4. Go to `Resources` > `Advanced Google Services` in menu
  5. Turn swith for `Admin Directory API` to `on`
  6. Below click to `Google Developers Console` link (it contains direct URL to Console of your Project)
  7. Click to `ENABLE API` button
  8. Search "`Admin`"
  9. Click to `Admin SDK`
  10. Press `ENABLE` above

### First run
You already have prepared Script and Project to run. Last step is authorize Script to run as your User account identity.

  1. Switch back to Script, select `Code.gs` tab
  2. On Select in toolbar select anyone function
  3. Run script by Play button
  4. Script challenge you to authorize access to API. Required permissions should be only:
    - Know who you are on Google
    - View your email address
    - View users on your domain
    - View groups on your domain
    - View group subscriptions on your domain
    - Allow this application to run when you are not present

### Deploy
Deploy process make your app reacheable on public URL for all users. 

  1. Go to `Publish` > `Deploy as web app…`
  2. Select current version (if not yet exists, choose `New` and describe version name - like a "My first version")
  3. On `Execute the app as` choose `Me`
  4. On `Who has access to the app` choose `Anyone within yourdomain.com`
  5. Press `Deploy`
  6. You get URL with deployed app

Enjoy!
