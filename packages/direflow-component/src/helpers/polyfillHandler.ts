import { IDireflowPlugin } from '../types/DireflowConfig';
import asyncScriptLoader from './asyncScriptLoader';

type TWcPolyfillsLoaded = Array<{ script: Element; hasLoaded: boolean }>;
declare global {
  interface Window {
    wcPolyfillsLoaded: TWcPolyfillsLoaded;
  }
}

let didIncludeOnce = false;

const DEFAULT_SD = 'https://cdn.jsdelivr.net/npm/@webcomponents/webcomponentsjs@2.4.1/bundles/webcomponents-sd.js';
const DEFAULT_CE = 'https://cdn.jsdelivr.net/npm/@webcomponents/webcomponentsjs@2.4.1/bundles/webcomponents-ce.js';
const DEFAULT_AD = 'https://cdnjs.cloudflare.com/ajax/libs/webcomponentsjs/2.4.1/custom-elements-es5-adapter.js';

const includePolyfills = async (
  options: { usesShadow: boolean },
  plugins: IDireflowPlugin[] | undefined,
) => {
  if (didIncludeOnce) {
    return;
  }
  const scriptsList = [];

  let useSD = '';
  let useCE = '';
  let useAD = '';
  const polyfillLoaderPlugin = plugins?.find((plugin) => plugin.name === 'polyfill-loader');

  const disableSD = polyfillLoaderPlugin?.options?.use.sd === false;
  const disableCE = polyfillLoaderPlugin?.options?.use.ce === false;
  const disableAD = polyfillLoaderPlugin?.options?.use.adapter === false;

  if (polyfillLoaderPlugin?.options?.use.sd) {
    useSD = typeof polyfillLoaderPlugin.options?.use.sd === 'string'
      ? polyfillLoaderPlugin.options?.use.sd
      : DEFAULT_SD;
  }

  if (polyfillLoaderPlugin?.options?.use.ce) {
    useCE = typeof polyfillLoaderPlugin.options?.use.ce === 'string'
      ? polyfillLoaderPlugin.options?.use.ce
      : DEFAULT_CE;
  }

  if (polyfillLoaderPlugin?.options?.use.adapter) {
    useAD = typeof polyfillLoaderPlugin.options?.use.adapter === 'string'
      ? polyfillLoaderPlugin.options.use.adapter
      : DEFAULT_AD;
  }

  if (options.usesShadow && !disableSD) {
    scriptsList.push(asyncScriptLoader(useSD || DEFAULT_SD, 'wcPolyfillsLoaded'));
  }

  if (!disableCE) {
    scriptsList.push(asyncScriptLoader(useCE || DEFAULT_CE, 'wcPolyfillsLoaded'));
  }

  if (!disableAD) {
    scriptsList.push(asyncScriptLoader(useAD || DEFAULT_AD, 'wcPolyfillsLoaded'));
  }

  try {
    await Promise.all(scriptsList);
    didIncludeOnce = true;
  } catch (error) {
    console.error(error);
  }
};

export default includePolyfills;
