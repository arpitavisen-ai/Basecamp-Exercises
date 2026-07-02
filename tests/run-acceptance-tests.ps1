# run-acceptance-tests.ps1
# Usage:
#   .\tests\run-acceptance-tests.ps1                        # test production URL
#   .\tests\run-acceptance-tests.ps1 -Url http://localhost:5173   # test local dev server
#   .\tests\run-acceptance-tests.ps1 -Headed                # show browser window

param(
  [string]$Url = "https://refine-problem-statement.vercel.app",
  [switch]$Headed,
  [switch]$Report
)

$env:BASE_URL = $Url
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host " Patient Feedback Intelligence Platform" -ForegroundColor Cyan
Write-Host " Acceptance Test Suite" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host " Target: $Url" -ForegroundColor Yellow
Write-Host ""

$args = @("playwright", "test", "--config=playwright.config.ts")
if ($Headed) { $args += "--headed" }

npx @args

$exitCode = $LASTEXITCODE

Write-Host ""
if ($exitCode -eq 0) {
  Write-Host "✅  All acceptance tests PASSED" -ForegroundColor Green
} else {
  Write-Host "❌  Some acceptance tests FAILED (exit $exitCode)" -ForegroundColor Red
  Write-Host "   Open tests/report/index.html for details" -ForegroundColor Yellow
}

if ($Report) {
  npx playwright show-report tests/report
}

exit $exitCode
