# PowerShell script to deploy your project to GitHub
# Make sure you've created a repository on GitHub first

# Navigate to project directory
Set-Location "c:\Codage All Project\cric-app"

Write-Host "Initializing Git repository..." -ForegroundColor Green
git init

Write-Host "Adding all files to Git..." -ForegroundColor Green
git add .

Write-Host "Creating initial commit..." -ForegroundColor Green
git commit -m "Initial commit: Cricket application with Next.js frontend and Express backend"

# Replace the URL below with your actual GitHub repository URL
$githubUrl = "https://github.com/Meet0105/Crick_Buddy.git"

Write-Host "Setting remote origin..." -ForegroundColor Green
git remote add origin $githubUrl

Write-Host "Renaming master branch to main..." -ForegroundColor Green
git branch -M main

Write-Host "Pushing to GitHub..." -ForegroundColor Green
git push -u origin main

Write-Host "Deployment complete!" -ForegroundColor Green
Write-Host "If you get authentication errors, you may need to:" -ForegroundColor Yellow
Write-Host "1. Use GitHub CLI: gh auth login" -ForegroundColor Yellow
Write-Host "2. Or use a Personal Access Token for authentication" -ForegroundColor Yellow