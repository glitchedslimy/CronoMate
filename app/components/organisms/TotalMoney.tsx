import DefaultTheme from '@/app/theme/DefaultTheme';
import { Text, View } from 'react-native';

export default function TotalMoney({ amount }: { amount: number }) {
    return (
        <View>
            <Text style={{ color: DefaultTheme.colors.text, fontSize: 16, fontFamily: "Toroka-Regular" }}>
                Este mes cobras
            </Text>
            <Text style={{ color: DefaultTheme.colors.text, fontSize: 18, fontFamily: "Toroka-WideBold" }}>
                €{amount.toFixed(2)}
            </Text>
        </View>
    );
}
