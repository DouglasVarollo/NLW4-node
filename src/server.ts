import express from 'express';

const app = express();

app.get('/', function (request, response) {
  return response.json({
    message: 'Hello World - NLW04'
  });
});

app.post('/', function (request, response) {
  return response.json({
    message: 'Os dados foram salvos com sucesso!'
  });
});

app.listen(3333, function () {
  console.log('Server is running!');
});
