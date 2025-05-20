# Virtualized Rendering

It is a smart technique used to optimize the rendering of large lists by only displaying the items that are currently visible on the screen.

Example Approaches:

## Option 1: Use Intersection Observer (recommended for performance)
React + IntersectionObserver can detect when a card goes out of view or comes into view, and you can update your state to show/hide/mount/unmount accordingly.

## Option 2: Use Manual Scroll + Ref + Offset Math
You track scroll position using scrollY and compare it against element positions. (Learn this first)

- If you're aiming for performance and simplicity, consider using libraries like:

* react-window or react-virtualized → handles virtualization (mounting/unmounting) for lists

* framer-motion + IntersectionObserver → animate things into view as they scroll

