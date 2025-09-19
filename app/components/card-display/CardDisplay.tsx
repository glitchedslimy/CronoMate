import { WorkEntry } from "@/app/db/WorkerEntriesService";
import DefaultTheme from "@/app/theme/DefaultTheme";
import { useState } from "react";
import { Text, View } from "react-native";
import TempCard from "../card/TempCard";

interface CardDisplayProps {
    entries: WorkEntry[];
    dbReady: boolean;
    onDelete: (id: number) => void; // ✅ new
}

export default function CardDisplay({ entries, dbReady, onDelete }: CardDisplayProps) {
    const [hintShown, setHintShown] = useState(false);
    if (!dbReady) return null;

    const sortedEntries = [...entries].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    return (
        <View style={{ marginHorizontal: 20, marginTop: 30 }}>
            <Text style={{ color: DefaultTheme.colors.text, fontFamily: "Toroka-WideBold", fontSize: 30 }}>
                Horas
            </Text>

            {sortedEntries.length === 0 && (
                <Text style={{ color: DefaultTheme.colors.textAlpha, marginTop: 10 }}>
                    No hay registros
                </Text>
            )}

            {sortedEntries.map((entry, index) => {
                const money =
                    entry.hoursWorkedPerDay * entry.moneyPerHour +
                    (entry.hoursWorkedPerDayExtra || 0) * (entry.moneyPerHourExtra || 0);

                return (
                    <TempCard
                        key={entry.id}
                        id={entry.id!} // pass id for deletion
                        description={entry.extraHours ? "Incluye horas extra" : "Trabajo normal"}
                        hours={entry.extraHours
                            ? `${entry.hoursWorkedPerDay + entry.hoursWorkedPerDayExtra}`
                            : `${entry.hoursWorkedPerDay}`
                        }
                        money={money}
                        showHint={true}
                        onHintShown={() => setHintShown(!hintShown)} // 👈 hide forever
                        date={new Date(entry.date).toLocaleDateString()}
                        onDelete={onDelete} // ✅ pass callback
                    />
                );
            })}
        </View>
    );
}
