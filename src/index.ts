// src/index.ts
import app from './app'; // Import the app setup from app.ts

const PORT = 30001;

app.listen(PORT, async () => {
    console.log(`Server is running on port ${PORT}`);
});
