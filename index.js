let express    = require('express');
let bodyParser = require('body-parser');
let cookieSession = require('cookie-session');
let compression = require('compression')
let app = express();
app.use(compression())
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.set('trust proxy', 1);
app.use(cookieSession({
	name: 'session',
	keys: ['niszx', 'xzsin']
}));

app.use(function(req, res, next){
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers","Origin, X-Requested-With, Content-Type, Accept");
  next();
});

const https = require('https');

const proxy = [
    {
        domain: 'googleapis.com',  // domain and url should be same except the http[s]:// part
        url: 'https://www.googleapis.com'
    }
]

// do not change
for (let i=0; i<proxy.length; i++) {
    app.get('/'+proxy[i].domain+'/*', function(req, res) {
        console.log('https://www.googleapis.com' + req.url);
        https.get(proxy[i].url + req.url.replace('/googleapis.com',''), (resp) => {
          let data = '';
          // A chunk of data has been received.
          resp.on('data', (chunk) => {
            data += chunk;
          });

          resp.on('end', () => {
            res.json(JSON.parse(data));
          });

        }).on("error", (err) => {
          console.log("Error: " + err.message);
        });
    });

}


const port = 3000;
const server = app.listen(port, function(){
    console.log('Listening at http://127.0.0.1:' + port);
});

// your code below here