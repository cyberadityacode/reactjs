# Cricket App Setup Guide

## Installed Packages

### 🚀 React Router DOM
- **Version**: ^7.8.1
- **Purpose**: Client-side routing for React applications
- **Documentation**: [React Router](https://reactrouter.com/)

### 🎨 Tailwind CSS
- **Version**: ^4.1.12
- **Purpose**: Utility-first CSS framework for rapid UI development
- **Documentation**: [Tailwind CSS](https://tailwindcss.com/)

### 🔥 Firebase
- **Version**: ^12.1.0
- **Purpose**: Backend-as-a-Service platform (Authentication, Firestore, Storage)
- **Documentation**: [Firebase](https://firebase.google.com/docs)

## Configuration Files Created

### Tailwind CSS Configuration
- `tailwind.config.js` - Main Tailwind configuration
- `postcss.config.js` - PostCSS configuration for Tailwind
- Updated `src/index.css` - Added Tailwind directives

### Firebase Configuration
- `src/firebase.js` - Firebase initialization and exports

## Example Usage

### React Router
The app now includes:
- Navigation with multiple routes (Home, Scores, About)
- `BrowserRouter` setup
- `Link` components for navigation
- `Routes` and `Route` components

### Tailwind CSS
Examples of Tailwind classes used:
- Layout: `min-h-screen`, `container`, `mx-auto`
- Spacing: `p-8`, `mb-8`, `space-x-4`
- Typography: `text-4xl`, `font-bold`, `text-center`
- Colors: `text-blue-600`, `bg-gray-100`
- Effects: `hover:text-blue-800`, `shadow-lg`

### Firebase Setup Instructions

1. **Create a Firebase Project**:
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Click "Create a project"
   - Follow the setup wizard

2. **Get Configuration**:
   - In your Firebase project, click on "Web" icon
   - Register your app
   - Copy the configuration object

3. **Update Firebase Config**:
   - Replace the placeholder values in `src/firebase.js` with your actual Firebase configuration

4. **Enable Services** (Optional):
   - **Authentication**: Enable in Firebase Console → Authentication → Sign-in method
   - **Firestore**: Create database in Firebase Console → Firestore Database
   - **Storage**: Set up in Firebase Console → Storage

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linting
npm run lint
```

## Next Steps

1. Replace Firebase configuration with your actual project credentials
2. Set up Firebase Authentication providers if needed
3. Configure Firestore security rules
4. Customize Tailwind configuration for your design system
5. Add more routes and components as needed

## File Structure
```
src/
├── components/
│   └── FirebaseExample.jsx    # Example Firebase integration
├── App.jsx                    # Main app with routing
├── firebase.js                # Firebase configuration
├── index.css                  # Tailwind CSS imports
└── main.jsx                   # App entry point
```

Happy coding! 🏏