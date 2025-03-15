export default function useError() {

  const errorBag = useState('error-Bag', () => ({}));

  const transformValidationErrors = (response, handlerType = 'axios') => {
    if (handlerType === 'axios') {
      if (response.data.errors) {
 
        response.data.errors.forEach(error => {
          errorBag.value[error.field] = error.message;
        });
      }else {
        if(response){
          console.log('error', response);
        }
      }
    }
  };
function resetErrorBag (){
  errorBag.value = {};
}
  return {
    errorBag,
    transformValidationErrors,
    resetErrorBag
  };
}
