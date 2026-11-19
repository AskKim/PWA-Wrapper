## Phase 4 — Native Backup Vault Mirror & Unified Developer Panel (`android-wrapper/` in AI Studio)

### Prior Assumptions Check
- Confirm Phases 1–3 are complete and `pedigreeBridge.syncBackupSnapshotToNative` and `pedigreeBridge.openNativeDevPanel` are wired cleanly.
- Confirm `app_webview` is never directly modified or wiped by native vault or reset routines, and diagnostic exports never include herd records.
- Confirm `BuildConfig.DEBUG` gates any debug URL override so release builds cannot be pointed at untrusted hosts.

### Implementation Plan
- Implement `NativeBackupVault.kt`: Handle `SYNC_BACKUP_SNAPSHOT` by writing snapshots atomically off the UI thread into `context.filesDir/pedigree-vault/`, rotating the most recent 5 snapshots, and returning snapshot count, total bytes, and latest timestamp for `GET_CONTAINER_INFO`.
- Implement `DiagnosticRingBuffer.kt`: Maintain a thread-safe, in-memory ring buffer of the last 100 container events (`onConsoleMessage` errors/warnings, `onReceivedError` / `onReceivedHttpError`, `onRenderProcessGone`, back-button latency/results, and blocked or rerouted URLs) without writing noisy log files to disk.
- Implement `DeveloperPanelDialog.kt`: Build a compact AndroidX dialog showing WebView runtime info (API level, `WebViewCompat.getCurrentWebViewPackage` package name and version with a `<109` OPFS notice, active origin, build flavor), the Storage Truth Card (`navigator.storage.persisted()` explanation, JS quota estimate, read-only `app_webview` and `filesDir/pedigree-vault/` byte counts, last native backup time), the 100-event log, and actions (`Copy Diagnostic JSON`, `Reload App`, `Soft Cache Reset (?emergency_reset=true)` preserving SQLite/IDB/OPFS, and a `BuildConfig.DEBUG`-only target URL switcher).
- Wire Dual Triggers & Failsafes: Connect the 800ms header icon long-press (`OPEN_DEV_PANEL`) plus a 5-tap top-right 80dp root touch fallback and a static launcher App Shortcut (`"Diagnostics"`) so the panel remains reachable even if React fails to mount.
