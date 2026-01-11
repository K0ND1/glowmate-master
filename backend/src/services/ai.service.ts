// Placeholder for a real AI/LLM service
// In a real app, this would use an SDK like @google/generative-ai or openai

const AI_API_KEY = process.env.AI_API_KEY || 'your_placeholder_ai_api_key';
// A generic endpoint, could be Google AI, OpenAI, etc.
const AI_API_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${AI_API_KEY}`;

interface ProductInfo {
    name: string;
    brand: string;
    description: string | null;
    ingredients: { name: string }[];
}

interface UserProfile {
    skinProfile: any;
}

/**
 * Generates a prompt for the AI based on product info, user profile, and a question.
 */
const constructPrompt = (product: ProductInfo, user: UserProfile, question: string): string => {
    const ingredientsList = product.ingredients.map(ing => ing.name).join(', ');
    const userSkinProfile = JSON.stringify(user.skinProfile);

    // This detailed prompt helps the AI adopt the persona of a skincare expert
    return `
        You are "GlowMate", a friendly and knowledgeable AI skincare assistant. Your goal is to provide safe, helpful, and clear advice.

        CONTEXT:
        - Product Name: ${product.name}
        - Brand: ${product.brand}
        - Product Description: ${product.description || 'Not provided.'}
        - Full Ingredient List: ${ingredientsList}
        - User's Skin Profile: ${userSkinProfile}

        Based on all the information above, please answer the following user's question. Be concise and focus on the most important information. If the user asks for something that could be harmful, advise them to consult a dermatologist.

        USER'S QUESTION:
        "${question}"
    `;
}

/**
 * Calls a generic LLM API to get advice about a skincare product.
 * @param product The product details.
 * @param user The user's profile.
 * @param question The user's question.
 * @returns The AI-generated advice as a string.
 */
export const getAiProductAdvice = async (product: ProductInfo, user: UserProfile, question: string): Promise<string> => {
    if (!AI_API_KEY || AI_API_KEY === 'your_placeholder_ai_api_key') {
        console.warn('AI_API_KEY is not set. Returning mock response.');
        return 'This is a mock AI response. In a real scenario, I would analyze the product based on your skin profile and question. For example, I might say this product seems suitable for oily skin due to the presence of salicylic acid.';
    }

    const prompt = constructPrompt(product, user, question);

    const requestBody = {
        contents: [{
            parts: [{
                text: prompt
            }]
        }]
    };

    try {
        const response = await fetch(AI_API_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
            const errorBody = await response.text();
            console.error('AI API Error:', response.status, errorBody);
            throw new Error('Failed to get a response from the AI service.');
        }

        const data = await response.json();
        
        // Safely access the deeply nested text response
        const textResponse = data?.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!textResponse) {
            throw new Error('AI response was empty or in an unexpected format.');
        }

        return textResponse.trim();

    } catch (error) {
        console.error('Error calling AI service:', error);
        throw new Error('An error occurred while contacting the AI service.');
    }
};
