import DefaultTheme from "@/app/theme/DefaultTheme";
import Ionicons from "@expo/vector-icons/Ionicons";
import React, { useRef, useState } from "react";
import { Dimensions, FlatList, Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { Calendar, LocaleConfig } from "react-native-calendars";


LocaleConfig.locales['es'] = {
    monthNames: [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ],
    monthNamesShort: [
        'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
        'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'
    ],
    dayNames: [
        'Domingo', 'Lunes', 'Martes', 'Miércoles',
        'Jueves', 'Viernes', 'Sábado'
    ],
    dayNamesShort: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
    today: 'Hoy'
};
LocaleConfig.defaultLocale = 'es';

const screenWidth = Dimensions.get("window").width;
const CALENDAR_HEIGHT = 360; // Fixed height for all months

interface Props {
    selectedDate: Date;
    onChange: (date: Date) => void;
}

export default function DaySelector({ selectedDate, onChange }: Props) {
    const [visible, setVisible] = useState(false);


    const months = Array.from({ length: 24 }, (_, i) => {
        const d = new Date();
        d.setMonth(d.getMonth() - 12 + i);
        return d;
    });

    const flatListRef = useRef<FlatList>(null);

    const onDayPress = (day: any) => {
        onChange(new Date(day.dateString));
        setVisible(false);
    };

    const renderMonth = ({ item }: { item: Date }) => (
        <View style={{ width: screenWidth - 40, alignSelf: "center", height: CALENDAR_HEIGHT }}>
            <Calendar
                current={item.toISOString().split("T")[0]}
                onDayPress={onDayPress}
                markedDates={{
                    [selectedDate.toISOString().split("T")[0]]: {
                        selected: true,
                        selectedColor: DefaultTheme.colors.primary,
                        textColor: "#fff",
                    },
                }}
                theme={{
                    backgroundColor: "transparent",
                    calendarBackground: "transparent",
                    textSectionTitleColor: DefaultTheme.colors.primary,
                    dayTextColor: DefaultTheme.colors.text,
                    todayTextColor: DefaultTheme.colors.primaryLight,
                    selectedDayBackgroundColor: DefaultTheme.colors.primary,
                    selectedDayTextColor: "#fff",
                    textDisabledColor: "#6f6f6f",
                    monthTextColor: DefaultTheme.colors.text,
                    arrowColor: DefaultTheme.colors.primary,
                    textDayFontFamily: "Toroka-Regular",
                    textMonthFontFamily: "Toroka-WideBold",
                    textDayHeaderFontFamily: "Toroka-WideBold",
                    textDayFontSize: 14,
                    textMonthFontSize: 18,
                    textDayHeaderFontSize: 14,
                }}
                hideExtraDays={false}
            />
        </View>
    );

    return (
        <View>
            <Pressable
                style={{ flexDirection: "row", alignItems: "center", marginBottom: 30, marginTop: 10 }}
                onPress={() => setVisible(true)}
            >
                <Text style={styles.text}>A fecha de:</Text>
                <Text style={styles.text}>
                    {selectedDate.toLocaleDateString("es-ES", {
                        weekday: "short",
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                    })}
                </Text>
                <Ionicons
                    name="chevron-down"
                    size={18}
                    color={DefaultTheme.colors.graph}
                    style={{ marginLeft: 6 }}
                />
            </Pressable>

            <Modal visible={visible} transparent animationType="fade" onRequestClose={() => setVisible(false)}>
                <View style={styles.overlay}>
                    <View style={{ height: 420, backgroundColor: DefaultTheme.colors.card, borderRadius: 10 }}>
                        <FlatList
                            ref={flatListRef}
                            data={months}
                            renderItem={renderMonth}
                            keyExtractor={(item) => item.toISOString()}
                            horizontal
                            pagingEnabled
                            showsHorizontalScrollIndicator={false}
                            initialScrollIndex={12} // Center on current month
                            getItemLayout={(_, index) => ({
                                length: screenWidth - 40,
                                offset: (screenWidth - 40) * index,
                                index,
                            })}
                            initialNumToRender={1}
                            maxToRenderPerBatch={1}
                            windowSize={2}
                        />

                        <Pressable style={styles.closeButton} onPress={() => setVisible(false)}>
                            <Text style={styles.closeText}>Cerrar</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 15,
        backgroundColor: DefaultTheme.colors.cardElevated,
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: DefaultTheme.colors.primaryLight, // subtle highlight
    },
    text: { color: DefaultTheme.colors.text, fontSize: 16, fontFamily: "Toroka-WideBold", marginLeft: 10 },
    overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.6)", justifyContent: "center", alignItems: "center", paddingHorizontal: 20 },
    closeButton: { marginTop: 10, backgroundColor: DefaultTheme.colors.primary, paddingVertical: 10, marginBottom: 10, marginHorizontal: 10, paddingHorizontal: 10, borderRadius: 7 },
    closeText: { color: "#fff", fontSize: 16, fontFamily: "Toroka-WideBold", textAlign: "center" },
});
