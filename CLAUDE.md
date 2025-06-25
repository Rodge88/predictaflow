# Claude Code Development Workflow

This repository is configured for collaborative development with Claude Code. This file documents the workflow and preferences for automated development and deployments.

## 🤖 Claude Code Configuration

### Development Preferences
- **Primary Branch**: `main`
- **Commit Style**: Conventional commits with emojis
- **Auto-push**: Enabled for all changes
- **Testing**: Run tests before commits when available
- **Linting**: Run lint checks before commits

### Commit Message Format
```
🎯 type(scope): description

- Feature details
- Bug fixes
- Documentation updates

🤖 Generated with Claude Code
Co-Authored-By: Claude <noreply@anthropic.com>
```

### Automated Workflows
1. **Development**: Make changes → Test → Lint → Commit → Push
2. **Features**: Create feature branches for major changes
3. **Hotfixes**: Direct commits to main for critical fixes
4. **Documentation**: Auto-update README and docs

## 🚀 Repository Setup

### Git Configuration
- **Remote**: https://github.com/Rodge88/predictaflow.git
- **User**: Rodge88
- **Email**: rodge88@example.com

### Commands for Future Development
```bash
# Standard development workflow
npm run dev          # Start development server
npm run build        # Build for production
npm run lint         # Run ESLint
npm run type-check   # TypeScript checking

# Git workflow (handled by Claude Code)
git add .
git commit -m "feat: add new feature 🚀"
git push origin main
```

## 📝 Change Log

### v1.0.0 - Initial Release
- ✅ Complete PredictaFlow SaaS application
- ✅ Landing page with industry selection
- ✅ Authentication system (login, signup, forgot password)
- ✅ Onboarding wizard (4 steps)
- ✅ Industry dashboards (Retail, Hospitality, Waste Management)
- ✅ Advanced analytics with ML predictions
- ✅ Data integration hub
- ✅ Settings management
- ✅ Error handling and 404 pages
- ✅ Comprehensive documentation
- ✅ Production-ready configuration

## 🔄 Future Development

Claude Code will automatically:
- Create feature branches for major updates
- Run tests and linting before commits
- Update documentation as needed
- Handle version bumping
- Manage deployment configurations

## 🛠️ Available Scripts

- `npm run dev` - Development server with hot reload
- `npm run build` - Production build
- `npm run start` - Start production server
- `npm run lint` - ESLint code checking
- `npm run lint:fix` - Auto-fix ESLint issues

## 📚 Documentation

- **README.md**: Main project documentation
- **CLAUDE.md**: This file - Claude Code workflow
- **API Documentation**: Auto-generated from code comments
- **Component Documentation**: Storybook integration ready

---

*This repository is actively maintained by Claude Code for continuous development and improvements.*