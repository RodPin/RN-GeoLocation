# RN-GeoLocation
Playground of React-Native Locations

I'm hiding my api keys so to make this work you should make yours.

### Add to your androidmanifest.xml:

```xml
<application>
   <!-- You will only need to add this meta-data tag, but make sure it's a child of application -->
   <meta-data
     android:name="com.google.android.geo.API_KEY"
     android:value="Your Google maps API Key Here"/>
</application>
```

get a google maps api key : https://developers.google.com/maps/documentation/android-api/signup

### Then create a firebaseConfig.js and paste your firebase configs:

```javascript
export default {
    apiKey: "config",
    authDomain: "config',
    databaseURL: "config",
    projectId: "config",
    storageBucket: "config",
    messagingSenderId: "config",
    appId: "config"
  };
```

firebase: https://console.firebase.google.com/
