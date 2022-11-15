import React, { useState, useEffect } from "react";
import { createResponse } from "../../utils";

const useSWR = (key, fetcher) => {
  const [data, setData] = useState();

  useEffect(() => {
    async function fetch() {
      const newData = await fetcher(key);
      setData(newData);
    }
    fetch();
  }, [fetcher, key]);

  return { data };
};

const fetcher = (id) =>
  createResponse(
    fetch(`https://api.github.com/repos/${id}`).then((r) =>
      r.json()
    ),
    1000
  );

// const fetcher = (id) =>
//   fetch(`https://api.github.com/repos/${id}`).then((r) =>
//     r.json()
//   );

export default function TrendingProjects() {
  const [id, setId] = useState("facebook/react");
  const { data } = useSWR(id, fetcher);

  return (
    <div>
      <h1>Trending Projects</h1>

      <div>
        <button onClick={() => setId("facebook/react")}>
          React
        </button>{" "}
        <button onClick={() => setId("vercel/swr")}>
          SWR
        </button>{" "}
        <button onClick={() => setId("TanStack/query")}>
          TanStack Query
        </button>
      </div>

      {data ? (
        <>
          <h2>{data.full_name}</h2>
          <ul>
            <li>forks: {data.forks_count}</li>
            <li>stars: {data.stargazers_count}</li>
            <li>watchers: {data.watchers}</li>
          </ul>
        </>
      ) : (
        <p>loading...</p>
      )}
    </div>
  );
}
