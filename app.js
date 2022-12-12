import createError from 'http-errors';
import express from 'express';
import logger from 'morgan';
import cors from 'cors';

import deviceRouter from './routes/device.js';
import gatewayRouter from './routes/gateway.js';

var app = express();

const port = process.env.PORT || 5000

app.use(logger('dev'));
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());

app.use('/device', deviceRouter);
app.use('/gateway', gatewayRouter);

app.get('/', (req, res) => {
    res.send('API for Gateways Practical Task')
})

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
