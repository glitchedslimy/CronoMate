import DefaultTheme from '@/app/theme/DefaultTheme';
import { ReactNode } from 'react';
import { Text } from 'react-native';
import SIZES from './badgeSizes';

interface BadgeProps {
    size: "sm" | "md" | "lg" | "xl";
    children: ReactNode
}

export function Badge(props: BadgeProps) {
    const { size, children } = props;
    const sizeStyles = SIZES[size] || SIZES.lg;
    return (
        <Text style={{ 
            color: DefaultTheme.colors.background, 
            backgroundColor: DefaultTheme.colors.textAlpha, 
            fontFamily: "Toroka-Bold", 
            borderRadius: 20, 
            marginTop: 4, 
            borderColor: DefaultTheme.colors.textAlpha, 
            borderWidth: 1,
            ...sizeStyles
        }}>{children}</Text>
    )
}