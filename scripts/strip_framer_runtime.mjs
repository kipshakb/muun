// Framer's runtime is required for layout, backgrounds, the ticket graphic,
// hover states, and appear animations. Removing it breaks the pages.
// Eventis text is kept off screen by the content fixer, which re-runs
// when Framer rewrites the DOM. This function stays so the build call
// sites do not need to change.
export function stripFramerRuntime(html) {
  return html;
}
