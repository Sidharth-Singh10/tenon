import { cpSync, existsSync, mkdirSync, rmSync, writeFileSync } from "node:fs"
import { resolve } from "node:path"

/**
 * Compose the static landing page.
 *
 * The interactive demo is the Amaterasu reference app, which is deployed from
 * its own repository. The landing page links to it directly, so this build is a
 * pure copy: no SPA build, no composed /demo directory.
 */

const root = resolve(import.meta.dirname, "..")
const siteDir = resolve(root, "site")
const siteOut = resolve(root, "_site")

const rawBase = process.env.SITE_BASE ?? ""
const base = rawBase === "" ? "" : `/${rawBase.replace(/^\/+|\/+$/g, "")}`

if (!existsSync(siteDir)) throw new Error(`missing ${siteDir}`)

rmSync(siteOut, { recursive: true, force: true })
mkdirSync(siteOut, { recursive: true })
cpSync(siteDir, siteOut, { recursive: true })

// GitHub Pages runs Jekyll unless this file is present.
writeFileSync(resolve(siteOut, ".nojekyll"), "")

if (process.env.SITE_CNAME) {
  writeFileSync(resolve(siteOut, "CNAME"), `${process.env.SITE_CNAME}\n`)
}

console.log(`wrote ${siteOut}`)
console.log(`landing: ${base || ""}/`)
