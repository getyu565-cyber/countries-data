const { WebSocketServer } = require('ws');

// Use environment port or default to 5900 as requested
const PORT = process.env.PORT || 5900;

// Create WebSocket Server attached to the HTTP server / port
const wss = new WebSocketServer({ port: Number(PORT) }, () => {
    console.log(`🚀 WebSocket server is running on ws://localhost:${PORT}/api/countries`);
});

// List of 48 countries with their flags
const countries = [
    { name: "United States", code: "US", flag: "🇺🇸" },
    { name: "Canada", code: "CA", flag: "🇨🇦" },
    { name: "United Kingdom", code: "GB", flag: "🇬🇧" },
    { name: "Germany", code: "DE", flag: "🇩🇪" },
    { name: "France", code: "FR", flag: "🇫🇷" },
    { name: "Japan", code: "JP", flag: "🇯🇵" },
    { name: "South Korea", code: "KR", flag: "🇰🇷" },
    { name: "Australia", code: "AU", flag: "🇦🇺" },
    { name: "Brazil", code: "BR", flag: "🇧🇷" },
    { name: "India", code: "IN", flag: "🇮🇳" },
    { name: "China", code: "CN", flag: "🇨🇳" },
    { name: "Italy", code: "IT", flag: "🇮🇹" },
    { name: "Spain", code: "ES", flag: "🇪🇸" },
    { name: "Mexico", code: "MX", flag: "🇲🇽" },
    { name: "Argentina", code: "AR", flag: "🇦🇷" },
    { name: "South Africa", code: "ZA", flag: "🇿🇦" },
    { name: "Nigeria", code: "NG", flag: "🇳🇬" },
    { name: "Egypt", code: "EG", flag: "🇪🇬" },
    { name: "Russia", code: "RU", flag: "🇷🇺" },
    { name: "Turkey", code: "TR", flag: "🇹🇷" },
    { name: "Saudi Arabia", code: "SA", flag: "🇸🇦" },
    { name: "Indonesia", code: "ID", flag: "🇮🇩" },
    { name: "Vietnam", code: "VN", flag: "🇻🇳" },
    { name: "Thailand", code: "TH", flag: "🇹🇭" },
    { name: "Philippines", code: "PH", flag: "🇵🇭" },
    { name: "Malaysia", code: "MY", flag: "🇲🇾" },
    { name: "Singapore", code: "SG", flag: "🇸🇬" },
    { name: "New Zealand", code: "NZ", flag: "🇳🇿" },
    { name: "Switzerland", code: "CH", flag: "🇨🇭" },
    { name: "Sweden", code: "SE", flag: "🇸🇪" },
    { name: "Norway", code: "NO", flag: "🇳🇴" },
    { name: "Denmark", code: "DK", flag: "🇩🇰" },
    { name: "Finland", code: "FI", flag: "🇫🇮" },
    { name: "Poland", code: "PL", flag: "🇵🇱" },
    { name: "Netherlands", code: "NL", flag: "🇳🇱" },
    { name: "Belgium", code: "BE", flag: "🇧🇪" },
    { name: "Austria", code: "AT", flag: "🇦🇹" },
    { name: "Greece", code: "GR", flag: "🇬🇷" },
    { name: "Portugal", code: "PT", flag: "🇵🇹" },
    { name: "Ireland", code: "IE", flag: "🇮🇪" },
    { name: "Israel", code: "IL", flag: "🇮🇱" },
    { name: "United Arab Emirates", code: "AE", flag: "🇦🇪" },
    { name: "Chile", code: "CL", flag: "🇨🇱" },
    { name: "Colombia", code: "CO", flag: "🇨🇴" },
    { name: "Peru", code: "PE", flag: "🇵🇪" },
    { name: "Ukraine", code: "UA", flag: "🇺🇦" },
    { name: "Czech Republic", code: "CZ", flag: "🇨🇿" },
    { name: "Hungary", code: "HU", flag: "🇭🇺" }
];

// Handle incoming connections
wss.on('connection', (ws, req) => {
    const urlPath = new URL(req.url, `ws://${req.headers.host}`).pathname;

    // Validate path to match /api/countries
    if (urlPath !== '/api/countries') {
        ws.send(JSON.stringify({ error: "Invalid endpoint. Please connect to /api/countries" }));
        ws.close();
        return;
    }

    console.log(`🔌 New client connected to /api/countries`);

    // Send initial country list to the client upon connection
    ws.send(JSON.stringify({
        event: 'WELCOME',
        message: 'Connected to Countries WebSocket API',
        total: countries.length,
        data: countries
    }));

    // Handle messages received from client (if needed)
    ws.on('message', (message) => {
        console.log(`📩 Received from client: ${message}`);
        try {
            const parsed = JSON.parse(message);
            if (parsed.action === 'get_countries') {
                ws.send(JSON.stringify({ event: 'COUNTRIES_LIST', data: countries }));
            }
        } catch (e) {
            ws.send(JSON.stringify({ error: 'Invalid JSON format' }));
        }
    });

    // Handle client disconnection
    ws.on('close', () => {
        console.log('🔌 Client disconnected');
    });
});
