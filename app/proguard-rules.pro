# This is a configuration file for R8
# keep everything in this package from being removed or renamed
-keep class com.isdenmois.** { *; }

# keep everything in this package from being renamed only
-keepnames class com.isdenmois.** { *; }
-allowaccessmodification
