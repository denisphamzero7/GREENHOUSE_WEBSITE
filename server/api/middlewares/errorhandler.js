const notFound = (req, res, next) => {
    const error = new Error(`Route ${req.originalUrl} is not found!`);
    res.status(404);
    next(error);
  };
  

 const errorHandler = (err, req, res, next) => {  
const status = err.status|| 500;
const field = err.field||"server";
const message = err.message||"ERR_INTERNAL_SERVER";
res.status(status).json({
    success:false,
    errors:[{field, message}]
})
}


module.exports = {
    notFound,
    errorHandler
}