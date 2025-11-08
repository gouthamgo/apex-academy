# ✅ Quick Setup Guide

## You've Already Done This! ✅

You enabled: **"Allow GitHub Actions to create and approve pull requests"**

That's the main requirement! Now the pipeline will work.

---

## 🚀 How It Works Now

### 1. You Push Code
```bash
git push origin claude/my-feature-011CUpcJo28gMKrrHm6PZAJf
```

### 2. Workflow Runs Automatically
- ✅ Builds Next.js app
- ✅ Validates build successful
- ✅ Creates pull request (if doesn't exist)
- ✅ Enables auto-merge on PR
- ✅ PR merges automatically to main

### 3. Done!
Your code is in main, branch is deleted.

---

## 📋 Which Workflow to Use

### **Recommended: `auto-merge-simple.yml`** ⭐

This is the simplest and most reliable workflow:
- Builds app
- Creates PR
- Enables auto-merge
- Lets GitHub merge automatically

**When it runs:**
- On every push to `claude/**` branches

---

## 🔧 Optional: Check Workflow Permissions

Go to **Settings → Actions → General**

Make sure these are enabled:
- ✅ **Workflow permissions**: "Read and write permissions"
- ✅ **Allow GitHub Actions to create and approve pull requests** (You did this!)

---

## 📊 Monitoring

### View Workflow Runs:
1. Go to **Actions** tab in GitHub
2. See "Auto-Merge to Main (Simple)" workflow
3. Click on any run to see logs

### Command Line:
```bash
# List runs
gh run list

# Watch current run
gh run watch

# View specific run
gh run view <run-id> --log
```

---

## 🎯 What Happens Next

Every push to `claude/**` branch:
```
Push → Build (2-3 min) → Create PR → Auto-merge enabled → Merged! ✅
```

---

## ⚠️ Troubleshooting

### If PR doesn't auto-merge:
1. Check if there are merge conflicts
2. Check if all status checks pass
3. Manually approve the PR if needed

### If build fails:
1. Check Actions tab for error logs
2. Fix the issue locally
3. Push again - workflow will retry

---

## 🎉 That's It!

**The pipeline is ready to use!**

Just push to any `claude/**` branch and watch it auto-merge to main.

No more manual merging! 🚀
