# promote.ps1
# Merges develop -> main and pushes to trigger a production Vercel deploy.
# Run this after reviewing the app locally with `npm run dev`.
#
# Usage: npm run promote

$ErrorActionPreference = 'Stop'

function Write-Step($msg) { Write-Host "`n── $msg" -ForegroundColor Cyan }
function Write-Ok($msg)   { Write-Host "  ✓ $msg" -ForegroundColor Green }
function Write-Fail($msg) { Write-Host "  ✗ $msg" -ForegroundColor Red; exit 1 }

Write-Step "Checking working tree is clean"
$status = git status --porcelain
if ($status) {
    Write-Fail "Uncommitted changes detected. Commit or stash them before promoting.`n$status"
}
Write-Ok "Working tree clean"

Write-Step "Checking current branch"
$branch = git rev-parse --abbrev-ref HEAD
if ($branch -ne 'develop') {
    Write-Fail "You must be on the 'develop' branch to promote. Currently on: $branch"
}
Write-Ok "On develop"

Write-Step "Pulling latest develop from upstream"
git pull upstream develop --no-rebase
Write-Ok "develop is up to date"

Write-Step "Building locally to catch any compile errors"
pnpm build
if ($LASTEXITCODE -ne 0) { Write-Fail "Build failed — fix errors before promoting." }
Write-Ok "Build passed"

Write-Host "`n── Local review" -ForegroundColor Cyan
Write-Host "  Run 'pnpm dev' in another terminal to review the app at http://localhost:5173" -ForegroundColor Yellow
$confirm = Read-Host "  Have you reviewed the app locally and are happy to deploy to production? (y/N)"
if ($confirm -notmatch '^[Yy]$') {
    Write-Host "  Promotion cancelled. Run 'npm run dev' to review first." -ForegroundColor Yellow
    exit 0
}

Write-Step "Switching to main"
git checkout main
git pull upstream main --no-rebase
Write-Ok "main is up to date"

Write-Step "Merging develop into main"
git merge develop --no-ff -m "Promote develop -> main: deploy to production"
Write-Ok "Merge complete"

Write-Step "Pushing main to upstream (triggers Vercel production deploy)"
git push upstream main
Write-Ok "Pushed — CI pipeline running at https://github.com/arpitavisen-ai/refine-problem-statement/actions"

Write-Step "Switching back to develop"
git checkout develop
Write-Ok "Back on develop — ready for next change"

Write-Host "`n✅ Promotion complete. Production deploy in progress." -ForegroundColor Green
Write-Host "   Watch: https://github.com/arpitavisen-ai/refine-problem-statement/actions" -ForegroundColor Gray
Write-Host "   Live:  https://refine-problem-statement.vercel.app`n" -ForegroundColor Gray
