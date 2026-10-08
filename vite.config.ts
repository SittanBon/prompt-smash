import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// The project type-checks without Node typings; this config only reads env vars.
declare const process: { env: Record<string, string | undefined> };

// Production base path for GitHub Pages, taken from the real repository:
// - PAGES_BASE_PATH is set by the deploy workflow from actions/configure-pages
//   ("/prompt-smash" for a project site, "" for a USERNAME.github.io site).
// - Otherwise GITHUB_REPOSITORY ("owner/name") is used, so any CI build is right.
// - Locally the base stays relative ('./'), which works from any sub-path.
function pagesBase(): string {
  const fromPages = process.env.PAGES_BASE_PATH;
  if (fromPages !== undefined) return `${fromPages.replace(/\/+$/, '')}/`;
  const repo = process.env.GITHUB_REPOSITORY?.split('/')[1];
  if (repo) return repo.toLowerCase().endsWith('.github.io') ? '/' : `/${repo}/`;
  return './';
}

export default defineConfig({
  base: pagesBase(),
  plugins: [react()],
});
