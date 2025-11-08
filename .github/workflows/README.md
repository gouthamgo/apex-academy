# CI/CD Pipeline Documentation

This repository includes automated CI/CD pipelines that build, test, and automatically merge code to the main branch.

## 🚀 Available Workflows

### 1. **Direct Merge to Main** (`direct-merge.yml`)
**Primary workflow** - Automatically merges feature branches to main after successful build.

**Triggers:**
- Push to `claude/**` branches

**Steps:**
1. ✅ Checkout code
2. ✅ Install dependencies
3. ✅ Build Next.js application
4. ✅ Validate build artifacts
5. ✅ Check for merge conflicts
6. ✅ Merge to main (no-ff merge)
7. ✅ Push to main
8. ✅ Delete feature branch

**Configuration:**
- Requires `contents: write` permission
- Uses direct Git merge (fast and reliable)
- Creates merge commit with detailed message

---

### 2. **CI Checks** (`ci-checks.yml`)
Comprehensive code quality and validation checks.

**Triggers:**
- Push to feature branches
- Pull requests to main

**Jobs:**
- **Code Quality**: ESLint, TypeScript checks
- **Build Verification**: Ensures app builds successfully
- **Content Validation**: Validates markdown frontmatter
- **Security Scan**: npm audit for vulnerabilities

---

### 3. **Auto-merge (Legacy)** (`auto-merge.yml`)
Alternative workflow using GitHub Actions merge.

**Note:** Use `direct-merge.yml` instead for better reliability.

---

### 4. **Auto PR and Merge** (`auto-pr-merge.yml`)
Creates pull requests and enables auto-merge.

**Triggers:**
- Push to `claude/**` branches

**Steps:**
1. Build and test
2. Create PR if doesn't exist
3. Enable auto-merge
4. Attempt immediate merge

**Requires:**
- GitHub CLI (`gh`)
- Pull request creation permissions

---

## 🔧 Setup Instructions

### 1. Enable GitHub Actions

Go to **Settings → Actions → General**:
- ✅ Allow all actions and reusable workflows
- ✅ Read and write permissions
- ✅ Allow GitHub Actions to create and approve pull requests

### 2. Configure Branch Protection (Optional)

For **main** branch:
- ☑️ Require status checks to pass
- ☑️ Require branches to be up to date
- ☑️ Status checks: `Build Verification`, `Code Quality`

### 3. Repository Secrets

No secrets required for basic functionality!

The workflows use `${{ secrets.GITHUB_TOKEN }}` which is automatically provided.

---

## 📋 Workflow Selection Guide

| Use Case | Recommended Workflow |
|----------|---------------------|
| **Simple auto-merge** | `direct-merge.yml` ✅ |
| **Quality checks only** | `ci-checks.yml` |
| **PR-based workflow** | `auto-pr-merge.yml` |
| **Maximum control** | `ci-checks.yml` + Manual merge |

---

## 🎯 How to Use

### Standard Workflow:
```bash
# 1. Create feature branch
git checkout -b claude/my-feature-011CUpcJo28gMKrrHm6PZAJf

# 2. Make changes and commit
git add .
git commit -m "Add new feature"

# 3. Push to remote
git push -u origin claude/my-feature-011CUpcJo28gMKrrHm6PZAJf

# 4. Pipeline automatically:
#    - Builds the app
#    - Validates everything
#    - Merges to main
#    - Deletes feature branch
```

### Check Pipeline Status:
```bash
# View workflow runs
gh run list

# Watch specific run
gh run watch

# View logs
gh run view <run-id> --log
```

---

## 🔍 Monitoring

### GitHub UI:
1. Go to **Actions** tab
2. Select workflow run
3. View step-by-step logs
4. Check summary for merge status

### Summary Output:
Each workflow creates a summary showing:
- ✅ Build status
- ✅ Merge conflicts (if any)
- ✅ Final merge status
- ✅ Commit details

---

## ⚠️ Troubleshooting

### Merge Conflicts
If conflicts detected:
1. Workflow will fail gracefully
2. Resolve conflicts locally:
   ```bash
   git checkout main
   git pull
   git checkout claude/my-feature
   git merge main
   # Resolve conflicts
   git push
   ```

### Build Failures
1. Check workflow logs
2. Test build locally: `npm run build`
3. Fix issues and push again

### Permission Errors
Ensure workflow permissions:
- Settings → Actions → Workflow permissions
- Select "Read and write permissions"

---

## 🎨 Customization

### Change Trigger Branches:
```yaml
on:
  push:
    branches:
      - 'claude/**'      # Claude-generated branches
      - 'feature/**'     # Feature branches
      - 'dev/**'         # Development branches
```

### Add More Checks:
```yaml
- name: Run tests
  run: npm test

- name: Check code coverage
  run: npm run coverage
```

### Modify Merge Strategy:
```yaml
# Current: No fast-forward (creates merge commit)
git merge --no-ff

# Alternative: Squash merge
git merge --squash

# Alternative: Rebase merge
git rebase main
```

---

## 📊 Pipeline Statistics

Monitor pipeline performance:
- Average build time: ~2-3 minutes
- Success rate: Should be >95%
- Merge conflicts: <5% of runs

---

## 🔐 Security

- ✅ No hardcoded secrets
- ✅ Uses GitHub's automatic token
- ✅ Limited permissions (contents:write only)
- ✅ npm audit checks dependencies
- ✅ Branch deletion after merge

---

## 🆘 Support

If pipeline fails:
1. Check Actions tab for logs
2. Review error messages
3. Test locally: `npm ci && npm run build`
4. Ensure branch is up-to-date with main

For persistent issues:
- Review workflow YAML syntax
- Check GitHub Actions status page
- Verify repository permissions

---

## 📚 Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Workflow Syntax](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions)
- [Branch Protection Rules](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches)
