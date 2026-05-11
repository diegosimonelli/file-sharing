# FileSharing

Simple file sharing app created with Angular.

## Local development

This project uses Angular 11 and the matching Angular CLI/Webpack build tooling. That stack is older than current Node releases, so the npm scripts run Angular through Node's `--openssl-legacy-provider` flag to avoid `ERR_OSSL_EVP_UNSUPPORTED` on modern Node/OpenSSL versions.

The project also pins Angular CLI's transitive PostCSS version with an npm `overrides` entry. This keeps the older Angular 11 CSS loader compatible with modern Node's package export rules.

Uploads are sent through `/api/file`, which is proxied to `https://tmpfiles.org/api/v1/upload` during local development. The original file.io upload endpoint this app used no longer accepts the old anonymous `POST https://file.io` flow reliably, so the app now uses a compatible temporary-file upload API and normalizes its response internally.

Uploaded files are temporary. TmpFiles automatically deletes uploads after 60 minutes, and the UI shows each file's expiry time with a live countdown.

Recommended Node versions:

- Best compatibility: Node 16 LTS.
- Modern local development: Node 18+ can run with the included OpenSSL legacy provider workaround.

Install dependencies:

```bash
npm install
```

Run the app locally:

```bash
npm start
```

Build the app:

```bash
npm run build
```

The development server uses Angular CLI's default local URL, usually `http://localhost:4200/`.

For Netlify deploys, `src/_redirects` provides the same `/api/file` proxy route.

## Deployment

This project is deployed on https://filesharingbydiego.netlify.app/
