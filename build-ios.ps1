Write-Host "🚀 Citim versiunea curenta din app.json..."

# Path fisier app.json
$appJsonPath = "app.json"

if (-Not (Test-Path $appJsonPath)) {
    Write-Host "❌ Eroare: Nu am gasit app.json in folderul curent."
    exit 1
}

# Citim JSON-ul
$appJsonRaw = Get-Content $appJsonPath -Raw
$appJson = $appJsonRaw | ConvertFrom-Json

if (-not $appJson.expo) {
    Write-Host "❌ Eroare: campul expo nu exista in app.json."
    exit 1
}

$appVersion = $appJson.expo.version
Write-Host "📦 Versiune aplicatie: $appVersion"

# Preia ultimele build-uri iOS
try {
    $buildsRaw = eas build:list --platform ios --limit 10 --json --non-interactive
    $builds = $buildsRaw | ConvertFrom-Json
} catch {
    Write-Host "⚠ Nu am putut prelua build-urile. Folosim buildNumber = 1"
    $builds = @()
}

# Filtram dupa versiunea actuala
$matchingBuilds = $builds | Where-Object { $_.appVersion -eq $appVersion }

if ($matchingBuilds.Count -eq 0) {
    $newBuildNumber = 1
} else {
    $latestBuildNumber = ($matchingBuilds | Sort-Object { [int]$_.buildVersion } -Descending)[0].buildVersion
    $newBuildNumber = [int]$latestBuildNumber + 1
}

Write-Host "🆕 Noul buildNumber: $newBuildNumber"

# Asigura existenta nodului ios
if (-not $appJson.expo.ios) {
    $appJson.expo | Add-Member -MemberType NoteProperty -Name ios -Value (@{})
}

# Seteaza noul buildNumber
$appJson.expo.ios.buildNumber = "$newBuildNumber"

# Salveaza inapoi
$appJson | ConvertTo-Json -Depth 10 | Set-Content $appJsonPath -Encoding UTF8

Write-Host "✅ buildNumber actualizat la $newBuildNumber in app.json"

# Porneste build-ul iOS production
Write-Host "🔨 Lansam build iOS (profile: production)..."
eas build --platform ios --profile production
