# volery-client
This is our conference app: Volery!

## Running instructions
1. First, make sure all of your dependencies are installed by running `npm install` within the `expo-frontend` directory.


### How to run the app on Web

1. Within the `expo-frontend` directory, run `npx expo start`.
2. When prompted to choose a platform, press the `w` key to select `open web`.

Some considerations for web...
- The web version of the app doesn't have caching, so it needs to be connected to the `volery-server` application at all times in order to pull data from Salesforce. Make sure the Express server is authenticated and running on `localhost:3000`.

### How to run the app on Android emulator
1. Make sure you have an Android SDK and emulator installed. The standard way to do this is via [Android Studio](https://developer.android.com/studio).
1. Within the `expo-frontend` directory, run `npx expo run`.
2. Make sure `Android` is selected and press the `enter` key. Your app will now build, which may take a while. When building is completed, the app will launch.

Some considerations for mobile...
- The mobile ersion of the app has caching via watermelondb. This means that if the app has ever pulled data from the `volery-server` API before, it will have data to display even if the app is offline. In order to have up-to-date data (or to ensure data is displayed even when opening the app for the first time), make sure you are running `volery-server` on `localhost:3000`.