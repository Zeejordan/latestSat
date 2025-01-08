import React, { useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';

const GoogleAuth = () => {
  const [loading, setLoading] = useState(true);

  const initiationUrl = 'http://127.0.0.1:8000/accounts/google/login';
  const callbackUrl = 'http://127.0.0.1:8000/accounts/google/login/callback/';

  const handleNavigationStateChange = (event) => {
    if (event.url.startsWith(callbackUrl)) {
      // Handle the callback, extract query params or tokens
      const urlParams = new URL(event.url).searchParams;
      const token = urlParams.get('token'); // Example if the backend sends a token
      console.log('Token:', token);

      // Navigate away from WebView or save token
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {loading && (
        <ActivityIndicator
          size="large"
          color="#0000ff"
          style={{ position: 'absolute', top: '50%', left: '50%' }}
        />
      )}
      <WebView
        source={{ uri: initiationUrl }}
        onNavigationStateChange={handleNavigationStateChange}
        onLoadEnd={() => setLoading(false)}
        style={{ flex: 1 }}
      />
    </View>
  );
};

export default GoogleAuth;
