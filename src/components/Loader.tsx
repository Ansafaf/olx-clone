const Loader = () => {
  return (
    <div className="loader-wrap" aria-live="polite" aria-label="Loading content">
      <div className="loader-ring">
        <div className="loader-core" />
      </div>
      <span className="loader-text">Loading...</span>
    </div>
  );
};

export default Loader;