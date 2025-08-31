# 🚀 GitHub Pages Deployment Guide

## Step 1: Create GitHub Repository

1. Go to [GitHub.com](https://github.com) and sign in
2. Click the **"+"** button in the top right corner
3. Select **"New repository"**
4. Fill in the details:
   - **Repository name**: `Rate-it`
   - **Description**: `A modern web application for rating and reviewing social media influencers`
   - **Visibility**: Choose Public or Private
   - **DO NOT** initialize with README, .gitignore, or license (we already have these)
5. Click **"Create repository"**

## Step 2: Connect Your Local Repository

Run these commands in your terminal:

```bash
# Add the remote origin (replace YOUR_USERNAME with your actual GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/Rate-it.git

# Rename the branch to main (GitHub's default)
git branch -M main

# Push your code to GitHub
git push -u origin main
```

## Step 3: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **"Settings"** tab
3. In the left sidebar, click **"Pages"**
4. Under **"Source"**, select **"GitHub Actions"**
5. The workflow will automatically deploy your site

## Step 4: Your Site is Live! 🎉

Your Rate-it app will be available at:
**`https://YOUR_USERNAME.github.io/Rate-it/`**

## 🔄 Automatic Updates

Every time you push changes to the `main` branch:
1. GitHub Actions will automatically build your project
2. Deploy it to GitHub Pages
3. Your site will be updated within a few minutes

## 🛠️ Manual Deployment (Optional)

If you want to deploy manually:

```bash
npm run deploy
```

## 📝 Important Notes

- **Base Path**: Your app is configured for `/Rate-it/` base path
- **Environment Variables**: Make sure your `.env` file has the correct Supabase credentials
- **Build Output**: The build creates a `dist` folder that gets deployed
- **Branch**: Only the `main` branch triggers automatic deployment

## 🆘 Troubleshooting

### Site Not Loading?
- Check if GitHub Actions workflow completed successfully
- Verify the repository name matches exactly: `Rate-it`
- Wait a few minutes after pushing - deployment takes time

### Build Errors?
- Check the Actions tab in your GitHub repository
- Look for any error messages in the workflow logs
- Make sure all dependencies are properly installed

### Environment Variables?
- Remember: `.env` files are NOT committed to Git
- You'll need to set up environment variables in your production environment
- For now, the app will work with the existing Supabase configuration

---

**Your Rate-it app is now ready for the world! 🌍✨**
