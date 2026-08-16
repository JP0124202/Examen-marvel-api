function ErrorMessage({ message }) {
  return <div className="error-box">{message || 'Ha ocurrido un error.'}</div>;
}

export default ErrorMessage;
