import path from "path";
import readPkg from "read-pkg";
import AggregateError from "aggregate-error";
import getError from "./get-error.js";

export default async function ({ pkgRoot }, { cwd }) {
  try {
    const pkg = await readPkg.sync({ cwd: pkgRoot ? path.resolve(cwd, String(pkgRoot)) : cwd });

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