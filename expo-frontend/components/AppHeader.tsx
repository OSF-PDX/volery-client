import React from "react";
import { StyleSheet, View } from "react-native";
import { useColorScheme } from "react-native";

type Props = {
    headerBackgroundColor: { dark: string; light: string };
};

export default function AppHeader({ headerBackgroundColor }: Props) {
    const colorScheme = useColorScheme() ?? "light";

    return (
        <View
            style={[
                styles.header,
                { backgroundColor: headerBackgroundColor[colorScheme] },
            ]}
        >
            {/* Header content goes here */}
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: 100,
        overflow: "hidden",
        zIndex: 10,
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
});