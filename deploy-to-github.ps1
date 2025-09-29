# PowerShell script to deploy your project to GitHub
# Make sure you've created a repository on GitHub first

# Navigate to project directory
Set-Location "c:\Codage All Project\cric-app"

Write-Host "=== GitHub Deployment Script ===" -ForegroundColor Green
Write-Host "Current directory: $(Get-Location)" -ForegroundColor Cyan

# Check if git is installed
try {
    $gitVersion = git --version
    Write-Host "Git is installed: $gitVersion" -ForegroundColor Green
} catch {
    Write-Host "Git is not installed. Please install Git from https://git-scm.com/" -ForegroundColor Red
    exit 1
}

# Check if GitHub CLI is installed
try {
    $ghVersion = gh --version
    Write-Host "GitHub CLI is installed: $ghVersion" -ForegroundColor Green
    $useGH = $true
} catch {
    Write-Host "GitHub CLI is not installed. Will use standard git commands." -ForegroundColor Yellow
    $useGH = $false
}

# Initialize Git repository if not already initialized
if (-not (Test-Path ".git")) {
    Write-Host "Initializing Git repository..." -ForegroundColor Green
    git init
} else {
    Write-Host "Git repository already initialized." -ForegroundColor Yellow
}

# Create .gitignore if it doesn't exist
if (-not (Test-Path ".gitignore")) {
    Write-Host "Creating .gitignore file..." -ForegroundColor Green
    @"
# Dependencies
node_modules/

# Build outputs
.frontend/.next/
.backend/dist/

# Environment variables
.env*
!.env.example

# Logs
*.log

# IDE files
.vscode/
.idea/
*.swp
*.swo

# OS generated files
Thumbs.db
.DS_Store

# Temporary files
*.tmp
*.temp
"@ | Out-File -FilePath ".gitignore" -Encoding UTF8
}

# Add all files to Git
Write-Host "Adding all files to Git..." -ForegroundColor Green
git add .

# Check if there are changes to commit
$gitStatus = git status --porcelain
if ([string]::IsNullOrWhiteSpace($gitStatus)) {
    Write-Host "No changes to commit." -ForegroundColor Yellow
} else {
    Write-Host "Creating commit..." -ForegroundColor Green
    git commit -m "Initial commit: Cricket application with Next.js frontend and Express backend"
}

# If GitHub CLI is available, use it for easier authentication
if ($useGH) {
    Write-Host "Using GitHub CLI for deployment..." -ForegroundColor Green
    
    # Authenticate with GitHub (if not already authenticated)
    Write-Host "Checking GitHub authentication..." -ForegroundColor Cyan
    try {
        $authStatus = gh auth status
        Write-Host "Already authenticated with GitHub" -ForegroundColor Green
    } catch {
        Write-Host "Not authenticated with GitHub. Please authenticate:" -ForegroundColor Yellow
        gh auth login
    }
    
    # Ask for repository name
    $repoName = Read-Host "Enter your GitHub repository name (e.g., cric-app)"
    
    # Create repository and push
    Write-Host "Creating GitHub repository: $repoName" -ForegroundColor Green
    try {
        gh repo create $repoName --private --push
        Write-Host "Repository created and code pushed successfully!" -ForegroundColor Green
    } catch {
        Write-Host "Failed to create repository. Try creating it manually on GitHub first." -ForegroundColor Red
        Write-Host "Then run: gh repo create $repoName --private --clone" -ForegroundColor Yellow
    }
} else {
    # Use standard git commands
    Write-Host "Using standard Git commands for deployment..." -ForegroundColor Green
    
    # Ask for GitHub username and repository name
    $githubUsername = Read-Host "Enter your GitHub username"
    $repoName = Read-Host "Enter your GitHub repository name"
    
    # Set remote origin
    $githubUrl = "https://github.com/$githubUsername/$repoName.git"
    Write-Host "Setting remote origin to: $githubUrl" -ForegroundColor Green
    
    # Check if remote already exists
    try {
        $remote = git remote get-url origin
        Write-Host "Remote already exists: $remote" -ForegroundColor Yellow
        $updateRemote = Read-Host "Do you want to update the remote URL? (y/n)"
        if ($updateRemote -eq 'y') {
            git remote set-url origin $githubUrl
        }
    } catch {
        git remote add origin $githubUrl
    }
    
    # Rename branch to main if needed
    $currentBranch = git branch --show-current
    if ($currentBranch -ne "main") {
        Write-Host "Renaming branch to main..." -ForegroundColor Green
        git branch -M main
    }
    
    # Push to GitHub
    Write-Host "Pushing to GitHub..." -ForegroundColor Green
    Write-Host "Note: You may be prompted for your GitHub credentials" -ForegroundColor Yellow
    Write-Host "Consider using a Personal Access Token instead of password" -ForegroundColor Yellow
    Write-Host "Create one at: https://github.com/settings/tokens" -ForegroundColor Yellow
    
    try {
        git push -u origin main
        Write-Host "Code pushed successfully!" -ForegroundColor Green
    } catch {
        Write-Host "Failed to push to GitHub. Common solutions:" -ForegroundColor Red
        Write-Host "1. Check your internet connection" -ForegroundColor Yellow
        Write-Host "2. Verify repository exists on GitHub" -ForegroundColor Yellow
        Write-Host "3. Use Personal Access Token for authentication" -ForegroundColor Yellow
        Write-Host "4. Try: git push -u origin main --force" -ForegroundColor Yellow
    }
}

Write-Host "=== Deployment Process Complete ===" -ForegroundColor Green