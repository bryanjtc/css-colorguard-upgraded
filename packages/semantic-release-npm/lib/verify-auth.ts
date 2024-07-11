import AggregateError from "aggregate-error";
import getError from "./get-error.js";
import getRegistry from "./get-registry.js";
import setNpmrcAuth from "./set-npmrc-auth.js";

const execa = require("execa");
const normalizeUrl = require("normalize-url")

export default async function (npmrc, pkg, context) {
  const {
    cwd,
    env: { DEFAULT_NPM_REGISTRY = "https://registry.npmjs.org/", ...env },
    stdout,
    stderr,
  } = context;
  const registry = getRegistry(pkg, context);

  await setNpmrcAuth(npmrc, registry, context);

  if (normalizeUrl(registry) === normalizeUrl(DEFAULT_NPM_REGISTRY)) {
    try {
      const whoamiResult = execa("npm", ["whoami", "--userconfig", npmrc, "--registry", registry], {
        cwd,
        env,
        preferLocal: true,
      });
      whoamiResult.stdout.pipe(stdout, { end: false });
      whoamiResult.stderr.pipe(stderr, { end: false });
      await whoamiResult;
    } catch {
      throw new AggregateError([getError("EINVALIDNPMTOKEN", { registry })]);
    }
  }
}