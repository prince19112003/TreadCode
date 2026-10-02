# Capacitor Native Bridge Keep Rules
-keep class com.getcapacitor.** { *; }
-keep interface com.getcapacitor.** { *; }
-keep class com.treadcode.app.** { *; }
-keep public class * extends com.getcapacitor.Plugin
-keep public class * extends com.getcapacitor.BridgeActivity

# WebView Javascript Interface Keep
-keepattributes JavascriptInterface
-keepclassmembers class * {
    @android.webkit.JavascriptInterface <methods>;
}

# Suppress harmless warnings from dependencies
-dontwarn com.getcapacitor.**
-dontwarn org.apache.cordova.**
