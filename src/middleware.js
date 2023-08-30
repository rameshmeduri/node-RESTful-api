import bodyParser from 'body-parser';

const setGlobalMiddleware = (app) => {
  // Enable req.params with URL : /api/songs?var1=1
  app.use(bodyParser.urlencoded({extended: true}));
  // Enable access POST or PUT req.body with the json sended by the client.
  app.use(bodyParser.json());
}

export default setGlobalMiddleware
