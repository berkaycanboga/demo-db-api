import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import productsRoutes from './routes/products.routes';
import adsRoutes from './routes/ads.routes';
import setsRoutes from './routes/sets.routes';
import setItemsRoutes from './routes/setItems.routes';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

app.use(productsRoutes);
app.use(adsRoutes);
app.use(setsRoutes);
app.use(setItemsRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

export default app;
