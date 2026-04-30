/**
 * Custom WTR test runner HTML template.
 * Even if you use await whenDefined('component-name') in tests,
 * there is no guarantee that document.createElement('component-name') and mount('<component-name>') use the same tag name.
 * For example: await whenDefined('component-name'), but document.createElement('componet-') (typo).
 * Playwright will wait indefinitely for "upgrade-pending" custom elements, causing test timeouts.
 * The safest approach is to always constantize the tag name in tests.
 *
 * Injects two browser-side safety patches before any test module loads:
 *
 * Patch 1 — customElements.whenDefined():
 *   Wraps the native API with a timeout so that a typo in a tag name
 *   produces a clear error instead of hanging forever.
 *
 * Patch 2 — document.createElement():
 *   Throws immediately when given an unregistered custom-element tag name,
 *   preventing Playwright from waiting on "upgrade-pending" elements forever.
 *
 * @param {string} testRunnerImport  WTR-provided URL of the test module entry
 * @param {number} [timeoutMs=3000]  Milliseconds before whenDefined times out
 * @returns {string} Full HTML document string
 */
export function buildTestRunnerHtml(testRunnerImport, timeoutMs = 3000) {
  return `<!DOCTYPE html>
<html>
  <body>
    <script>
      ;(function (TIMEOUT_MS) {
        // Patch 1: customElements.whenDefined — add timeout + clearTimeout on resolve
        var _origWhenDefined = customElements.whenDefined.bind(customElements)
        customElements.whenDefined = function (name) {
          var timerId
          var timeout = new Promise(function (_, reject) {
            timerId = setTimeout(function () {
              reject(new Error(
                'customElements.whenDefined(): <' + name + '> was not defined within ' +
                TIMEOUT_MS + 'ms. Check the tag name or ensure the component module is imported.'
              ))
            }, TIMEOUT_MS)
          })
          return Promise.race([
            _origWhenDefined(name).then(function (ctor) { clearTimeout(timerId); return ctor }),
            timeout,
          ])
        }

        // Patch 2: document.createElement — throw immediately for unregistered custom elements
        var _origCreate = document.createElement.bind(document)
        document.createElement = function (tagName, options) {
          if (typeof tagName === 'string' && tagName.indexOf('-') !== -1 && !customElements.get(tagName)) {
            throw new Error(
              'document.createElement(): <' + tagName + '> is not a registered custom element. ' +
              'Check the tag name or ensure the component module is imported.'
            )
          }
          return options !== undefined ? _origCreate(tagName, options) : _origCreate(tagName)
        }
      })(${timeoutMs})
    </script>
    <script type="module" src="${testRunnerImport}"></script>
  </body>
</html>`
}
