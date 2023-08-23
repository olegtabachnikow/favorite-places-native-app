import { FC, ReactNode } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';

interface OutlinedButtonProps {
  onPress: () => void;
  icon: keyof typeof Ionicons.glyphMap;
  children: ReactNode;
}

export const OutlinedButton: FC<OutlinedButtonProps> = ({
  onPress,
  icon,
  children,
}) => {
  return (
    <Pressable
      style={({ pressed }) => [styles.button, pressed && styles.pressed]}
      onPress={onPress}
    >
      <Ionicons
        style={styles.icon}
        name={icon}
        size={18}
        color={Colors.primary500}
      />
      <Text style={styles.text}>{children}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 6,
    margin: 4,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.primary500,
  },
  pressed: { opacity: 0.7 },
  icon: { marginRight: 6 },
  text: { color: Colors.primary500 },
});
