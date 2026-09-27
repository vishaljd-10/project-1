import express from 'express';
import type { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import Stripe from 'stripe';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '10mb' }));

// Stripe Gateway Client (reads from environment variables)
const stripeApiKey = process.env.STRIPE_SECRET_KEY;
const stripe = stripeApiKey ? new Stripe(stripeApiKey) : null;

// Shared Gemini client with telemetry header
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// System metrics store for Admin Dashboard
let adminMetrics = {
  totalVisitors: 284920,
  activeDancersLive: 142680,
  passesBooked: 38450,
  diningReservations: 12890,
  sosAlertsResolved: 14,
  networkSyncRate: '99.8%',
  serverLatencyMs: 42,
  lastBackupTimestamp: new Date().toISOString(),
};

// API: Health check
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    city: 'Ahmedabad, Gujarat',
    festival: 'Navratri Mahotsav',
  });
});

// API: System stats for Admin Dashboard
app.get('/api/system/stats', (_req: Request, res: Response) => {
  // Add small dynamic fluctuations to simulate real-time live garba footfall
  const dynamicVisitors = adminMetrics.totalVisitors + Math.floor(Math.random() * 20) - 5;
  const dynamicLive = adminMetrics.activeDancersLive + Math.floor(Math.random() * 30) - 10;
  res.json({
    ...adminMetrics,
    totalVisitors: dynamicVisitors,
    activeDancersLive: dynamicLive,
    serverLatencyMs: Math.floor(35 + Math.random() * 15),
  });
});

// API: Stripe Payment Status Check
app.get('/api/payments/status', (_req: Request, res: Response) => {
  const isConfigured = !!stripe;
  const isLiveMode = isConfigured && !stripeApiKey?.startsWith('sk_test_');
  res.json({
    configured: isConfigured,
    mode: isLiveMode ? 'live' : isConfigured ? 'test' : 'mock_fallback',
    currency: 'INR',
    message: isConfigured 
      ? `Stripe Gateway is active (${isLiveMode ? 'Live Production' : 'Test Mode'})`
      : 'Stripe Gateway fallback mode. Set STRIPE_SECRET_KEY in environment variables.',
  });
});

// API: Create Stripe Payment Intent for Garba Passes & Valet Parking
app.post('/api/payments/create-intent', async (req: Request, res: Response) => {
  try {
    const { amount, currency = 'inr', description, metadata = {} } = req.body;

    if (!amount || typeof amount !== 'number' || amount <= 0) {
      return res.status(400).json({ error: 'Valid positive amount in INR is required.' });
    }

    // Convert INR to subunits (paise) for Stripe
    const amountInSubunits = Math.round(amount * 100);

    if (stripe) {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amountInSubunits,
        currency: currency.toLowerCase(),
        description: description || 'Ahmedabad Navratri Garba & Parking Token',
        metadata: {
          festival: 'Navratri Mahotsav Ahmedabad',
          ...metadata,
        },
        automatic_payment_methods: {
          enabled: true,
        },
      });

      return res.json({
        success: true,
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
        amount,
        currency: currency.toUpperCase(),
        mode: stripeApiKey?.startsWith('sk_test_') ? 'test' : 'live',
      });
    }

    // Fallback when Stripe API key is not yet provided in runtime env
    const mockIntentId = 'pi_mock_' + Math.random().toString(36).substring(2, 12);
    return res.json({
      success: true,
      clientSecret: `${mockIntentId}_secret_demo`,
      paymentIntentId: mockIntentId,
      amount,
      currency: currency.toUpperCase(),
      mode: 'mock_sandbox',
      note: 'Processed in test sandbox mode. Set STRIPE_SECRET_KEY in server environment for live bank charges.',
    });
  } catch (error: any) {
    console.error('Error creating Stripe PaymentIntent:', error);
    return res.status(500).json({
      error: 'Failed to create payment intent.',
      message: error?.message || 'Payment service error',
    });
  }
});

// API: Gemini Chatbot
// Role-based Navratri AI Concierge (RaasGuru) with model tiering:
// - gemini-3.1-pro-preview: Complex planning & VIP itineraries
// - gemini-3.5-flash: General Navratri & dineout questions
// - gemini-3.1-flash-lite: Fast quick lookups
app.post('/api/chat', async (req: Request, res: Response) => {
  try {
    const { messages, model, systemInstruction } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages array is required.' });
    }

    // Select valid model or fallback
    let selectedModel = model || 'gemini-3.5-flash';
    const validModels = [
      'gemini-3.1-pro-preview',
      'gemini-3.5-flash',
      'gemini-3.1-flash-lite',
      'gemini-3.8-flash',
    ];
    if (!validModels.includes(selectedModel)) {
      selectedModel = 'gemini-3.5-flash';
    }

    const defaultRole = `You are 'RaasGuru', the ultimate expert AI Guide and Concierge for Navratri Festival in Ahmedabad & Gujarat.
Your knowledge includes:
- Ahmedabad's most iconic Garba grounds: GMDC Vibrant Gujarat Garba, Karnavati Club, Rajpath Club (SG Highway), Mirchi Rock N Dhol (Aman Akash Party Plot), Heritage Pol Garba (Mandvi ni Pol in Old Ahmedabad), Shankus Water World/Farm, YMCA, Shott, Gulmohar Greens, and Vadodara United Way.
- Traditional Garba dance styles: 2-Taali, 3-Taali, Dodhiya, Popat, Hudo, Sanedo, and Dakla.
- Traditional Gujarati attire: Chaniya Choli with mirror work, Kedia, Dhoti, Pagdi, and oxidized jewelry.
- Authentic late-night dining post-Garba (11:30 PM - 5 AM): Manek Chowk Night Market (Midnight Gwalior Butter Dosa, Chocolate Cheese Sandwich, Rabdi Kulfi), Sindhu Bhavan Road cafes, Law Garden Khau Galli, Iscon Gathiya (midnight hot Jalebi & Fafda), and Chandravilas.
- Real-time Ahmedabad Weather & Outdoor Garba conditions: Autumn nights in Ahmedabad are typically 25°C - 30°C with 0-5% rain probability (clear skies, minimal precipitation), low humidity after midnight, and cool breezes near SG Highway and Gandhinagar. Recommend breathable cotton lining for heavy mirror-work Chaniya Cholis and regular hydration.
- Ahmedabad GMRC Night Metro & Feeder Bus Network: GMRC extends Metro lines until 2:00 AM on Phase-1 (Thaltej Gam ↔ Vastral Gam and APMC ↔ Motera). Dedicated AMTS/BRTS electric night shuttles run every 5-7 minutes connecting stations to SG Highway & SBR grounds. Advise users to generate fast QR transit tokens to avoid 40-minute ticket lines.
- Find My Dandiya Circle (P2P Mesh Radar): Explain how users can locate lost friends inside dense 40,000+ dancer grounds without cellular reception using Bluetooth Low Energy (BLE) RSSI and compass orientation.
- Safety & navigation: Ahmedabad Police SHE-Team assistance, BRTS/Metro Garba specials, parking zones, and hydration tips.
- Tone: Extremely warm, celebratory, culturally knowledgeable, bilingual with pleasant Gujarati phrases like 'Jai Ambe!', 'Khabar Che?', 'Aavo Padharo!', 'Halo Re Halo!'. Always provide specific, actionable tips for Ahmedabad visitors.`;

    // Convert client chat history to GoogleGenAI contents format
    const contents = messages.map((m: { role: string; content: string }) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

    try {
      const response = await ai.models.generateContent({
        model: selectedModel,
        contents,
        config: {
          systemInstruction: systemInstruction || defaultRole,
        },
      });

      return res.json({
        text: response.text || 'Jai Ambe! Ready to celebrate Navratri tonight in Ahmedabad!',
        model: selectedModel,
      });
    } catch (genError: any) {
      console.warn(`Error with model ${selectedModel}, falling back to gemini-3.5-flash:`, genError?.message);
      // Fallback to gemini-3.5-flash if pro or other model fails
      const fallbackResponse = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents,
        config: {
          systemInstruction: defaultRole,
        },
      });

      return res.json({
        text: fallbackResponse.text || 'Jai Ambe! Ready to guide you through Ahmedabad Garba nights.',
        model: 'gemini-3.5-flash (fallback)',
      });
    }
  } catch (error: any) {
    console.error('Chat API Error:', error);
    res.status(500).json({
      error: 'Failed to generate response',
      details: error?.message || 'Unknown error',
    });
  }
});

// API: AI Image Generation
// Model: gemini-3-pro-image-preview (with user-selected imageSize: 1K, 2K, 4K)
app.post('/api/generate-image', async (req: Request, res: Response) => {
  try {
    const { prompt, imageSize = '1K', aspectRatio = '1:1' } = req.body;

    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ error: 'Prompt string is required' });
    }

    // Validate size: 1K, 2K, 4K
    const validSizes = ['1K', '2K', '4K'];
    const chosenSize = validSizes.includes(imageSize) ? imageSize : '1K';

    const enhancedPrompt = `${prompt}. Vibrant Ahmedabad Navratri festival aesthetic, traditional Gujarati colorful embroidery, mirror work, festive golden diya illuminations, dandiya raas energy, premium 8k photographic festival lighting.`;

    let generatedImageUrl = '';

    // First attempt with gemini-3-pro-image-preview
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-image-preview',
        contents: {
          parts: [{ text: enhancedPrompt }],
        },
        config: {
          imageConfig: {
            aspectRatio: aspectRatio as any,
            imageSize: chosenSize as any,
          },
        },
      });

      const parts = response.candidates?.[0]?.content?.parts || [];
      for (const part of parts) {
        if (part.inlineData && part.inlineData.data) {
          const mime = part.inlineData.mimeType || 'image/png';
          generatedImageUrl = `data:${mime};base64,${part.inlineData.data}`;
          break;
        }
      }
    } catch (primaryErr: any) {
      console.warn('gemini-3-pro-image-preview attempt failed, trying gemini-3.1-flash-image:', primaryErr?.message);
      // Fallback attempt with gemini-3.1-flash-image
      try {
        const fallbackResponse = await ai.models.generateContent({
          model: 'gemini-3.1-flash-image',
          contents: {
            parts: [{ text: enhancedPrompt }],
          },
          config: {
            imageConfig: {
              aspectRatio: aspectRatio as any,
              imageSize: chosenSize as any,
            },
          },
        });

        const fallbackParts = fallbackResponse.candidates?.[0]?.content?.parts || [];
        for (const part of fallbackParts) {
          if (part.inlineData && part.inlineData.data) {
            const mime = part.inlineData.mimeType || 'image/png';
            generatedImageUrl = `data:${mime};base64,${part.inlineData.data}`;
            break;
          }
        }
      } catch (secErr: any) {
        console.error('All image generation models failed:', secErr?.message);
        throw secErr;
      }
    }

    if (!generatedImageUrl) {
      return res.status(500).json({ error: 'No image data returned from model' });
    }

    res.json({
      imageUrl: generatedImageUrl,
      prompt,
      imageSize: chosenSize,
      aspectRatio,
    });
  } catch (error: any) {
    console.error('Image Generation Error:', error);
    res.status(500).json({
      error: 'Failed to generate image',
      details: error?.message || 'Error generating image',
    });
  }
});

// API: Emergency Alert / SHE-Team Dispatch Simulation
app.post('/api/emergency-alert', (req: Request, res: Response) => {
  const { venueId, venueName, coords, userPhone, emergencyType } = req.body;
  adminMetrics.sosAlertsResolved += 1;

  console.log(`[EMERGENCY SOS LOGGED] Venue: ${venueName}, Coords: ${JSON.stringify(coords)}, Type: ${emergencyType}`);

  res.json({
    success: true,
    alertId: 'SOS-AMD-' + Math.floor(100000 + Math.random() * 900000),
    dispatchedUnit: 'Ahmedabad Police SHE-Team Unit #24 & Volunteer Medical Guard',
    etaMinutes: 3,
    status: 'ACTIVE_DISPATCH',
    instructions: 'Stay near the designated Women Safety Booth or Gate Security. Security officers have received your live GPS coordinates.',
  });
});

// Health check endpoints for container orchestrators (Cloud Run / Kubernetes)
app.get(['/health', '/api/health'], (_req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', uptime: process.uptime(), timestamp: new Date().toISOString() });
});

// Mount Vite or serve production static assets
async function startServer() {
  const distDir = path.join(__dirname, 'dist');
  const indexHtmlPath = path.join(distDir, 'index.html');
  const hasDist = fs.existsSync(indexHtmlPath);
  const isProduction = process.env.NODE_ENV === 'production' || !!process.env.K_SERVICE || hasDist;

  if (isProduction && hasDist) {
    console.log('Serving production build from dist/');
    app.use(express.static(distDir));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(indexHtmlPath);
    });
  } else {
    console.log('Starting Vite in development middleware mode');
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Navratri Ahmedabad Server running on port ${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
