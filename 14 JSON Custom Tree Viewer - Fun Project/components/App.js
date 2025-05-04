import React from 'react';
import useFetch from './useFetch';
import TreeNodeComponent from './TreeNodeComponent';

const App = () => {
  const { data, loading, error } = useFetch('https://api.github.com/users/cyberadityacode/repos');
  // const { data, loading, error } = useFetch('https://api.github.com/repos/cyberadityacode/reactjs');

  if (loading) return <p>Loading GitHub repos...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h1>GitHub Repositories</h1>
      {data.map(repo => (
        <TreeNodeComponent key={repo.id} node={repo} />
      ))}
    </div>
  );
};

export default App;
