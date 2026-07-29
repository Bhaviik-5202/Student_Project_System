# 🤝 Contributing Guidelines

Thank you for considering contributing to the **Student Project Management System**!

---

## 🚀 How to Contribute

### 1. Reporting Bugs
- Search existing issues to avoid duplicates.
- Create a new issue describing the bug, steps to reproduce, and expected behavior.

### 2. Suggesting Enhancements
- Open an issue detailing your suggested feature or improvement.

### 3. Pull Requests
1. Fork the repository.
2. Create a new feature branch:
   ```bash
   git checkout -b feature/my-new-feature
   ```
3. Make your changes following project standards:
   - Ensure clean code formatting (`npm run format` / prettier).
   - Ensure linter passes cleanly (`cd frontend && npm run lint`).
   - Ensure backend integration tests pass (`cd backend && npm test`).
4. Commit your changes:
   ```bash
   git commit -m "feat: add my new feature"
   ```
5. Push to your branch and open a Pull Request.

---

## 📜 Code Style Guidelines

- **Frontend**: Follow React 18 functional component patterns with Hooks. Avoid unnecessary heavy external libraries.
- **Backend**: Adhere to clean architecture separation (Controller -> Service -> Repository -> Model).
- **Git Commits**: Follow standard conventional commits (`feat:`, `fix:`, `docs:`, `style:`, `refactor:`, `test:`).
