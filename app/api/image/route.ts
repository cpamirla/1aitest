import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';
import { Configuration, OpenAIApi } from 'openai'

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
})

const openai = new OpenAIApi(configuration)

export const POST = async (req: Request) => {
    console.log(req.body);

    try {
        const { userId } = auth()
        const body = await req.json()
        const { prompt, amount = 1, resolution = '512x512' } = body

        if (!userId) return new NextResponse('Unauthorized', { status: 401 });
        if (!configuration.apiKey) return new NextResponse('Open AI API Keys not configured', { status: 500 });

        if (!prompt) return new NextResponse('No prompt found', { status: 400 });
        if (!amount) return new NextResponse('No amount found', { status: 400 });
        if (!resolution) return new NextResponse('No resolution found', { status: 400 });

        const response = await openai.createImage({
            prompt,
            n: parseInt(amount, 10),
            size: resolution,
        })

        return NextResponse.json(response.data.data);


    } catch (err) {
        console.log(`Image Generator error: ${err}`);
        return new NextResponse(`Internal error: ${err}`, { status: 500 });
    }
}