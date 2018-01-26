if(process.env.NODE_ENV === 'production'){
  module.exports = {mongoURI: 'mongodb://adis:adis@ds113435.mlab.com:13435/curs-prod'};
}else{
  module.exports = {mongoURI: 'mongodb://localhost/curs-dev'};
}