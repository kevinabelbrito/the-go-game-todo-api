import express from 'express';
import dotenv from 'dotenv';
import routes from './routes';
import { cors } from './config/cors';

dotenv.config();

const app = express();
const port = process.env.PORT || 8080;

app.use(express.json());
app.use(cors);
app.use('/api', routes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
