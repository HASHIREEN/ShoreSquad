# ShoreSquad Development Instructions

## AI Assistant Guidelines for ShoreSquad Project

This document provides specific instructions for AI assistants working on the ShoreSquad beach cleanup rally application.

### Project Context
- **Project Name**: ShoreSquad
- **Type**: Beach cleanup rally web application
- **Target Audience**: Young eco-conscious individuals (16-35)
- **Tech Stack**: HTML5, CSS3, JavaScript ES6+, Leaflet.js

### Brand Guidelines

#### Color Palette (Always use these exact values)
- Primary: `#0ea5e9` (Ocean Blue)
- Secondary: `#f5f5dc` (Sandy Beige)
- Accent: `#ff6b6b` (Coral Pink)
- Success: `#22c55e` (Sea Green)
- Warning: `#f59e0b` (Sunset Orange)
- Neutral: `#374151` (Charcoal)

#### Typography
- Font Family: `Poppins` (Google Fonts)
- Fallback: `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`

### Code Standards

#### CSS Guidelines
- Use CSS custom properties (CSS variables) defined in `:root`
- Mobile-first responsive design
- Minimum touch target size: 44px
- WCAG 2.1 AA contrast ratios
- Use semantic class names (BEM methodology preferred)

#### JavaScript Guidelines
- ES6+ syntax (classes, arrow functions, async/await)
- Modular architecture with clear separation of concerns
- Accessibility-first approach with ARIA labels
- Performance optimization (debounce, throttle, lazy loading)
- Error handling for all async operations

#### HTML Guidelines
- Semantic HTML5 elements
- Proper heading hierarchy (h1 → h6)
- ARIA roles and labels for accessibility
- Meta tags for SEO and PWA
- Progressive enhancement approach

### Feature Implementation Rules

#### Interactive Map
- Use Leaflet.js for map functionality
- Default location: Singapore (1.3521, 103.8198)
- Beach markers with color coding:
  - Red: Needs Cleanup
  - Green: Active Rally
  - Blue: Clean
- Include map legend and accessibility features

#### Weather Integration
- Mock weather data acceptable for development
- 5-day forecast display
- Weather alerts for cleanup conditions
- Location-based weather (with fallback)

#### Rally Management
- Form validation with real-time feedback
- Local storage for temporary data
- Social features (participant count, creator info)
- Date/time validation for future events

#### Accessibility Requirements
- Screen reader compatible
- Keyboard navigation support
- High contrast mode support
- Reduced motion preferences
- Skip links for main content
- ARIA live regions for dynamic updates

### File Organization

#### Required Files
- `index.html` - Main application page
- `css/styles.css` - All styles in single file
- `js/app.js` - Main application logic
- `manifest.json` - PWA configuration
- `.gitignore` - Git ignore patterns
- `README.md` - Project documentation

#### Optional Enhancements
- Service worker for offline functionality
- Additional CSS files for specific features
- Separate JS modules for complex features
- Image optimization and favicon sets

### Performance Guidelines

- Minimize HTTP requests
- Use efficient CSS selectors
- Implement lazy loading for images
- Debounce user input handlers
- Throttle scroll event handlers
- Optimize images (WebP with fallbacks)

### PWA Requirements

#### Manifest.json
- App name: "ShoreSquad"
- Theme color: "#0ea5e9"
- Background color: "#ffffff"
- Display mode: "standalone"
- Include comprehensive icon set

#### Service Worker (if implemented)
- Cache strategy for offline functionality
- Update notifications for new versions
- Background sync for data synchronization

### Environmental Messaging

#### Tone and Voice
- Enthusiastic and youth-focused
- Environmental awareness without being preachy
- Community-driven and social
- Action-oriented with clear calls-to-action

#### Key Messages
- "Rally your crew" - emphasize social aspect
- "Make waves for cleaner beaches" - environmental impact
- "Eco-action made fun" - remove barriers to participation
- Beach cleanup as social adventure, not chore

### Testing Requirements

#### Browser Compatibility
- Chrome/Edge (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Mobile browsers (iOS Safari, Chrome Mobile)

#### Device Testing
- Mobile phones (320px+)
- Tablets (768px+)
- Desktops (1024px+)
- High-DPI displays

#### Accessibility Testing
- Screen reader compatibility (NVDA, JAWS, VoiceOver)
- Keyboard-only navigation
- High contrast mode
- Zoom to 200% without horizontal scrolling

### Common Patterns

#### Button Styling
```css
.btn {
  min-height: 44px;
  padding: var(--spacing-3) var(--spacing-6);
  border-radius: var(--radius-lg);
  transition: all var(--transition-normal);
}
```

#### Form Validation
- Real-time validation on blur
- Visual and screen reader feedback
- Required field indicators
- Success/error state styling

#### Animation Guidelines
- Respect `prefers-reduced-motion`
- Subtle hover effects (2px transform)
- Loading states for async operations
- Page transition animations

### AI Assistant Specific Instructions

When working on ShoreSquad:

1. **Always prioritize accessibility** - Include ARIA labels, proper semantic HTML
2. **Use the established color palette** - Don't introduce new colors without approval
3. **Maintain responsive design** - Test changes across breakpoints
4. **Follow the established architecture** - Don't restructure without discussion
5. **Include error handling** - All user interactions should handle failure states
6. **Document new features** - Update README.md for significant additions
7. **Test thoroughly** - Provide clear testing instructions for new features

### Deployment Notes

- Live Server configuration in `.vscode/settings.json`
- Default port: 5501
- No build process required (vanilla HTML/CSS/JS)
- PWA features work on HTTPS only in production

---

**Remember**: ShoreSquad is about making environmental action accessible, social, and fun for young people. Every feature should support this mission!