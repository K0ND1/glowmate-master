import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Alert, ScrollView } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { theme } from '../theme';
import { Button } from '../components/Button';
import { reviewService } from '../services/reviewService';

const WriteReviewScreen = () => {
    const route = useRoute<any>();
    const navigation = useNavigation();
    const { barcode } = route.params;

    const [rating, setRating] = useState('5');
    const [comment, setComment] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!comment.trim()) {
            Alert.alert('Required', 'Please write a comment');
            return;
        }

        const ratingNum = parseInt(rating);
        if (isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5) {
            Alert.alert('Invalid Rating', 'Rating must be 1-5');
            return;
        }

        setLoading(true);
        try {
            await reviewService.createReview(barcode, ratingNum, comment);
            Alert.alert('Success', 'Review submitted!');
            navigation.goBack();
        } catch (error) {
            Alert.alert('Error', 'Failed to submit review');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <Text style={styles.title}>Write a Review</Text>

            <Text style={styles.label}>Rating (1-5)</Text>
            <TextInput
                style={styles.input}
                value={rating}
                onChangeText={setRating}
                keyboardType="numeric"
                maxLength={1}
            />

            <Text style={styles.label}>Your Review</Text>
            <TextInput
                style={[styles.input, styles.textArea]}
                value={comment}
                onChangeText={setComment}
                multiline
                placeholder="What did you think about this product?"
                textAlignVertical="top"
            />

            <Button
                title="Submit Review"
                onPress={handleSubmit}
                loading={loading}
            />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.white,
    },
    content: {
        padding: 24,
    },
    title: {
        ...theme.typography.h2,
        marginBottom: 24,
        color: theme.colors.gray[900],
    },
    label: {
        ...theme.typography.body,
        fontWeight: 'bold',
        marginBottom: 8,
        color: theme.colors.gray[700],
    },
    input: {
        borderWidth: 1,
        borderColor: theme.colors.gray[300],
        borderRadius: 8,
        padding: 12,
        marginBottom: 24,
        fontSize: 16,
    },
    textArea: {
        height: 120,
    },
});

export default WriteReviewScreen;
