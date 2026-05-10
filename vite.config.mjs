import { defineConfig } from 'vite';

const normalizeBasePath = (basePath) => {
  if (!basePath.startsWith('/')) {
    return `/${basePath.replace(/^\/+/, '')}`;
  }

  return basePath.endsWith('/') ? basePath : `${basePath}/`;
};

const getBasePath = () => {
  if (process.env.VITE_BASE_PATH) {
    return normalizeBasePath(process.env.VITE_BASE_PATH);
  }

  const repositoryName = process.env.GITHUB_REPOSITORY?.split('/')[1];
  const isGitHubPagesUserSite = repositoryName?.toLowerCase().endsWith('.github.io');

  if (process.env.GITHUB_ACTIONS === 'true' && repositoryName && !isGitHubPagesUserSite) {
    return `/${repositoryName}/`;
  }

  return '/';
};

export default defineConfig({
  base: getBasePath(),
});
