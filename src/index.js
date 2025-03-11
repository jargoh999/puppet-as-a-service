import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { doCaptureWork, doLogoWork, allowedRequest } from "./helpers.js";

// Load environment variables
dotenv.config({ path: '.env.dev' });

const app = express();

// Detailed CORS configuration with logging
const corsOptions = {
    origin: function (origin, callback) {
        const allowedOrigins = [
            'http://127.0.0.1:5500',
            'http://localhost:5500',
            'http://localhost:5173',
            'http://127.0.0.1:5173',
            'file:///',
            'https://hng-task-8af4f.web.app/*',
            'https://hng-task-8af4f.web.app',
            "http://localhost:8080",
            undefined, // for same-origin requests
            '*'
        ];

        console.log('Incoming Origin:', origin);

        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            console.error('CORS blocked for origin:', origin);
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    optionsSuccessStatus: 200
};

// Enable CORS middleware with detailed logging
app.use((req, res, next) => {
    console.log('Request Origin:', req.get('origin'));
    console.log('Request Headers:', req.headers);
    next();
});

app.use(cors(corsOptions));

// Explicit CORS handling for preflight
app.options('*', cors(corsOptions));

const PORT = process.env.PORT || 8080;

// Capture endpoint
app.get('/capture', async (req, res) => {
    console.log('Capture Endpoint Called');
    console.log('Query Parameters:', req.query);
    console.log('Request Headers:', req.headers);

    // Add CORS headers explicitly
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    // Check if request is allowed
    if (!allowedRequest(req.query)) {
        console.log('Request Not Allowed');
        return res.status(403).json({ message: 'Unauthorized request' });
    }

    try {
        // Perform capture work
        const result = await doCaptureWork(req.query);

        if (result.statusCode === 200) {
            // Set content type based on response type
            res.contentType(`image/${result.responseType}`);
            res.send(result.buffer);
        } else {
            res.status(result.statusCode).json({ message: result.message });
        }
    } catch (error) {
        console.error('Capture error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Logo extraction endpoint
app.get('/logo', async (req, res) => {
    console.log('Logo Extraction Endpoint Called');
    console.log('Query Parameters:', req.query);
    console.log('Request Headers:', req.headers);

    // Add CORS headers explicitly
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    // Check if request is allowed
    if (!allowedRequest(req.query)) {
        console.log('Request Not Allowed');
        return res.status(403).json({ message: 'Unauthorized request' });
    }

    try {
        // Perform logo extraction
        const result = await doLogoWork(req.query);

        if (result.statusCode === 200) {
            // Set content type to image
            res.contentType(`image/${result.responseType}`);
            res.send(result.buffer);
        } else {
            res.status(result.statusCode).json({ message: result.message });
        }
    } catch (error) {
        console.error('Logo extraction error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Catch-all error handler
app.use((err, req, res, next) => {
    console.error('Unhandled Error:', err);
    res.status(500).json({ message: 'Unexpected error occurred' });
});

// Start server
const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Listening on all network interfaces`);
});

// Improve error handling
server.on('error', (error) => {
    console.error('Server Error:', error);
});

export default app;