
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import notificationRoutes from './routes/routes.js';

dotenv.config({ path: "../Deployment/ConfigurationManager/envs/dev.env" });


const app = express();
const PORT = process.env.NOTIFICATION_SERVICE_PORT || 4500;

app.use(cors());
app.use(express.json());


app.use('/api/notifications', notificationRoutes);

app.get('/', (req, res) => {
    res.status(200).send('Notification Service is running.');
});

// 6. Démarrer le serveur
app.get('/', (req, res) => {
    res.status(200).send('Notification Service is running.');
});

if (process.env.NODE_ENV !== 'test') { // Ne pas démarrer le serveur en mode test
    app.listen(PORT, () => {
        console.log(`Notification service listening on port ${PORT}`);
    });
}


export default app;