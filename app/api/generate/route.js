import {NextResponse} from 'next/server';
import OpenAI from 'openai';

const systemPrompt = `
You are a flashcard creator. Your task is to generate concise and effective flashcards based on the given topic or content.
Follow these guidelines:

1. Create clear and concise questions for the front of the flashcard.
2. Provide accurate and informative answers for the back of the flashcard.
3. Ensure that each flashcard focuses on a single concept or piece of information.
4. Use simple language to make the flashcards accessible to a wide range of learners.
5. Include a variety of question types, such as definitions, examples, comparisons, and applications.
6. Avoid overly complex or ambiguous phrasing in both questions and answers.
7. When appropriate, use mnemonics or memory aids to help reinforce the information.
8. Tailor the difficulty level of the flashcards to the user's specified preferences.
9. If given a body of text, extract the most important and relevant information in the flashcards.
10. Providing a spaced repetition system for more effective learning and retention.
11. Only generate 12 flashcards.

Return in the following JSON format:
{
    "flashcards": [{
        "front": str,
        "back": str
    }]
}`;

// Maps an error to a user-facing message and an HTTP status.
function describeError(error) {
    // Errors thrown by the OpenAI SDK carry a status and a code we can act on.
    if (error instanceof OpenAI.APIError) {
        switch (error.status) {
            case 401:
                return {status: 500, message: "The OpenAI API key is missing or invalid. Check OPENAI_API_KEY."};
            case 429:
                // Out of credits and rate limiting share a status but need different advice.
                if (error.code === 'insufficient_quota' || error.code === 'credit_balance_exhausted') {
                    return {status: 402, message: "The OpenAI account has no credits remaining. Add credits to continue generating flashcards."};
                }
                return {status: 429, message: "Too many requests to OpenAI right now. Please wait a moment and try again."};
            case 400:
                return {status: 400, message: "OpenAI rejected the request. Try shortening or rewording your input."};
            default:
                if (error.status >= 500) {
                    return {status: 503, message: "OpenAI is temporarily unavailable. Please try again shortly."};
                }
                return {status: 500, message: error.message || "Unexpected error from OpenAI."};
        }
    }

    if (error instanceof OpenAI.APIConnectionError) {
        return {status: 503, message: "Could not reach OpenAI. Check your network connection and try again."};
    }

    return {status: 500, message: "Something went wrong while generating flashcards."};
}

export async function POST(req) {
    if (!process.env.OPENAI_API_KEY) {
        return NextResponse.json(
            {error: "The server is missing OPENAI_API_KEY. Add it to .env.local and restart the dev server."},
            {status: 500},
        );
    }

    const data = await req.text();

    if (!data || !data.trim()) {
        return NextResponse.json(
            {error: "Please enter a topic or some notes to generate flashcards from."},
            {status: 400},
        );
    }

    let completion;
    try {
        const openai = new OpenAI();
        completion = await openai.chat.completions.create({
            messages: [
                {role: 'system', content: systemPrompt},
                {role: 'user', content: data},
            ],
            model: "gpt-4o",
            response_format: {type: 'json_object'},
        });
    } catch (error) {
        const {status, message} = describeError(error);
        // Log the full error server-side; return only the safe message to the client.
        console.error('Flashcard generation failed:', error);
        return NextResponse.json({error: message}, {status});
    }

    let parsed;
    try {
        parsed = JSON.parse(completion.choices[0].message.content);
    } catch (error) {
        console.error('Could not parse OpenAI response as JSON:', error);
        return NextResponse.json(
            {error: "OpenAI returned a malformed response. Please try again."},
            {status: 502},
        );
    }

    // The model is asked for {flashcards: [...]}, but that shape isn't guaranteed.
    if (!Array.isArray(parsed?.flashcards) || parsed.flashcards.length === 0) {
        console.error('Unexpected response shape from OpenAI:', parsed);
        return NextResponse.json(
            {error: "OpenAI did not return any flashcards. Please try again."},
            {status: 502},
        );
    }

    return NextResponse.json(parsed.flashcards);
}
