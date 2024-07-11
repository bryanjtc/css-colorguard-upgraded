import path from "path";
import AggregateError from "aggregate-error";
import getError from "./get-error.js";

const readPkg = require('read-pkg');


export default async function ({ pkgRoot }, { cwd }) {
  try {
    const pkg = await readPkg({ cwd: pkgRoot ? path.resolve(cwd, String(pkgRoot)) : cwd });

    if (!pkg.name) {
      throw getError("ENOPKGNAME");
    }

    return pkg;
  } catch (error) {
    if (error.code === "ENOENT") {
      throw new AggregateError([getError("ENOPKG")]);
    }

    throw new AggregateError([error]);
  }
}