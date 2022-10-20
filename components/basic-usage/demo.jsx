// How to display code in deck:
// 1. Remove `React` from import
// 2. Update fetcher without `createResponse`

import React, { useState } from "react";
// import { useState } from "react";
import useSWR from "swr";
import { createResponse } from "../utils";

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
        <div>
          <h2>{id}</h2>
          <p>forks: {data.forks_count}</p>
          <p>stars: {data.stargazers_count}</p>
          <p>watchers: {data.watchers}</p>
        </div>
      ) : (
        <p>loading...</p>
      )}
    </div>
  );
}
