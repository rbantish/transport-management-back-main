// src/app.ts
import express from 'express';
import routes from './routes'; // Import routes from the routes directory
import cors from 'cors';
import path from 'path';
const app = express();

// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: "*",
    methods: ["GET","POST","PUT"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"]  // Headers that are allowed
}));

app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

// Routes setup
app.use('/api', routes);

// Error handling middleware (example)
app.use((err:any, req:any, res:any, next:any) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

export default app;
