import React from 'react';
import { Image, StyleSheet, View } from 'react-native';

interface UserAvatarProps {
  avatarUri?: string;
  size?: number;
}

export default function UserAvatar({ avatarUri, size = 100 }: UserAvatarProps) {
  return (
    <View style={[styles.container, { width: size, height: size, borderRadius: size / 2 }]}>
      <Image
        source={{ uri: avatarUri || 'https://placeimg.com/100/100/people' }}
        style={[styles.avatar, { width: size, height: size, borderRadius: size / 2 }]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { overflow: 'hidden' },
  avatar: { resizeMode: 'cover' },
});
