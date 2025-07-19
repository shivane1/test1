@@ .. @@
 /** @type {import('tailwindcss').Config} */
 export default {
   content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
+  darkMode: 'class',
   theme: {
-    extend: {},
+    extend: {
+      animation: {
+        'spin-slow': 'spin 3s linear infinite',
+        'spin-reverse': 'spin 3s linear infinite reverse',
+      },
+      colors: {
+        gray: {
+          750: '#374151',
+        }
+      }
+    },
   },
   plugins: [],
 };