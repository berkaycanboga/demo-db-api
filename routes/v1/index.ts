import productsRoutes from '../products.routes';
import adsRoutes from '../ads.routes';
import setsRoutes from '../sets.routes';
import setItemsRoutes from '../setItems.routes';
import express from 'express';

const v1Router = express.Router();

v1Router.use('/api/v1/products', productsRoutes);
v1Router.use('/api/v1/ads', adsRoutes);
v1Router.use('/api/v1/sets', setsRoutes);
v1Router.use('/api/v1/set_items', setItemsRoutes);

export default v1Router;
