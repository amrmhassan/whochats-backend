import express from 'express';

const app = express();

app.set('view engine', 'pug');
app.set('views', 'views');

export default app;
