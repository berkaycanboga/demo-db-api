import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import v1Router from './routes/v1/index';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

app.use(v1Router);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

export default app;
