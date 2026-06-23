const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Jenkins build info (Optional, testing ke liye)
const BRANCH_NAME = process.env.BRANCH_NAME || 'Local-Development';

app.get('/', (req, res) => {
    res.send(`
        <h1>Welcome to My Multi-Branch App!</h1>
        <p>Current Active Branch: <strong>${BRANCH_NAME}</strong></p>
        <p>Status: Running smoothly.</p>
    `);
});

app.get('/health', (req, res) => {
    res.json({ status: 'UP', branch: BRANCH_NAME });
});

app.listen(PORT, () => {
    console.log(`Application is running on port ${PORT} for branch: ${BRANCH_NAME}`);
});