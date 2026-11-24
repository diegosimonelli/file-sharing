# FileShare

Simple temporary file sharing built with Angular. Upload a file, get a share link, and track each link's 60-minute expiry. Live at https://filesharingbydiego.netlify.app/

## Stack

Angular 21 (standalone components), TypeScript, tmpfiles.org upload API.

## How uploads work

The app posts files to `/api/file`. That path is forwarded to `https://tmpfiles.org/api/v1/upload`:

- in production by Netlify, via `src/_redirects` (copied into the build output)
- in development by the Angular dev server, via `proxy.conf.json`

tmpfiles.org deletes uploads after 60 minutes; the UI shows a live countdown for each file.

## Run locally

Requires Node 20.19+ or 22.12+.

```bash
npm install
npm start        # dev server at http://localhost:4200
npm run build    # production build in dist/file-sharing/browser
```
