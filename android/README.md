# Android APK plan (Capacitor)

The current package is a web app/PWA. APK packaging is the next phase after the web app and backend have been tested.

## Recommended route

1. Publish the frontend over HTTPS and confirm it works on Android Chrome.
2. Install Node.js LTS and Android Studio on a desktop computer.
3. In a separate Capacitor wrapper project, install `@capacitor/core`, `@capacitor/cli`, and `@capacitor/android`.
4. Build/copy the web frontend into the Capacitor `webDir`.
5. Run `npx cap add android`, `npx cap sync android`, then open Android Studio.
6. Test on a real Android phone, including sign-in, camera/file permissions (if added), network failures, back navigation, and offline behavior.
7. Build a signed APK/AAB in Android Studio.

Do not publish an APK until privacy policy, permissions, app icon, package ID, signing key, and API security are checked. Keep the signing key and passwords private.
