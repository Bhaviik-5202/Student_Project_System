# Development Best Practices Guide

## Component Development Standards

### Component Structure Template

```jsx
import { useMemo, useCallback, memo } from "react";

const MyComponent = memo(({ prop1, prop2, onAction }) => {
  // Memoized static data
  const staticData = useMemo(
    () => ({
      items: [...],
      options: {...},
    }),
    []
  );

  // Memoized callbacks
  const handleClick = useCallback((e) => {
    // Handler logic
    onAction(e);
  }, [onAction]);

  return (
    <div className="...">
      {/* Component JSX */}
    </div>
  );
});

MyComponent.displayName = "MyComponent";

export default MyComponent;
```

### File Organization

```
components/
├── pages/
│   └── [feature-name]/
│       ├── ComponentName.jsx
│       ├── SubComponent.jsx
│       └── index.js (optional)
├── common/
│   └── ReusableComponent.jsx
└── ui/
    └── Button.jsx
```

## React Hooks Usage

### useMemo() - When to Use
- Static arrays or objects
- Complex calculations
- Context values
- Filter/sort operations
- Derived state

```jsx
const data = useMemo(() => {
  return items.filter(i => i.active).sort((a, b) => a.name.localeCompare(b.name));
}, [items]);
```

### useCallback() - When to Use
- Event handlers passed to child components
- Dependency array items
- Handlers used in useEffect dependencies
- Avoiding unnecessary child re-renders

```jsx
const handleSubmit = useCallback((formData) => {
  onSubmit(formData);
}, [onSubmit]);
```

### React.memo() - When to Use
- Every component in the codebase
- Prevents unnecessary re-renders
- Performance-critical components
- Components with expensive rendering

```jsx
const MyComponent = memo(({ data, onAction }) => {
  // Component code
});

MyComponent.displayName = "MyComponent";
export default MyComponent;
```

## Styling Standards

### Tailwind CSS Color Palette

#### Success/Positive Actions
```jsx
className="bg-emerald-500 text-white dark:bg-emerald-600"
```
Use for:
- Successful operations
- Completed tasks
- Positive status indicators
- "Submit" or "Create" buttons

#### Warning/Pending States
```jsx
className="bg-amber-500 text-white dark:bg-amber-600"
```
Use for:
- Warnings
- Pending operations
- In-progress items
- Caution indicators

#### Error/Destructive Actions
```jsx
className="bg-rose-500 text-white dark:bg-rose-600"
```
Use for:
- Errors
- Delete operations
- Failed states
- Danger indicators

#### Primary/Information
```jsx
className="bg-blue-600 text-white dark:bg-blue-700"
```
Use for:
- Primary actions
- Links
- General information
- Primary CTAs

#### Neutral/Secondary
```jsx
className="bg-slate-500 text-white dark:bg-slate-600"
```
Use for:
- Secondary actions
- Neutral states
- Background elements
- Text and borders

### Dark Mode Implementation

Every color class should include `dark:` variant:

```jsx
<div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
  <button className="bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-800">
    Click me
  </button>
</div>
```

### Responsive Design Pattern

Use Tailwind breakpoints:

```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
  {/* Single column on mobile, 2 on tablet, 4 on desktop */}
</div>
```

## State Management Guidelines

### Local State (Preferred)
```jsx
const [isOpen, setIsOpen] = useState(false);
const [count, setCount] = useState(0);
```
Use for: UI state, form inputs, temporary data

### Context API (When Needed)
```jsx
// In context file
export const MyContext = createContext(null);

export const MyProvider = ({ children }) => {
  const value = useMemo(() => ({ data, methods }), [data, methods]);
  return <MyContext.Provider value={value}>{children}</MyContext.Provider>;
};

// In component
const { data, methods } = useContext(MyContext);
```
Use for: Global state (auth, theme, notifications)

## Error Handling

### Try-Catch Pattern
```jsx
try {
  const result = await apiCall();
  handleSuccess(result);
} catch (error) {
  console.error("Operation failed:", error);
  showError("An error occurred");
}
```

### Component Error Boundary
```jsx
// Error Boundary is in main.jsx
// Automatically catches and handles React errors
```

## Testing Best Practices

### Component Testing
```jsx
// Test file: ComponentName.test.jsx
describe("ComponentName", () => {
  it("should render correctly", () => {
    // Test implementation
  });

  it("should handle user interactions", () => {
    // Test implementation
  });
});
```

### Accessibility Testing
- Use semantic HTML elements
- Add ARIA labels where needed
- Test keyboard navigation
- Test with screen readers

## Performance Checklist

When creating new components:

- [ ] Wrapped in `React.memo()`
- [ ] `displayName` property added
- [ ] Static data in `useMemo()`
- [ ] Handlers in `useCallback()`
- [ ] Dark mode support with `dark:` classes
- [ ] Responsive design implemented
- [ ] Semantic colors used
- [ ] Proper error handling
- [ ] Loading states managed
- [ ] Documentation added

## Code Quality Standards

### Naming Conventions

**Components**: PascalCase
```jsx
const UserProfile = memo(({ userId }) => {
  // ...
});
```

**Variables/Functions**: camelCase
```jsx
const user = { name: "John" };
const handleClick = () => {};
```

**Constants**: UPPER_SNAKE_CASE
```jsx
const API_URL = "https://api.example.com";
const MAX_ITEMS = 50;
```

**CSS Classes**: kebab-case (Tailwind default)
```jsx
className="bg-blue-600 text-white rounded-lg"
```

### Code Documentation

**Component JSDoc**
```jsx
/**
 * UserProfile - Displays user profile information
 * @param {string} userId - Unique user identifier
 * @param {function} onUpdate - Callback when user updates profile
 * @returns {React.ReactNode} User profile component
 */
const UserProfile = memo(({ userId, onUpdate }) => {
  // ...
});
```

**Complex Functions**
```jsx
/**
 * Calculate grade based on score and rubric
 * @param {number} score - Student's score (0-100)
 * @param {object} rubric - Grading rubric criteria
 * @returns {string} Letter grade (A, B, C, D, F)
 */
const calculateGrade = (score, rubric) => {
  // ...
};
```

## Git Commit Standards

### Commit Message Format
```
type(scope): subject

body
footer
```

**Types**:
- `feat`: New feature
- `fix`: Bug fix
- `refactor`: Code restructuring
- `perf`: Performance improvement
- `docs`: Documentation update
- `style`: Code style change
- `test`: Test addition/update

**Examples**:
```
feat(auth): add login validation
fix(dashboard): resolve loading spinner issue
perf(portfolio): optimize portfolio gallery rendering
```

## File Size Limits

- Single component: < 500 lines
- Page component: < 1000 lines
- Bundle chunk: < 200KB
- CSS file: < 50KB

If exceeded, consider splitting into smaller components.

## Browser Support

- Chrome/Edge: Latest 2 versions
- Firefox: Latest 2 versions
- Safari: Latest 2 versions
- Mobile browsers: Latest versions

## Dependencies Management

### Adding New Dependencies

Before adding:
1. Check if alternative exists in current deps
2. Verify bundle size impact
3. Check maintenance status
4. Verify compatibility

### Updating Dependencies

```bash
# Check for updates
npm outdated

# Update specific package
npm update package-name

# Update all packages
npm update

# Run tests after updates
npm run lint
npm run build
```

## Security Guidelines

### Environment Variables
- Never commit `.env` files
- Use `.env.example` as template
- Store secrets in deployment platform
- Never log sensitive data

### User Input
- Sanitize all user inputs
- Use parameterized queries (backend)
- Validate on client AND server
- Escape HTML output

### API Communication
- Always use HTTPS in production
- Validate API responses
- Handle errors gracefully
- Implement rate limiting (backend)

## Debugging Tips

### React DevTools
- Install React Developer Tools extension
- Use DevTools Profiler for performance
- Check component props and state
- Monitor re-render reasons

### Console Debugging
```jsx
// Temporary debugging
console.log("Value:", value);
console.table(arrayOfObjects);
console.time("operation");
// ... code
console.timeEnd("operation");
```

### Network Debugging
- Use browser DevTools Network tab
- Check API responses
- Monitor bundle sizes
- Analyze waterfall charts

## Performance Optimization Checklist

- [ ] Use lazy loading for routes
- [ ] Implement code splitting
- [ ] Memoize expensive components
- [ ] Optimize re-render triggers
- [ ] Minimize bundle size
- [ ] Cache static assets
- [ ] Compress images
- [ ] Monitor Core Web Vitals
- [ ] Test on slow networks
- [ ] Profile with DevTools

## Resources

- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [Tailwind CSS Docs](https://tailwindcss.com)
- [React Router Docs](https://reactrouter.com)
- [Web Fundamentals](https://developers.google.com/web)
