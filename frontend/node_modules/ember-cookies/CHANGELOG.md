# 0.0.12

* Update the ember-getowner-polyfill dependency, see #49.

# 0.0.12

* The `cookies` service's `clear` method now accepts options, see #48.
* ember-cookies now uses ESLint instead of JSHint/JSCS, see #37.

# 0.0.11

* A deprecation triggered by ember-getowner-polyfill has been fixed, see #30.

# 0.0.10

* Fix usage of the FastBoot host, see #25.

# 0.0.9

* Handling of FastBoot cookies has been fixed, see #24.

# 0.0.8

* The new `clear` method was added to delete a particular cookie, see #20.
* The dependency on ember-lodash was removed, see #22.

# 0.0.7

* Cookies are now written directly to the response headers in FastBoot mode,
  see #17.

# 0.0.6

* The fastboot service is now correctly referenced as `service:fastboot`, see
  #16.

# 0.0.5

* FastBoot is now always being referred to correctly with a capital "B", see
  #15.
* Values are now encoded when written and decoded when read, see #14.

# 0.0.4

* ember-lodash is now a direct dependency of ember-cookies while it was only a
  dev dependency before which caused errors in applications that didn't have
  ember-lodash installed already, see #12.

# 0.0.3

* Make sure that cookies can be read after having been written in FastBoot,
  see #9.
* Enable ember-suave for the project, see #10.

# 0.0.2

* tests, tests, tests 🎉, see #5.

# 0.0.1

initial release
